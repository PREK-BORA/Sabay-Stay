<script setup lang="ts">
import BoraImage from "~/assets/css/image/developer.jpg";
import vannetImage from "~/assets/css/image/photo_2026-09-10_21-56-47.jpg";
import MakaraImage from "~/assets/css/image/ChatGPT Image Sep 11, 2026, 03_21_43 PM.png";

const differences = [
  {
    icon: "☆",
    iconClass: "bg-[#dedfff] text-[#07166b]",
    title: "Curated Excellence",
    description:
      "We hand-select only the top 1% of hotels globally, ensuring every property meets our rigorous standards for design, comfort, and service.",
  },
  {
    icon: "♧",
    iconClass: "bg-[#53ead4] text-[#07166b]",
    title: "Personalized Concierge",
    description:
      "Enjoy 24/7 access to our dedicated travel experts, ready to tailor every aspect of your journey to your unique preferences.",
  },
  {
    icon: "♙",
    iconClass: "bg-[#e9e7cf] text-[#4d4b2d]",
    title: "Exclusive Access",
    description:
      "Unlock member-only benefits, complimentary upgrades, and bespoke experiences not available to the general public.",
  },
];

const developers = [
  {
    name: "PREK BORA",
    role: "Frontend Developer",
    description:
      "Responsible for designing and developing the customer-facing side of SabayStay. This developer focuses on creating a modern, responsive, and user-friendly interface using Nuxt.js and Vue.js, including the Home, Hotels, Destinations, Experiences, Services, Offers, and Customer Dashboard pages.",
    image: BoraImage,
  },
  {
    name: "TIM VANNET",
    role: "Frontend Developer",
    description:
      "Responsible for developing the hotel management and booking features of SabayStay. This developer works on hotel and room management, room availability, booking processes, booking details, the hotel owner dashboard, and revenue-related features.",
    image: vannetImage,
  },
  {
    name: "MAKARA",
    role: "Backend Developer",
    description:
      "Responsible for the backend services, authentication, database, and administration system. This developer manages Firebase Authentication, user roles, database structure, Admin Dashboard, security rules, user management, and system deployment.",
    image: MakaraImage,
  },
];
</script>

<template>
  <div class="bg-white text-[#202638]">
    <section
      class="relative flex min-h-[430px] items-center justify-center overflow-hidden text-center"
    >
      <img
        src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=85"
        alt="Luxury tropical resort overlooking the sea"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-white/45" />
      <div
        class="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white to-transparent"
      />
      <div class="relative z-10 mx-auto max-w-3xl px-6 pt-5">
        <h1
          class="sabay-display text-4xl font-bold leading-tight tracking-[-0.04em] text-[#07166b] sm:text-5xl"
        >
          Our Story: Elevating the Art of Travel
        </h1>
        <p class="mx-auto mt-3 max-w-[520px] text-sm leading-5 text-[#384055]">
          SabayStay was born from a passion for discovery and a commitment to
          unparalleled luxury. We believe that where you stay is as important as
          where you go.
        </p>
        <div class="mx-auto mt-7 h-0.5 w-10 bg-[#087d72]" />
      </div>
    </section>

    <section class="mx-auto max-w-3xl px-6 py-14 text-center sm:py-16">
      <h2 class="sabay-display text-2xl font-bold text-[#07166b]">
        Our Mission
      </h2>
      <p class="mt-4 text-sm leading-5 text-[#4b5262]">
        To connect discerning travelers with the world's most extraordinary
        stays, transforming ordinary trips into unforgettable, soul-enriching
        journeys. We meticulously curate every property, ensuring a seamless
        blend of striking design, impeccable service, and profound connection to
        the local environment. Our goal is to redefine luxury
        travel—making it highly personalized, deeply sustainable, and
        effortlessly refined.
      </p>
    </section>

    <section class="bg-[#f7f6f5] px-6 py-14 sm:py-16">
      <div class="mx-auto max-w-6xl text-center">
        <h2 class="sabay-display text-2xl font-bold text-[#07166b]">
          The SabayStay Difference
        </h2>
        <p class="mt-1 text-xs text-[#5b6070]">What sets our curation apart.</p>

        <div class="mt-9 grid gap-4 md:grid-cols-3">
          <article
            v-for="difference in differences"
            :key="difference.title"
            class="rounded-lg bg-white px-6 py-5 shadow-[0_4px_14px_rgba(35,36,45,0.07)]"
          >
            <div
              :class="[
                'mx-auto flex h-10 w-10 items-center justify-center rounded-full text-xl',
                difference.iconClass,
              ]"
              aria-hidden="true"
            >
              {{ difference.icon }}
            </div>
            <h3 class="sabay-display mt-4 text-lg font-bold text-[#07166b]">
              {{ difference.title }}
            </h3>
            <p class="mt-1.5 text-xs leading-4 text-[#5a6070]">
              {{ difference.description }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-white px-6 py-14 sm:py-16">
      <div class="mx-auto max-w-6xl">
        <div class="text-center">
          <p
            class="text-xs font-semibold uppercase tracking-[0.2em] text-[#087d72]"
          >
            The people behind SabayStay
          </p>
          <h2 class="sabay-display mt-2 text-3xl font-bold text-[#07166b]">
            MEET OUR DEVELOPERS
          </h2>
          <p class="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#5b6070]">
            A small team with a shared belief that great technology should make
            beautiful travel feel effortless.
          </p>
        </div>

        <div class="mt-9 grid gap-5 md:grid-cols-3">
          <article
            v-for="developer in developers"
            :key="developer.name"
            class="group overflow-hidden rounded-lg border border-[#e5e6ea] bg-[#fafbfc] transition duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(29,47,82,0.1)]"
          >
            <div class="aspect-square overflow-hidden bg-[#e7edf4]">
              <img
                :src="developer.image"
                :alt="developer.name"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div class="p-5">
              <p
                class="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#087d72]"
              >
                {{ developer.role }}
              </p>
              <h3 class="sabay-display mt-2 text-2xl font-bold text-[#07166b]">
                {{ developer.name }}
              </h3>
              <p class="mt-2 text-xs leading-5 text-[#5a6070]">
                {{ developer.description }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-[#080d70] px-6 py-14 text-center text-white sm:py-16">
      <h2 class="sabay-display text-2xl font-bold">Join the Elite</h2>
      <p class="mx-auto mt-3 max-w-[430px] text-sm leading-5 text-[#c5c9f2]">
        Elevate your travel experiences. Register for a SabayStay membership to
        access our curated collection and exclusive concierge services.
      </p>
      <NuxtLink
        to="/auth/register"
        class="mt-5 inline-flex rounded-md bg-white px-5 py-3 text-xs font-semibold text-[#07166b] shadow-sm hover:bg-[#eef0ff]"
      >
        Register for Membership
      </NuxtLink>
    </section>
  </div>
</template>