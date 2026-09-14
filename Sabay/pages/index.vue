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
          src="data:image/jpeg;base64,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"
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
                  class="w-[50px] text-lg leading-none text-slate-400 transition-colors hover:text-red-500"
                  :class="favorites.includes(hotel.id) ? '!text-red-600' : ''"
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
