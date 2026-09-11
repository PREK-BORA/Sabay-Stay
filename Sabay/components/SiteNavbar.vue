<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "~/composables/useAuth";

const route = useRoute();
const { isAuthenticated, user, logout } = useAuth();
const isAccountMenuOpen = ref(false);
const userInitial = computed(() =>
  (user.value?.name?.trim().charAt(0) || "B").toUpperCase(),
);
const isBookingConfirmation = computed(() =>
  route.path.startsWith("/dashboard/bookings/"),
);
const isRegisterPage = computed(() => route.path === "/auth/register");
const isLoginPage = computed(() => route.path === "/auth/login");

const isActiveLink = (path: string) => {
  if (path === "/") {
    return route.path === "/";
  }

  return route.path.startsWith(path);
};

function logoutUser() {
  logout();
  isAccountMenuOpen.value = false;
  navigateTo("/");
}
</script>

<template>
  <header
    v-if="!isBookingConfirmation && !isRegisterPage && !isLoginPage"
    class="border-b border-slate-200 bg-white"
  >
    <nav
      class="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-7"
      aria-label="Main navigation"
    >
      <NuxtLink
        to="/"
        class="text-2xl font-black tracking-tight text-[#1d2f52]"
      >
        Sabay<span class="font-medium">Stay</span>
      </NuxtLink>

      <div
        class="hidden items-center gap-8 text-sm font-medium text-[#24314d] md:flex"
      >
        <NuxtLink
          to="/"
          :class="[
            'transition-colors hover:text-[#0c2349]',
            isActiveLink('/')
              ? 'font-semibold text-[#0c2349]'
              : 'text-[#24314d]',
          ]"
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/hotels"
          :class="[
            'transition-colors hover:text-[#0c2349]',
            isActiveLink('/hotels')
              ? 'font-semibold text-[#0c2349]'
              : 'text-[#24314d]',
          ]"
        >
          Hotels
        </NuxtLink>
        <NuxtLink
          to="/destinations"
          :class="[
            'transition-colors hover:text-[#0c2349]',
            isActiveLink('/destinations')
              ? 'font-semibold text-[#0c2349]'
              : 'text-[#24314d]',
          ]"
        >
          Destinations
        </NuxtLink>
        <NuxtLink
          to="/experiences"
          :class="[
            'transition-colors hover:text-[#0c2349]',
            isActiveLink('/experiences')
              ? 'font-semibold text-[#0c2349]'
              : 'text-[#24314d]',
          ]"
        >
          Experiences
        </NuxtLink>
        <NuxtLink
          to="/offers"
          :class="[
            'transition-colors hover:text-[#0c2349]',
            isActiveLink('/offers')
              ? 'font-semibold text-[#0c2349]'
              : 'text-[#24314d]',
          ]"
        >
          Offers
        </NuxtLink>
        <NuxtLink
          to="/about"
          :class="[
            'transition-colors hover:text-[#0c2349]',
            isActiveLink('/about')
              ? 'font-semibold text-[#0c2349]'
              : 'text-[#24314d]',
          ]"
        >
          About
        </NuxtLink>
        <NuxtLink
          to="/contact"
          :class="[
            'transition-colors hover:text-[#0c2349]',
            isActiveLink('/contact')
              ? 'font-semibold text-[#0c2349]'
              : 'text-[#24314d]',
          ]"
        >
          Contact
        </NuxtLink>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink
          v-if="isAuthenticated"
          to="/notifications"
          class="relative flex h-10 w-10 items-center justify-center rounded-full text-xl text-[#24314d] transition hover:bg-slate-100 hover:text-[#0c2349]"
          aria-label="View notifications"
          title="Notifications"
        >
          <span aria-hidden="true">🔔</span>
          <span
            class="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white"
          >
            2
          </span>
        </NuxtLink>
        <div v-if="isAuthenticated" class="relative">
          <button
            type="button"
            class="flex h-12 w-20 items-center justify-center gap-2 rounded-full border-2 border-slate-300 bg-slate-100 p-1 shadow-sm"
            aria-label="Open account menu"
            :aria-expanded="isAccountMenuOpen"
            @click="isAccountMenuOpen = !isAccountMenuOpen"
          >
            <span
              class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white shadow-inner"
            >
              {{ userInitial }}
            </span>
            <span class="text-sm text-slate-400" aria-hidden="true">
              {{ isAccountMenuOpen ? "⌃" : "⌄" }}
            </span>
          </button>

          <div
            v-if="isAccountMenuOpen"
            class="absolute right-0 top-14 z-30 w-56 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200"
          >
            <p
              class="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Account
            </p>
            <NuxtLink
              to="/dashboard"
              class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
              @click="isAccountMenuOpen = false"
            >
              <span class="text-base" aria-hidden="true">⊞</span>
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/dashboard/profile"
              class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-100"
              @click="isAccountMenuOpen = false"
            >
              <span class="text-base" aria-hidden="true">♙</span>
              Profile
            </NuxtLink>
            <button
              type="button"
              class="mt-1 flex w-full items-center gap-3 rounded-xl border-t border-slate-100 px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
              @click="logoutUser"
            >
              <span class="text-base" aria-hidden="true">↪</span>
              Logout
            </button>
          </div>
        </div>
        <NuxtLink
          v-if="!isAuthenticated"
          to="/auth/login"
          class="text-sm font-medium text-[#24314d] hover:text-[#0c2349]"
        >
          Login
        </NuxtLink>
        <NuxtLink
          v-if="!isAuthenticated"
          to="/auth/register"
          class="rounded-full bg-[#0d224a] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0a1d3e]"
        >
          Register
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>
