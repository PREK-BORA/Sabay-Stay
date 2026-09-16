<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { useNuxtApp } from "#imports";

import {
  Calendar,
  Users,
  Star,
  Heart,
  MapPin,
  Minus,
  Plus,
  ArrowRight,
  Loader2,
} from "lucide-vue-next";

// Interface Definitions
interface Hotel {
  id: string;
  name: string;
  location: string;
  amenities: string[];
  badge?: string;
  price: number;
  image: string;
  imageUrl?: string;
  rating: number;
}

const router = useRouter();

// State
const hotels = ref<Hotel[]>([]);
const isLoadingHotels = ref(true);

const checkIn = ref("2026-09-10");
const checkOut = ref("2026-09-13");
const adults = ref(2);
const children = ref(0);
const isGuestsOpen = ref(false);
const guestsRef = ref<HTMLElement | null>(null);
const bookingError = ref("");
const favorites = ref<string[]>([]);

// Fallback Data
const fallbackHotels: Hotel[] = [
  {
    id: "sabay-angkor",
    name: "Sabay Angkor Resort",
    location: "Siem Reap, Cambodia",
    amenities: ["Infinity Pool", "Spa & Wellness"],
    badge: "Premium",
    price: 180,
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=85",
    rating: 4.9,
  },
  {
    id: "royal-phnom-penh",
    name: "Royal Phnom Penh Hotel",
    location: "Phnom Penh, Cambodia",
    amenities: ["Rooftop Pool", "City View"],
    price: 120,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85",
    rating: 4.8,
  },
  {
    id: "kep-seaside-resort",
    name: "Kep Seaside Resort",
    location: "Kep, Cambodia",
    amenities: ["Sea View", "Private Pool"],
    badge: "Luxury",
    price: 150,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=85",
    rating: 4.8,
  },
];

// Close guest dropdown when clicking outside
function handleClickOutside(event: MouseEvent) {
  if (guestsRef.value && !guestsRef.value.contains(event.target as Node)) {
    isGuestsOpen.value = false;
  }
}

onMounted(async () => {
  document.addEventListener("click", handleClickOutside);

  const { $db } = useNuxtApp();

  if (!$db) {
    hotels.value = fallbackHotels;
    isLoadingHotels.value = false;
    return;
  }

  try {
    const q = query(collection($db as any, "hotels"), limit(6));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      hotels.value = fallbackHotels;
    } else {
      const fetched: Hotel[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetched.push({
          id: doc.id,
          name: data.name || "Unnamed Hotel",
          location: data.location || data.address || "Cambodia",
          amenities: Array.isArray(data.amenities) ? data.amenities : [],
          badge: data.badge || undefined,
          price: Number(data.price) || 0,
          image:
            data.imageUrl ||
            data.heroImage ||
            data.image ||
            "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=85",
          rating: Number(data.rating) || 5.0,
        });
      });
      hotels.value = fetched;
    }
  } catch (err) {
    console.error("Firestore Fetch Error:", err);
    hotels.value = fallbackHotels;
  } finally {
    isLoadingHotels.value = false;
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

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
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      adults: adults.value,
      children: children.value,
    },
  });
}

function toggleFavorite(id: string) {
  favorites.value = favorites.value.includes(id)
    ? favorites.value.filter((favorite) => favorite !== id)
    : [...favorites.value, id];
}

const testimonials = [
  {
    name: "Jessica M.",
    location: "Miami, FL",
    text: "The most beautiful resort we've ever stayed at. The views, service, and attention to detail are absolutely perfect.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    name: "Michael T.",
    location: "Austin, TX",
    text: "From the oceanfront room to the amazing food, everything was beyond our expectations. Can't wait to come back!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    name: "Sarah L.",
    location: "Chicago, IL",
    text: "A true paradise! The staff made our anniversary unforgettable. Everything exceeded our expectations.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80",
  },
];

const experiences = [
  {
    name: "Water Activities",
    description: "Snorkeling, kayaking, paddleboarding & more",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Romantic Dining",
    description: "Private dinners & unforgettable gastronomic experiences",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Spa & Wellness",
    description: "Signature treatments for mind, body & complete relaxation",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Explore & Discover",
    description: "Discover the island's charm, history & hidden gems",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
  },
];
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=85"
          alt="Oceanfront luxury resort"
          class="h-full w-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/50 to-slate-900/30" />
      </div>

      <div class="relative px-5 pb-16 pt-20 md:px-10 md:pb-24 md:pt-32">
        <div class="mx-auto max-w-4xl">
          <h1 class="mt-4 text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
            Your Oceanfront<br />Paradise Awaits
          </h1>
          <p class="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            Oceanfront luxury, world-class comfort, and unforgettable experiences in the heart of paradise.
          </p>

          <!-- Booking Form -->
          <div class="mt-12 rounded-xl border border-slate-700/80 bg-slate-900/80 p-6 backdrop-blur md:p-8">
            <div class="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
              <label
                class="flex items-center gap-3 border-b border-slate-700 pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-6"
                for="check-in"
              >
                <Calendar class="h-5 w-5 text-amber-500" />
                <span class="flex flex-col">
                  <p class="text-xs uppercase tracking-widest text-slate-400">Check In</p>
                  <input
                    id="check-in"
                    v-model="checkIn"
                    type="date"
                    :max="checkOut || undefined"
                    class="scheme-dark mt-1 bg-transparent text-sm font-medium text-white outline-none"
                    aria-label="Check-in date"
                  />
                </span>
              </label>

              <label
                class="flex items-center gap-3 border-b border-slate-700 pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-6"
                for="check-out"
              >
                <Calendar class="h-5 w-5 text-amber-500" />
                <span class="flex flex-col">
                  <p class="text-xs uppercase tracking-widest text-slate-400">Check Out</p>
                  <input
                    id="check-out"
                    v-model="checkOut"
                    type="date"
                    :min="checkIn || undefined"
                    class="scheme-dark mt-1 bg-transparent text-sm font-medium text-white outline-none"
                    aria-label="Check-out date"
                  />
                </span>
              </label>

              <!-- Guest Dropdown Container -->
              <div ref="guestsRef" class="relative border-b border-slate-700 pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-6">
                <button
                  type="button"
                  class="flex w-full items-center gap-3 text-left"
                  @click="isGuestsOpen = !isGuestsOpen"
                >
                  <Users class="h-5 w-5 text-amber-500" />
                  <span class="flex flex-col">
                    <p class="text-xs uppercase tracking-widest text-slate-400">Guests</p>
                    <p class="mt-1 text-sm font-medium text-white">{{ guestsLabel }}</p>
                  </span>
                </button>

                <div
                  v-if="isGuestsOpen"
                  class="absolute left-0 right-0 top-full z-20 mt-3 rounded-xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl"
                >
                  <div class="flex items-center justify-between gap-4 py-2 text-white">
                    <span class="text-sm font-medium">Adults</span>
                    <div class="flex items-center gap-3">
                      <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 text-white transition hover:bg-slate-700"
                        @click.stop="adjustGuests('adult', -1)"
                      >
                        <Minus class="h-3.5 w-3.5" />
                      </button>
                      <span class="min-w-4 text-center text-sm font-semibold">{{ adults }}</span>
                      <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 text-white transition hover:bg-slate-700"
                        @click.stop="adjustGuests('adult', 1)"
                      >
                        <Plus class="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div class="mt-2 flex items-center justify-between gap-4 py-2 text-white">
                    <span class="text-sm font-medium">Children</span>
                    <div class="flex items-center gap-3">
                      <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 text-white transition hover:bg-slate-700"
                        @click.stop="adjustGuests('child', -1)"
                      >
                        <Minus class="h-3.5 w-3.5" />
                      </button>
                      <span class="min-w-4 text-center text-sm font-semibold">{{ children }}</span>
                      <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 text-white transition hover:bg-slate-700"
                        @click.stop="adjustGuests('child', 1)"
                      >
                        <Plus class="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                class="rounded-lg bg-amber-600 px-8 py-3 font-semibold text-white shadow-sm transition hover:bg-amber-700"
                @click="checkAvailability"
              >
                Check Availability
              </button>
            </div>

            <p v-if="bookingError" class="mt-3 text-sm text-amber-300" role="alert">
              {{ bookingError }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Accommodations Section -->
    <section class="py-16 md:py-24">
      <div class="mx-auto max-w-7xl px-5 md:px-10">
        <div class="mb-12 text-center">
          <p class="text-xs font-semibold uppercase tracking-widest text-amber-600">Accommodations</p>
          <h2 class="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Featured Hotels & Resorts</h2>
        </div>

        <div v-if="isLoadingHotels" class="flex justify-center py-12">
          <Loader2 class="h-8 w-8 animate-spin text-amber-600" />
        </div>

        <div v-else class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="hotel in hotels"
            :key="hotel.id"
            class="group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div class="relative h-48 w-full overflow-hidden bg-slate-100">
              <img
                :src="hotel.image"
                :alt="hotel.name"
                class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <span
                v-if="hotel.badge"
                class="absolute left-3 top-3 rounded-md bg-slate-900/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm"
              >
                {{ hotel.badge }}
              </span>
              <div class="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-sm">
                <Star class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{{ hotel.rating.toFixed(1) }}</span>
              </div>
            </div>

            <div class="flex flex-1 flex-col p-5">
              <div class="flex items-start justify-between gap-3">
                <h3 class="text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-amber-600">
                  {{ hotel.name }}
                </h3>
              </div>

              <p class="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin class="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span>{{ hotel.location }}</span>
              </p>

              <div class="mt-4 flex flex-wrap gap-1.5">
                <span
                  v-for="amenity in hotel.amenities"
                  :key="amenity"
                  class="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                >
                  {{ amenity }}
                </span>
              </div>

              <div class="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <p class="text-xs text-slate-400">Starting from</p>
                  <p class="text-xl font-bold text-slate-900">
                    ${{ hotel.price.toLocaleString() }}
                    <span class="text-xs font-normal text-slate-500">/ night</span>
                  </p>
                </div>
                <NuxtLink
                  :to="`/hotels/${hotel.id}`"
                  class="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
                >
                  <span>Booking and Details</span>
                  <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>

        <div class="mt-12 text-center">
          <NuxtLink
            to="/hotels"
            class="inline-block rounded-lg border-2 border-slate-900 bg-white px-8 py-3 font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
          >
            View All Accommodations
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Experiences Section -->
    <section class="border-y border-slate-200/60 bg-white py-16 md:py-24">
      <div class="mx-auto max-w-7xl px-5 md:px-10">
        <div class="mb-12 text-center">
          <p class="text-xs font-semibold uppercase tracking-widest text-amber-600">Unforgettable Moments</p>
          <h2 class="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Experiences to Inspire</h2>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          <div v-for="exp in experiences" :key="exp.name" class="group cursor-pointer">
            <div class="relative mb-4 h-48 overflow-hidden rounded-xl bg-slate-100">
              <img
                :src="exp.image"
                :alt="exp.name"
                class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-slate-900/20 transition group-hover:bg-slate-900/40" />
            </div>
            <h3 class="text-base font-bold tracking-wide text-slate-900 uppercase">{{ exp.name }}</h3>
            <p class="mt-1.5 text-sm leading-relaxed text-slate-600">{{ exp.description }}</p>
          </div>
        </div>

        <div class="mt-12 text-center">
          <NuxtLink
            to="/experiences"
            class="inline-block rounded-lg bg-slate-900 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-slate-800"
          >
            View All Experiences
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 md:py-24">
      <div class="mx-auto max-w-7xl px-5 md:px-10">
        <div class="mb-12 text-center">
          <p class="text-xs font-semibold uppercase tracking-widest text-amber-600">What Our Guests Say</p>
          <h2 class="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">Memories That Last a Lifetime</h2>
        </div>

        <div class="grid gap-8 md:grid-cols-3">
          <div
            v-for="testimonial in testimonials"
            :key="testimonial.name"
            class="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-8 shadow-sm"
          >
            <div>
              <span class="font-serif text-3xl text-amber-500">“</span>
              <p class="mt-2 leading-relaxed text-slate-700">{{ testimonial.text }}</p>
            </div>
            <div class="mt-6 flex items-center gap-4 border-t border-slate-100 pt-4">
              <img :src="testimonial.image" :alt="testimonial.name" class="h-12 w-12 rounded-full object-cover" />
              <div>
                <p class="font-bold text-slate-900">{{ testimonial.name }}</p>
                <p class="text-xs text-slate-500">{{ testimonial.location }}</p>
                <div class="mt-1 flex gap-0.5">
                  <Star v-for="i in testimonial.rating" :key="i" class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative overflow-hidden py-20 md:py-32">
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80"
          alt="Tropical beach"
          class="h-full w-full object-cover"
        />
        <div class="absolute inset-0 bg-slate-900/75" />
      </div>

      <div class="relative mx-auto max-w-4xl px-5 text-center md:px-10">
        <h2 class="text-3xl font-bold text-white md:text-4xl">Plan Your Perfect Getaway</h2>
        <p class="mt-4 text-lg text-white/90">
          Book directly with us for the best rates, exclusive offers & unforgettable memories.
        </p>
        <NuxtLink
          to="/hotels"
          class="mt-8 inline-block rounded-lg bg-amber-600 px-10 py-4 font-semibold text-white shadow-md transition hover:bg-amber-700"
        >
          Book Your Stay
        </NuxtLink>
      </div>
    </section>
  </div>
</template>