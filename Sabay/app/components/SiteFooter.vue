<script setup lang="ts">
import { ref } from "vue";
import { Globe, MessageSquare, Instagram, Send } from "lucide-vue-next";

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
    class="border-t border-slate-200 bg-slate-100 px-4 py-10 font-normal text-slate-800 sm:px-6 md:py-12 lg:px-8"
  >
    <div class="mx-auto max-w-7xl">
      <div
        class="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_1fr_1fr] lg:gap-12"
      >
        <div>
          <NuxtLink
            to="/"
            class="text-xl font-bold tracking-tight text-[#07166b]"
          >
            Sabay<span class="font-normal">Stay</span>
          </NuxtLink>
          <p
            class="mt-3 max-w-sm text-xs font-normal leading-relaxed text-slate-600"
          >
            Curating extraordinary premium luxury travel experiences. Discover
            serene escapes and meticulously crafted journeys designed for the
            discerning traveler.
          </p>

          <form class="mt-6" @submit.prevent="subscribe">
            <label
              for="footer-email"
              class="block text-xs font-normal text-slate-900"
            >
              Subscribe to our newsletter
            </label>
            <div class="mt-2 flex max-w-sm">
              <input
                id="footer-email"
                v-model="email"
                type="email"
                required
                placeholder="Email address"
                class="min-w-0 flex-1 rounded-l-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-normal text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#07166b] focus:ring-1 focus:ring-[#07166b]"
              />
              <button
                type="submit"
                class="inline-flex items-center gap-1.5 rounded-r-lg bg-[#07166b] px-4 py-2 text-xs font-normal text-white transition hover:bg-[#07166b]/90"
              >
                <span>Subscribe</span>
                <Send class="h-3 w-3" />
              </button>
            </div>
            <p
              v-if="isSubscribed"
              class="mt-2 text-xs font-normal text-emerald-600"
              role="status"
            >
              Thank you for subscribing.
            </p>
          </form>
        </div>

        <nav aria-label="Company" class="flex flex-col gap-2.5 text-xs font-normal">
          <h2 class="mb-1 text-sm font-bold text-slate-900">
            Company
          </h2>
          <NuxtLink to="/" class="text-slate-600 hover:text-[#07166b]">Home</NuxtLink>
          <NuxtLink to="/about" class="text-slate-600 hover:text-[#07166b]">About</NuxtLink>
          <NuxtLink to="/services" class="text-slate-600 hover:text-[#07166b]">Services</NuxtLink>
          <NuxtLink to="/offers" class="text-slate-600 hover:text-[#07166b]">Offers</NuxtLink>
          <a href="#" class="text-slate-600 hover:text-[#07166b]">Careers</a>
        </nav>

        <nav aria-label="Discovery" class="flex flex-col gap-2.5 text-xs font-normal">
          <h2 class="mb-1 text-sm font-bold text-slate-900">
            Discovery
          </h2>
          <NuxtLink to="/hotels" class="text-slate-600 hover:text-[#07166b]">Hotels</NuxtLink>
          <NuxtLink to="/destinations" class="text-slate-600 hover:text-[#07166b]">Destinations</NuxtLink>
          <NuxtLink to="/experiences" class="text-slate-600 hover:text-[#07166b]">Experiences</NuxtLink>
        </nav>

        <nav aria-label="Support" class="flex flex-col gap-2.5 text-xs font-normal">
          <h2 class="mb-1 text-sm font-bold text-slate-900">
            Support
          </h2>
          <NuxtLink to="/contact" class="text-slate-600 hover:text-[#07166b]">Contact</NuxtLink>
          <NuxtLink to="/help" class="text-slate-600 hover:text-[#07166b]">FAQ</NuxtLink>
          <NuxtLink to="/help" class="text-slate-600 hover:text-[#07166b]">Help Center</NuxtLink>
        </nav>
      </div>

      <div
        class="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 text-xs font-normal text-slate-500 md:flex-row md:items-center md:justify-between"
      >
        <p>© 2026 SabayStay Premium Travel. All rights reserved.</p>

        <nav aria-label="Legal navigation" class="flex gap-4">
          <NuxtLink to="/" class="hover:text-[#07166b]">Sitemap</NuxtLink>
          <a href="#" class="hover:text-[#07166b]">Privacy Policy</a>
          <a href="#" class="hover:text-[#07166b]">Terms of Service</a>
        </nav>

        <div class="flex gap-2" aria-label="Social links">
          <a
            href="#"
            aria-label="Website"
            title="Website"
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:border-[#07166b] hover:text-[#07166b]"
          >
            <Globe class="h-4 w-4" />
          </a>
          <a
            href="#"
            aria-label="Message"
            title="Message"
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:border-[#07166b] hover:text-[#07166b]"
          >
            <MessageSquare class="h-4 w-4" />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            title="Instagram"
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition hover:border-[#07166b] hover:text-[#07166b]"
          >
            <Instagram class="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>