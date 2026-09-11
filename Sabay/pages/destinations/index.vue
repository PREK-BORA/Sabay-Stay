<script setup lang="ts">
import { computed, ref } from "vue";

type Destination = {
  slug: string;
  country: string;
  name: string;
  description: string;
  image: string;
  region: string;
  season: string;
  metric: string;
};

const destinations: Destination[] = [
  {
    slug: "khos rong",
    country: "Cambodia",
    name: "Khos Rong",
    description:
      "Dramatic cliffs, pastel villages, and the sparkling Mediterranean.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfn2DaMzZdw2EOSNDIxV5DJkk6ky6i3VX42qaO89PsiA&s=10",
    region: "Coastal",
    season: "Summer",
    metric: "24k travelers this year",
  },
  {
    slug: "Angkor Wat",
    country: "Cambodia",
    name: "Angkor Wat",
    description: "Ancient temple complex and cultural heritage.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0g-_gfwa3HmXM_n-HlMgDdEoyhlLw9kj1qWb2RG3x1g&s=10",
    region: "Cultural",
    season: "Spring",
    metric: "98% guest love",
  },
  {
    slug: "Khos Sdach",
    country: "Cambodia",
    name: "khos Sdach",
    description: "Ultimate overwater luxury and quiet island days.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnEu51DLvPSb_YK6TanBNh2MTOWmqowBc0vhUwVgxfXA&s=10",
    region: "coastal",
    season: "Winter",
    metric: "4.9 guest rating",
  },
  {
    slug: "khos Songsa",
    country: "Cambodia",
    name: "khos Songsa",
    description: "Eco-luxury amid vibrant biodiversity.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSValg7gR1_INGa4FS6OZT3Mxpyuf4mE7TA9LmSDU0Mng&s=10",
    region: "coastal",
    season: "Winter",
    metric: "Wild by nature",
  },
  {
    slug: "Chiso Mountain",
    country: "Cambodia",
    name: "Chiso Mountain",
    description: "Pristine slopes and exclusive alpine retreats.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVSEUpnDttq4dCn9WvwRlERdoHe4r5siVyDTKoF8amEg&s=10",
    region: "Mountains",
    season: "Winter",
    metric: "Peak season",
  },
];

const regions = ["All Regions", "Coastal", "Cultural", "Mountains", "Tropical"];
const searchQuery = ref("");
const selectedRegion = ref("All Regions");
const selectedSeason = ref("Any Season");

const filteredDestinations = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return destinations.filter((destination) => {
    const matchesRegion =
      selectedRegion.value === "All Regions" ||
      destination.region === selectedRegion.value;
    const matchesSeason =
      selectedSeason.value === "Any Season" ||
      destination.season === selectedSeason.value;
    const matchesQuery =
      !query ||
      `${destination.name} ${destination.country} ${destination.description}`
        .toLowerCase()
        .includes(query);
    return matchesRegion && matchesSeason && matchesQuery;
  });
});
</script>

<template>
  <div class="min-h-screen bg-[#f7f6f2] text-[#1d2f52]">
    <section class="relative overflow-hidden bg-[#0d224a] text-white">
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(215,235,255,0.2),transparent_32%)]"
        aria-hidden="true"
      />
      <div
        class="relative mx-auto max-w-7xl px-5 pb-20 pt-16 md:px-10 md:pb-28 md:pt-24"
      >
        <div class="max-w-3xl">
          <p
            class="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200"
          >
            Your world, beautifully considered
          </p>
          <h1
            class="sabay-display mt-5 text-5xl font-black leading-[0.98] tracking-[-0.05em] md:text-8xl"
          >
            Discover the extraordinary.
          </h1>
          <p
            class="mt-6 max-w-2xl text-base leading-7 text-white/75 md:text-xl"
          >
            Curated destinations, remarkable stays, and the kind of places that
            make you want to stay a little longer.
          </p>
        </div>
        <div
          class="mt-10 grid max-w-5xl gap-3 rounded-2xl bg-white p-3 text-[#1d2f52] shadow-2xl md:grid-cols-[1.4fr_0.8fr_auto]"
        >
          <label
            class="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#f9fafb] px-4 py-3"
          >
            <span class="text-xl text-[#087d72]" aria-hidden="true">⌕</span>
            <span class="sr-only">Search destinations</span>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Search regions, cities, or islands"
              class="w-full bg-transparent text-sm outline-none placeholder:text-[#718096]"
            />
          </label>
          <label
            class="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#f9fafb] px-4 py-3"
          >
            <span class="text-lg text-[#087d72]" aria-hidden="true">◷</span>
            <span class="sr-only">Choose a season</span>
            <select
              v-model="selectedSeason"
              class="w-full bg-transparent text-sm outline-none"
            >
              <option>Any Season</option>
              <option>Spring</option>
              <option>Summer</option>
              <option>Winter</option>
            </select>
          </label>
          <button
            type="button"
            class="rounded-xl bg-amber-500 px-8 py-3 text-sm font-bold text-[#18253d] hover:bg-amber-400"
            @click="selectedRegion = 'All Regions'"
          >
            Explore
          </button>
        </div>
      </div>
    </section>

    <main class="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
      <div
        class="flex flex-col gap-5 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.2em] text-[#087d72]"
          >
            Choose your next chapter
          </p>
          <h2 class="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Places that stay with you
          </h2>
        </div>
        <p class="max-w-sm text-sm leading-6 text-[#65728a] md:text-right">
          {{ filteredDestinations.length }} destinations selected for your kind
          of escape.
        </p>
      </div>
      <nav
        class="mt-7 flex gap-2 overflow-x-auto pb-1"
        aria-label="Destination regions"
      >
        <button
          v-for="region in regions"
          :key="region"
          type="button"
          :class="[
            'whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold transition-colors',
            selectedRegion === region
              ? 'border-[#0d224a] bg-[#0d224a] text-white'
              : 'border-slate-200 bg-white text-[#53637c] hover:border-[#0d224a]',
          ]"
          @click="selectedRegion = region"
        >
          {{ region }}
        </button>
      </nav>
      <div
        v-if="filteredDestinations.length"
        class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <article
          v-for="destination in filteredDestinations"
          :key="destination.slug"
          class="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          :class="
            destination.slug === 'amalfi-coast'
              ? 'md:col-span-2 lg:col-span-2'
              : ''
          "
        >
          <div
            class="relative h-72 overflow-hidden"
            :class="destination.slug === 'amalfi-coast' ? 'lg:h-[390px]' : ''"
          >
            <img
              :src="destination.image"
              :alt="destination.name"
              class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-[#081826]/85 via-[#081826]/10 to-transparent"
            />
            <div class="absolute inset-x-0 bottom-0 p-6 text-white">
              <div class="flex items-end justify-between gap-3">
                <div>
                  <p class="text-xs uppercase tracking-[0.2em] text-white/75">
                    {{ destination.country }}
                  </p>
                  <h3
                    class="sabay-display mt-2 text-4xl font-black md:text-5xl"
                  >
                    {{ destination.name }}
                  </h3>
                </div>
                <span
                  class="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-[10px] backdrop-blur-sm"
                  >{{ destination.metric }}</span
                >
              </div>
              <p class="mt-3 max-w-lg text-sm leading-6 text-white/80">
                {{ destination.description }}
              </p>
              <NuxtLink
                :to="`/destinations/${destination.slug}`"
                class="mt-4 inline-flex items-center rounded-full border border-white/70 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-sm hover:bg-white hover:text-[#1d2f52]"
                >Explore destination
                <span class="ml-2" aria-hidden="true">-&gt;</span></NuxtLink
              >
            </div>
          </div>
        </article>
      </div>
      <div
        v-else
        class="mt-8 bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-200"
      >
        <p class="font-semibold">No destinations found</p>
        <p class="mt-2 text-sm text-[#65728a]">
          Try another search, season, or region.
        </p>
      </div>
      <section
        class="mt-14 flex flex-col gap-6 bg-[#e5f0ed] p-8 md:flex-row md:items-center md:justify-between md:p-10"
      >
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.2em] text-[#087d72]"
          >
            Not sure where to begin?
          </p>
          <h2 class="mt-2 text-2xl font-bold text-[#0d224a]">
            Let your stay find its setting.
          </h2>
          <p class="mt-2 max-w-xl text-sm leading-6 text-[#53637c]">
            Our concierge can match your mood, pace, and travel style with a
            destination made for you.
          </p>
        </div>
        <NuxtLink
          to="/contact"
          class="inline-flex shrink-0 items-center justify-center bg-[#0d224a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#087d72]"
          >Talk to a concierge</NuxtLink
        >
      </section>
    </main>
  </div>
</template>
