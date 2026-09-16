<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "~/composables/auth/useAuth";
import { navigateTo } from "#imports";
// Direct component imports from lucide-vue-next
import { User, LogOut, Bell } from "lucide-vue-next";

const route = useRoute();
const { isLoggedIn, user, logout } = useAuth();

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

const isRegisterPage = computed(() => route.path === "/auth/register");

const isLoginPage = computed(() => route.path === "/auth/login");

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
      <NuxtLink to="/" class="text-2xl font-bold text-[#0c2349]">
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
        <template v-if="isLoggedIn">
          <!-- Notification Button with Lucide Bell Icon -->
          <button
            class="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell class="h-5 w-5 text-gray-700" />
            <span
              class="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
            >
              2
            </span>
          </button>

          <!-- Account Dropdown Trigger -->
          <div class="relative">
            <button
              @click="isAccountMenuOpen = !isAccountMenuOpen"
              class="flex items-center gap-2 rounded-full border px-3 py-1.5 transition hover:bg-gray-50"
            >
              <span
                class="flex h-8 w-8 items-center justify-center rounded-full bg-[#0c2349] text-sm font-semibold text-white"
              >
                {{ userInitial }}
              </span>

              <span class="text-sm font-medium text-gray-700">
                {{ user?.name || "Account" }}
              </span>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="isAccountMenuOpen"
              class="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl"
            >
              <NuxtLink
                to="/dashboard"
                @click="isAccountMenuOpen = false"
                class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-1 text-gray-700 transition hover:bg-gray-100 "
              >
                <User class="h-4 w-4 text-gray-500" />
                <span>Profile</span>
              </NuxtLink>

              <button
                @click="logoutUser"
                class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut class="h-4 w-4 text-red-500" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </template>

        <!-- Guest Links -->
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