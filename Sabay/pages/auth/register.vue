<script setup lang="ts">
import { ref } from "vue";

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};
</script>

<template>
  <div class="grid min-h-screen bg-white lg:grid-cols-2">
    <section
      class="relative hidden min-h-115 overflow-hidden bg-[#12304c] lg:block"
      aria-label="SabayStay travel inspiration"
    >
      <img
        src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=85"
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
        <div class="mb-7">
          <h2
            class="sabay-display text-4xl font-bold leading-tight text-[#171717]"
          >
            Create Account
          </h2>
          <p class="mt-2 text-sm text-[#32333a]">
            Join SabayStay for personalized luxury travel.
          </p>
        </div>

        <form class="space-y-4" @submit.prevent>
          <label class="block text-xs font-medium text-[#17191e]">
            Full Name
            <input
              type="text"
              placeholder="John Doe"
              autocomplete="name"
              class="mt-1.5 block h-12 w-full rounded-md border border-[#c9cad4] px-4 text-sm text-[#252936] outline-none placeholder:text-[#9da0aa] focus:border-[#080d70] focus:ring-1 focus:ring-[#080d70]"
            />
          </label>

          <label class="block text-xs font-medium text-[#17191e]">
            Email Address
            <input
              type="email"
              placeholder="john@example.com"
              autocomplete="email"
              class="mt-1.5 block h-12 w-full rounded-md border border-[#c9cad4] px-4 text-sm text-[#252936] outline-none placeholder:text-[#9da0aa] focus:border-[#080d70] focus:ring-1 focus:ring-[#080d70]"
            />
          </label>

          <label class="relative block text-xs font-medium text-[#17191e]">
            Password
            <input
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="new-password"
              class="mt-1.5 block h-12 w-full rounded-md border border-[#c9cad4] px-4 pr-12 text-sm text-[#252936] outline-none placeholder:text-[#777b89] focus:border-[#080d70] focus:ring-1 focus:ring-[#080d70]"
            />
            <button
              type="button"
              class="absolute right-4 top-8 text-[#111832]"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="togglePassword"
            >
              <span aria-hidden="true">◉</span>
            </button>
          </label>

          <label class="block text-xs font-medium text-[#17191e]">
            Confirm Password
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="new-password"
              class="mt-1.5 block h-12 w-full rounded-md border border-[#c9cad4] px-4 text-sm text-[#252936] outline-none placeholder:text-[#777b89] focus:border-[#080d70] focus:ring-1 focus:ring-[#080d70]"
            />
          </label>

          <label
            class="flex items-center gap-2 pt-1 text-[11px] text-[#2f3442]"
          >
            <input
              type="checkbox"
              class="h-4 w-4 rounded border-[#c9cad4] accent-[#080d70]"
            />
            <span
              >I agree to the
              <a href="#" class="font-semibold text-[#07166b]"
                >Terms and Conditions</a
              >
              and
              <a href="#" class="font-semibold text-[#07166b]"
                >Privacy Policy</a
              ></span
            >
          </label>

          <button
            type="submit"
            class="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#080d70] text-sm font-semibold text-white shadow-sm hover:bg-[#11198e]"
          >
            Create Account <span aria-hidden="true">→</span>
          </button>
        </form>

        <p class="mt-7 text-center text-sm text-[#20222b]">
          Already have an account?
          <NuxtLink
            to="/auth/login"
            class="font-semibold text-[#07166b] hover:underline"
            >Log In</NuxtLink
          >
        </p>
      </div>
    </section>
  </div>
</template>
