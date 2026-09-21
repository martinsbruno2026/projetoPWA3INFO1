const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8001";

const requestInterceptors = [];
const responseSuccessInterceptors = [];
const responseErrorInterceptors = [];

const apiClient = {
  defaults: {
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  },
  interceptors: {
    request: {
      use: (fn) => requestInterceptors.push(fn),
    },
    response: {
      use: (successFn, errorFn) => {
        if (successFn) responseSuccessInterceptors.push(successFn);
        if (errorFn) responseErrorInterceptors.push(errorFn);
      },
    },
  },
  async request(config = {}) {
    let requestConfig = {
      method: (config.method ?? "GET").toUpperCase(),
      url: config.url ?? "/",
      data: config.data,
      params: config.params ?? {},
      headers: {
        ...(this.defaults.headers ?? {}),
        ...(config.headers ?? {}),
      },
      baseURL: config.baseURL ?? this.defaults.baseURL,
      _retry: !!config._retry,
    };

    for (const interceptor of requestInterceptors) {
      requestConfig = (await interceptor(requestConfig)) ?? requestConfig;
    }

    const query = new URLSearchParams();
    Object.entries(requestConfig.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, String(value));
      }
    });

    const endpoint = `${requestConfig.baseURL}${requestConfig.url.startsWith("/") ? requestConfig.url : `/${requestConfig.url}`}${query.toString() ? `?${query.toString()}` : ""}`;
    const fetchOptions = {
      method: requestConfig.method,
      headers: requestConfig.headers,
    };

    if (
      requestConfig.data !== undefined &&
      requestConfig.data !== null &&
      !["GET", "HEAD"].includes(requestConfig.method)
    ) {
      const isFormData =
        typeof FormData !== "undefined" &&
        requestConfig.data instanceof FormData;
      fetchOptions.body = isFormData
        ? requestConfig.data
        : JSON.stringify(requestConfig.data);
      if (!isFormData && !fetchOptions.headers["Content-Type"]) {
        fetchOptions.headers["Content-Type"] = "application/json";
      }
    }

    try {
      const response = await fetch(endpoint, fetchOptions);
      const text = await response.text();
      let data = text ? text : null;
      try {
        data = JSON.parse(text);
      } catch {
        // mantém texto quando a resposta não é JSON
      }

      const result = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        config: requestConfig,
      };

      if (!response.ok) {
        const error = new Error(response.statusText || "Request failed");
        error.response = result;
        error.config = requestConfig;
        throw await runResponseErrorInterceptors(error);
      }

      return await runResponseSuccessInterceptors(result);
    } catch (error) {
      const handledError = await runResponseErrorInterceptors(error);
      return Promise.reject(handledError ?? error);
    }
  },
  get(url, config = {}) {
    return this.request({ ...config, method: "GET", url });
  },
  post(url, data, config = {}) {
    return this.request({ ...config, method: "POST", url, data });
  },
  put(url, data, config = {}) {
    return this.request({ ...config, method: "PUT", url, data });
  },
  patch(url, data, config = {}) {
    return this.request({ ...config, method: "PATCH", url, data });
  },
  delete(url, config = {}) {
    return this.request({ ...config, method: "DELETE", url });
  },
};

const runResponseSuccessInterceptors = async (response) => {
  let nextResponse = response;
  for (const interceptor of responseSuccessInterceptors) {
    nextResponse = (await interceptor(nextResponse)) ?? nextResponse;
  }
  return nextResponse;
};

const runResponseErrorInterceptors = async (error) => {
  let nextError = error;
  for (const interceptor of responseErrorInterceptors) {
    nextError = (await interceptor(nextError)) ?? nextError;
  }
  return nextError;
};

// Injeta o access token em todas as requisições
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = {
      ...(config.headers ?? {}),
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// Em caso de 401, tenta renovar o token e reenviar a requisição original
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes("/api/token")
    ) {
      original._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          const { data } = await apiClient.post("/api/token/refresh", {
            refresh_token: refreshToken,
          });
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          original.headers = {
            ...(original.headers ?? {}),
            Authorization: `Bearer ${data.access_token}`,
          };
          return apiClient.request(original);
        } catch {
          // refresh falhou — segue para o logout
        }
      }
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
