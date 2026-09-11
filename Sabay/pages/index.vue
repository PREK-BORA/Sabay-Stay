<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const checkIn = ref("2026-09-10");
const checkOut = ref("2026-09-13");
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
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      adults: adults.value,
      children: children.value,
    },
  });
}

const testimonials = [
  {
    name: "Jessica M.",
    location: "Miami, FL",
    text: "The most beautiful resort we've ever stayed at. The views, service, and attention to detail are absolutely perfect.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    name: "Michael T.",
    location: "Austin, TX",
    text: "From the oceanfront room to the amazing food, everything was beyond our expectations. Can't wait to come back!",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    name: "Sarah L.",
    location: "Chicago, IL",
    text: "A true paradise! The staff made our anniversary unforgettable. Everything exceeded our expectations.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80",
  },
];

const hotels = [
  {
    id: "sabay-angkor",
    name: "Sabay Angkor Resort",
    location: "Siem Reap, Cambodia",
    amenities: ["Infinity Pool", "Spa & Wellness"],
    badge: "Premium",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=85",
    rating: 4.9,
  },
  {
    id: "royal-phnom-penh",
    name: "Royal Phnom Penh Hotel",
    location: "Phnom Penh, Cambodia",
    amenities: ["Rooftop Pool", "City View"],
    price: 120,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=85",
    rating: 4.8,
  },
  {
  id: "kep-seaside-resort",
  name: "Kep Seaside Resort",
  location: "Kep, Cambodia",
  amenities: ["Sea View", "Private Pool"],
  badge: "Luxury",
  price: 150,
  image:
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=85",
  rating: 4.8,
},
{
  id: "battambang-garden",
  name: "Battambang Garden Hotel",
  location: "Battambang, Cambodia",
  amenities: ["Garden View", "Swimming Pool"],
  price: 75,
  image:
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=85",
  rating: 4.6,
},
  {
    id: "koh-rong-paradise",
    name: "Koh Rong Paradise Resort",
    location: "Koh Rong, Cambodia",
    amenities: ["Private Beach", "Ocean View"],
    badge: "Premium",
    price: 250,
    image:
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1000&q=85",
    rating: 5.0,
  },
  {
    id: "kampot-riverside",
    name: "Kampot Riverside Retreat",
    location: "Kampot, Cambodia",
    amenities: ["River View", "Fine Dining"],
    price: 95,
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=85",
    rating: 4.7,
  },
];

const favorites = ref<string[]>([]);

function toggleFavorite(id: string) {
  favorites.value = favorites.value.includes(id)
    ? favorites.value.filter((favorite) => favorite !== id)
    : [...favorites.value, id];
}

const experiences = [
  {
    name: "Water Activities",
    description: "Snorkeling, kayaking, paddleboarding & more",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLBp7wiqAx58M5kDQgP3on5WeqwK16GRx9oNQSJb_hzw&s=10",
  },
  {
    name: "Romantic Dining",
    description: "Private dinners & unforgettable gastronomic experiences",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc7IEUevJEJ5A0e9OBKqJw0_szrWQVUldzezpt6bFI7w&s=10",
  },
  {
    name: "Spa & Wellness",
    description: "Signature treatments for mind, body & complete relaxation",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9NwXRQIZ8ItRxk5ORv0CrZwjG_aJb0YXlwlZ770k0vA&s=10",
  },
  {
    name: "Explore & Discover",
    description: "Discover the island's charm, history & hidden gems",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&h=300&q=80",
  },
];
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvXpMqyST5nyu5dnm_M9MEa7DPntgkv05xYymmI1Jl-A&s=10"
          alt="Oceanfront luxury resort"
          class="h-full w-full object-cover"
        />
      </div>
      <!-- class="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/30 to-transparent"
      /> -->

      <div class="relative px-5 pb-16 pt-20 md:px-10 md:pb-24 md:pt-32">
        <div class="mx-auto max-w-4xl">
          <p
            class="text-xs uppercase tracking-[0.2em] text-amber-200 font-semibold"
          >
            Escape. Relax. Recharge.
          </p>
          <h1
            class="mt-4 text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight"
          >
            Your Oceanfront<br />Paradise Awaits
          </h1>
          <p
            class="mt-6 text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed"
          >
            Oceanfront luxury, world-class comfort, and unforgettable
            experiences in the heart of paradise.
          </p>

          <!-- Booking Form -->
          <div
            class="mt-12 bg-slate-800/80 backdrop-blur rounded-xl p-6 md:p-8 border border-slate-700"
          >
            <div class="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
              <label
                class="flex items-center gap-3 border-b border-slate-600 pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-6"
                for="check-in"
              >
                <span class="text-2xl" aria-hidden="true">📅</span>
                <span class="flex flex-col">
                  <p class="text-xs uppercase tracking-widest text-slate-400">
                    Check In
                  </p>
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
                class="flex items-center gap-3 border-b border-slate-600 pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-6"
                for="check-out"
              >
                <span class="text-2xl" aria-hidden="true">📅</span>
                <span class="flex flex-col">
                  <p class="text-xs uppercase tracking-widest text-slate-400">
                    Check Out
                  </p>
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
              <div
                class="relative border-b md:border-b-0 md:border-r border-slate-600 pb-4 md:pb-0 md:pr-6"
              >
                <button
                  type="button"
                  class="flex w-full items-center gap-3 text-left"
                  @click="isGuestsOpen = !isGuestsOpen"
                >
                  <span class="text-2xl" aria-hidden="true">👥</span>
                  <span class="flex flex-col">
                    <p class="text-xs uppercase tracking-widest text-slate-400">
                      Guests
                    </p>
                    <p class="mt-1 text-sm font-medium text-white">
                      {{ guestsLabel }}
                    </p>
                  </span>
                </button>

                <div
                  v-if="isGuestsOpen"
                  class="absolute left-0 right-0 top-full z-20 mt-3 rounded-xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl"
                >
                  <div
                    class="flex items-center justify-between gap-4 py-2 text-white"
                  >
                    <span class="text-sm">Adults</span>
                    <div class="flex items-center gap-3">
                      <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 text-lg text-white hover:bg-slate-700"
                        @click.stop="adjustGuests('adult', -1)"
                      >
                        −
                      </button>
                      <span class="min-w-4 text-center text-sm">{{
                        adults
                      }}</span>
                      <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 text-lg text-white hover:bg-slate-700"
                        @click.stop="adjustGuests('adult', 1)"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div
                    class="mt-3 flex items-center justify-between gap-4 py-2 text-white"
                  >
                    <span class="text-sm">Children</span>
                    <div class="flex items-center gap-3">
                      <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 text-lg text-white hover:bg-slate-700"
                        @click.stop="adjustGuests('child', -1)"
                      >
                        −
                      </button>
                      <span class="min-w-4 text-center text-sm">{{
                        children
                      }}</span>
                      <button
                        type="button"
                        class="flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 text-lg text-white hover:bg-slate-700"
                        @click.stop="adjustGuests('child', 1)"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                class="bg-amber-600 px-8 py-3 font-semibold text-white transition hover:bg-amber-700"
                @click="checkAvailability"
              >
                Check Availability
              </button>
            </div>
            <p
              v-if="bookingError"
              class="mt-3 text-sm text-amber-200"
              role="alert"
            >
              {{ bookingError }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Rooms & Suites Section -->
    <section class="py-16 md:py-24">
      <div class="mx-auto max-w-7xl px-5 md:px-10">
        <div class="text-center mb-16">
          <h2 class="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            OVER HOTELS & SUITES
          </h2>
        </div>

        <div class="grid gap-8 md:grid-cols-3">
          <article
            v-for="hotel in hotels"
            :key="hotel.id"
            class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_4px_18px_rgba(29,47,82,0.08)]"
          >
            <div class="relative aspect-[1.65] overflow-hidden">
              <img
                :src="hotel.image"
                :alt="hotel.name"
                class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />

              <div
                v-if="hotel.badge"
                class="absolute left-2 top-2 rounded-full bg-[#07166b] px-2 py-1 text-[9px] text-white"
              >
                {{ hotel.badge }}
              </div>

              <div
                class="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[9px] text-[#07166b]"
              >
                <span>★</span>
                <span>{{ hotel.rating.toFixed(1) }}</span>
              </div>
            </div>

            <div class="p-3.5">
              <div class="flex items-start justify-between gap-2">
                <h3 class="sabay-display text-lg font-bold text-[#07166b]">
                  {{ hotel.name }}
                </h3>

                <button
                  type="button"
                  :aria-label="
                    favorites.includes(hotel.id)
                      ? `Remove ${hotel.name} from favorites`
                      : `Save ${hotel.name}`
                  "
                  class="text-lg leading-none text-red-600 w-[50px] hover:text-[#07166b]"
                  :class="favorites.includes(hotel.id) ? 'text-red-600' : ''"
                  @click="toggleFavorite(hotel.id)"
                >
                  {{ favorites.includes(hotel.id) ? "♥" : "♡" }}
                </button>
              </div>

              <p class="mt-0.5 text-[10px] text-[#30364b]">
                ⌖ {{ hotel.location }}
              </p>

              <div class="mt-2 flex flex-wrap gap-1.5">
                <span
                  v-for="amenity in hotel.amenities"
                  :key="amenity"
                  class="rounded-full bg-[#f0eff1] px-2 py-1 text-[8px] text-[#53586a]"
                >
                  {{ amenity }}
                </span>
              </div>

              <div
                class="mt-3 flex items-end justify-between border-t border-[#e7e5e7] pt-2.5"
              >
                <div>
                  <p class="text-[9px] text-[#53586a]">Starting from</p>
                  <p class="sabay-display text-lg text-[#07166b]">
                    ${{ hotel.price.toLocaleString()
                    }}<span class="font-sans text-[9px] text-[#53586a]"
                      >/night</span
                    >
                  </p>
                </div>

                <NuxtLink
                  :to="`/hotels/${hotel.id}`"
                  class="text-[10px] font-semibold text-[#07166b] hover:underline"
                >
                  View Details →
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>

        <div class="text-center mt-12">
          <NuxtLink
            to="/hotels"
            class="inline-block bg-white text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white font-semibold px-8 py-3 rounded transition"
          >
            View All Accommodations
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Experiences Section -->
    <section class="bg-slate-50 py-16 md:py-24">
      <div class="mx-auto max-w-7xl px-5 md:px-10">
        <div class="text-center mb-16">
          <p
            class="text-xs uppercase tracking-[0.2em] text-amber-600 font-semibold"
          >
            Unforgettable Moments
          </p>
          <h2 class="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            Experiences to Inspire
          </h2>
        </div>

        <div class="grid md:grid-cols-4 gap-6">
          <div
            v-for="exp in experiences"
            :key="exp.name"
            class="group cursor-pointer"
          >
            <div class="relative overflow-hidden rounded-lg h-48 mb-6">
              <img
                :src="exp.image"
                :alt="exp.name"
                class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div
                class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"
              />
            </div>
            <h3
              class="text-lg font-bold text-slate-900 uppercase tracking-wide"
            >
              {{ exp.name }}
            </h3>
            <p class="text-slate-600 text-sm mt-3">{{ exp.description }}</p>
          </div>
        </div>

        <div class="text-center mt-12">
          <NuxtLink
            to="/experiences"
            class="inline-block bg-slate-900 hover:bg-slate-800 text-white font-semibold px-8 py-3 rounded uppercase text-sm tracking-wide transition"
          >
            View All Experiences
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 md:py-24">
      <div class="mx-auto max-w-7xl px-5 md:px-10">
        <div class="text-center mb-16">
          <p
            class="text-xs uppercase tracking-[0.2em] text-amber-600 font-semibold"
          >
            What Our Guests Say
          </p>
          <h2 class="mt-4 text-3xl md:text-4xl font-bold text-slate-900">
            Memories That Last a Lifetime
          </h2>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="testimonial in testimonials"
            :key="testimonial.name"
            class="bg-slate-50 p-8 rounded-lg border border-slate-200"
          >
            <p class="text-2xl mb-4">"</p>
            <p class="text-slate-700 leading-relaxed mb-6">
              {{ testimonial.text }}
            </p>
            <div class="flex items-center gap-4">
              <img
                :src="testimonial.image"
                :alt="testimonial.name"
                class="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p class="font-bold text-slate-900">{{ testimonial.name }}</p>
                <p class="text-sm text-slate-600">{{ testimonial.location }}</p>
                <div class="flex gap-1 mt-2">
                  <span
                    v-for="i in testimonial.rating"
                    :key="i"
                    class="text-amber-500"
                    >★</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="relative overflow-hidden py-20 md:py-32">
      <div
        class="absolute inset-0 bg-cover bg-center"
        style="
          background-image: url(&quot;https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80&quot;);
        "
      />
      <div class="absolute inset-0 bg-slate-900/70" />

      <div class="relative mx-auto max-w-4xl px-5 md:px-10 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white">
          Plan Your Perfect Getaway
        </h2>
        <p class="mt-4 text-lg text-white/90">
          Book directly with us for the best rates, exclusive offers &
          unforgettable memories.
        </p>
        <NuxtLink
          to="/hotels"
          class="mt-8 inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-10 py-4 rounded-lg transition"
        >
          Book Your Stay
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
