<template>
  <section class="mx-auto max-w-md px-6 py-20">
    <p class="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
      Account access
    </p>
    <h1 class="mt-3 text-4xl font-semibold tracking-tight">
      Reset your password
    </h1>
    <p class="mt-4 leading-7 text-stone-600">
      Enter your email and we will send a secure reset link.
    </p>
    <form class="mt-8 space-y-5" @submit.prevent>
      <label class="block text-sm font-medium" for="email">Email address</label>
      <input
        id="email"
        type="email"
        autocomplete="email"
        required
        placeholder="you@example.com"
        class="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
      />
      <button
        type="submit"
        class="w-full rounded-xl bg-teal-800 px-4 py-3 font-medium text-white hover:bg-teal-900"
      >
        Send reset link
      </button>
    </form>
    <NuxtLink
      to="/auth/login"
      class="mt-6 inline-block text-sm font-medium text-teal-800 hover:text-teal-950"
      >Back to sign in</NuxtLink
    >
  </section>
</template>
