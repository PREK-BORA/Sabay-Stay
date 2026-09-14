<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
const isSubscribed = ref(false);

function subscribe() {
  if (!email.value.trim()) return;

  isSubscribed.value = true;
  email.value = "";
}
</script>

<template>
  <footer
    class="border-t border-[#e2dfe1] bg-[#f3f0f2] px-5 py-10 text-[#171c31] md:px-9 md:py-11"
  >
    <div class="mx-auto max-w-[1200px]">
      <div
        class="grid gap-9 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr] lg:gap-12"
      >
        <div>
          <NuxtLink
            to="/"
            class="sabay-display text-[1.55rem] font-bold tracking-[-0.06em] text-[#07166b]"
          >
            Sabay<span class="font-sans font-semibold tracking-[-0.04em]"
              >Stay</span
            >
          </NuxtLink>
          <p
            class="mt-2 max-w-[290px] text-[15px] leading-[1.4] text-[#30364b]"
          >
            Curating extraordinary premium luxury travel experiences. Discover
            serene escapes and meticulously crafted journeys designed for the
            discerning traveler.
          </p>

          <form class="mt-7" @submit.prevent="subscribe">
            <label
              for="footer-email"
              class="text-[15px] font-semibold tracking-[0.04em] text-[#171c31]"
            >
              Subscribe to our newsletter
            </label>
            <div class="mt-2 flex max-w-[308px]">
              <input
                id="footer-email"
                v-model="email"
                type="email"
                required
                placeholder="Email address"
                class="min-w-0 flex-1 rounded-l-sm border border-[#9da0ad] bg-[#faf8f9] px-3 py-2.5 text-xs text-[#1c2238] outline-none placeholder:text-[#697188] focus:border-[#07166b]"
              />
              <button
                type="submit"
                class="rounded-r-sm bg-[#07166b] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#0d278a]"
              >
                Subscribe
              </button>
            </div>
            <p
              v-if="isSubscribed"
              class="mt-2 text-xs text-[#087d72]"
              role="status"
            >
              Thank you for subscribing.
            </p>
          </form>
        </div>

        <nav aria-label="Company" class="flex flex-col gap-2.5 text-[15px]">
          <h2 class="sabay-display mb-1 text-lg font-bold text-[#171717]">
            Company
          </h2>
          <NuxtLink to="/about" class="hover:text-[#07166b]">About</NuxtLink>
          <NuxtLink to="/services" class="hover:text-[#07166b]"
            >Services</NuxtLink
          >
          <NuxtLink to="/offers" class="hover:text-[#07166b]">Offers</NuxtLink>
          <a href="#" class="hover:text-[#07166b]">Careers</a>
        </nav>

        <nav aria-label="Discovery" class="flex flex-col gap-2.5 text-[13px]">
          <h2 class="sabay-display mb-1 text-lg font-bold text-[#171717]">
            Discovery
          </h2>
          <NuxtLink to="/hotels" class="hover:text-[#07166b]">Hotels</NuxtLink>
          <NuxtLink to="/destinations" class="hover:text-[#07166b]"
            >Destinations</NuxtLink
          >
          <NuxtLink to="/experiences" class="hover:text-[#07166b]"
            >Experiences</NuxtLink
          >
        </nav>

        <nav aria-label="Support" class="flex flex-col gap-2.5 text-[13px]">
          <h2 class="sabay-display mb-1 text-lg font-bold text-[#171717]">
            Support
          </h2>
          <NuxtLink to="/contact" class="hover:text-[#07166b]"
            >Contact</NuxtLink
          >
          <NuxtLink to="/help" class="hover:text-[#07166b]">FAQ</NuxtLink>
          <NuxtLink to="/help" class="hover:text-[#07166b]"
            >Help Center</NuxtLink
          >
        </nav>
      </div>

      <div
        class="mt-9 flex flex-col gap-5 border-t border-[#dedbde] pt-6 text-[15px] tracking-[0.03em] text-[#171c31] md:flex-row md:items-center md:justify-between"
      >
        <p>© 2024 SabayStay Premium Travel. All rights reserved.</p>
        <nav aria-label="Legal navigation" class="flex gap-5">
          <NuxtLink to="/" class="hover:text-[#07166b]">Sitemap</NuxtLink>
          <a href="#" class="hover:text-[#07166b]">Privacy Policy</a>
          <a href="#" class="hover:text-[#07166b]">Terms of Service</a>
        </nav>
        <div class="flex gap-3" aria-label="Social links">
          <a
            href="#"
            aria-label="Website"
            title="Website"
            class="flex h-8 w-8 items-center justify-center rounded-full border border-[#8b8e9c] text-base hover:border-[#07166b] hover:text-[#07166b]"
            >◎</a
          >
          <a
            href="#"
            aria-label="Message"
            title="Message"
            class="flex h-8 w-8 items-center justify-center rounded-full border border-[#8b8e9c] text-base hover:border-[#07166b] hover:text-[#07166b]"
            >□</a
          >
          <a
            href="#"
            aria-label="Instagram"
            title="Instagram"
            class="flex h-8 w-8 items-center justify-center rounded-full border border-[#8b8e9c] text-base hover:border-[#07166b] hover:text-[#07166b]"
            >▣</a
          >
        </div>
      </div>
    </div>
  </footer>
</template>
