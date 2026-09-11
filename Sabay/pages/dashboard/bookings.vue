<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "~/composables/useAuth";

definePageMeta({ layout: "user", middleware: "auth" });

interface Booking {
  id: string;
  property: string;
  location: string;
  dates: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  total: string;
  image: string;
  rating: string;
  roomType: string;
  guests: number;
  facilities: string[];
  checkIn: string;
  checkOut: string;
  nights: number;
  roomPrice: number;
  taxes: number;
  discount: number;
}

const { user } = useAuth();
const { $auth, $db } = useNuxtApp();
const selectedBooking = ref<Booking | null>(null);
const isLoading = ref(true);
const bookingError = ref("");

function getCancelledBookingIds(): string[] {
  try {
    const stored = localStorage.getItem("sabaystay-cancelled-bookings");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setCancelledBookingIds(ids: string[]) {
  localStorage.setItem("sabaystay-cancelled-bookings", JSON.stringify(ids));
}

function isBookingCancelled(bookingId: string): boolean {
  const cancelledIds = getCancelledBookingIds();
  return cancelledIds.includes(bookingId);
}

function getDisplayStatus(booking: Booking): Booking["status"] {
  if (isBookingCancelled(booking.id)) return "Cancelled";
  return booking.status;
}

const bookings = ref<Booking[]>([
  {
    id: "SBY-88392",
    property: "The Azure Retreat",
    location: "Maldives",
    dates: "Oct 12 - Oct 18, 2026",
    status: "Confirmed",
    total: "$4,250",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    rating: "4.9 / 5",
    roomType: "Oceanfront Suite",
    guests: 2,
    facilities: ["Ocean view", "King bed", "Breakfast included", "Wi-Fi"],
    checkIn: "October 12, 2026",
    checkOut: "October 18, 2026",
    nights: 6,
    roomPrice: 4200,
    taxes: 150,
    discount: 100,
  },
  {
    id: "SBY-90114",
    property: "Metro Grand Suites",
    location: "Tokyo, Japan",
    dates: "Nov 05 - Nov 10, 2026",
    status: "Pending",
    total: "$1,800",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
    rating: "4.7 / 5",
    roomType: "Deluxe City Suite",
    guests: 2,
    facilities: ["City view", "King bed", "Breakfast included", "Wi-Fi"],
    checkIn: "November 5, 2026",
    checkOut: "November 10, 2026",
    nights: 5,
    roomPrice: 1750,
    taxes: 100,
    discount: 50,
  },
]);

const guestName = computed(() => user.value?.name || "Guest traveler");
const guestEmail = computed(() => user.value?.email || "guest@example.com");
const guestPhone = computed(() => user.value?.phone || "Not provided");

async function loadBookings() {
  const firebaseUser = $auth.currentUser;

  if (!firebaseUser) {
    isLoading.value = false;
    return;
  }

  try {
    const snapshot = await getDocs(
      query(
        collection($db, "bookings"),
        where("userId", "==", firebaseUser.uid),
      ),
    );

    const savedBookings: Booking[] = snapshot.docs.map((bookingDoc) => {
      const data = bookingDoc.data();
      const status = String(data.status || "pending");
      const checkIn = String(data.checkIn || "");
      const checkOut = String(data.checkOut || "");
      const nights = Number(data.nights || 0);
      const roomPrice = Number(data.pricePerNight || 0) * nights;

      return {
        id: bookingDoc.id,
        property: String(data.hotelName || "SabayStay property"),
        location: "Your saved hotel booking",
        dates: `${checkIn} - ${checkOut}`,
        status: (status.charAt(0).toUpperCase() +
          status.slice(1)) as Booking["status"],
        total: `$${Number(data.total || 0).toLocaleString()}`,
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
        rating: "Not rated",
        roomType: String(data.roomName || "Room"),
        guests: Number(data.guests || 1),
        facilities: [],
        checkIn,
        checkOut,
        nights,
        roomPrice,
        taxes: 0,
        discount: 0,
      };
    });

    if (savedBookings.length > 0) {
      const cancelledIds = getCancelledBookingIds();
      bookings.value = savedBookings.map((booking) =>
        cancelledIds.includes(booking.id)
          ? { ...booking, status: "Cancelled" as Booking["status"], total: "$0" }
          : booking,
      );
    }
  } catch (error) {
    console.error("Failed to load bookings", error);
    bookingError.value = "Your saved bookings could not be loaded.";
  } finally {
    isLoading.value = false;
  }
}

let unsubscribe = () => {};

onMounted(() => {
  unsubscribe = onAuthStateChanged($auth, () => {
    void loadBookings();
  });
});

onBeforeUnmount(() => unsubscribe());

function openDetails(booking: Booking) {
  const displayStatus = getDisplayStatus(booking);
  selectedBooking.value = {
    ...booking,
    status: displayStatus,
    total: displayStatus === "Cancelled" ? "$0" : booking.total,
  };
}

function closeDetails() {
  selectedBooking.value = null;
}

function cancelBooking() {
  if (!selectedBooking.value) return;

  selectedBooking.value.status = "Cancelled";
  selectedBooking.value.total = "$0";

  const cancelledIds = getCancelledBookingIds();
  if (!cancelledIds.includes(selectedBooking.value.id)) {
    cancelledIds.push(selectedBooking.value.id);
    setCancelledBookingIds(cancelledIds);
  }
}

function downloadConfirmation() {
  if (!selectedBooking.value) return;

  const booking = selectedBooking.value;
  const confirmation = [
    "SabayStay Booking Confirmation",
    `Booking ID: ${booking.id}`,
    `Hotel: ${booking.property}`,
    `Room: ${booking.roomType}`,
    `Stay: ${booking.checkIn} - ${booking.checkOut}`,
    `Guest: ${guestName.value}`,
    `Total: ${booking.total}`,
  ].join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(
    new Blob([confirmation], { type: "text/plain" }),
  );
  link.download = `${booking.id}-confirmation.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-[#1d2f52]">Bookings</h1>
      <p class="mt-1 text-sm text-[#65728a]">
        Manage your upcoming stays and travel plans.
      </p>
    </div>
    <div v-if="isLoading" class="text-sm text-[#65728a]">Loading bookings...</div>
    <div v-else-if="bookingError" class="text-sm text-red-600">{{ bookingError }}</div>
    <div v-else class="space-y-4">
      <article
        v-for="booking in bookings"
        :key="booking.id"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-200"
      >
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-[0.2em] text-[#65728a]"
            >
              {{ booking.id }}
            </p>
            <h2 class="mt-1 text-lg font-bold text-[#0d224a]">
              {{ booking.property }}
            </h2>
            <p class="text-sm text-[#53637c]">
              {{ booking.location }} · {{ booking.dates }}
            </p>
          </div>
          <span
            class="rounded-full px-3 py-1 text-xs font-semibold"
            :class="
              getDisplayStatus(booking) === 'Cancelled'
                ? 'bg-red-100 text-red-700'
                : getDisplayStatus(booking) === 'Pending'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
            "
          >
            {{ getDisplayStatus(booking) }}
          </span>
        </div>
        <div
          class="mt-5 flex justify-between border-t border-slate-200 pt-4 text-sm"
        >
          <div>
            <span class="text-[#65728a]">Total</span>
            <strong class="ml-2 text-[#087d72]">{{ booking.total }}</strong>
          </div>
          <button
            type="button"
            class="font-semibold text-[#087d72] hover:text-[#0d224a]"
            @click="openDetails(booking)"
          >
            View Details
          </button>
        </div>
      </article>
    </div>

    <div
      v-if="selectedBooking"
      class="fixed inset-0 z-50 overflow-y-auto bg-[#07182b]/50 p-4 sm:p-8"
      @click.self="closeDetails"
    >
      <section
        class="mx-auto max-w-4xl overflow-hidden rounded-3xl bg-[#f7f6f2] shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-details-title"
      >
        <div
          class="flex items-start justify-between gap-5 bg-[#0d224a] px-6 py-6 text-white sm:px-8"
        >
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300"
            >
              Booking Details
            </p>
            <h2
              id="booking-details-title"
              class="mt-1 text-2xl font-bold text-white"
            >
              {{ selectedBooking.property }}
            </h2>
            <p class="mt-1 text-sm text-white/70">{{ selectedBooking.id }}</p>
          </div>
          <button
            type="button"
            class="rounded-full bg-white/10 px-3 py-1 text-2xl text-white hover:bg-white/20"
            aria-label="Close booking details"
            @click="closeDetails"
          >
            ×
          </button>
        </div>

        <div class="space-y-5 p-5 sm:p-8">
          <div
            class="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-5 text-sm"
          >
            <span class="font-semibold text-[#53637c]"
              >Booking ID: {{ selectedBooking.id }}</span
            >
            <span
              class="rounded-full px-3 py-1 text-xs font-semibold"
              :class="
                getDisplayStatus(selectedBooking) === 'Cancelled'
                  ? 'bg-red-100 text-red-700'
                  : getDisplayStatus(selectedBooking) === 'Pending'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
              "
            >
              {{ getDisplayStatus(selectedBooking) }}
            </span>
          </div>

          <section
            class="grid gap-5 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-[180px_1fr]"
          >
            <img
              :src="selectedBooking.image"
              :alt="selectedBooking.property"
              class="h-36 w-full rounded-xl object-cover sm:h-full"
            />
            <div>
              <h3 class="text-lg font-bold text-[#0d224a]">
                Hotel Information
              </h3>
              <p class="mt-2 text-base font-semibold text-[#1d2f52]">
                {{ selectedBooking.property }}
              </p>
              <p class="mt-1 text-sm text-[#53637c]">
                {{ selectedBooking.location }}
              </p>
              <p class="mt-2 text-sm font-semibold text-amber-600">
                ★ {{ selectedBooking.rating }}
              </p>
            </div>
          </section>

          <div class="grid gap-5 md:grid-cols-2">
            <section class="rounded-2xl bg-white p-5 shadow-sm">
              <h3 class="font-bold text-[#0d224a]">Room Information</h3>
              <dl class="mt-4 space-y-3 text-sm">
                <div class="flex justify-between gap-4">
                  <dt class="text-[#65728a]">Room Type</dt>
                  <dd class="font-semibold text-right text-[#1d2f52]">
                    {{ selectedBooking.roomType }}
                  </dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-[#65728a]">Guests</dt>
                  <dd class="font-semibold text-[#1d2f52]">
                    {{ selectedBooking.guests }}
                  </dd>
                </div>
                <div>
                  <dt class="text-[#65728a]">Facilities</dt>
                  <dd class="mt-2 flex flex-wrap gap-2">
                    <span
                      v-for="facility in selectedBooking.facilities"
                      :key="facility"
                      class="rounded-full bg-[#e5f0ed] px-2.5 py-1 text-xs text-[#087d72]"
                      >{{ facility }}</span>
                  </dd>
                </div>
              </dl>
            </section>

            <section class="rounded-2xl bg-white p-5 shadow-sm">
              <h3 class="font-bold text-[#0d224a]">Stay Information</h3>
              <dl class="mt-4 space-y-3 text-sm">
                <div class="flex justify-between gap-4">
                  <dt class="text-[#65728a]">Check-in</dt>
                  <dd class="font-semibold text-right text-[#1d2f52]">
                    {{ selectedBooking.checkIn }}
                  </dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-[#65728a]">Check-out</dt>
                  <dd class="font-semibold text-right text-[#1d2f52]">
                    {{ selectedBooking.checkOut }}
                  </dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-[#65728a]">Number of Nights</dt>
                  <dd class="font-semibold text-[#1d2f52]">
                    {{ selectedBooking.nights }}
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          <section class="rounded-2xl bg-white p-5 shadow-sm">
            <h3 class="font-bold text-[#0d224a]">Guest Information</h3>
            <div class="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <p class="text-[#65728a]">Name</p>
                <p class="mt-1 font-semibold text-[#1d2f52]">{{ guestName }}</p>
              </div>
              <div>
                <p class="text-[#65728a]">Email</p>
                <p class="mt-1 break-all font-semibold text-[#1d2f52]">
                  {{ guestEmail }}
                </p>
              </div>
              <div>
                <p class="text-[#65728a]">Phone</p>
                <p class="mt-1 font-semibold text-[#1d2f52]">
                  {{ guestPhone }}
                </p>
              </div>
            </div>
          </section>

          <section class="rounded-2xl bg-white p-5 shadow-sm">
            <h3 class="font-bold text-[#0d224a]">Price Summary</h3>
            <dl class="mt-4 space-y-3 text-sm">
              <div class="flex justify-between">
                <dt class="text-[#65728a]">Room Price</dt>
                <dd>${{ selectedBooking.roomPrice.toLocaleString() }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-[#65728a]">Number of Nights</dt>
                <dd>{{ selectedBooking.nights }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-[#65728a]">Taxes / Fees</dt>
                <dd>${{ selectedBooking.taxes.toLocaleString() }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-[#65728a]">Discount</dt>
                <dd class="text-emerald-700">
                  -${{ selectedBooking.discount.toLocaleString() }}
                </dd>
              </div>
              <div
                class="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-[#0d224a]"
              >
                <dt>Total</dt>
                <dd>{{ selectedBooking.total }}</dd>
              </div>
            </dl>
          </section>

          <div
            class="flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pt-5 sm:flex-row"
          >
            <button
              type="button"
              class="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="getDisplayStatus(selectedBooking) === 'Cancelled'"
              @click="cancelBooking"
            >
              Cancel Booking
            </button>
            <button
              type="button"
              class="rounded-xl bg-[#0d224a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0a1d3d]"
              @click="downloadConfirmation"
            >
              Download Confirmation
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
