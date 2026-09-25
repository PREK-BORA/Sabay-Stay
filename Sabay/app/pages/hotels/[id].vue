<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { 
  addDoc, 
  collection, 
  doc, 
  getDocs, 
  onSnapshot, 
  or,
  query, 
  serverTimestamp, 
  where, 
  type Firestore 
} from "firebase/firestore";
import { navigateTo, useNuxtApp, useRoute } from "#imports";
import {
  ArrowLeft,
  BedDouble,
  Check,
  Heart,
  MapPin,
  Star,
  Users,
} from "lucide-vue-next";
import { useFavorites } from "~/composables/user/useFavorites";
import { useAuth } from "~/composables/auth/useAuth";

interface HotelDetails {
  id: string;
  name: string;
  location: string;
  address: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  gallery: string[];
  amenities: string[];
  badge?: string;
}

interface HotelRoom {
  id: string;
  title: string;
  type: string;
  price: number;
  status: string;
  beds: string;
  capacity: number;
  size: string;
  amenity: string;
  description: string;
  image: string;
}

const fallbackImage =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85";

const route = useRoute();
const { $db } = useNuxtApp();
const db = $db as Firestore | undefined;
const { isFavorite, toggleFavorite } = useFavorites();
const { user, isLoggedIn } = useAuth();

const hotel = ref<HotelDetails | null>(null);
const rooms = ref<HotelRoom[]>([]);
const loading = ref(true);
const error = ref("");
const selectedRoomId = ref("");
const bookingError = ref("");
const bookingSuccess = ref("");
const isBooking = ref(false);
const checkIn = ref("");
const checkOut = ref("");
const guests = ref(1);
let stopHotelListener: (() => void) | undefined;
let stopRoomsListener: (() => void) | undefined;

const hotelId = computed(() => String(route.params.id || ""));
const availableRooms = computed(() =>
  rooms.value.filter((room) => !room.status || room.status === "Available"),
);
const selectedRoom = computed(() =>
  availableRooms.value.find((room) => room.id === selectedRoomId.value) || availableRooms.value[0],
);
const bookingNights = computed(() => {
  if (!checkIn.value || !checkOut.value) return 0;
  const difference = new Date(checkOut.value).getTime() - new Date(checkIn.value).getTime();
  return Math.max(0, Math.ceil(difference / 86_400_000));
});
const bookingTotal = computed(() => (selectedRoom.value?.price || lowestPrice.value) * bookingNights.value);
const lowestPrice = computed(() => {
  const prices = availableRooms.value.map((room) => room.price).filter((price) => price > 0);
  return prices.length ? Math.min(...prices) : hotel.value?.price || 0;
});
const gallery = computed(() => {
  if (!hotel.value) return [];
  return [...new Set([hotel.value.image, ...hotel.value.gallery].filter(Boolean))];
});

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

function cleanImage(value: unknown): string {
  return typeof value === "string" && value.trim() ? value.trim().replace(/[\[\]"']/g, "") : fallbackImage;
}

function loadHotel() {
  stopHotelListener?.();
  stopRoomsListener?.();
  hotel.value = null;
  rooms.value = [];
  selectedRoomId.value = "";
  error.value = "";
  loading.value = true;

  if (!db || !hotelId.value) {
    error.value = "This hotel could not be loaded.";
    loading.value = false;
    return;
  }

  stopHotelListener = onSnapshot(
    doc(db, "hotels", hotelId.value),
    (snapshot) => {
      if (!snapshot.exists()) {
        error.value = "This hotel is no longer available.";
        loading.value = false;
        return;
      }

      const data = snapshot.data();
      const loadedHotel: HotelDetails = {
        id: snapshot.id,
        name: String(data.name || "Unnamed hotel"),
        location: String(data.location || data.city || "Location not specified"),
        address: String(data.address || data.location || data.city || ""),
        description: String(data.description || "Details about this stay will be available soon."),
        price: Number(data.price || 0),
        rating: Number(data.rating || 0),
        image: cleanImage(data.imageUrl || data.image),
        gallery: asStringList(data.gallery),
        amenities: asStringList(data.amenities),
        badge: data.region || data.badge || undefined,
      };
      hotel.value = loadedHotel;
      loading.value = false;

      // Listen to rooms matching EITHER hotelId OR hotelName
      stopRoomsListener?.();
      stopRoomsListener = onSnapshot(
        query(
          collection(db, "rooms"), 
          or(
            where("hotelId", "==", hotelId.value),
            where("hotelName", "==", loadedHotel.name)
          )
        ),
        (roomSnapshot) => {
          rooms.value = roomSnapshot.docs.map((room) => {
            const roomData = room.data();
            return {
              id: room.id,
              title: String(roomData.title || roomData.type || "Room"),
              type: String(roomData.type || "Room"),
              price: Number(roomData.price || 0),
              status: String(roomData.status || "Available"),
              beds: String(roomData.beds || "Bed details available on request"),
              capacity: Number(roomData.capacity || 1),
              size: String(roomData.size || ""),
              amenity: String(roomData.amenity || ""),
              description: String(roomData.description || ""),
              image: cleanImage(roomData.image),
            };
          });
          if (!rooms.value.some((room) => room.id === selectedRoomId.value)) {
            selectedRoomId.value = rooms.value[0]?.id || "";
          }
        },
        () => {
          rooms.value = [];
        },
      );
    },
    () => {
      error.value = "We could not load this hotel right now.";
      loading.value = false;
    },
  );
}

function handleFavorite() {
  if (!hotel.value) return;
  toggleFavorite({
    id: hotel.value.id,
    name: hotel.value.name,
    location: hotel.value.location,
    price: lowestPrice.value,
    image: hotel.value.image,
    badge: hotel.value.badge,
    amenities: hotel.value.amenities,
  });
}

async function bookNow() {
  bookingError.value = "";
  bookingSuccess.value = "";
  if (!isLoggedIn.value || !user.value?.id) {
    await navigateTo(`/auth/login?redirect=${encodeURIComponent(route.fullPath)}`);
    return;
  }
  if (!db || !hotel.value) {
    bookingError.value = "Booking is temporarily unavailable. Please try again.";
    return;
  }
  if (!checkIn.value || !checkOut.value || bookingNights.value < 1) {
    bookingError.value = "Choose a valid check-in and check-out date.";
    return;
  }
  if (guests.value < 1 || (selectedRoom.value && guests.value > selectedRoom.value.capacity)) {
    bookingError.value = "Choose a valid number of guests for this room.";
    return;
  }

  const currentHotel = hotel.value;
  const room = selectedRoom.value;
  isBooking.value = true;

  try {
    const price = room?.price || lowestPrice.value;
    const total = price * bookingNights.value;
    const bookingRef = await addDoc(collection(db, "bookings"), {
      userId: user.value.id,
      guestName: user.value.name || "Guest traveler",
      guestEmail: user.value.email || "",
      hotelId: currentHotel.id,
      hotelName: currentHotel.name,
      location: currentHotel.location,
      image: currentHotel.image,
      roomId: room?.id || "",
      roomName: room?.title || "Standard room",
      guests: guests.value,
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      nights: bookingNights.value,
      pricePerNight: price,
      total,
      totalPrice: total,
      status: "Pending",
      createdAt: serverTimestamp(),
    });

    const userMessage = `Your request for ${currentHotel.name}${room ? ` (${room.title})` : ""} was received. We will notify you when it is confirmed.`;

    const adminSnapshot = await getDocs(
      query(collection(db, "users"), where("role", "==", "admin"))
    );

    const notificationPromises: Promise<any>[] = [
      addDoc(collection(db, "notifications"), {
        recipientId: user.value.id,
        actorId: user.value.id,
        recipientRole: "user",
        bookingId: bookingRef.id,
        type: "booking",
        title: "Booking request received",
        message: userMessage,
        isRead: false,
        createdAt: serverTimestamp(),
      }),
    ];

    adminSnapshot.forEach((adminDoc) => {
      notificationPromises.push(
        addDoc(collection(db, "notifications"), {
          recipientId: adminDoc.id,
          actorId: user.value.id,
          recipientRole: "admin",
          bookingId: bookingRef.id,
          type: "booking",
          title: "New booking request",
          message: `${user.value.name || user.value.email || "A guest"} requested ${currentHotel.name}${room ? ` — ${room.title}` : ""}.`,
          isRead: false,
          createdAt: serverTimestamp(),
        })
      );
    });

    await Promise.all(notificationPromises);
    bookingSuccess.value = "Booking request sent. You can view it in Dashboard → Bookings.";
  } catch (bookingFailure) {
    console.error("Unable to create booking", bookingFailure);
    bookingError.value = "We could not create your booking. Please try again.";
  } finally {
    isBooking.value = false;
  }
}

onMounted(loadHotel);
watch(hotelId, loadHotel);
onUnmounted(() => {
  stopHotelListener?.();
  stopRoomsListener?.();
});
</script>

<template>
  <main class="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <NuxtLink to="/hotels" class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-amber-600">
      <ArrowLeft class="h-4 w-4" />
      Back to hotels
    </NuxtLink>

    <div v-if="loading" class="py-24 text-center text-slate-500">Loading hotel details...</div>

    <section v-else-if="error" class="mx-auto mt-8 max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <h1 class="text-2xl font-bold text-slate-900">Hotel unavailable</h1>
      <p class="mt-2 text-slate-500">{{ error }}</p>
      <NuxtLink to="/hotels" class="mt-6 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Browse hotels</NuxtLink>
    </section>

    <template v-else-if="hotel">
      <section class="mt-6 grid gap-3 md:grid-cols-4 md:grid-rows-2">
        <img :src="gallery[0]" :alt="hotel.name" class="h-72 w-full rounded-2xl object-cover md:col-span-2 md:row-span-2 md:h-full" />
        <img v-for="(image, index) in gallery.slice(1, 5)" :key="image" :src="image" :alt="`${hotel.name} photo ${index + 2}`" class="hidden h-36 w-full rounded-xl object-cover md:block" />
      </section>

      <div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section>
          <div class="flex items-start justify-between gap-4">
            <div>
              <p v-if="hotel.badge" class="text-xs font-bold uppercase tracking-widest text-amber-600">{{ hotel.badge }}</p>
              <h1 class="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{{ hotel.name }}</h1>
              <p class="mt-3 flex items-center gap-1.5 text-sm text-slate-500"><MapPin class="h-4 w-4" />{{ hotel.location }}</p>
            </div>
            <button type="button" :aria-label="isFavorite(hotel.id) ? 'Remove from favorites' : 'Save to favorites'" class="rounded-full border border-slate-200 p-3 text-slate-500 hover:border-red-200 hover:text-red-500" @click="handleFavorite">
              <Heart class="h-5 w-5" :class="isFavorite(hotel.id) ? 'fill-red-500 text-red-500' : ''" />
            </button>
          </div>

          <div class="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Star class="h-5 w-5 fill-amber-400 text-amber-400" />
            {{ hotel.rating ? hotel.rating.toFixed(1) : 'New' }} <span class="font-normal text-slate-400">· Guest rating</span>
          </div>

          <section id="rooms" class="mt-8 border-t border-slate-200 pt-7">
            <h2 class="text-xl font-bold text-slate-900">About this stay</h2>
            <p class="mt-3 max-w-3xl leading-7 text-slate-600">{{ hotel.description }}</p>
            <p v-if="hotel.address" class="mt-4 text-sm font-medium text-slate-600">{{ hotel.address }}</p>
          </section>

          <section v-if="hotel.amenities.length" class="mt-8 border-t border-slate-200 pt-7">
            <h2 class="text-xl font-bold text-slate-900">What this place offers</h2>
            <ul class="mt-4 grid gap-3 sm:grid-cols-2">
              <li v-for="amenity in hotel.amenities" :key="amenity" class="flex items-center gap-2 text-sm text-slate-700"><Check class="h-4 w-4 text-emerald-600" />{{ amenity }}</li>
            </ul>
          </section>

          <section class="mt-8 border-t border-slate-200 pt-7">
            <h2 class="text-xl font-bold text-slate-900">Available rooms</h2>
            <p class="mt-1 text-sm text-slate-500">Choose the room that suits your trip.</p>
            <div v-if="availableRooms.length" class="mt-5 space-y-4">
              <button v-for="room in availableRooms" :key="room.id" type="button" class="grid w-full gap-4 rounded-xl border p-4 text-left transition sm:grid-cols-[128px_1fr_auto] sm:items-center" :class="selectedRoom?.id === room.id ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500' : 'border-slate-200 hover:border-slate-300'" @click="selectedRoomId = room.id">
                <img :src="room.image" :alt="room.title" class="h-28 w-full rounded-lg object-cover sm:h-24" />
                <div>
                  <h3 class="font-bold text-slate-900">{{ room.title }}</h3>
                  <p class="mt-1 text-sm text-slate-500">{{ room.beds }}<span v-if="room.size"> · {{ room.size }}</span></p>
                  <p v-if="room.amenity" class="mt-2 text-xs text-slate-500">{{ room.amenity }}</p>
                </div>
                <div class="text-left sm:text-right"><p class="text-lg font-bold text-slate-900">${{ room.price.toLocaleString() }}</p><p class="text-xs text-slate-500">per night</p></div>
              </button>
            </div>
            <p v-else class="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Room availability will be updated soon. Contact the property for current options.</p>
          </section>
        </section>

        <aside class="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-lg lg:sticky lg:top-6">
          <p class="text-sm text-slate-500">Starting from</p>
          <p class="mt-1 text-3xl font-bold text-slate-900">${{ lowestPrice.toLocaleString() }} <span class="text-sm font-normal text-slate-500">/ night</span></p>
          <div class="my-5 border-t border-slate-100" />
          <p class="flex items-center gap-2 text-sm text-slate-600"><BedDouble class="h-4 w-4" />{{ availableRooms.length }} available room{{ availableRooms.length === 1 ? '' : 's' }}</p>
          <p class="mt-3 flex items-center gap-2 text-sm text-slate-600"><Users class="h-4 w-4" />Room capacity shown per selection</p>
          <p v-if="selectedRoom" class="mt-5 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">Selected: {{ selectedRoom.title }}</p>
          <div class="mt-4 grid grid-cols-2 gap-2">
            <label class="text-xs font-medium text-slate-600">Check-in<input v-model="checkIn" type="date" class="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-700" /></label>
            <label class="text-xs font-medium text-slate-600">Check-out<input v-model="checkOut" type="date" :min="checkIn || undefined" class="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-700" /></label>
          </div>
          <label class="mt-3 block text-xs font-medium text-slate-600">Guests<input v-model.number="guests" type="number" min="1" :max="selectedRoom?.capacity || 8" class="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm text-slate-700" /></label>
          <p v-if="bookingNights" class="mt-3 text-sm font-semibold text-slate-800">{{ bookingNights }} night{{ bookingNights === 1 ? '' : 's' }} · ${{ bookingTotal.toLocaleString() }} total</p>
          <button type="button" class="mt-4 w-full rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60" :disabled="isBooking" @click="bookNow">{{ isBooking ? 'Sending booking...' : 'Book Now' }}</button>
          <p v-if="bookingSuccess" class="mt-3 text-center text-xs font-medium text-emerald-700">{{ bookingSuccess }}</p>
          <p v-if="bookingError" class="mt-3 text-center text-xs font-medium text-red-600">{{ bookingError }}</p>
          <p class="mt-3 text-center text-xs text-slate-400">Prices may vary by date and room selection.</p>
        </aside>
      </div>
    </template>
  </main>
</template>