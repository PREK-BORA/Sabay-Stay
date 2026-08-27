<script setup lang="ts">
const experiences = [
  {
    id: 1,
    title: "Private Chauffeur",
    description:
      "Seamless transfers in our fleet of premium vehicles. Whether you're heading to the airport or exploring the coast, travel with absolute comfort and discretion.",
    button: "Request Service",
    type: "service",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    title: "Personal Concierge",
    description:
      "Your dedicated lifestyle manager is available 24/7. From securing exclusive dinner reservations to curating bespoke local itineraries, consider it done.",
    button: "Meet Your Concierge",
    type: "service",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    title: "Wellness Spa",
    description:
      "Rejuvenate your senses with holistic treatments, guided yoga sessions, and state-of-the-art hydrotherapy facilities.",
    button: "View Spa Menu",
    type: "wellness",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    title: "In-Villa Dining",
    description:
      "Savor culinary masterpieces in the privacy of your suite. Our executive chefs craft personalized menus to suit your exacting tastes.",
    button: "Order Now",
    type: "dining",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
  },
];
</script>

<template>
  <div class="mx-auto max-w-[1280px] px-5 pb-16 pt-0 md:px-8">
    <section class="relative overflow-hidden rounded-none">
      <div
        class="absolute inset-0 bg-cover bg-center"
        style="
          background-image: url(&quot;https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80&quot;);
        "
      />
      <div
        class="absolute inset-0 bg-gradient-to-r from-[#0d1c2e]/80 via-[#142a3d]/45 to-[#0b1d2e]/50"
      />

      <div class="relative px-5 py-24 text-center text-white md:px-10 md:py-28">
        <p
          class="text-sm font-semibold uppercase tracking-[0.22em] text-white/80"
        >
          Exclusive amenities
        </p>
        <h1
          class="sabay-display mt-4 text-5xl font-black tracking-[-0.06em] md:text-8xl"
        >
          Elevate Your Stay
        </h1>
        <p
          class="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/85 md:text-2xl"
        >
          Experience unparalleled comfort with our curated selection of premium
          services, designed to cater to your every desire with seamless
          elegance.
        </p>
      </div>
    </section>

    <section class="mt-10 grid gap-6 lg:grid-cols-2">
      <div
        v-for="item in experiences.slice(0, 2)"
        :key="item.id"
        class="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200"
      >
        <div class="grid h-full gap-0 md:grid-cols-[0.9fr_1.1fr]">
          <div class="overflow-hidden">
            <img
              :src="item.image"
              class="h-full min-h-[260px] w-full object-cover"
              :alt="item.title"
            />
          </div>
          <div class="flex flex-col justify-center p-7">
            <div
              class="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#edf3fb] text-xl text-[#1d2f52]"
            >
              ✦
            </div>
            <h2 class="text-4xl font-semibold text-[#1d2f52]">
              {{ item.title }}
            </h2>
            <p class="mt-4 text-lg leading-8 text-[#495a76]">
              {{ item.description }}
            </p>
            <button
              class="mt-7 inline-flex w-fit items-center rounded-xl border border-[#1d2f52] bg-white px-4 py-3 text-sm font-semibold text-[#1d2f52] hover:bg-[#1d2f52] hover:text-white"
            >
              {{ item.button }} →
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div
        v-for="item in experiences.slice(2, 4)"
        :key="item.id"
        class="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200"
      >
        <div class="grid h-full gap-0 md:grid-cols-[0.9fr_1.1fr]">
          <div class="overflow-hidden">
            <img
              :src="item.image"
              class="h-full min-h-[260px] w-full object-cover"
              :alt="item.title"
            />
          </div>
          <div class="flex flex-col justify-center p-7">
            <div
              class="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#edf3fb] text-xl text-[#1d2f52]"
            >
              ✦
            </div>
            <h2 class="text-4xl font-semibold text-[#1d2f52]">
              {{ item.title }}
            </h2>
            <p class="mt-4 text-lg leading-8 text-[#495a76]">
              {{ item.description }}
            </p>
            <button
              class="mt-7 inline-flex w-fit rounded-xl bg-[#0d224a] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0a1d3c]"
            >
              {{ item.button }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
