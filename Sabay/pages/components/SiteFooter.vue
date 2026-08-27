<script setup lang="ts">
const subscribe = () => undefined;
</script>

<template>
  <footer
    class="bg-[#f1efee] px-7 py-10 text-sm text-[#303545] sm:px-9 lg:py-11"
  >
    <div class="mx-auto max-w-6xl">
      <div class="grid gap-9 md:grid-cols-[1.7fr_1fr_1fr_1fr] lg:gap-12">
        <div>
          <NuxtLink
            to="/"
            class="sabay-display text-2xl font-bold text-[#07166b]"
          >
            SabayStay
          </NuxtLink>
          <p class="mt-2 max-w-75 text-sm leading-5 text-[#303545]">
            Curating extraordinary premium luxury travel experiences. Discover
            serene escapes and meticulously crafted journeys designed for the
            discerning traveler.
          </p>

          <form class="mt-7" @submit.prevent="subscribe">
            <label
              for="footer-email"
              class="text-xs font-semibold text-[#17191e]"
            >
              Subscribe to our newsletter
            </label>
            <div class="mt-2 flex max-w-77 gap-1.5">
              <input
                id="footer-email"
                type="email"
                placeholder="Email address"
                autocomplete="email"
                required
                class="h-10 min-w-0 flex-1 rounded-md border border-[#9da0aa] bg-white px-3 text-sm outline-none placeholder:text-[#687083] focus:border-[#080d70] focus:ring-1 focus:ring-[#080d70]"
              />
              <button
                type="submit"
                class="h-10 rounded-md bg-[#080d70] px-4 text-xs font-semibold text-white hover:bg-[#11198e]"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>

        <div>
          <h2 class="sabay-display text-xl font-bold text-[#171717]">
            Company
          </h2>
          <nav
            class="mt-3 flex flex-col gap-3 text-sm"
            aria-label="Company links"
          >
            <NuxtLink to="/about" class="hover:text-[#07166b]">About</NuxtLink>
            <NuxtLink to="/services" class="hover:text-[#07166b]"
              >Services</NuxtLink
            >
            <a href="#" class="hover:text-[#07166b]">Careers</a>
          </nav>
        </div>

        <div>
          <h2 class="sabay-display text-xl font-bold text-[#171717]">
            Discovery
          </h2>
          <nav
            class="mt-3 flex flex-col gap-3 text-sm"
            aria-label="Discovery links"
          >
            <NuxtLink to="/hotels" class="hover:text-[#07166b]"
              >Hotels</NuxtLink
            >
            <NuxtLink to="/destinations" class="hover:text-[#07166b]"
              >Destinations</NuxtLink
            >
            <NuxtLink to="/experiences" class="hover:text-[#07166b]"
              >Experiences</NuxtLink
            >
          </nav>
        </div>

        <div>
          <h2 class="sabay-display text-xl font-bold text-[#171717]">
            Support
          </h2>
          <nav
            class="mt-3 flex flex-col gap-3 text-sm"
            aria-label="Support links"
          >
            <NuxtLink to="/contact" class="hover:text-[#07166b]"
              >Contact</NuxtLink
            >
            <NuxtLink to="/help" class="hover:text-[#07166b]">FAQ</NuxtLink>
            <NuxtLink to="/help" class="hover:text-[#07166b]"
              >Help Center</NuxtLink
            >
          </nav>
        </div>
      </div>

      <div
        class="mt-9 flex flex-col gap-5 border-t border-[#d9d7d8] pt-6 text-xs sm:flex-row sm:items-center sm:justify-between"
      >
        <p>© 2024 SabayStay Premium Travel. All rights reserved.</p>
        <nav class="flex flex-wrap gap-x-5 gap-y-2" aria-label="Legal links">
          <a href="#" class="hover:text-[#07166b]">Sitemap</a>
          <a href="#" class="hover:text-[#07166b]">Privacy Policy</a>
          <a href="#" class="hover:text-[#07166b]">Terms of Service</a>
        </nav>
        <div class="flex gap-3" aria-label="Social links">
          <a
            href="#"
            aria-label="Website"
            class="flex h-8 w-8 items-center justify-center rounded-full border border-[#8f9098] text-base hover:border-[#07166b] hover:text-[#07166b]"
            >◉</a
          >
          <a
            href="#"
            aria-label="Chat"
            class="flex h-8 w-8 items-center justify-center rounded-full border border-[#8f9098] text-base hover:border-[#07166b] hover:text-[#07166b]"
            >□</a
          >
          <a
            href="#"
            aria-label="Instagram"
            class="flex h-8 w-8 items-center justify-center rounded-full border border-[#8f9098] text-base hover:border-[#07166b] hover:text-[#07166b]"
            >▣</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>
