<script setup lang="ts">
const gallery = [
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
];

const amenities = [
  "Infinity Pool",
  "Holistic Spa",
  "Fine Dining",
  "Fitness Centre",
  "High-Speed Wi-Fi",
  "24/7 Room Service",
];

const rooms = [
  {
    title: "Deluxe Garden Room",
    price: "$450",
    per: "/ night",
    description:
      "A spacious retreat featuring elegant minimalist decor, a private balcony with serene garden views, and a luxurious rain shower.",
    size: "40m²",
    bed: "King Bed",
    amenity: "Balcony",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Oceanfront Suite",
    price: "$780",
    per: "/ night",
    description:
      "The ultimate indulgence: Wake up to panoramic ocean views, unwind in a breathtaking soaking tub, and enjoy expansive living spaces designed for pure relaxation.",
    size: "65m²",
    bed: "King Bed",
    amenity: "Ocean View",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
];

const reviews = [
  {
    name: "EC",
    title: "Stayed in Oceanfront Suite",
    text: "An absolute dream. The attention to detail in the design incredible, and the service was flawless. The infinity pool at sunset is a memory I won't soon forget.",
    rating: 5,
  },
  {
    name: "MR",
    title: "Stayed in Deluxe Garden Room",
    text: "The perfect escape. We loved the quiet, the design, and the thoughtful service from every team member. Highly recommended.",
    rating: 5,
  },
  {
    name: "SW",
    title: "Stayed in Oceanfront Suite",
    text: "Beautiful property and excellent facilities. The spa treatments were divine and the views made every evening feel magical.",
    rating: 5,
  },
];
</script>

<template>
  <div class="mx-auto max-w-[1280px] px-5 pb-16 pt-8 md:px-8">
    <section class="mb-10">
      <div
        class="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <h1
            class="sabay-display text-5xl font-black tracking-[-0.05em] text-[#1d2f52] md:text-7xl"
          >
            The Azure Oasis Resort
          </h1>
          <div
            class="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#44506a]"
          >
            <span>📍 123 Coastal Highway, Emerald Bay, Bivera</span>
            <span class="text-[#f7b500]">★★★★★</span>
            <span>4.8 (245 Reviews)</span>
          </div>
        </div>

        <div class="flex items-center gap-3 text-sm font-medium text-[#24314d]">
          <button
            class="rounded-full border border-slate-300 bg-white px-4 py-2 hover:border-[#1d2f52]"
          >
            Share
          </button>
          <button
            class="rounded-full border border-slate-300 bg-white px-4 py-2 hover:border-[#1d2f52]"
          >
            Save
          </button>
        </div>
      </div>

      <div class="grid gap-4 lg:grid-cols-[1.6fr_0.9fr]">
        <div class="overflow-hidden rounded-[2rem]">
          <img
            class="h-[420px] w-full object-cover"
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
            alt="Azure Oasis Resort"
          />
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div
            v-for="(image, index) in gallery.slice(0, 3)"
            :key="index"
            class="overflow-hidden rounded-[1.5rem]"
          >
            <img
              :src="image"
              class="h-52 w-full object-cover"
              alt="Resort gallery"
            />
          </div>
          <div class="relative overflow-hidden rounded-[1.5rem] bg-[#d9dfe8]">
            <img
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
              class="h-52 w-full object-cover"
              alt="Room view"
            />
            <button
              class="absolute inset-x-4 bottom-4 rounded-full bg-white/85 px-4 py-2 text-sm font-medium text-[#1d2f52] backdrop-blur-sm"
            >
              View All 42 Photos
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-8 lg:grid-cols-[1.6fr_0.8fr]">
      <div>
        <div
          class="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200"
        >
          <h2
            class="sabay-display text-4xl font-black tracking-[-0.04em] text-[#1d2f52]"
          >
            About This Property
          </h2>
          <p class="mt-5 text-lg leading-8 text-[#4a5871]">
            Experience unparalleled luxury at The Azure Oasis Resort, where
            minimalist design meets the lush vibrancy of the tropics. Nestled on
            a pristine stretch of private coastline, our sanctuary offers a
            seamless blend of indoor and outdoor living, designed for the
            discerning traveler seeking deep relaxation and refined elegance.
          </p>

          <p class="mt-5 text-lg leading-8 text-[#4a5871]">
            Every detail, from the ambient lighting in our expansive suites to
            the locally sourced ingredients in our restaurant, has been
            thoughtfully curated to create an effortless experience that feels
            both restorative and unforgettable.
          </p>
        </div>

        <div
          class="mt-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200"
        >
          <h3
            class="sabay-display text-4xl font-black tracking-[-0.04em] text-[#1d2f52]"
          >
            Facilities &amp; Amenities
          </h3>
          <div class="mt-6 flex flex-wrap gap-3">
            <span
              v-for="item in amenities"
              :key="item"
              class="rounded-full border border-[#d9e4ef] bg-[#eef6fb] px-4 py-2 text-sm text-[#20365f]"
            >
              {{ item }}
            </span>
          </div>
        </div>

        <div class="mt-8">
          <h3
            class="sabay-display text-4xl font-black tracking-[-0.04em] text-[#1d2f52]"
          >
            Available Rooms
          </h3>

          <div
            v-for="room in rooms"
            :key="room.title"
            class="mt-6 rounded-[2rem] bg-white p-4 shadow-sm ring-1 ring-slate-200 md:p-5"
          >
            <div class="grid gap-5 md:grid-cols-[0.95fr_1.6fr]">
              <img
                :src="room.image"
                class="h-52 w-full rounded-[1.5rem] object-cover md:h-full"
                :alt="room.title"
              />

              <div class="flex flex-col justify-between gap-4">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <h4 class="text-3xl font-semibold text-[#1d2f52]">
                      {{ room.title }}
                    </h4>
                    <p class="mt-3 text-base leading-7 text-[#4b5871]">
                      {{ room.description }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-4xl font-bold text-[#1d2f52]">
                      {{ room.price }}
                    </p>
                    <p
                      class="text-xs uppercase tracking-[0.2em] text-slate-400"
                    >
                      per night
                    </p>
                  </div>
                </div>

                <div
                  class="flex flex-wrap items-center gap-4 text-sm text-[#4b5871]"
                >
                  <span class="rounded-full bg-slate-100 px-3 py-1.5">{{
                    room.size
                  }}</span>
                  <span class="rounded-full bg-slate-100 px-3 py-1.5">{{
                    room.bed
                  }}</span>
                  <span class="rounded-full bg-slate-100 px-3 py-1.5">{{
                    room.amenity
                  }}</span>
                </div>

                <div
                  class="flex items-center justify-between gap-3 border-t border-slate-200 pt-4"
                >
                  <button
                    class="text-sm font-medium text-[#1d2f52] hover:text-[#0d224a]"
                  >
                    View Room Details
                  </button>
                  <button
                    class="rounded-xl border border-[#1d2f52] bg-white px-5 py-3 text-sm font-semibold text-[#1d2f52] hover:bg-[#1d2f52] hover:text-white"
                  >
                    {{
                      room.title === "Deluxe Garden Room"
                        ? "Select Room"
                        : "Book Now"
                    }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="mt-8 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200"
        >
          <h3
            class="sabay-display text-4xl font-black tracking-[-0.04em] text-[#1d2f52]"
          >
            Guest Experiences
          </h3>

          <div class="mt-6 grid gap-4 md:grid-cols-3">
            <div
              v-for="review in reviews"
              :key="review.title"
              class="rounded-[1.5rem] border border-slate-200 bg-[#f8fafc] p-4"
            >
              <div class="flex items-center gap-1 text-[#f7b500]">
                <span v-for="n in review.rating" :key="n">★</span>
              </div>
              <p class="mt-4 text-base leading-7 text-[#324259]">
                “{{ review.text }}”
              </p>
              <div class="mt-5 flex items-center gap-3">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-full bg-[#dfeaf5] text-sm font-bold text-[#1d2f52]"
                >
                  {{ review.name }}
                </div>
                <div>
                  <p class="font-semibold text-[#1d2f52]">{{ review.name }}</p>
                  <p class="text-xs text-slate-500">{{ review.title }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside class="lg:pt-6">
        <div
          class="rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200"
        >
          <div
            class="flex items-center justify-between gap-3 rounded-[1rem] border border-slate-200 bg-[#f5f7fa] p-4"
          >
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">
                Price from
              </p>
              <p class="mt-3 text-4xl font-black text-[#1d2f52]">$450</p>
              <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                / night
              </p>
            </div>
            <div
              class="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf1fb] text-xl"
            >
              🛏️
            </div>
          </div>

          <div class="mt-5 space-y-3 text-sm text-[#3b4a62]">
            <div class="rounded-xl border border-slate-200 bg-white p-3">
              <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                Check-in / Check-out
              </p>
              <p class="mt-2 font-medium text-[#1d2f52]">Select Dates</p>
            </div>
            <div class="rounded-xl border border-slate-200 bg-white p-3">
              <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                Guests
              </p>
              <p class="mt-2 font-medium text-[#1d2f52]">
                2 adults, 0 children
              </p>
            </div>
          </div>

          <button
            class="mt-5 w-full rounded-xl bg-[#0d224a] px-4 py-4 text-base font-semibold text-white hover:bg-[#0a1d3d]"
          >
            Check Availability
          </button>
        </div>
      </aside>
    </section>
  </div>
</template>
