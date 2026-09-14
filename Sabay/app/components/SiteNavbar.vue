
<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "~/composables/auth/useAuth";

const route = useRoute();
const { isAuthenticated, user, logout } = useAuth();

const isAccountMenuOpen = ref(false);

const navItems = [
  { name: "Home", path: "/" },
  { name: "Hotels", path: "/hotels" },
  { name: "Destinations", path: "/destinations" },
  { name: "Experiences", path: "/experiences" },
  { name: "Offers", path: "/offers" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const userInitial = computed(() =>
  (user.value?.name?.trim().charAt(0) || "B").toUpperCase()
);

const isBookingConfirmation = computed(() =>
  route.path.startsWith("/dashboard/bookings/")
);

const isRegisterPage = computed(() =>
  route.path === "/auth/register"
);

const isLoginPage = computed(() =>
  route.path === "/auth/login"
);

// Check active link
const isActiveLink = (path: string) => {
  if (path === "/") {
    return route.path === "/";
  }

  return route.path === path || route.path.startsWith(path + "/");
};

function logoutUser() {
  logout();
  isAccountMenuOpen.value = false;
  navigateTo("/");
}
</script>

<template>
  <nav
    v-if="!isBookingConfirmation && !isRegisterPage && !isLoginPage"
    class="border-b bg-white"
  >
    <div
      class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6"
    >
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="text-2xl font-bold text-[#0c2349]"
      >
        SabayStay
      </NuxtLink>

      <!-- Navigation -->
      <div class="flex items-center gap-8">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="relative py-2 text-sm transition-all duration-200"
          :class="
            isActiveLink(item.path)
              ? 'font-bold text-[#0c2349] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#0c2349] after:content-[\'\']'
              : 'text-gray-600 hover:text-[#0c2349]'
          "
        >
          {{ item.name }}
        </NuxtLink>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-4">

        <!-- Authenticated -->
        <template v-if="isAuthenticated">

          <!-- Notification -->
          <button
            class="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
          >
            🔔

            <span
              class="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white"
            >
              2
            </span>
          </button>

          <!-- Account -->
          <div class="relative">
            <button
              @click="isAccountMenuOpen = !isAccountMenuOpen"
              class="flex items-center gap-2 rounded-full border px-3 py-2"
            >
              <span
                class="flex h-8 w-8 items-center justify-center rounded-full bg-[#0c2349] text-white"
              >
                {{ userInitial }}
              </span>

              <span class="text-sm font-medium">
                {{ user?.name || "Account" }}
              </span>
            </button>

            <!-- Dropdown -->
            <div
              v-if="isAccountMenuOpen"
              class="absolute right-0 z-50 mt-2 w-48 rounded-lg border bg-white p-2 shadow-lg"
            >
              <NuxtLink
                to="/dashboard"
                class="block rounded-md px-4 py-2 text-sm hover:bg-gray-100"
              >
                Dashboard
              </NuxtLink>

              <NuxtLink
                to="/profile"
                class="block rounded-md px-4 py-2 text-sm hover:bg-gray-100"
              >
                Profile
              </NuxtLink>

              <button
                @click="logoutUser"
                class="block w-full rounded-md px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </template>

        <!-- Guest -->
        <template v-else>
          <NuxtLink
            to="/auth/login"
            class="text-sm font-medium text-gray-700 hover:text-[#0c2349]"
          >
            Login
          </NuxtLink>

          <NuxtLink
            to="/auth/register"
            class="rounded-lg bg-[#0c2349] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#183765]"
          >
            Register
          </NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>
