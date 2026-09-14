<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "#app";

const route = useRoute();
const selectedGuests = ref("2 adults, 0 children");

interface DestinationInfo {
  country: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  accent: string;
  highlights: string[];
}

const destinationDetails: Record<string, DestinationInfo> = {
  "koh-rong": {
    country: "Cambodia",
    name: "Koh Rong",
    tagline: "Turquoise waters, untouched sands, and vibrant island life.",
    description:
      "A serene tropical escape where turquoise waters meet pristine white sands, peaceful bays, and unhurried days.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfn2DaMzZdw2EOSNDIxV5DJkk6ky6i3VX42qaO89PsiA&s=10",
    accent: "Coastal escape",
    highlights: ["Bioluminescent plankton", "White sand beaches", "Island boat charters"],
  },
  "angkor-wat": {
    country: "Cambodia",
    name: "Angkor Wat",
    tagline: "Ancient calm, thoughtfully reimagined.",
    description:
      "Move between sacred temples, quiet forest shrines, and timeless streets where ancient heritage tells an unforgettable story.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0g-_gfwa3HmXM_n-HlMgDdEoyhlLw9kj1qWb2RG3x1g&s=10",
    accent: "Cultural escape",
    highlights: ["Sunrise over Angkor", "Private temple tours", "Khmer fine dining"],
  },
  "koh-sdach": {
    country: "Cambodia",
    name: "Koh Sdach",
    tagline: "Ultimate overwater serenity and quiet island days.",
    description:
      "Find pure stillness on the King Island archipelago with unspoiled marine life, fresh local seafood, and tranquil sea views.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnEu51DLvPSb_YK6TanBNh2MTOWmqowBc0vhUwVgxfXA&s=10",
    accent: "Island escape",
    highlights: ["Archipelago cruising", "Coral reef snorkeling", "Local fishing villages"],
  },
  "song-saa": {
    country: "Cambodia",
    name: "Song Saa",
    tagline: "Eco-luxury amid vibrant biodiversity.",
    description:
      "A private sanctuary across twin islands blending sustainable luxury, overwater dining, and secluded coastal hideaways.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSValg7gR1_INGa4FS6OZT3Mxpyuf4mE7TA9LmSDU0Mng&s=10",
    accent: "Eco-luxury escape",
    highlights: ["Private island villas", "Marine conservation tours", "Sunset spa rituals"],
  },
  "chiso-mountain": {
    country: "Cambodia",
    name: "Chiso Mountain",
    tagline: "High-altitude quiet and historical wonder.",
    description:
      "Climb to ancient hilltop sanctuaries overlooking emerald rice fields and dramatic horizons of Takeo province.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVSEUpnDttq4dCn9WvwRlERdoHe4r5siVyDTKoF8amEg&s=10",
    accent: "Mountain escape",
    highlights: ["Historical temple stairs", "Panoramic valley vistas", "Countryside heritage"],
  },
  "amalfi-coast": {
    country: "Italy",
    name: "Amalfi Coast",
    tagline: "Where every view feels like a postcard.",
    description:
      "A sun-washed coastline of pastel villages, hidden coves, and long lunches overlooking the Mediterranean.",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1800&q=85",
    accent: "Coastal escape",
    highlights: [
      "Cliffside villages",
      "Mediterranean dining",
      "Private boat days",
    ],
  },
  "the-maldives": {
    country: "South Asia",
    name: "The Maldives",
    tagline: "A private world, suspended over blue.",
    description:
      "Find stillness in an overwater retreat where warm seas, reef life, and unhurried days become the whole itinerary.",
    image:
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1800&q=85",
    accent: "Island escape",
    highlights: ["Overwater villas", "House reef diving", "Sunset sailing"],
  },
  "costa-rica": {
    country: "Central America",
    name: "Costa Rica",
    tagline: "Wild beauty with a softer way to stay.",
    description:
      "Wake to rainforest birdsong, follow the coastline, and let the natural world set the pace of your escape.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=85",
    accent: "Nature escape",
    highlights: ["Rainforest trails", "Wildlife encounters", "Pacific beaches"],
  },
  "swiss-alps": {
    country: "Switzerland",
    name: "Swiss Alps",
    tagline: "High-altitude quiet, made luxurious.",
    description:
      "Trade the ordinary for crisp mountain air, snowy horizons, and retreats that make slowing down feel natural.",
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=85",
    accent: "Mountain escape",
    highlights: [
      "Alpine rail journeys",
      "Private ski guides",
      "Fireside evenings",
    ],
  },
};

// Aliases for user-friendly slugs or spaces in route params
destinationDetails["khos-rong"] = destinationDetails["koh-rong"];
destinationDetails["khos rong"] = destinationDetails["koh-rong"];
destinationDetails["koh rong"] = destinationDetails["koh-rong"];
destinationDetails["kyoto"] = destinationDetails["angkor-wat"];
destinationDetails["angkor wat"] = destinationDetails["angkor-wat"];
destinationDetails["khos-sdach"] = destinationDetails["koh-sdach"];
destinationDetails["khos sdach"] = destinationDetails["koh-sdach"];
destinationDetails["koh sdach"] = destinationDetails["koh-sdach"];
destinationDetails["khos-songsa"] = destinationDetails["song-saa"];
destinationDetails["khos songsa"] = destinationDetails["song-saa"];
destinationDetails["song saa"] = destinationDetails["song-saa"];
destinationDetails["chiso mountain"] = destinationDetails["chiso-mountain"];

const destination = computed<DestinationInfo>(() => {
  const rawSlug = String(route.params.slug || "").trim();
  const normalizedSlug = rawSlug.toLowerCase().replace(/\s+/g, "-");

  return (
    destinationDetails[normalizedSlug] ??
    destinationDetails[rawSlug.toLowerCase()] ??
    destinationDetails[rawSlug] ??
    destinationDetails["koh-rong"] ??
    destinationDetails["angkor-wat"]
  );
});

const stays = [
  {
    name: "The Azure Retreat",
    detail: "Private villas · Ocean views",
    price: "$1,250",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=85",
    link: "/hotels/angkor-heritage-resort",
  },
  {
    name: "Emerald Canopy Resort",
    detail: "Jungle suites · Spa rituals",
    price: "$850",
    image:
      "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&w=900&q=85",
    link: "/hotels/mondulkiri-forest-sanctuary",
  },
  {
    name: "Koh Rong Island Sanctuary",
    detail: "Overwater villas · Private beach",
    price: "$680",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
    link: "/hotels/koh-rong-island-resort",
  },
  {
    name: "Royal Mekong Villa",
    detail: "Heritage suites · River sunset",
    price: "$450",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=85",
    link: "/hotels/royal-mekong-hotel",
  },
];
</script>

<template>
  <div
    class="min-h-screen bg-[#f8f7f4] font-sans text-[#1d2f52] selection:bg-amber-400 selection:text-slate-900"
  >
    <!-- Hero Section -->
    <section
      class="relative min-h-[75vh] w-full overflow-hidden flex items-end"
    >
      <img
        :src="destination.image"
        :alt="destination.name"
        class="absolute inset-0 h-full w-full object-cover scale-105 transform transition-transform duration-1000 ease-out"
      />
      <!-- Overlays -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-[#07162b]/90 via-[#07162b]/50 to-black/30"
      />
      <div
        class="absolute inset-0 bg-radial-at-c from-transparent via-black/20 to-black/60 pointer-events-none"
      />

      <div
        class="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-32 lg:px-12 lg:pb-24"
      >
        <div class="max-w-3xl">
          <NuxtLink
            to="/destinations"
            class="group inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-md transition-all duration-300 hover:bg-white/25 hover:text-white"
          >
            <span
              class="transition-transform duration-300 group-hover:-translate-x-1"
              >&larr;</span
            >
            All destinations
          </NuxtLink>

          <div class="mt-6 flex items-center gap-3">
            <span class="h-px w-8 bg-amber-400"></span>
            <p
              class="text-xs font-bold uppercase tracking-[0.3em] text-amber-300"
            >
              {{ destination.country }} &bull; {{ destination.accent }}
            </p>
          </div>

          <h1
            class="mt-3 text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            {{ destination.name }}
          </h1>

          <p
            class="mt-6 text-xl font-light leading-relaxed text-slate-200 sm:text-2xl"
          >
            {{ destination.tagline }}
          </p>

          <p
            class="mt-4 max-w-2xl text-base text-slate-200/90 leading-relaxed font-normal"
          >
            {{ destination.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content Grid -->
    <main class="relative z-20 mx-auto max-w-7xl px-6 py-12 lg:px-12 lg:py-20">
      <section class="grid gap-8 lg:grid-cols-12 lg:items-start">
        <!-- Left Panel: Context -->
        <div
          class="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm ring-1 ring-slate-200/60 lg:col-span-7 lg:p-12"
        >
          <div>
            <span
              class="text-xs font-bold uppercase tracking-[0.25em] text-[#087d72]"
              >The Experience</span
            >
            <h2
              class="sabay-display mt-3 text-3xl font-bold tracking-tight text-[#07166b] sm:text-4xl"
            >
              A destination with its own rhythm.
            </h2>
            <p class="mt-6 text-base leading-relaxed text-[#4b5871]">
              The best journeys leave room for discovery. Let your mornings
              unfold slowly, follow a local recommendation for lunch, and leave
              the afternoon open for whatever catches your eye.
            </p>
          </div>

          <div class="mt-10">
            <NuxtLink
              to="/experiences"
              class="group inline-flex items-center gap-3 rounded-xl bg-[#07166b] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#0d278a] hover:shadow-lg"
            >
              <span>Explore experiences</span>
              <span
                class="transition-transform duration-300 group-hover:translate-x-1"
                >&rarr;</span
              >
            </NuxtLink>
          </div>
        </div>

        <!-- Right Panel: Highlights & Booking Card -->
        <div class="space-y-8 lg:col-span-5">
          <!-- Highlights Box -->
          <div
            class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm ring-1 ring-slate-200/60"
          >
            <span
              class="text-xs font-bold uppercase tracking-[0.25em] text-[#087d72]"
              >Highlights</span
            >
            <ul class="mt-6 space-y-4">
              <li
                v-for="(highlight, index) in destination.highlights"
                :key="highlight"
                class="flex items-center gap-4 rounded-xl border border-slate-100 bg-[#f9fafb] p-3.5 transition-colors duration-300 hover:border-slate-200 hover:bg-[#f3f4f6]"
              >
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e5f0ed] text-xs font-bold text-[#087d72]"
                >
                  0{{ index + 1 }}
                </span>
                <span class="text-sm font-semibold text-[#1d2f52]">{{
                  highlight
                }}</span>
              </li>
            </ul>
          </div>

          <!-- Quick Booking Card -->
          <div
            class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200/60"
          >
            <div
              class="flex items-center justify-between border-b border-slate-100 pb-5"
            >
              <div>
                <p
                  class="text-[10px] font-bold uppercase tracking-widest text-[#65728a]"
                >
                  Price starting from
                </p>
                <p
                  class="sabay-display mt-1 text-4xl font-extrabold tracking-tight text-[#07166b]"
                >
                  $450
                  <span class="text-xs font-normal text-[#65728a]"
                    >/ night</span
                  >
                </p>
              </div>
              <div
                class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eaf1fb] text-2xl"
              >
                🛏️
              </div>
            </div>

            <div class="mt-5 space-y-3">
              <div
                class="rounded-xl border border-slate-200 bg-[#f9fafb] p-3.5 transition-colors hover:border-slate-300"
              >
                <p
                  class="text-[10px] font-bold uppercase tracking-wider text-[#65728a]"
                >
                  Check-in / Check-out
                </p>
                <p class="mt-1 text-sm font-semibold text-[#1d2f52]">
                  Select Travel Dates
                </p>
              </div>

              <div
                class="rounded-xl border border-slate-200 bg-[#f9fafb] p-3.5 transition-colors hover:border-slate-300"
              >
                <p
                  class="text-[10px] font-bold uppercase tracking-wider text-[#65728a]"
                >
                  Guests
                </p>
                <p class="mt-1 text-sm font-semibold text-[#1d2f52]">
                  {{ selectedGuests }}
                </p>
              </div>
            </div>

            <NuxtLink
              to="/hotels"
              class="mt-6 flex w-full items-center justify-center rounded-xl bg-[#07166b] px-6 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-[#0d278a] hover:shadow-lg"
            >
              Check Availability
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Accommodations Section -->
      <section class="mt-24">
        <div
          class="flex items-end justify-between border-b border-slate-200 pb-6"
        >
          <div>
            <span
              class="text-xs font-bold uppercase tracking-[0.25em] text-[#087d72]"
              >Accommodations</span
            >
            <h2
              class="sabay-display mt-2 text-3xl font-bold tracking-tight text-[#07166b] sm:text-4xl"
            >
              A beautiful base for your journey
            </h2>
          </div>
          <NuxtLink
            to="/hotels"
            class="hidden text-sm font-semibold text-[#07166b] transition-colors hover:underline sm:block"
          >
            View all stays &rarr;
          </NuxtLink>
        </div>

        <div class="mt-8 grid gap-8 md:grid-cols-2">
          <article
            v-for="stay in stays"
            :key="stay.name"
            class="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-200/60 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
          >
            <div class="flex flex-col h-full sm:flex-row">
              <div
                class="relative h-60 w-full overflow-hidden sm:h-auto sm:w-1/2"
              >
                <img
                  :src="stay.image"
                  :alt="stay.name"
                  class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>

              <div class="flex flex-col justify-between p-6 sm:w-1/2">
                <div>
                  <p class="text-xs font-medium text-[#65728a]">
                    {{ stay.detail }}
                  </p>
                  <h3
                    class="sabay-display mt-2 text-xl font-bold text-[#07166b] transition-colors group-hover:text-[#087d72]"
                  >
                    {{ stay.name }}
                  </h3>
                </div>

                <div class="mt-6">
                  <p
                    class="text-[10px] font-bold uppercase tracking-wider text-[#65728a]"
                  >
                    From
                  </p>
                  <p class="sabay-display text-2xl font-bold text-[#07166b]">
                    {{ stay.price }}
                    <span class="text-xs font-normal text-[#65728a]"
                      >/ night</span
                    >
                  </p>
                  <NuxtLink
                    :to="stay.link"
                    class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#087d72] transition-colors hover:text-[#07166b]"
                  >
                    View property <span>&rarr;</span>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- CTA Banner -->
      <section
        class="relative mt-24 overflow-hidden rounded-3xl bg-[#07166b] p-10 text-center text-white sm:p-16"
      >
        <div
          class="absolute -bottom-24 -right-12 h-64 w-64 rounded-full border-[32px] border-white/10"
          aria-hidden="true"
        />
        <div class="relative z-10 mx-auto max-w-2xl">
          <span
            class="text-xs font-bold uppercase tracking-[0.25em] text-amber-300"
            >Your Next Chapter</span
          >
          <h2
            class="sabay-display mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            Ready to see it for yourself?
          </h2>
          <p class="mt-4 text-base leading-relaxed text-slate-200">
            Browse our curated stays and start shaping a journey that feels
            entirely yours.
          </p>
          <NuxtLink
            to="/hotels"
            class="mt-8 inline-flex items-center rounded-xl bg-amber-400 px-8 py-4 text-sm font-bold text-[#07166b] transition-all duration-300 hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/20"
          >
            Find a stay
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>
