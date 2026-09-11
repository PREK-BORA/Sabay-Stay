<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuth } from "~/composables/useAuth";

interface BookingDetails {
  property: string;
  location: string;
  status: "Confirmed" | "Pending" | "Cancelled";
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
  specialRequests?: string;
  cancellationPolicy: string;
  paymentMethod: string;
  bookingDate: string;
}

definePageMeta({ layout: "user", middleware: "auth" });

const route = useRoute();
const router = useRouter();
const { user } = useAuth();
const bookingId = computed(() => String(route.params.id));
const booking = ref<BookingDetails>({
  property: "The Azure Oasis Resort",
  location: "Emerald Bay, Bivera",
  status: "Confirmed",
  image:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  rating: "4.8 / 5",
  roomType: "Oceanfront Suite",
  guests: 2,
  facilities: ["Ocean view", "King bed", "Breakfast included", "Wi-Fi"],
  checkIn: "October 12, 2026",
  checkOut: "October 18, 2026",
  nights: 6,
  roomPrice: 4200,
  taxes: 150,
  discount: 100,
  specialRequests: "Late check-in requested after 10 PM",
  cancellationPolicy: "Free cancellation up to 48 hours before check-in",
  paymentMethod: "Visa ending in 4242",
  bookingDate: "September 28, 2026",
});

const guestName = computed(() => user.value?.name || "Guest traveler");
const guestEmail = computed(() => user.value?.email || "guest@example.com");
const guestPhone = computed(() => user.value?.phone || "Not provided");
const total = computed(
  () => booking.value.roomPrice + booking.value.taxes - booking.value.discount,
);
const displayStatus = computed(() => {
  const cancelledIds = getCancelledBookingIds();
  if (cancelledIds.includes(bookingId.value)) return "Cancelled";
  return booking.value.status;
});

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

function cancelBooking() {
  booking.value.status = "Cancelled";
  const cancelledIds = getCancelledBookingIds();
  if (!cancelledIds.includes(bookingId.value)) {
    cancelledIds.push(bookingId.value);
    setCancelledBookingIds(cancelledIds);
  }
}

function downloadConfirmation() {
  const details = [
    "SabayStay Booking Confirmation",
    `Booking ID: ${bookingId.value}`,
    `Hotel: ${booking.value.property}`,
    `Room: ${booking.value.roomType}`,
    `Stay: ${booking.value.checkIn} - ${booking.value.checkOut}`,
    `Guest: ${guestName.value}`,
    `Total: $${total.value.toLocaleString()}`,
  ].join("\n");
  const url = URL.createObjectURL(new Blob([details], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${bookingId.value}-confirmation.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

const statusConfig = {
  Confirmed: {
    bg: "bg-emerald-100 text-emerald-700",
    border: "border-emerald-200",
    icon: "✓",
  },
  Pending: {
    bg: "bg-amber-100 text-amber-700",
    border: "border-amber-200",
    icon: "⏳",
  },
  Cancelled: {
    bg: "bg-red-100 text-red-700",
    border: "border-red-200",
    icon: "✕",
  },
};
</script>

<template>
  <div class="mx-auto max-w-5xl space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <NuxtLink
          to="/dashboard/bookings"
          class="inline-flex items-center gap-2 text-sm font-semibold text-[#087d72] hover:text-[#0d224a]"
        >
          <span aria-hidden="true">←</span>
          Back to bookings
        </NuxtLink>
        <h1 class="mt-3 text-3xl font-bold text-[#1d2f52]">Booking Details</h1>
        <p class="mt-1 text-sm text-[#65728a]">Booking ID: {{ bookingId }}</p>
      </div>
      <span
        class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
        :class="statusConfig[displayStatus].bg"
      >
        <span aria-hidden="true">{{ statusConfig[displayStatus].icon }}</span>
        {{ displayStatus }}
      </span>
    </div>

    <section class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
      <div class="grid md:grid-cols-[300px_1fr]">
        <div class="relative h-64 md:h-full">
          <img
            :src="booking.image"
            :alt="booking.property"
            class="h-full w-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#07182b]/40 to-transparent md:bg-gradient-to-r" />
        </div>
        <div class="p-6 sm:p-8">
          <p
            class="text-xs font-semibold uppercase tracking-[0.2em] text-[#087d72]"
          >
            Hotel Information
          </p>
          <h2 class="mt-2 text-3xl font-black text-[#0d224a]">
            {{ booking.property }}
          </h2>
          <div class="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#53637c]">
            <span class="flex items-center gap-1.5">
              <span aria-hidden="true">📍</span>
              {{ booking.location }}
            </span>
            <span class="flex items-center gap-1.5 font-semibold text-amber-600">
              <span aria-hidden="true">★</span>
              {{ booking.rating }}
            </span>
          </div>
          <div class="mt-6 flex flex-wrap gap-2">
            <span
              v-for="facility in booking.facilities.slice(0, 4)"
              :key="facility"
              class="rounded-full bg-[#e5f0ed] px-3 py-1 text-xs font-medium text-[#087d72]"
            >
              {{ facility }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <div class="grid gap-5 md:grid-cols-2">
      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 class="text-lg font-bold text-[#0d224a]">Room Information</h2>
        <dl class="mt-4 space-y-3 text-sm">
          <div class="flex justify-between gap-4">
            <dt class="text-[#65728a]">Room Type</dt>
            <dd class="text-right font-semibold text-[#1d2f52]">
              {{ booking.roomType }}
            </dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-[#65728a]">Guests</dt>
            <dd class="font-semibold text-[#1d2f52]">{{ booking.guests }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-[#65728a]">Number of Nights</dt>
            <dd class="font-semibold text-[#1d2f52]">{{ booking.nights }}</dd>
          </div>
        </dl>
      </section>

      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 class="text-lg font-bold text-[#0d224a]">Stay Information</h2>
        <dl class="mt-4 space-y-3 text-sm">
          <div class="flex justify-between gap-4">
            <dt class="text-[#65728a]">Check-in</dt>
            <dd class="text-right font-semibold text-[#1d2f52]">
              {{ booking.checkIn }}
            </dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-[#65728a]">Check-out</dt>
            <dd class="text-right font-semibold text-[#1d2f52]">
              {{ booking.checkOut }}
            </dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt class="text-[#65728a]">Booking Date</dt>
            <dd class="text-right font-semibold text-[#1d2f52]">
              {{ booking.bookingDate }}
            </dd>
          </div>
        </dl>
      </section>
    </div>

    <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 class="text-lg font-bold text-[#0d224a]">Guest Information</h2>
      <div class="mt-4 grid gap-4 text-sm sm:grid-cols-3">
        <div class="rounded-xl border border-slate-200 bg-[#f7f6f2] p-4">
          <p class="text-xs uppercase tracking-[0.18em] text-[#65728a]">Name</p>
          <p class="mt-1 font-semibold text-[#1d2f52]">{{ guestName }}</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-[#f7f6f2] p-4">
          <p class="text-xs uppercase tracking-[0.18em] text-[#65728a]">Email</p>
          <p class="mt-1 break-all font-semibold text-[#1d2f52]">
            {{ guestEmail }}
          </p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-[#f7f6f2] p-4">
          <p class="text-xs uppercase tracking-[0.18em] text-[#65728a]">Phone</p>
          <p class="mt-1 font-semibold text-[#1d2f52]">{{ guestPhone }}</p>
        </div>
      </div>
    </section>

    <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 class="text-lg font-bold text-[#0d224a]">Additional Details</h2>
      <div class="mt-4 grid gap-4 sm:grid-cols-2">
        <div class="rounded-xl border border-slate-200 bg-[#f7f6f2] p-4">
          <p class="text-xs uppercase tracking-[0.18em] text-[#65728a]">
            Special Requests
          </p>
          <p class="mt-1 text-sm text-[#1d2f52]">
            {{ booking.specialRequests || "No special requests" }}
          </p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-[#f7f6f2] p-4">
          <p class="text-xs uppercase tracking-[0.18em] text-[#65728a]">
            Cancellation Policy
          </p>
          <p class="mt-1 text-sm text-[#1d2f52]">
            {{ booking.cancellationPolicy }}
          </p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-[#f7f6f2] p-4">
          <p class="text-xs uppercase tracking-[0.18em] text-[#65728a]">
            Payment Method
          </p>
          <p class="mt-1 text-sm text-[#1d2f52]">
            {{ booking.paymentMethod }}
          </p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-[#f7f6f2] p-4">
          <p class="text-xs uppercase tracking-[0.18em] text-[#65728a]">
            Booking Status
          </p>
          <p class="mt-1 text-sm font-semibold text-[#1d2f52]">
            {{ displayStatus }}
          </p>
        </div>
      </div>
    </section>

    <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h2 class="text-lg font-bold text-[#0d224a]">Price Summary</h2>
      <dl class="mt-4 max-w-md space-y-3 text-sm">
        <div class="flex justify-between">
          <dt class="text-[#65728a]">Room Price ({{ booking.nights }} nights)</dt>
          <dd class="font-medium text-[#1d2f52]">
            ${{ booking.roomPrice.toLocaleString() }}
          </dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-[#65728a]">Taxes / Fees</dt>
          <dd class="font-medium text-[#1d2f52]">
            ${{ booking.taxes.toLocaleString() }}
          </dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-[#65728a]">Discount</dt>
          <dd class="font-medium text-emerald-700">
            -${{ booking.discount.toLocaleString() }}
          </dd>
        </div>
        <div
          class="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-[#0d224a]"
        >
          <dt>Total</dt>
          <dd>${{ total.toLocaleString() }}</dd>
        </div>
      </dl>
    </section>

    <div
      class="flex flex-col-reverse justify-end gap-3 border-t border-slate-200 pb-8 pt-2 sm:flex-row"
    >
      <button
        type="button"
        class="rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="displayStatus === 'Cancelled'"
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
</template>
