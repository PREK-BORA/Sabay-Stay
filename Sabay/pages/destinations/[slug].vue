<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "#app";
import { useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const checkIn = ref("");
const checkOut = ref("");
const adults = ref(2);
const children = ref(0);
const isGuestsOpen = ref(false);
const bookingError = ref("");

const guestsLabel = computed(() => {
  const adultText = `${adults.value} Adult${adults.value === 1 ? "" : "s"}`;
  const childText = `${children.value} Child${children.value === 1 ? "" : "ren"}`;
  return `${adultText}, ${childText}`;
});

function adjustGuests(type: "adult" | "child", delta: number) {
  if (type === "adult") {
    adults.value = Math.max(1, adults.value + delta);
    return;
  }

  children.value = Math.max(0, children.value + delta);
}

function checkAvailability() {
  if (!checkIn.value || !checkOut.value) {
    bookingError.value = "Please choose both dates.";
    return;
  }

  if (checkOut.value <= checkIn.value) {
    bookingError.value = "Check-out must be after check-in.";
    return;
  }

  bookingError.value = "";
  router.push({
    path: "/hotels",
    query: {
      destination: String(route.params.slug),
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      adults: adults.value,
      children: children.value,
    },
  });
}

const destinationDetails = {
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
  kyoto: {
    country: "Cambodia",
    name: "Angkor Wat",
    tagline: "Ancient calm, thoughtfully reimagined.",
    description:
      "Move between moss gardens, quiet tea houses, and timeless streets where every season tells a different story.",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1800&q=85",
    accent: "Cultural escape",
    highlights: ["Temple mornings", "Seasonal cuisine", "Private tea rituals"],
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
} as const;

const destination = computed(() => {
  const slug = String(route.params.slug);
  return (
    destinationDetails[slug as keyof typeof destinationDetails] ??
    destinationDetails["amalfi-coast"]
  );
});

const stays = [
  {
    name: "The Azure Retreat",
    detail: "Private villas · Ocean views",
    price: "$1,250",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=85",
    link: "/hotels/azure-retreat",
  },
  {
    name: "Emerald Canopy Resort",
    detail: "Jungle suites · Spa rituals",
    price: "$850",
    image:
      "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&w=900&q=85",
    link: "/hotels/emerald-canopy",
  },
];
</script>

<template>
  <div class="min-h-screen bg-[#f7f6f2] text-[#1d2f52]">
    <section class="relative min-h-[520px] overflow-hidden md:min-h-[640px]">
      <img
        :src="destination.image"
        :alt="destination.name"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-[#07182b]/90 via-[#07182b]/30 to-[#07182b]/10"
      />
      <div
        class="relative mx-auto flex min-h-[520px] max-w-7xl items-end px-5 pb-12 md:min-h-[640px] md:px-10 md:pb-20"
      >
        <div class="max-w-3xl text-white">
          <NuxtLink
            to="/destinations"
            class="text-xs font-semibold uppercase tracking-[0.2em] text-white/75 hover:text-white"
            >← All destinations</NuxtLink
          >
          <p
            class="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-amber-200"
          >
            {{ destination.country }} · {{ destination.accent }}
          </p>
          <h1
            class="sabay-display mt-4 text-6xl font-black leading-[0.95] tracking-[-0.05em] md:text-8xl"
          >
            {{ destination.name }}
          </h1>
          <p class="mt-5 text-xl font-medium text-white/90 md:text-2xl">
            {{ destination.tagline }}
          </p>
          <p
            class="mt-4 max-w-2xl text-sm leading-7 text-white/75 md:text-base"
          >
            {{ destination.description }}
          </p>
        </div>
      </div>
    </section>

    <main class="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
      <section class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div class="bg-white p-7 shadow-sm ring-1 ring-slate-200 md:p-10">
          <p
            class="text-xs font-semibold uppercase tracking-[0.2em] text-[#087d72]"
          >
            The feeling of this place
          </p>
          <h2
            class="mt-3 text-3xl font-bold tracking-tight text-[#0d224a] md:text-4xl"
          >
            A destination with its own rhythm.
          </h2>
          <p class="mt-5 text-base leading-8 text-[#53637c]">
            The best journeys leave room for discovery. Let your mornings unfold
            slowly, follow a local recommendation for lunch, and leave the
            afternoon open for whatever catches your eye.
          </p>
          <NuxtLink
            to="/experiences"
            class="mt-7 inline-flex items-center bg-[#0d224a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#087d72]"
            >Explore experiences
            <span class="ml-2" aria-hidden="true">-&gt;</span></NuxtLink
          >
        </div>
        <div class="bg-[#e5f0ed] p-7 md:p-10">
          <p
            class="text-xs font-semibold uppercase tracking-[0.2em] text-[#087d72]"
          >
            Make the most of it
          </p>
          <ul class="mt-6 divide-y divide-[#c8ddd7]">
            <li
              v-for="(highlight, index) in destination.highlights"
              :key="highlight"
              class="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
            >
              <span class="text-sm font-bold text-[#087d72]"
                >0{{ index + 1 }}</span
              >
              <span class="text-sm font-semibold text-[#0d224a]">{{
                highlight
              }}</span>
            </li>
          </ul>

          <div
            class="mt-8 rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <div
              class="flex items-center justify-between gap-3 rounded-[1rem] border border-slate-200 bg-[#f5f7fa] p-4"
            >
              <div>
                <p class="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Price from
                </p>
                <p class="mt-3 text-4xl font-black text-[#1d2f52]">$450</p>
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                  / night
                </p>
              </div>
              <div
                class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf1fb] text-xl"
                aria-hidden="true"
              >
                🛏️
              </div>
            </div>

            <div class="mt-5 space-y-3 text-sm text-[#3b4a62]">
              <div class="rounded-xl border border-slate-200 bg-white p-3">
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Check-in / Check-out
                </p>
                <div class="mt-2 grid grid-cols-2 gap-2">
                  <label class="flex flex-col text-left">
                    <span class="text-[10px] uppercase tracking-widest text-slate-400">Check-in</span>
                    <input
                      v-model="checkIn"
                      type="date"
                      class="mt-1 bg-transparent text-sm font-medium text-[#1d2f52] outline-none"
                    />
                  </label>
                  <label class="flex flex-col text-left">
                    <span class="text-[10px] uppercase tracking-widest text-slate-400">Check-out</span>
                    <input
                      v-model="checkOut"
                      type="date"
                      class="mt-1 bg-transparent text-sm font-medium text-[#1d2f52] outline-none"
                    />
                  </label>
                </div>
              </div>
              <div class="relative rounded-xl border border-slate-200 bg-white p-3">
                <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Guests
                </p>
                <button
                  type="button"
                  class="mt-2 flex w-full items-center justify-between text-left font-medium text-[#1d2f52]"
                  @click="isGuestsOpen = !isGuestsOpen"
                >
                  {{ guestsLabel }}
                  <span aria-hidden="true">{{ isGuestsOpen ? "▲" : "▼" }}</span>
                </button>
                <div
                  v-if="isGuestsOpen"
                  class="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border border-slate-200 bg-white p-3 shadow-lg"
                >
                  <div
                    class="flex items-center justify-between gap-4 py-2 text-[#1d2f52]"
                  >
                    <span class="text-sm">Adults</span>
                    <div class="flex items-center gap-3">
                      <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-lg text-[#1d2f52] hover:bg-slate-100"
                        @click.stop="adjustGuests('adult', -1)"
                      >
                        −
                      </button>
                      <span class="min-w-4 text-center text-sm">{{ adults }}</span>
                      <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-lg text-[#1d2f52] hover:bg-slate-100"
                        @click.stop="adjustGuests('adult', 1)"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div
                    class="mt-2 flex items-center justify-between gap-4 py-2 text-[#1d2f52]"
                  >
                    <span class="text-sm">Children</span>
                    <div class="flex items-center gap-3">
                      <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-lg text-[#1d2f52] hover:bg-slate-100"
                        @click.stop="adjustGuests('child', -1)"
                      >
                        −
                      </button>
                      <span class="min-w-4 text-center text-sm">{{ children }}</span>
                      <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-lg text-[#1d2f52] hover:bg-slate-100"
                        @click.stop="adjustGuests('child', 1)"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p v-if="bookingError" class="mt-3 text-sm text-red-600" role="alert">
              {{ bookingError }}
            </p>

            <NuxtLink
              to="/hotels"
              class="mt-5 flex w-full items-center justify-center rounded-xl bg-[#0d224a] px-4 py-4 text-base font-semibold text-white hover:bg-[#0a1d3d]"
              @click.prevent="checkAvailability"
            >
              Check Availability
            </NuxtLink>
          </div>
        </div>
      </section>

      <section class="mt-16">
        <div
          class="flex items-end justify-between gap-5 border-b border-slate-200 pb-5"
        >
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-[0.2em] text-[#087d72]"
            >
              Where to stay
            </p>
            <h2 class="mt-2 text-3xl font-bold tracking-tight text-[#0d224a]">
              A beautiful base for your journey
            </h2>
          </div>
          <NuxtLink
            to="/hotels"
            class="hidden text-sm font-semibold text-[#0d224a] hover:text-[#087d72] sm:block"
            >View all stays →</NuxtLink
          >
        </div>
        <div class="mt-7 grid gap-6 md:grid-cols-2">
          <article
            v-for="stay in stays"
            :key="stay.name"
            class="group overflow-hidden bg-white shadow-sm ring-1 ring-slate-200"
          >
            <div class="grid md:grid-cols-[0.9fr_1.1fr]">
              <div class="h-56 overflow-hidden md:h-full">
                <img
                  :src="stay.image"
                  :alt="stay.name"
                  class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div class="p-6">
                <p class="text-xs text-[#718096]">{{ stay.detail }}</p>
                <h3 class="mt-2 text-2xl font-bold text-[#0d224a]">
                  {{ stay.name }}
                </h3>
                <p
                  class="mt-5 text-xs uppercase tracking-[0.14em] text-[#718096]"
                >
                  From
                </p>
                <p class="mt-1 text-2xl font-bold text-[#087d72]">
                  {{ stay.price }}
                  <span class="text-xs font-normal text-[#718096]"
                    >/ night</span
                  >
                </p>
                <NuxtLink
                  :to="stay.link"
                  class="mt-5 inline-flex text-sm font-semibold text-[#0d224a] hover:text-[#087d72]"
                  >View property <span class="ml-2">-&gt;</span></NuxtLink
                >
              </div>
            </div>
          </article>
        </div>
      </section>

      <section
        class="mt-16 bg-[#0d224a] px-7 py-10 text-center text-white md:px-10 md:py-14"
      >
        <p
          class="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200"
        >
          Your next chapter
        </p>
        <h2 class="mt-3 text-3xl font-bold">Ready to see it for yourself?</h2>
        <p class="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/75">
          Browse our stays and start shaping a journey that feels entirely
          yours.
        </p>
        <NuxtLink
          to="/hotels"
          class="mt-6 inline-flex bg-amber-500 px-5 py-3 text-sm font-bold text-[#18253d] hover:bg-amber-400"
          >Find a stay</NuxtLink
        >
      </section>
    </main>
  </div>
</template>
