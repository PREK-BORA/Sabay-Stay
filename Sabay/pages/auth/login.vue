<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";

const showPassword = ref(false);
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const { updateUser } = useAuth();

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

function login() {
  const savedUser = localStorage.getItem("sabaystay-user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  if (
    !user ||
    user.email !== email.value.trim() ||
    user.password !== password.value
  ) {
    errorMessage.value =
      "Email or password is incorrect. Register an account first if needed.";
    return;
  }

  localStorage.setItem("sabaystay-authenticated", "true");
  updateUser(user);
  navigateTo("/dashboard");
}
</script>

<template>
  <div class="grid min-h-screen bg-white lg:grid-cols-2">
    <section
      class="relative hidden min-h-115 overflow-hidden bg-[#12304c] lg:block"
      aria-label="SabayStay travel inspiration"
    >
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn68Bu0m0pfUoAVYLc3o3kbdFQGBiMqGdfqmOwteMDKA&s=10"
        alt="Luxury resort surrounded by tropical mountains"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-[#061d39]/25" />

      <NuxtLink
        to="/"
        class="sabay-display absolute left-9 top-9 z-10 text-xl font-bold text-white"
      >
        <span class="mr-2 text-lg" aria-hidden="true">⌁</span>Sabay<span
          class="font-sans text-base font-semibold"
          >Stay</span
        >
      </NuxtLink>

      <div class="absolute bottom-10 left-9 z-10 max-w-97.5 text-white">
        <h1
          class="sabay-display text-5xl font-bold leading-[0.95] tracking-[-0.04em]"
        >
          Begin Your Journey.
        </h1>
        <p class="mt-2 max-w-82.5 text-sm leading-5 text-white/95">
          Unlock access to exclusive premium stays and curated experiences
          worldwide.
        </p>
      </div>
    </section>

    <section
      class="flex min-h-screen items-center justify-center px-2 py-4 sm:px-10"
    >
      <div class="w-full max-w-md">
        <div class="mb-6">
          <h1
            class="sabay-display text-3xl font-bold leading-tight text-[#171717] sm:text-4xl"
          >
            Welcome back
          </h1>
          <p class="mt-1 max-w-[280px] text-sm leading-5 text-[#32333a]">
            Sign in to access your exclusive premium travel experiences.
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="login">
          <label class="block text-xs font-medium text-[#17191e]">
            Email Address
            <div class="relative mt-1.5">
              <span
                class="absolute left-3 top-1/2 -translate-y-1/2 text-base text-[#596174]"
                aria-hidden="true"
                >▣</span
              >
              <input
                type="email"
                v-model="email"
                placeholder="Enter your email"
                autocomplete="email"
                class="block h-12 w-full rounded-md border border-[#c9cad4] px-10 text-sm text-[#252936] outline-none placeholder:text-[#687083] focus:border-[#080d70] focus:ring-1 focus:ring-[#080d70]"
              />
            </div>
          </label>

          <label class="relative block text-xs font-medium text-[#17191e]">
            Password
            <span
              class="absolute left-3 top-9 text-base text-[#596174]"
              aria-hidden="true"
              >▣</span
            >
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="Enter your password"
              autocomplete="current-password"
              class="mt-1.5 block h-12 w-full rounded-md border border-[#c9cad4] px-10 pr-12 text-sm text-[#252936] outline-none placeholder:text-[#687083] focus:border-[#080d70] focus:ring-1 focus:ring-[#080d70]"
            />
            <button
              type="button"
              class="absolute right-4 top-9 text-[#111832]"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="togglePassword"
            >
              <span aria-hidden="true">◉</span>
            </button>
          </label>

          <div
            class="flex items-center justify-between text-[11px] text-[#20222b]"
          >
            <label class="flex items-center gap-2">
              <input
                type="checkbox"
                class="h-4 w-4 rounded border-[#c9cad4] text-[11px] accent-[#080d70]"
              />
              Remember me
            </label>
            <NuxtLink
              to="/auth/forgot-password"
              class="font-medium text-[13px] text-[#07166b] hover:underline"
            >
              Forgot Password?
            </NuxtLink>
          </div>

          <p v-if="errorMessage" class="text-sm text-red-600" role="alert">
            {{ errorMessage }}
          </p>

          <button
            type="submit"
            class="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#080d70] text-sm font-semibold text-white shadow-sm hover:bg-[#11198e]"
          >
            Login <span aria-hidden="true">→</span>
          </button>
          <NuxtLink
            to="/auth/register"
            class="flex h-12 w-full items-center justify-center rounded-md border border-[#378c88] text-sm font-semibold text-[#176b67] hover:bg-[#f1faf9]"
          >
            Register
          </NuxtLink>
        </form>
      </div>
    </section>
  </div>
</template>
