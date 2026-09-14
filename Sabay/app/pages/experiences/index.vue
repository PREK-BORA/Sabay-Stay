<script setup lang="ts">
import { computed, ref } from "vue";

const experiences = [
  {
    id: 1,
    title: "Sunset Sailing",
    description:
      "Glide across calm turquoise water as the day turns gold. A private crew, chilled drinks, and the perfect view make this a moment to remember.",
    button: "Explore sailing",
    type: "Water",
    location: "The Maldives",
    duration: "3 hours",
    price: "From $180",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdbIbUNpcKTN8uATzLr9M23l3K3EY3xDF-Ol222tLG_g&s=10",
  },
  {
    id: 2,
    title: "Hidden Island Picnic",
    description:
      "Follow your host to a quiet shore known only to locals. Your basket of island flavors and a shaded table will be waiting by the sea.",
    button: "Discover the picnic",
    type: "Nature",
    location: "Khos Rong ,Cambodia",
    duration: "Half day",
    price: "From $145",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUdmwlbAT9VoBAoBCAi1FDWxLICmVBgsigm9UnSGtnzg&s=10",
  },
  {
    id: 3,
    title: "Jungle Wellness Ritual",
    description:
      "Begin with breathwork beneath the canopy, then settle into a locally inspired treatment designed to restore your natural rhythm.",
    button: "View the ritual",
    type: "Wellness",
    location: "Ubud, Bali",
    duration: "2 hours",
    price: "From $120",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT675xcXToslFwOFnre_Qyd99jGCgikBYL65cgUq1xFHA&s=10",
  },
  {
    id: 4,
    title: "Dinner Under the Stars",
    description:
      "A private table, a tailored menu, and the night sky above. Our chefs bring the best of the destination to your own corner of paradise.",
    button: "Plan your dinner",
    type: "Dining",
    location: "Santorini, Greece",
    duration: "2.5 hours",
    price: "From $210",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc7IEUevJEJ5A0e9OBKqJw0_szrWQVUldzezpt6bFI7w&s=10",
  },
];

const categories = ["All experiences", "Water", "Nature", "Wellness", "Dining"];
const activeCategory = ref("All experiences");
const visibleExperiences = computed(() =>
  activeCategory.value === "All experiences"
    ? experiences
    : experiences.filter(
        (experience) => experience.type === activeCategory.value,
      ),
);
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
          Curated moments, made personal
        </p>
        <h1
          class="sabay-display mt-4 text-5xl font-black tracking-[-0.06em] md:text-8xl"
        >
          Go beyond the getaway.
        </h1>
        <p
          class="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/85 md:text-2xl"
        >
          Discover the places, flavors, and quiet moments that make a stay stay
          with you long after you return home.
        </p>
      </div>
    </section>

    <section class="mt-10">
      <div
        class="flex flex-col gap-5 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.2em] text-[#087d72]"
          >
            Find your moment
          </p>
          <h2 class="mt-2 text-3xl font-bold text-[#1d2f52]">
            Experiences worth remembering
          </h2>
        </div>
        <nav
          class="flex gap-2 overflow-x-auto pb-1"
          aria-label="Experience categories"
        >
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            :class="[
              'whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition-colors',
              activeCategory === category
                ? 'border-[#0d224a] bg-[#0d224a] text-white'
                : 'border-slate-200 bg-white text-[#53637c] hover:border-[#0d224a] hover:text-[#0d224a]',
            ]"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </nav>
      </div>
    </section>

    <section class="mt-8 grid gap-6 lg:grid-cols-2">
      <div
        v-for="item in visibleExperiences"
        :key="item.id"
        class="group overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div class="grid h-full gap-0 md:grid-cols-[0.9fr_1.1fr]">
          <div class="overflow-hidden">
            <img
              :src="item.image"
              class="h-full min-h-[280px] w-full object-cover transition duration-500 group-hover:scale-105"
              :alt="item.title"
            />
          </div>
          <div class="flex flex-col justify-center p-7">
            <div
              class="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#edf3fb] text-sm font-bold text-[#1d2f52]"
            >
              {{ String(item.id).padStart(2, "0") }}
            </div>
            <p
              class="text-xs font-semibold uppercase tracking-[0.16em] text-[#087d72]"
            >
              {{ item.type }} · {{ item.location }}
            </p>
            <h2 class="mt-3 text-3xl font-semibold text-[#1d2f52]">
              {{ item.title }}
            </h2>
            <p class="mt-4 text-base leading-7 text-[#495a76]">
              {{ item.description }}
            </p>
            <div class="mt-5 flex items-center gap-4 text-xs text-[#718096]">
              <span>{{ item.duration }}</span
              ><span aria-hidden="true">·</span><span>{{ item.price }}</span>
            </div>
            <NuxtLink
              to="/contact"
              class="mt-6 inline-flex w-fit items-center rounded-xl border border-[#1d2f52] bg-white px-4 py-3 text-sm font-semibold text-[#1d2f52] hover:bg-[#1d2f52] hover:text-white"
            >
              {{ item.button }}
              <span class="ml-2" aria-hidden="true">-&gt;</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section
      class="mt-10 bg-[#0d224a] px-7 py-10 text-center text-white md:px-10"
    >
      <p
        class="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200"
      >
        Make it yours
      </p>
      <h2 class="mt-3 text-3xl font-bold">
        Your perfect day starts with a conversation.
      </h2>
      <p class="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/75">
        Tell our concierge what you are dreaming of, and we will create an
        experience around it.
      </p>
      <NuxtLink
        to="/contact"
        class="mt-6 inline-flex bg-amber-500 px-5 py-3 text-sm font-bold text-[#18253d] hover:bg-amber-400"
        >Talk to our concierge</NuxtLink
      >
    </section>
  </div>
</template>
