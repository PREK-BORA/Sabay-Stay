<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    description: string;
    eyebrow?: string;
    actionLabel?: string;
    actionTo?: string;
  }>(),
  {
    eyebrow: "Sabay Stay",
    actionLabel: "Explore more",
    actionTo: "/",
  },
);
</script>

<template>
  <section class="mx-auto max-w-6xl px-6 py-20">
    <div
      class="rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm md:p-12"
    >
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
        {{ eyebrow }}
      </p>
      <h1
        class="mt-3 text-4xl font-semibold tracking-tight text-stone-900 md:text-5xl"
      >
        {{ title }}
      </h1>
      <p class="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
        {{ description }}
      </p>

      <div class="mt-10 flex flex-wrap gap-3">
        <NuxtLink
          v-if="actionLabel"
          :to="actionTo"
          class="rounded-full bg-teal-800 px-5 py-3 text-sm font-medium text-white hover:bg-teal-900"
        >
          {{ actionLabel }}
        </NuxtLink>
        <NuxtLink
          to="/auth/login"
          class="rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 hover:border-teal-700 hover:text-teal-800"
        >
          Sign in
        </NuxtLink>
      </div>

      <div class="mt-12 grid gap-4 md:grid-cols-3">
        <div class="rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <p class="text-sm font-semibold text-teal-800">01</p>
          <h2 class="mt-2 text-lg font-semibold text-stone-900">
            Curated stays
          </h2>
          <p class="mt-2 text-sm leading-6 text-stone-600">
            Comfortable options chosen for every type of traveler.
          </p>
        </div>
        <div class="rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <p class="text-sm font-semibold text-teal-800">02</p>
          <h2 class="mt-2 text-lg font-semibold text-stone-900">
            Flexible booking
          </h2>
          <p class="mt-2 text-sm leading-6 text-stone-600">
            Easy planning with the right support before and during your stay.
          </p>
        </div>
        <div class="rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <p class="text-sm font-semibold text-teal-800">03</p>
          <h2 class="mt-2 text-lg font-semibold text-stone-900">
            Local experiences
          </h2>
          <p class="mt-2 text-sm leading-6 text-stone-600">
            More than a room, a calmer way to discover each destination.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
