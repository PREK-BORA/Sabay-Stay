<script setup lang="ts">
import { computed, ref } from "vue";

type Offer = {
  id: string;
  category: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  location: string;
  price: string;
  originalPrice: string;
  saving: string;
  includes: string[];
  badge?: string;
};

const categories = ["All offers", "Stay longer", "Romance", "Wellness"];
const activeCategory = ref("All offers");

const offers: Offer[] = [
  {
    id: "island-escape",
    category: "Stay longer",
    eyebrow: "Stay 4 nights, pay for 3",
    title: "The Island Escape",
    description:
      "Give yourself an extra day of ocean air, slow mornings, and sunsets over the water.",
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=85",
    location: "The Azure Retreat · Maldives",
    price: "$3,750",
    originalPrice: "$5,000",
    saving: "Save 25%",
    includes: ["Daily breakfast", "Private airport transfer", "Resort credit"],
    badge: "Most popular",
  },
  {
    id: "sunset-for-two",
    category: "Romance",
    eyebrow: "A stay made for two",
    title: "Sunset for Two",
    description:
      "A thoughtful escape with a private dinner, champagne, and time to reconnect.",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=85",
    location: "Cliffside Sanctuary · Santorini",
    price: "$2,250",
    originalPrice: "$2,800",
    saving: "Save 20%",
    includes: [
      "3 nights in an ocean suite",
      "Sunset dinner",
      "Couples massage",
    ],
  },
  {
    id: "restore-retreat",
    category: "Wellness",
    eyebrow: "Your reset starts here",
    title: "Restore Retreat",
    description:
      "Trade the busy pace for nourishing meals, restorative treatments, and quiet space.",
    image:
      "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&w=1200&q=85",
    location: "Emerald Canopy Resort · Bali",
    price: "$1,950",
    originalPrice: "$2,400",
    saving: "Save 18%",
    includes: [
      "4 nights in a jungle villa",
      "Daily wellness session",
      "Healthy breakfast",
    ],
  },
];

const visibleOffers = computed(() =>
  activeCategory.value === "All offers"
    ? offers
    : offers.filter((offer) => offer.category === activeCategory.value),
);
</script>

<template>
  <div class="min-h-screen bg-[#f8f7f4] font-sans text-[#18253d]">
    <header class="relative overflow-hidden bg-[#07166b] text-white">
      <div
        class="absolute -bottom-32 -right-12 h-72 w-72 rounded-full border-[32px] border-amber-300/15"
        aria-hidden="true"
      />
      <div class="relative mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
        <div class="max-w-2xl">
          <p
            class="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200"
          >
            Limited-time escapes
          </p>
          <h1
            class="mt-5 text-4xl font-black leading-tight tracking-tight md:text-6xl"
          >
            Make more room for beautiful moments.
          </h1>
          <p class="mt-5 max-w-xl text-base leading-7 text-white/80">
            Enjoy more of the places you love with exclusive rates, thoughtful
            extras, and stays designed to linger in your memory.
          </p>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14">
      <div
        class="flex flex-col gap-5 border-b border-[#deddd8] pb-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.2em] text-[#087d72]"
          >
            Curated for you
          </p>
          <h2 class="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            Offers worth travelling for
          </h2>
        </div>
        <nav
          class="flex gap-2 overflow-x-auto pb-1"
          aria-label="Offer categories"
        >
          <button
            v-for="category in categories"
            :key="category"
            type="button"
            :class="[
              'whitespace-nowrap px-3 py-2 text-xs font-semibold transition-colors',
              activeCategory === category
                ? 'border-b-2 border-[#07166b] text-[#07166b]'
                : 'text-[#718096] hover:text-[#07166b]',
            ]"
            @click="activeCategory = category"
          >
            {{ category }}
          </button>
        </nav>
      </div>

      <div class="mt-8 grid gap-6 lg:grid-cols-3">
        <article
          v-for="offer in visibleOffers"
          :key="offer.id"
          class="group flex flex-col overflow-hidden bg-white shadow-[0_8px_24px_rgba(29,47,82,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(29,47,82,0.14)]"
        >
          <div class="relative aspect-[1.45] overflow-hidden">
            <img
              :src="offer.image"
              :alt="offer.title"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <span
              v-if="offer.badge"
              class="absolute left-4 top-4 bg-amber-500 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#18253d]"
              >{{ offer.badge }}</span
            >
            <span
              class="absolute bottom-4 right-4 bg-white px-3 py-1.5 text-xs font-bold text-[#087d72]"
              >{{ offer.saving }}</span
            >
          </div>

          <div class="flex flex-1 flex-col p-6">
            <p
              class="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#087d72]"
            >
              {{ offer.eyebrow }}
            </p>
            <h3 class="mt-3 text-2xl font-bold tracking-tight text-[#07166b]">
              {{ offer.title }}
            </h3>
            <p class="mt-2 text-xs text-[#718096]">{{ offer.location }}</p>
            <p class="mt-4 text-sm leading-6 text-[#53637c]">
              {{ offer.description }}
            </p>

            <div class="mt-5 border-t border-[#ecebe7] pt-4">
              <p
                class="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#718096]"
              >
                Your stay includes
              </p>
              <ul class="mt-3 space-y-2">
                <li
                  v-for="item in offer.includes"
                  :key="item"
                  class="flex items-center gap-2 text-xs text-[#53637c]"
                >
                  <span class="text-[#087d72]" aria-hidden="true">✓</span
                  >{{ item }}
                </li>
              </ul>
            </div>

            <div
              class="mt-6 flex items-end justify-between gap-4 border-t border-[#ecebe7] pt-5"
            >
              <div>
                <p class="text-[10px] text-[#718096]">
                  From
                  <span class="line-through">{{ offer.originalPrice }}</span>
                </p>
                <p class="mt-1 text-xl font-bold text-[#07166b]">
                  {{ offer.price }}
                  <span class="text-[10px] font-normal text-[#718096]"
                    >total</span
                  >
                </p>
              </div>
              <NuxtLink
                :to="`/hotels/${offer.id === 'island-escape' ? 'azure-retreat' : offer.id === 'sunset-for-two' ? 'cliffside-sanctuary' : 'emerald-canopy'}`"
                class="bg-[#07166b] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#087d72]"
                >View stay</NuxtLink
              >
            </div>
          </div>
        </article>
      </div>

      <section
        class="mt-14 flex flex-col gap-6 border border-[#dcdcd6] bg-[#fffdf8] p-7 md:flex-row md:items-center md:justify-between md:p-9"
      >
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.2em] text-[#087d72]"
          >
            A little extra
          </p>
          <h2 class="mt-2 text-2xl font-bold text-[#07166b]">
            Your next escape is closer than you think.
          </h2>
          <p class="mt-2 max-w-xl text-sm leading-6 text-[#65728a]">
            Offers change with the season. Join our newsletter for first access
            to new stays and private member rates.
          </p>
        </div>
        <NuxtLink
          to="/contact"
          class="inline-flex shrink-0 items-center justify-center bg-amber-500 px-5 py-3 text-sm font-bold text-[#18253d] hover:bg-amber-400"
          >Plan my stay</NuxtLink
        >
      </section>
    </main>
  </div>
</template>
