<template>
  <div class="min-h-screen bg-[#f5f3ef]">
    <main class="mx-auto max-w-[1400px] px-4 pb-10 pt-0 md:px-6">
      <section class="relative overflow-hidden">
        <div
          class="absolute inset-0 bg-cover bg-center"
          style="
            background-image: url(&quot;https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80&quot;);
          "
        />
        <div
          class="absolute inset-0 bg-gradient-to-r from-[#071d36]/80 via-[#102b45]/35 to-[#102c45]/25"
        />

        <div class="relative px-5 pb-10 pt-12 md:px-10 md:pb-16 md:pt-16">
          <div class="mx-auto max-w-5xl pt-8 text-center text-white">
            <h1
              class="sabay-display text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-[6rem]"
            >
              Find your perfect staycation
            </h1>
            <p
              class="mx-auto mt-5 max-w-3xl text-base text-white/85 md:text-[1.7rem] md:leading-relaxed"
            >
              Discover hand-picked premium resorts and boutique hotels for your
              next unforgettable escape.
            </p>
          </div>

          <div
            class="mx-auto mt-10 max-w-5xl rounded-[1.5rem] bg-white/90 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur-sm md:p-5"
          >
            <div class="grid gap-3 md:grid-cols-[1.2fr_1fr_1fr_0.7fr]">
              <div
                class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left"
              >
                <span class="text-xl text-slate-500">📍</span>
                <div>
                  <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Location
                  </p>
                  <p class="mt-1 text-base text-slate-700">
                    Where are you going?
                  </p>
                </div>
              </div>

              <div
                class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left"
              >
                <span class="text-xl text-slate-500">📅</span>
                <div>
                  <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Dates
                  </p>
                  <p class="mt-1 text-base text-slate-700">
                    Check in — Check out
                  </p>
                </div>
              </div>

              <div
                class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left"
              >
                <span class="text-xl text-slate-500">👥</span>
                <div>
                  <p class="text-xs uppercase tracking-[0.18em] text-slate-400">
                    Guests
                  </p>
                  <p class="mt-1 text-base text-slate-700">
                    2 adults, 0 children
                  </p>
                </div>
              </div>

              <button
                class="rounded-xl bg-[#0d224a] px-4 py-4 text-lg font-semibold text-white shadow-lg shadow-[#0d224a]/20 hover:bg-[#0b1d3a]"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer
        class="mt-10 border-t border-slate-200 bg-white px-5 py-5 text-sm text-[#2d3a52] md:px-8"
      >
        <div
          class="mx-auto flex max-w-[1280px] flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div class="flex items-center gap-3 font-black text-[#1d2f52]">
            <span class="text-2xl">Sabay</span>
            <span class="text-xl font-medium">Stay</span>
          </div>

          <div class="flex flex-wrap items-center gap-5 text-[#3f4c68]">
            <a href="#" class="hover:text-[#0d224a]">Sitemap</a>
            <a href="#" class="hover:text-[#0d224a]">Newsletter</a>
            <a href="#" class="hover:text-[#0d224a]">Contact Us</a>
            <a href="#" class="hover:text-[#0d224a]">Privacy Policy</a>
            <a href="#" class="hover:text-[#0d224a]">Terms of Service</a>
          </div>

          <p class="text-[#4b5a74]">
            © 2024 SabayStay Premium Travel. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  </div>
</template>
