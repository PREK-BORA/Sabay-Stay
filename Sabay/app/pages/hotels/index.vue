<script setup lang="ts">
import { computed, ref } from "vue";
import { useFavorites } from "~/composables/user/useFavorites";
import { hotels, type Hotel } from "~/data/hotels";

const { favorites, isFavorite, toggleFavorite } = useFavorites();

const maxPrice = ref("");
const minPrice = ref("");
const minimumRating = ref(0);
const selectedAmenities = ref<string[]>([]);
const sortBy = ref("Recommended");

const amenities = ["Infinity Pool", "Private Beach", "Spa & Wellness"];

const filteredHotels = computed(() => {
  const filtered = hotels.filter((hotel) => {
    const meetsPrice =
      (!minPrice.value || hotel.price >= Number(minPrice.value)) &&
      (!maxPrice.value || hotel.price <= Number(maxPrice.value));
    const meetsRating = hotel.rating >= minimumRating.value;
    const meetsAmenities = selectedAmenities.value.every((amenity) =>
      hotel.amenities.includes(amenity),
    );

    return meetsPrice && meetsRating && meetsAmenities;
  });

  if (sortBy.value === "Price: Low to High") {
    return [...filtered].sort((a, b) => a.price - b.price);
  }

  if (sortBy.value === "Price: High to Low") {
    return [...filtered].sort((a, b) => b.price - a.price);
  }

  return filtered;
});

function toggleAmenity(amenity: string) {
  selectedAmenities.value = selectedAmenities.value.includes(amenity)
    ? selectedAmenities.value.filter((item) => item !== amenity)
    : [...selectedAmenities.value, amenity];
}

function handleFavorite(hotel: Hotel) {
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
  <div class="mx-auto max-w-[1280px] px-5 py-7 md:px-8 md:py-8">
    <div class="grid gap-8 lg:grid-cols-[178px_1fr]">
      <aside
        class="h-fit rounded-lg bg-white p-4 shadow-[0_4px_18px_rgba(29,47,82,0.08)]"
      >
        <h2 class="sabay-display text-lg font-bold text-[#07166b]">Filters</h2>

        <fieldset class="mt-5">
          <legend class="text-[10px] font-semibold text-[#171c31]">
            Price Range (Per Night)
          </legend>
          <div class="mt-2 flex items-center gap-2">
            <input
              v-model="minPrice"
              type="number"
              min="0"
              placeholder="$Min"
              aria-label="Minimum price"
              class="w-0 min-w-0 flex-1 rounded-sm border border-[#d8d9df] px-2 py-2 text-[11px] outline-none focus:border-[#07166b]"
            />
            <span class="text-xs text-slate-400">-</span>
            <input
              v-model="maxPrice"
              type="number"
              min="0"
              placeholder="$Max"
              aria-label="Maximum price"
              class="w-0 min-w-0 flex-1 rounded-sm border border-[#d8d9df] px-2 py-2 text-[11px] outline-none focus:border-[#07166b]"
            />
          </div>
        </fieldset>

        <fieldset class="mt-6 border-t border-[#e5e5e8] pt-5">
          <legend class="text-[10px] font-semibold text-[#171c31]">
            Star Rating
          </legend>
          <label
            v-for="rating in [5, 4]"
            :key="rating"
            class="mt-2 flex cursor-pointer items-center gap-2 text-[11px] text-[#07166b]"
          >
            <input
              v-model="minimumRating"
              type="radio"
              :value="rating"
              name="rating"
              class="accent-[#07166b]"
            />
            <span>{{ rating === 5 ? "★★★★★" : "★★★★☆" }}</span>
          </label>
        </fieldset>

        <fieldset class="mt-6 border-t border-[#e5e5e8] pt-5">
          <legend class="text-[10px] font-semibold text-[#171c31]">
            Amenities
          </legend>
          <label
            v-for="amenity in amenities"
            :key="amenity"
            class="mt-2 flex cursor-pointer items-center gap-2 text-[11px] text-[#566078]"
          >
            <input
              :checked="selectedAmenities.includes(amenity)"
              type="checkbox"
              class="accent-[#07166b]"
              @change="toggleAmenity(amenity)"
            />
            {{ amenity }}
          </label>
        </fieldset>

        <button
          type="button"
          class="mt-6 w-full rounded-md border border-[#07166b] px-2 py-1.5 text-[10px] text-[#07166b] hover:bg-[#07166b] hover:text-white"
          @click="resetFilters"
        >
          Reset Filters
        </button>
      </aside>

      <main>
        <div
          class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <h1
              class="sabay-display text-3xl font-bold tracking-[-0.04em] text-[#07166b] md:text-4xl"
            >
              Curated Luxury Stays
            </h1>
            <p class="mt-1 text-xs text-[#46506a]">
              Showing {{ filteredHotels.length }} premium properties matching
              your refined taste.
            </p>
          </div>
          <label
            class="flex items-center gap-2 text-[9px] uppercase tracking-[0.1em] text-[#4f566a]"
          >
            Sort by:
            <select
              v-model="sortBy"
              class="bg-transparent text-[10px] normal-case tracking-normal text-[#07166b] outline-none"
            >
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </label>
        </div>

        <div
          v-if="filteredHotels.length"
          class="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <article
            v-for="hotel in filteredHotels"
            :key="hotel.id"
            class="overflow-hidden rounded-lg bg-white shadow-[0_4px_18px_rgba(29,47,82,0.08)]"
          >
            <div class="relative aspect-[1.65] overflow-hidden">
              <img
                :src="hotel.image"
                :alt="hotel.name"
                class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <span
                v-if="hotel.badge"
                class="absolute left-2 top-2 rounded-full bg-[#07166b] px-2 py-1 text-[9px] text-white"
                >{{ hotel.badge }}</span
              >
              <span
                class="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-[9px] text-[#07166b]"
                >★ {{ hotel.rating.toFixed(1) }}</span
              >
            </div>
            <div class="p-3.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h2 class="sabay-display text-lg font-bold text-[#07166b]">
                    {{ hotel.name }}
                  </h2>
                  <p class="mt-0.5 text-[10px] text-[#30364b]">
                    ⌖ {{ hotel.location }}
                  </p>
                </div>
                <button
                  type="button"
                  :aria-label="
                    isFavorite(hotel.id)
                      ? `Remove ${hotel.name} from favorites`
                      : `Save ${hotel.name}`
                  "
                  class="text-lg leading-none text-slate-400 transition-colors hover:text-red-500"
                  :class="isFavorite(hotel.id) ? '!text-red-600' : ''"
                  @click="handleFavorite(hotel)"
                >
                  {{ isFavorite(hotel.id) ? "♥" : "♡" }}
                </button>
              </div>
              <div class="mt-2 flex flex-wrap gap-1.5">
                <span
                  v-for="amenity in hotel.amenities"
                  :key="amenity"
                  class="rounded-full bg-[#f0eff1] px-2 py-1 text-[8px] text-[#53586a]"
                  >{{ amenity }}</span
                >
              </div>
              <div
                class="mt-3 flex items-end justify-between border-t border-[#e7e5e7] pt-2.5"
              >
                <p class="text-[9px] text-[#53586a]">
                  Starting from<br /><strong
                    class="sabay-display text-lg text-[#07166b]"
                    >${{ hotel.price.toLocaleString() }}</strong
                  >
                  /night
                </p>
                <NuxtLink
                  :to="`/hotels/${hotel.id}`"
                  class="text-[10px] font-semibold text-[#07166b] hover:underline"
                  >View Details →</NuxtLink
                >
              </div>
            </div>
          </article>
        </div>
        <p
          v-else
          class="mt-8 rounded-lg bg-white p-10 text-center text-sm text-[#52627c]"
        >
          No stays match these filters.
        </p>

        <button
          type="button"
          class="mx-auto mt-5 block rounded-md border border-[#07166b] px-4 py-2 text-[10px] font-semibold text-[#07166b] hover:bg-[#07166b] hover:text-white"
        >
          Load More Stays
        </button>
      </main>
    </div>
  </div>
</template>
