<script setup lang="ts">
const destinations = [
  {
    country: "Italy",
    name: "Amalfi Coast",
    description:
      "Dramatic cliffs, pastel villages, and the sparkling Mediterranean.",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80",
    featured: true,
    metric: "24k travelers this year",
    accent: "#d7ebff",
  },
  {
    country: "Japan",
    name: "Kyoto",
    description: "Temples, gardens, and timeless traditions.",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    metric: "98%",
    accent: "#f7efe1",
  },
  {
    country: "South Asia",
    name: "The Maldives",
    description: "Ultimate overwater luxury and isolation.",
    image:
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80",
    metric: "4.9",
    accent: "#cfeaf1",
  },
  {
    country: "Central America",
    name: "Costa Rica",
    description: "Eco-luxury amid vibrant biodiversity.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    metric: "",
    accent: "#d7ebe8",
  },
  {
    country: "Switzerland",
    name: "Swiss Alps",
    description: "Pristine slopes and exclusive alpine retreats.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    metric: "",
    accent: "#dfeaf6",
  },
];

const filters = ["All Regions", "Coastal", "Cultural", "Mountains", "Tropical"];
</script>

<template>
  <div class="mx-auto max-w-[1280px] px-5 pb-16 pt-8 md:px-8">
    <section class="text-center">
      <h1
        class="sabay-display text-5xl font-black tracking-[-0.06em] text-[#1d2f52] md:text-[5.5rem]"
      >
        Discover the Extraordinary
      </h1>
      <p class="mx-auto mt-5 max-w-3xl text-xl leading-8 text-[#46576f]">
        Curated collections of the world's most breathtaking regions, designed
        for the discerning traveler.
      </p>

      <div
        class="mx-auto mt-8 flex max-w-4xl flex-col gap-3 rounded-[1.5rem] bg-white p-3 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center"
      >
        <div
          class="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-[#f9fafb] px-4 py-3 text-left"
        >
          <span class="text-xl">⌕</span>
          <span class="text-[#495d7d]">Search regions, cities, or islands</span>
        </div>

        <div
          class="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#f9fafb] px-4 py-3 text-left md:w-[220px]"
        >
          <span class="text-xl">▣</span>
          <span class="text-[#495d7d]">Any Season</span>
        </div>

        <button
          class="rounded-xl bg-[#0d224a] px-6 py-3 text-base font-semibold text-white hover:bg-[#0b1d3d]"
        >
          Explore
        </button>
      </div>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          v-for="filter in filters"
          :key="filter"
          class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-[#1d2f52] hover:border-[#1d2f52]"
          :class="
            filter === 'All Regions'
              ? 'bg-[#0d224a] text-white hover:bg-[#0b1d3d]'
              : ''
          "
        >
          {{ filter }}
        </button>
      </div>
    </section>

    <section class="mt-10 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
      <div
        class="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200"
      >
        <div class="relative h-[360px] overflow-hidden md:h-[440px]">
          <img
            class="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80"
            alt="Amalfi Coast"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-[#0d1d30]/80 via-[#081826]/20 to-transparent"
          />

          <div class="absolute inset-x-0 bottom-0 p-6 text-white">
            <div class="flex items-center justify-between gap-3">
              <div>
                <p class="text-sm uppercase tracking-[0.22em] text-white/85">
                  Italy
                </p>
                <h2 class="sabay-display mt-2 text-5xl font-black">
                  Amalfi Coast
                </h2>
              </div>
              <div
                class="rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-sm"
              >
                24k travelers this year
              </div>
            </div>
            <div class="mt-5 flex items-center justify-between gap-4">
              <p class="max-w-md text-lg text-white/85">
                Dramatic cliffs, pastel villages, and the sparkling
                Mediterranean.
              </p>
              <button
                class="rounded-full border border-white/75 bg-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/20"
              >
                Explore →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-5">
        <div
          class="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200"
        >
          <div class="relative h-[220px] overflow-hidden">
            <img
              :src="destinations[1].image"
              class="h-full w-full object-cover"
              alt="Kyoto"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-[#0f1d29]/70 to-transparent"
            />
            <div class="absolute inset-x-0 bottom-0 p-5 text-white">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm uppercase tracking-[0.18em] text-white/80">
                  Japan
                </p>
                <span
                  class="rounded-full bg-white/15 px-2 py-1 text-xs text-white/90"
                  >98%</span
                >
              </div>
              <h3 class="sabay-display mt-2 text-4xl font-black">Kyoto</h3>
              <p class="mt-2 text-sm text-white/80">
                Temples, gardens, and timeless traditions.
              </p>
            </div>
          </div>
        </div>

        <div
          class="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200"
        >
          <div class="relative h-[220px] overflow-hidden">
            <img
              :src="destinations[2].image"
              class="h-full w-full object-cover"
              alt="The Maldives"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-[#0a2035]/70 to-transparent"
            />
            <div class="absolute inset-x-0 bottom-0 p-5 text-white">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm uppercase tracking-[0.18em] text-white/80">
                  South Asia
                </p>
                <span
                  class="rounded-full bg-white/15 px-2 py-1 text-xs text-white/90"
                  >★ 4.9</span
                >
              </div>
              <h3 class="sabay-display mt-2 text-4xl font-black">
                The Maldives
              </h3>
              <p class="mt-2 text-sm text-white/80">
                Ultimate overwater luxury and isolation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-6 grid gap-5 xl:grid-cols-[0.95fr_1.05fr_0.75fr]">
      <div
        class="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200"
      >
        <div class="relative h-[260px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
            class="h-full w-full object-cover"
            alt="Swiss Alps"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-[#091827]/80 via-[#0a1e2b]/25 to-transparent"
          />
          <div class="absolute inset-x-0 bottom-0 p-5 text-white">
            <p class="text-sm uppercase tracking-[0.18em] text-white/80">
              Switzerland
            </p>
            <h3 class="sabay-display mt-2 text-4xl font-black">Swiss Alps</h3>
            <p class="mt-2 text-sm text-white/80">
              Pristine slopes and exclusive alpine retreats.
            </p>
            <button
              class="mt-4 rounded-xl border border-white/70 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
            >
              Discover More
            </button>
          </div>
        </div>
      </div>

      <div
        class="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200"
      >
        <div class="relative h-[260px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
            class="h-full w-full object-cover"
            alt="Costa Rica"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-[#0a1d28]/80 to-transparent"
          />
          <div class="absolute inset-x-0 bottom-0 p-5 text-white">
            <p class="text-sm uppercase tracking-[0.18em] text-white/80">
              Central America
            </p>
            <h3 class="sabay-display mt-2 text-4xl font-black">Costa Rica</h3>
            <p class="mt-2 text-sm text-white/80">
              Eco-luxury amid vibrant biodiversity.
            </p>
          </div>
        </div>
      </div>

      <div
        class="flex items-center justify-center rounded-[2rem] border border-slate-200 bg-[#f7f5f1] p-6 shadow-sm"
      >
        <div class="text-center">
          <div
            class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl text-[#1d2f52] shadow-sm"
          >
            ✦
          </div>
          <h3 class="sabay-display mt-5 text-4xl font-black text-[#1d2f52]">
            Can't decide?
          </h3>
          <p class="mt-4 text-lg leading-8 text-[#455670]">
            Let our concierge craft a bespoke journey for you.
          </p>
          <button
            class="mt-5 rounded-xl bg-[#0d224a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0a1d3d]"
          >
            Contact Concierge
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
