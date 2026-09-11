import { computed, onMounted, ref } from "vue";

interface StoredUser {
  name: string;
  email: string;
  password?: string;
}

const currentUser = ref<StoredUser | null>(null);

export function useAuth() {
  onMounted(() => {
    if (currentUser.value) return;

    const savedUser = localStorage.getItem("sabaystay-user");
    currentUser.value = savedUser ? JSON.parse(savedUser) : null;
  });

  return {
    user: computed(() => currentUser.value),
    isAuthenticated: computed(() => Boolean(currentUser.value)),
    updateUser(user: StoredUser) {
      currentUser.value = user;
      localStorage.setItem("sabaystay-user", JSON.stringify(user));
    },
    logout() {
      currentUser.value = null;
      localStorage.removeItem("sabaystay-authenticated");
    },
  };
}
