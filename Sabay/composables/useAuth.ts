import { computed, onMounted, ref } from "vue";

export interface StoredUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  country?: string;
  photo?: string;
}

const currentUser = ref<StoredUser | null>(null);

export function useAuth() {
  onMounted(() => {
    if (currentUser.value || !import.meta.client) return;

    try {
      const savedUser = localStorage.getItem("sabaystay-user");
      currentUser.value = savedUser ? JSON.parse(savedUser) : null;
    } catch {
      currentUser.value = null;
    }
  });

  return {
    user: computed(() => currentUser.value),
    isAuthenticated: computed(() => Boolean(currentUser.value)),
    updateUser(user: StoredUser) {
      currentUser.value = user;
      if (import.meta.client) {
        localStorage.setItem("sabaystay-user", JSON.stringify(user));
      }
    },
    logout() {
      currentUser.value = null;
      if (import.meta.client) {
        localStorage.removeItem("sabaystay-authenticated");
        localStorage.removeItem("sabaystay-user");
      }
    },
  };
}
