import { ref, onMounted, onUnmounted } from 'vue';

export function useBreakpoint() {
  const isMobile = ref(true);
  const isTablet = ref(false);
  const isDesktop = ref(false);

  function update() {
    const width = window.innerWidth;
    isMobile.value = width < 768;
    isTablet.value = width >= 768 && width < 1024;
    isDesktop.value = width >= 1024;
  }

  onMounted(() => {
    update();
    window.addEventListener('resize', update);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', update);
  });

  return { isMobile, isTablet, isDesktop };
}