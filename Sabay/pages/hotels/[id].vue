<script setup lang="ts">
import { computed, ref } from "vue";
import { signInAnonymously } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "vue-router";
import { getHotelById, hotels, type Hotel } from "~/data/hotels";

const { $auth, $db } = useNuxtApp() as any;
const route = useRoute();
const router = useRouter();

const hotel = computed<Hotel | undefined>(() => {
  const id = String(route.params.id || "");
  return getHotelById(id) ?? hotels[0];
});

const galleries = [
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
];

const hotelGallery = computed(() => hotel.value?.gallery ?? galleries);

const amenityIcons: Record<string, string> = {
  "Infinity Pool": "🏊",
  "Holistic Spa": "💆",
  "Fine Dining": "🍽️",
  "Fitness Centre": "🏋️",
  "High-Speed Wi-Fi": "📶",
  "24/7 Room Service": "🛎️",
  "Temple View": "🕌",
  "River View": "🌊",
  "Rooftop Pool": "🏊",
  "Private Beach": "🏖️",
  "Sea View": "🌅",
  "Garden View": "🌷",
  "Swimming Pool": "🏊",
  "Mountain View": "🏔️",
  "Spa & Wellness": "💆",
  "Eco Tours": "🌿",
  "Water Sports": "🏄",
  "Beach Access": "🏖️",
  "Private Balcony": "🌆",
  "Private Lounge": "🛋️",
};

const hotelAmenities = computed(() => {
  const amenityList = hotel.value?.amenities ?? [];
  return amenityList.map((label) => ({
    icon: amenityIcons[label] ?? "✓",
    label,
  }));
});

const rooms = [
  {
    title: "Sabay Classic Room",
    price: "$180",
    per: "/ night",
    description:
      "A cozy and elegant room designed for a comfortable stay, featuring warm interiors, modern facilities, and a relaxing atmosphere.",
    size: "32m²",
    bed: "Queen Bed",
    amenity: "Free WiFi",
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Khmer Heritage Suite",
    price: "$320",
    per: "/ night",
    description:
      "Experience Cambodian-inspired elegance with traditional details, spacious interiors, and a peaceful private sitting area.",
    size: "48m²",
    bed: "King Bed",
    amenity: "Private Lounge",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Sunset Balcony Room",
    price: "$390",
    per: "/ night",
    description:
      "Enjoy beautiful sunset moments from your private balcony while relaxing in a bright and contemporary room.",
    size: "38m²",
    bed: "Queen Bed",
    amenity: "Private Balcony",
    image:
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Riverside Retreat",
    price: "$480",
    per: "/ night",
    description:
      "A tranquil riverside escape offering peaceful views, natural light, comfortable furnishings, and a relaxing atmosphere.",
    size: "42m²",
    bed: "King Bed",
    amenity: "River View",
    image:
      "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Presidential Residence",
    price: "$1,200",
    per: "/ night",
    description:
      "Our most exclusive accommodation with multiple living spaces, premium furnishings, a private dining area, and exceptional comfort.",
    size: "120m²",
    bed: "King Bed",
    amenity: "Private Dining",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Tropical Family Villa",
    price: "$720",
    per: "/ night",
    description:
      "A spacious tropical villa perfect for families, featuring comfortable bedrooms, an outdoor terrace, and a peaceful garden.",
    size: "85m²",
    bed: "2 Queen Beds",
    amenity: "Garden Terrace",
    image:
      "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=1200&q=80",
  },
];

const reviews = [
  {
    name: "Jessica M.",
    location: "Miami, FL",
    text: "An absolute dream. The attention to detail in the design incredible, and the service was flawless. The infinity pool at sunset is a memory I won't soon forget.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    name: "Michael T.",
    location: "Austin, TX",
    text: "The perfect escape. We loved the quiet, the design, and the thoughtful service from every team member. Highly recommended.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
  },
  {
    name: "Sarah L.",
    location: "Chicago, IL",
    text: "Beautiful property and excellent facilities. The spa treatments were divine and the views made every evening feel magical.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80",
  },
];

const selectedRoom = ref<(typeof rooms)[number] | null>(null);
const bookingRoom = ref<(typeof rooms)[number] | null>(null);
const checkIn = ref("");
const checkOut = ref("");
const guests = ref(2);
const bookingError = ref("");
const isBooking = ref(false);
const isGalleryOpen = ref(false);
const activeGalleryIndex = ref(0);

function viewRoom(room: (typeof rooms)[number]) {
  selectedRoom.value = room;
}

function closeRoom() {
  selectedRoom.value = null;
}

function openBooking(room: (typeof rooms)[number]) {
  bookingRoom.value = room;
  bookingError.value = "";
}

function closeBooking() {
  if (!isBooking.value) {
    bookingRoom.value = null;
  }
}

function openGallery(index: number) {
  activeGalleryIndex.value = index;
  isGalleryOpen.value = true;
}

function closeGallery() {
  isGalleryOpen.value = false;
}

function nextGalleryImage() {
  activeGalleryIndex.value = (activeGalleryIndex.value + 1) % gallery.length;
}

function prevGalleryImage() {
  activeGalleryIndex.value =
    (activeGalleryIndex.value - 1 + gallery.length) % gallery.length;
}

async function submitBooking() {
  if (!bookingRoom.value || !checkIn.value || !checkOut.value) {
    bookingError.value = "Please select your check-in and check-out dates.";
    return;
  }

  const nights = Math.ceil(
    (new Date(checkOut.value).getTime() - new Date(checkIn.value).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (nights <= 0) {
    bookingError.value = "Check-out must be after check-in.";
    return;
  }

  isBooking.value = true;
  bookingError.value = "";

  if (!$auth || !$db) {
    bookingError.value =
      "Booking service is temporarily unavailable. Please try again.";
    isBooking.value = false;
    return;
  }

  try {
    const user = $auth.currentUser ?? (await signInAnonymously($auth)).user;
    const pricePerNight = Number(
      bookingRoom.value.price.replace("$", "").replace(",", ""),
    );
    const booking = await addDoc(collection($db, "bookings"), {
      userId: user.uid,
      hotelId: route.params.id,
      hotelName: hotel.value ? hotel.value.name : "SabayStay property",
      roomName: bookingRoom.value.title,
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      guests: guests.value,
      nights,
      pricePerNight,
      total: pricePerNight * nights,
      status: "confirmed",
      createdAt: serverTimestamp(),
    });

    bookingRoom.value = null;
    await router.push(`/dashboard/bookings/${booking.id}`);
  } catch (error) {
    console.error("Booking failed", error);
    const code =
      typeof error === "object" && error && "code" in error
        ? String(error.code)
        : "";

    if (
      code === "auth/operation-not-allowed" ||
      code === "auth/admin-restricted-operation"
    ) {
      bookingError.value =
        "Firebase blocked anonymous sign-in. In Firebase Console, open Authentication > Sign-in method and enable Anonymous sign-in.";
    } else if (code === "permission-denied") {
      bookingError.value =
        "Firestore rejected this booking. Deploy the Firestore rules from the project folder.";
    } else {
      bookingError.value =
        "Booking failed. Check the browser console for the Firebase error code.";
    }
  } finally {
    isBooking.value = false;
  }
}

const heroImage = computed(
  () =>
    hotel.value?.heroImage ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80",
);
</script>

<template>
  <div class="min-h-screen bg-[#f7f6f2] text-[#1d2f52]">
    <!-- Hero Section -->
    <section
      class="relative h-[70vh] min-h-[520px] overflow-hidden md:h-[75vh]"
    >
      <img
        :src="heroImage"
        :alt="hotel?.name"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"
      />
      <div
        class="relative mx-auto flex h-full max-w-7xl items-end px-5 pb-16 md:px-10 md:pb-24"
      >
        <div class="max-w-3xl text-white">
          <NuxtLink
            to="/hotels"
            class="inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-white/75 transition hover:text-white"
          >
            <span class="mr-2" aria-hidden="true">←</span>
            Back to Hotels
          </NuxtLink>
          <p
            class="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-amber-200"
          >
            {{ hotel?.tagline }}
          </p>
          <h1
            class="sabay-display mt-4 text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl"
          >
            {{ hotel?.name }}
          </h1>
          <div
            class="mt-6 flex flex-wrap items-center gap-4 text-sm md:text-base"
          >
            <span class="flex items-center gap-1.5">
              <span class="text-[#f7b500]" aria-hidden="true">★★★★★</span>
              <span class="font-semibold">{{ hotel?.rating }}</span>
              <span class="text-white/60">(245 Reviews)</span>
            </span>
            <span class="text-white/30">|</span>
          <span
            class="flex items-center gap-1.5 text-white/80"
          >
            <span aria-hidden="true">📍</span>
            <span>{{ hotel?.address }}</span>
          </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery Strip -->
    <section class="border-b border-slate-200 bg-white">
      <div class="mx-auto max-w-7xl px-5 py-6 md:px-10">
        <div class="grid grid-cols-2 gap-3 md:grid-cols-5">
          <button
            v-for="(image, index) in hotelGallery.slice(1, 6)"
            :key="index"
            type="button"
            class="group relative overflow-hidden rounded-xl"
            @click="openGallery(index + 1)"
          >
            <img
              :src="image"
              alt="Resort gallery"
              class="h-24 w-full object-cover transition duration-500 group-hover:scale-110 md:h-32"
            />
            <div
              class="absolute inset-0 bg-[#0d224a]/0 transition group-hover:bg-[#0d224a]/20"
            />
          </button>
          <button
            type="button"
            class="relative overflow-hidden rounded-xl"
            @click="openGallery(0)"
          >
            <img
              :src="hotelGallery[0]"
              alt="Main view"
              class="h-24 w-full object-cover md:h-32"
            />
            <div
              class="absolute inset-0 flex items-center justify-center bg-[#0d224a]/50"
            >
              <span class="text-sm font-semibold text-white md:text-base"
                >View All Photos</span
              >
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-5 py-12 md:px-10 md:py-16">
      <div class="grid gap-10 lg:grid-cols-[1fr_400px]">
        <!-- Left Column -->
        <div>
          <!-- About Section -->
          <section
            class="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200 md:p-10"
          >
            <p
              class="text-xs font-semibold uppercase tracking-[0.2em] text-[#087d72]"
            >
              About This Property
            </p>
            <h2
              class="sabay-display mt-3 text-3xl font-black tracking-[-0.04em] text-[#1d2f52] md:text-4xl"
            >
              Where luxury meets nature
            </h2>
            <p class="mt-5 text-base leading-8 text-[#4a5871] md:text-lg">
              {{ hotel?.description }}
            </p>

            <!-- Amenities Grid -->
            <div class="mt-10">
              <h3
                class="sabay-display text-2xl font-black tracking-[-0.03em] text-[#1d2f52]"
              >
                Facilities & Amenities
              </h3>
              <div class="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                <div
                  v-for="item in hotelAmenities"
                  :key="item.label"
                  class="flex items-center gap-3 rounded-xl border border-slate-200 bg-[#f9fafb] p-4 transition hover:border-[#087d72] hover:bg-[#e5f0ed]"
                >
                  <span class="text-2xl" aria-hidden="true">{{
                    item.icon
                  }}</span>
                  <span class="text-sm font-medium text-[#1d2f52]">{{
                    item.label
                  }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Available Rooms -->
          <section class="mt-10">
            <div class="mb-8">
              <p
                class="text-xs font-semibold uppercase tracking-[0.2em] text-[#087d72]"
              >
                Accommodations
              </p>
              <h2
                class="sabay-display mt-3 text-3xl font-black tracking-[-0.04em] text-[#1d2f52] md:text-4xl"
              >
                Available Rooms
              </h2>
            </div>

            <div class="grid gap-6 md:grid-cols-2">
              <article
                v-for="room in rooms"
                :key="room.title"
                class="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div class="relative h-56 overflow-hidden">
                  <img
                    :src="room.image"
                    :alt="room.title"
                    class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-[#07162b]/60 to-transparent"
                  />
                  <div class="absolute inset-x-0 bottom-0 p-5">
                    <div
                      class="flex items-end justify-between gap-3 text-white"
                    >
                      <h3
                        class="sabay-display text-2xl font-black leading-tight md:text-3xl"
                      >
                        {{ room.title }}
                      </h3>
                      <div class="text-right">
                        <p class="text-2xl font-bold md:text-3xl">
                          {{ room.price }}
                        </p>
                        <p
                          class="text-[10px] uppercase tracking-[0.15em] text-white/70"
                        >
                          per night
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="p-5 md:p-6">
                  <p class="text-sm leading-6 text-[#53637c]">
                    {{ room.description }}
                  </p>
                  <div class="mt-4 flex flex-wrap gap-2">
                    <span
                      class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-[#1d2f52]"
                    >
                      {{ room.size }}
                    </span>
                    <span
                      class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-[#1d2f52]"
                    >
                      {{ room.bed }}
                    </span>
                    <span
                      class="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-[#1d2f52]"
                    >
                      {{ room.amenity }}
                    </span>
                  </div>
                  <div
                    class="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-5"
                  >
                    <button
                      type="button"
                      class="text-sm font-medium text-[#087d72] transition hover:text-[#0d224a]"
                      @click="viewRoom(room)"
                    >
                      View Details →
                    </button>
                    <button
                      type="button"
                      class="rounded-xl bg-[#0d224a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a1d3d]"
                      @click="openBooking(room)"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <!-- Reviews Section -->
          <section class="mt-16">
            <div class="mb-8">
              <p
                class="text-xs font-semibold uppercase tracking-[0.2em] text-[#087d72]"
              >
                Guest Experiences
              </p>
              <h2
                class="sabay-display mt-3 text-3xl font-black tracking-[-0.04em] text-[#1d2f52] md:text-4xl"
              >
                What Our Guests Say
              </h2>
            </div>

            <div class="grid gap-6 md:grid-cols-3">
              <div
                v-for="review in reviews"
                :key="review.name"
                class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div class="flex items-center gap-0.5 text-[#f7b500]">
                  <span v-for="n in review.rating" :key="n" aria-hidden="true"
                    >★</span
                  >
                </div>
                <p class="mt-4 text-sm leading-7 text-[#324259]">
                  "{{ review.text }}"
                </p>
                <div class="mt-5 flex items-center gap-3">
                  <img
                    :src="review.image"
                    :alt="review.name"
                    class="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p class="text-sm font-semibold text-[#1d2f52]">
                      {{ review.name }}
                    </p>
                    <p class="text-xs text-slate-500">{{ review.location }}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Sidebar - Sticky Booking Card -->
        <aside class="lg:pt-2">
          <div
            class="sticky top-6 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200 md:p-8"
          >
            <div
              class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-[#f5f7fa] p-5"
            >
              <div>
                <p class="text-xs uppercase tracking-[0.18em] text-slate-500">
                  Price from
                </p>
                <p
                  class="sabay-display mt-2 text-4xl font-black text-[#1d2f52]"
                >
                  ${{ hotel?.price }}
                </p>
                <p
                  class="text-[10px] uppercase tracking-[0.15em] text-slate-400"
                >
                  / night
                </p>
              </div>
              <div
                class="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eaf1fb] text-2xl"
                aria-hidden="true"
              >
                🛏️
              </div>
            </div>

            <div class="mt-6 space-y-3">
              <div class="rounded-xl border border-slate-200 bg-white p-4">
                <p
                  class="text-[10px] uppercase tracking-[0.18em] text-slate-400"
                >
                  Check-in / Check-out
                </p>
                <p class="mt-2 font-medium text-[#1d2f52]">Select Dates</p>
              </div>
              <div class="rounded-xl border border-slate-200 bg-white p-4">
                <p
                  class="text-[10px] uppercase tracking-[0.18em] text-slate-400"
                >
                  Guests
                </p>
                <p class="mt-2 font-medium text-[#1d2f52]">
                  2 adults, 0 children
                </p>
              </div>
            </div>

            <button
              type="button"
              class="mt-6 w-full rounded-xl bg-[#0d224a] px-4 py-4 text-base font-semibold text-white transition hover:bg-[#0a1d3d]"
              @click="openBooking(rooms[0])"
            >
              Book Your Stay
            </button>

            <p class="mt-4 text-center text-xs text-slate-500">
              You won't be charged yet
            </p>

            <div class="mt-6 space-y-3 border-t border-slate-200 pt-6">
              <div class="flex items-center gap-3 text-sm text-[#53637c]">
                <span class="text-[#087d72]" aria-hidden="true">✓</span>
                <span>Free cancellation up to 48 hours before</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-[#53637c]">
                <span class="text-[#087d72]" aria-hidden="true">✓</span>
                <span>No payment required at booking</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-[#53637c]">
                <span class="text-[#087d72]" aria-hidden="true">✓</span>
                <span>Best price guarantee</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>

    <!-- Gallery Modal -->
    <div
      v-if="isGalleryOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 px-5 py-8"
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
      @click.self="closeGallery"
    >
      <button
        type="button"
        aria-label="Close gallery"
        class="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-sm transition hover:bg-white/20"
        @click="closeGallery"
      >
        ×
      </button>

      <button
        type="button"
        aria-label="Previous image"
        class="absolute left-5 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-sm transition hover:bg-white/20"
        @click="prevGalleryImage"
      >
        ‹
      </button>

      <button
        type="button"
        aria-label="Next image"
        class="absolute right-5 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-sm transition hover:bg-white/20"
        @click="nextGalleryImage"
      >
        ›
      </button>

      <img
        :src="hotelGallery[activeGalleryIndex]"
        alt="Resort gallery"
        class="max-h-[85vh] max-w-full rounded-2xl object-contain"
      />

      <div
        class="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"
      >
        {{ activeGalleryIndex + 1 }} / {{ hotelGallery.length }}
      </div>
    </div>

    <!-- Room Detail Modal -->
    <div
      v-if="selectedRoom"
      class="fixed inset-0 z-50 flex items-center justify-center bg-[#07162b]/70 px-5 py-8"
      role="dialog"
      aria-modal="true"
      :aria-label="`${selectedRoom.title} details`"
      @click.self="closeRoom"
    >
      <div
        class="relative grid w-full max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-2xl md:grid-cols-2"
      >
        <button
          type="button"
          aria-label="Close room details"
          class="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xl text-[#1d2f52] shadow-sm"
          @click="closeRoom"
        >
          ×
        </button>
        <img
          :src="selectedRoom.image"
          :alt="selectedRoom.title"
          class="h-72 w-full object-cover md:h-full"
        />
        <div class="flex flex-col justify-center p-7 md:p-10">
          <p class="text-xs uppercase tracking-[0.2em] text-[#087d72]">
            Room details
          </p>
          <h2 class="sabay-display mt-3 text-4xl font-black text-[#1d2f52]">
            {{ selectedRoom.title }}
          </h2>
          <p class="mt-4 text-base leading-7 text-[#4b5871]">
            {{ selectedRoom.description }}
          </p>
          <div class="mt-6 flex flex-wrap gap-2 text-sm text-[#4b5871]">
            <span class="rounded-full bg-slate-100 px-3 py-1.5">{{
              selectedRoom.size
            }}</span>
            <span class="rounded-full bg-slate-100 px-3 py-1.5">{{
              selectedRoom.bed
            }}</span>
            <span class="rounded-full bg-slate-100 px-3 py-1.5">{{
              selectedRoom.amenity
            }}</span>
          </div>
          <p class="mt-7 text-3xl font-bold text-[#1d2f52]">
            {{ selectedRoom.price }}
            <span class="text-sm font-normal text-slate-500">/ night</span>
          </p>
          <button
            type="button"
            class="mt-7 w-full rounded-xl bg-[#0d224a] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0a1d3d]"
            @click="
              openBooking(selectedRoom);
              closeRoom();
            "
          >
            Select This Room
          </button>
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <div
      v-if="bookingRoom"
      class="fixed inset-0 z-50 flex items-center justify-center bg-[#07162b]/70 px-5 py-8"
      role="dialog"
      aria-modal="true"
      aria-label="Complete your booking"
      @click.self="closeBooking"
    >
      <form
        class="w-full max-w-lg rounded-[2rem] bg-white p-7 shadow-2xl md:p-9"
        @submit.prevent="submitBooking"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-[#087d72]">
              Reserve your room
            </p>
            <h2 class="sabay-display mt-2 text-4xl font-black text-[#1d2f52]">
              {{ bookingRoom.title }}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close booking form"
            class="text-2xl text-slate-500"
            @click="closeBooking"
          >
            ×
          </button>
        </div>

        <div class="mt-7 grid gap-4 sm:grid-cols-2">
          <label class="text-sm font-medium text-[#1d2f52]">
            Check-in
            <input
              v-model="checkIn"
              type="date"
              required
              class="mt-2 h-12 w-full rounded-xl border border-slate-300 px-3 outline-none focus:border-[#1d2f52]"
            />
          </label>
          <label class="text-sm font-medium text-[#1d2f52]">
            Check-out
            <input
              v-model="checkOut"
              type="date"
              required
              :min="checkIn || undefined"
              class="mt-2 h-12 w-full rounded-xl border border-slate-300 px-3 outline-none focus:border-[#1d2f52]"
            />
          </label>
        </div>
        <label class="mt-4 block text-sm font-medium text-[#1d2f52]">
          Guests
          <input
            v-model.number="guests"
            type="number"
            min="1"
            max="8"
            required
            class="mt-2 h-12 w-full rounded-xl border border-slate-300 px-3 outline-none focus:border-[#1d2f52]"
          />
        </label>
        <p v-if="bookingError" class="mt-4 text-sm text-red-600" role="alert">
          {{ bookingError }}
        </p>
        <button
          type="submit"
          :disabled="isBooking"
          class="mt-6 w-full rounded-xl bg-[#0d224a] px-4 py-4 text-base font-semibold text-white disabled:cursor-wait disabled:opacity-60"
        >
          {{ isBooking ? "Confirming booking..." : "Confirm booking" }}
        </button>
      </form>
    </div>
  </div>
</template>
