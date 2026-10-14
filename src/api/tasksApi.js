import apiClient from "./config.js";

const tasksApi = {
  getAll() {
    return apiClient.get("/tasks");
  },
  create(data) {
    return apiClient.post(
      "/tasks",
      typeof data === "string" ? { title: data } : data,
    );
  },
  update(id, data) {
    return apiClient.patch(`/tasks/${id}`, data);
  },
  remove(id) {
    return apiClient.delete(`/tasks/${id}`);
  },
  uploadImage(file, description = "") {
    const formData = new FormData();
    formData.append("file", file);
    if (description) formData.append("description", description);
<<<<<<< HEAD
    return apiClient.post("/uploads/images/", formData, { headers: {} });
=======
    return apiClient.post("/uploads/images/", formData);
>>>>>>> 5c73340 (update 14/10)
  },
};
export default tasksApi;
