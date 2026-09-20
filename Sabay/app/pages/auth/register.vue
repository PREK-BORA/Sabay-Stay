<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "~/composables/auth/useAuth";
import { navigateTo } from "#imports";

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const fullName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const role = ref("user");
const acceptedTerms = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const { register: createAccount } = useAuth();

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

async function register() {
  if (!fullName.value.trim() || !email.value.trim() || !password.value) {
    errorMessage.value = "Please complete all required fields.";
    return;
  }
  if (password.value.length < 6) {
    errorMessage.value = "Password must be at least 6 characters.";
    return;
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match.";
    return;
  }
  if (!acceptedTerms.value) {
    errorMessage.value = "Please agree to the terms and conditions.";
    return;
  }

  try {
    errorMessage.value = "";
    await createAccount({
      name: fullName.value.trim(),
      email: email.value.trim(),
      password: password.value,
      role: role.value
    });
    
    successMessage.value = "Account request submitted successfully! Please wait for approval.";
    setTimeout(() => {
      navigateTo('/auth/login');
    }, 2000);
  } catch (error: any) {
    errorMessage.value =
      error?.code === "auth/email-already-in-use"
        ? "An account already exists for this email."
        : "Unable to create your account. Please try again.";
  }
}
</script>

<template>
  <div class="grid min-h-screen bg-white lg:grid-cols-2">
    <section
      class="relative hidden min-h-115 overflow-hidden bg-[#12304c] lg:block"
      aria-label="SabayStay travel inspiration"
    >
      <!-- High-resolution Unsplash resort image -->
      <img
        src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1920&auto=format&fit=crop"
        alt="Luxury resort surrounded by tropical ocean and umbrellas"
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

        <form class="space-y-4" @submit.prevent="register">
          <label class="block text-xs font-medium text-[#17191e]">
            Full Name
            <input
              type="text"
              v-model="fullName"
              placeholder="Prek Bora"
              autocomplete="name"
              class="mt-1.5 block h-12 w-full rounded-md border border-[#c9cad4] px-4 text-sm text-[#252936] outline-none placeholder:text-[#9da0aa] focus:border-[#080d70] focus:ring-1 focus:ring-[#080d70]"
            />
          </label>

          <label class="block text-xs font-medium text-[#17191e]">
            Email Address
            <input
              type="email"
              v-model="email"
              placeholder="bora@example.com"
              autocomplete="email"
              class="mt-1.5 block h-12 w-full rounded-md border border-[#c9cad4] px-4 text-sm text-[#252936] outline-none placeholder:text-[#9da0aa] focus:border-[#080d70] focus:ring-1 focus:ring-[#080d70]"
            />
          </label>

          <label class="block text-xs font-medium text-[#17191e]">
            Account Type
            <select
              v-model="role"
              class="mt-1.5 block h-12 w-full rounded-md border border-[#c9cad4] px-4 text-sm text-[#252936] outline-none focus:border-[#080d70] focus:ring-1 focus:ring-[#080d70]"
            >
              <option value="user">Guest / User Account</option>
              <option value="owner">Property Owner</option>
            </select>
          </label>

          <label class="relative block text-xs font-medium text-[#17191e]">
            Password
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
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

          <label class="relative block text-xs font-medium text-[#17191e]">
            Confirm Password
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              placeholder="••••••••"
              autocomplete="new-password"
              class="mt-1.5 block h-12 w-full rounded-md border border-[#c9cad4] px-4 pr-12 text-sm text-[#252936] outline-none placeholder:text-[#777b89] focus:border-[#080d70] focus:ring-1 focus:ring-[#080d70]"
            />
            <button
              type="button"
              class="absolute right-4 top-8 text-[#111832]"
              :aria-label="showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'"
              @click="toggleConfirmPassword"
            >
              <span aria-hidden="true">◉</span>
            </button>
          </label>

          <label
            class="flex items-center gap-2 pt-1 text-[11px] text-[#2f3442]"
          >
            <input
              type="checkbox"
              v-model="acceptedTerms"
              class="h-4 w-4 rounded border-[#c9cad4] accent-[#080d70]"
            />
            <span>
              I agree to the
              <a href="#" class="font-semibold text-[#07166b]">Terms and Conditions</a>
              and
              <a href="#" class="font-semibold text-[#07166b]">Privacy Policy</a>
            </span>
          </label>

          <p v-if="errorMessage" class="text-sm text-red-600" role="alert">
            {{ errorMessage }}
          </p>

          <p v-if="successMessage" class="text-sm text-emerald-600 font-semibold" role="status">
            {{ successMessage }}
          </p>

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
          >
            Log In
          </NuxtLink>
        </p>
      </div>
    </section>
  </div>
</template>