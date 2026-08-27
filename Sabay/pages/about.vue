<script setup lang="ts">
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
</script>

<template>
  <div class="bg-white text-[#202638]">
    <section
      class="relative flex min-h-107.5 items-center justify-center overflow-hidden text-center"
    >
      <img
        src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=85"
        alt="Luxury tropical resort overlooking the sea"
        class="absolute inset-0 h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-white/45" />
      <div
        class="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-white to-transparent"
      />
      <div class="relative z-10 mx-auto max-w-3xl px-6 pt-5">
        <h1
          class="sabay-display text-4xl font-bold leading-tight tracking-[-0.04em] text-[#07166b] sm:text-5xl"
        >
          Our Story: Elevating the Art of Travel
        </h1>
        <p class="mx-auto mt-3 max-w-130 text-sm leading-5 text-[#384055]">
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
        To connect discerning travelers with the world&apos;s most extraordinary
        stays, transforming ordinary trips into unforgettable, soul-enriching
        journeys. We meticulously curate every property, ensuring a seamless
        blend of striking design, impeccable service, and profound connection to
        the local environment. Our goal is to redefine luxury
        travel&mdash;making it highly personalized, deeply sustainable, and
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

    <section class="bg-[#080d70] px-6 py-14 text-center text-white sm:py-16">
      <h2 class="sabay-display text-2xl font-bold">Join the Elite</h2>
      <p class="mx-auto mt-3 max-w-107.5 text-sm leading-5 text-[#c5c9f2]">
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
