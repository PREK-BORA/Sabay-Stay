<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { collection, query, where, onSnapshot, type Firestore } from "firebase/firestore";
import { useNuxtApp } from "#imports";
import { useFavorites } from "~/composables/user/useFavorites";
import { Star, MapPin, Heart, ArrowRight } from "lucide-vue-next";

export interface UserHotel {
  id: string;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  badge?: string;
  amenities: string[];
}

const { isFavorite, toggleFavorite } = useFavorites();

const hotels = ref<UserHotel[]>([]);
const loading = ref(true);

const maxPrice = ref("");
const minPrice = ref("");
const minimumRating = ref(0);
const selectedAmenities = ref<string[]>([]);
const sortBy = ref("Recommended");

const amenities = ["Infinity Pool", "Private Beach", "Spa & Wellness"];

let unsubscribe: (() => void) | null = null;

const fetchPublishedHotels = () => {
  const nuxtApp = useNuxtApp();
  const db = nuxtApp.$db as Firestore;
  if (!db) return;

  // Reads from top-level 'hotels' collection
  const q = query(collection(db, "hotels"), where("status", "==", "Published"));

  unsubscribe = onSnapshot(q, (snapshot) => {
    const fetched: UserHotel[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      fetched.push({
        id: doc.id,
        name: data.name || "",
        location: data.location || "",
        price: Number(data.price || 0),
        rating: Number(data.rating || 0),
        image: data.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80",
        badge: data.region || "",
        amenities: data.amenities || []
      });
    });
    hotels.value = fetched;
    loading.value = false;
  });
};

onMounted(() => {
  fetchPublishedHotels();
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

const filteredHotels = computed(() => {
  const filtered = hotels.value.filter((hotel) => {
    const meetsPrice =
      (!minPrice.value || hotel.price >= Number(minPrice.value)) &&
      (!maxPrice.value || hotel.price <= Number(maxPrice.value));
    const meetsRating = hotel.rating >= minimumRating.value;
    const meetsAmenities = selectedAmenities.value.every((amenity) =>
      hotel.amenities.includes(amenity)
    );

    return meetsPrice && meetsRating && meetsAmenities;
  });

  if (sortBy.value === "Price: Low to High") return [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy.value === "Price: High to Low") return [...filtered].sort((a, b) => b.price - a.price);

  return filtered;
});

function toggleAmenity(amenity: string) {
  selectedAmenities.value = selectedAmenities.value.includes(amenity)
    ? selectedAmenities.value.filter((item) => item !== amenity)
    : [...selectedAmenities.value, amenity];
}

function handleFavorite(hotel: UserHotel) {
  toggleFavorite({
    id: hotel.id,
    name: hotel.name,
    location: hotel.location,
    price: hotel.price,
    image: hotel.image,
    badge: hotel.badge,
    amenities: hotel.amenities,
  });
}

function resetFilters() {
  minPrice.value = "";
  maxPrice.value = "";
  minimumRating.value = 0;
  selectedAmenities.value = [];
}
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans min-h-screen">
    <div class="grid gap-8 lg:grid-cols-[220px_1fr]">
      <!-- Sidebar Filters -->
      <aside class="h-fit rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm mt-29">
        <h2 class="text-base font-bold text-slate-900">Filters</h2>

        <fieldset class="mt-5">
          <legend class="text-xs font-semibold text-slate-700">Price Range (Per Night)</legend>
          <div class="mt-2.5 flex items-center gap-2">
            <input v-model="minPrice" type="number" placeholder="$Min" class="w-0 min-w-0 flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs" />
            <span class="text-xs text-slate-400">-</span>
            <input v-model="maxPrice" type="number" placeholder="$Max" class="w-0 min-w-0 flex-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs" />
          </div>
        </fieldset>

        <fieldset class="mt-6 border-t border-slate-100 pt-5">
          <legend class="text-xs font-semibold text-slate-700">Star Rating</legend>
          <label v-for="rating in [5, 4]" :key="rating" class="mt-2.5 flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
            <input v-model="minimumRating" type="radio" :value="rating" name="rating" class="accent-amber-600" />
            <div class="flex items-center gap-1 text-amber-500">
              <Star v-for="i in 5" :key="i" class="h-3.5 w-3.5" :class="i <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'" />
            </div>
          </label>
        </fieldset>

        <fieldset class="mt-6 border-t border-slate-100 pt-5">
          <legend class="text-xs font-semibold text-slate-700">Amenities</legend>
          <label v-for="amenity in amenities" :key="amenity" class="mt-2.5 flex cursor-pointer items-center gap-2 text-xs text-slate-600">
            <input :checked="selectedAmenities.includes(amenity)" type="checkbox" class="rounded accent-slate-900" @change="toggleAmenity(amenity)" />
            {{ amenity }}
          </label>
        </fieldset>

        <button type="button" class="mt-6 mb-12 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700" @click="resetFilters">
          Reset Filters
        </button>
      </aside>

      <!-- Main Listing -->
      <main>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">Curated Luxury Stays</h1>
            <p class="mt-4 text-xl text-slate-500">Showing {{ filteredHotels.length }} properties in real-time.</p>
          </div>

          <label class="flex items-center gap-2 text-xs font-semibold uppercase text-slate-500">
            Sort by:
            <select v-model="sortBy" class="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800">
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </label>
        </div>

        <div v-if="loading" class="mt-8 text-center text-slate-400">Loading live hotel listings...</div>

        <!-- Cards Grid -->
        <div v-else-if="filteredHotels.length" class="mt-6 grid gap-6 sm:grid-cols-2">
          <article v-for="hotel in filteredHotels" :key="hotel.id" class="group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <div class="relative aspect-[16/10] overflow-hidden bg-slate-100">
              <img :src="hotel.image" :alt="hotel.name" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <span v-if="hotel.badge" class="absolute left-3 top-3 rounded-md bg-slate-900/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {{ hotel.badge }}
              </span>
              <div class="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm">
                <Star class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{{ hotel.rating.toFixed(1) }}</span>
              </div>
            </div>

            <div class="flex flex-1 flex-col p-5">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h2 class="text-lg font-bold leading-snug text-slate-900 group-hover:text-amber-600 transition-colors">{{ hotel.name }}</h2>
                  <p class="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin class="h-3.5 w-3.5 text-slate-400" />
                    <span>{{ hotel.location }}</span>
                  </p>
                </div>

                <button type="button" class="rounded-full p-1.5 text-slate-400 hover:text-red-500" @click="handleFavorite(hotel)">
                  <Heart class="h-5 w-5" :class="isFavorite(hotel.id) ? 'fill-red-500 text-red-500' : ''" />
                </button>
              </div>

              <div class="mt-6 flex items-end justify-between border-t border-slate-100 pt-4">
                <div>
                  <p class="text-xs text-slate-400">Starting from</p>
                  <p class="text-xl font-bold text-slate-900">${{ hotel.price.toLocaleString() }} <span class="text-xs font-normal text-slate-500">/ night</span></p>
                </div>

                <NuxtLink :to="`/hotels/${hotel.id}`" class="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700">
                  <span>Booking and Details</span>
                  <ArrowRight class="h-4 w-4" />
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="mt-6 rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p class="text-base font-medium text-slate-700">No stays match these filters.</p>
        </div>
      </main>
    </div>
  </div>
</template>