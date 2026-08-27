<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isBookingConfirmation = computed(() =>
  route.path.startsWith("/dashboard/bookings/"),
);
const isRegisterPage = computed(() => route.path === "/auth/register");
const isLoginPage = computed(() => route.path === "/auth/login");
</script>

<template>
  <div class="min-h-screen bg-[#f5f3ef] text-[#1b2b41]">
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
          v-if="!isBookingConfirmation"
          class="hidden items-center gap-8 text-sm font-medium text-[#24314d] md:flex"
        >
          <NuxtLink to="/hotels" class="hover:text-[#0c2349]">Hotels</NuxtLink>
          <NuxtLink to="/destinations" class="hover:text-[#0c2349]"
            >Destinations</NuxtLink
          >
          <NuxtLink to="/experiences" class="hover:text-[#0c2349]"
            >Experiences</NuxtLink
          >
          <NuxtLink to="/about" class="hover:text-[#0c2349]">About</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-[#0c2349]"
            >Contact</NuxtLink
          >
        </div>

        <div v-if="!isBookingConfirmation" class="flex items-center gap-3">
          <NuxtLink
            to="/auth/login"
            class="text-sm font-medium text-[#24314d] hover:text-[#0c2349]"
          >
            Login
          </NuxtLink>
          <NuxtLink
            to="/auth/register"
            class="rounded-full bg-[#0d224a] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#0a1d3e]"
          >
            Register
          </NuxtLink>
        </div>
      </nav>
    </header>

    <main><NuxtPage /></main>

    <SiteFooter
      v-if="!isBookingConfirmation && !isRegisterPage && !isLoginPage"
    />
  </div>
</template>
