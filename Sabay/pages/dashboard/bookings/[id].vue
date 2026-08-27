<script setup lang="ts">
const printReceipt = () => window.print();
</script>

<template>
  <div class="confirmation-page px-5 py-9 md:px-8 md:py-12">
    <section class="mx-auto max-w-140 text-center">
      <div
        class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#4be8d3] shadow-[0_8px_18px_rgba(75,232,211,0.22)]"
        aria-label="Booking confirmed"
      >
        <span
          class="flex h-9 w-9 items-center justify-center rounded-full border-4 border-[#087d72] text-2xl font-bold leading-none text-[#087d72]"
          aria-hidden="true"
        >
          ✓
        </span>
      </div>
      <h1
        class="sabay-display mt-6 text-4xl font-bold leading-tight tracking-[-0.04em] text-[#07166b] md:text-[42px]"
      >
        Your booking is confirmed!
      </h1>
      <p class="mt-2 text-sm text-[#293149] md:text-base">
        We&apos;ve sent a confirmation email to you with all the details.
      </p>
      <p
        class="mx-auto mt-4 w-fit rounded-full bg-[#e1e0ff] px-3.5 py-1.5 text-[11px] font-semibold text-[#07166b]"
      >
        Booking Ref: #SBY-847291
      </p>
    </section>

    <section class="mx-auto mt-9 grid max-w-140 gap-4 md:grid-cols-[1fr_174px]">
      <article
        class="overflow-hidden rounded-lg bg-white shadow-[0_5px_18px_rgba(31,33,48,0.06)]"
      >
        <img
          src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85"
          alt="The Azure Retreat villa at sunset"
          class="h-35 w-full object-cover md:h-35"
        />
        <div class="p-4.5 px-4.5 pb-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="sabay-display text-xl font-bold text-[#07166b]">
                The Azure Retreat
              </h2>
              <p class="mt-0.5 text-[11px] text-[#263048]">⌖ Bali, Indonesia</p>
            </div>
            <span
              class="rounded-full bg-[#efeeee] px-2.5 py-1 text-[10px] text-[#30313c]"
            >
              Premium Villa
            </span>
          </div>

          <div class="my-3 border-t border-[#dedde0]" />
          <div class="grid grid-cols-2 gap-4 text-[11px] text-[#697083]">
            <div>
              <p>Check-in</p>
              <p class="mt-1 text-xs leading-4 text-[#202638]">
                Oct 15, 2024<br />3:00 PM
              </p>
            </div>
            <div>
              <p>Check-out</p>
              <p class="mt-1 text-xs leading-4 text-[#202638]">
                Oct 20, 2024<br />11:00 AM
              </p>
            </div>
          </div>
        </div>
      </article>

      <aside class="rounded-lg bg-[#f4f2f2] p-4.5 px-4.5 py-5">
        <h2
          class="sabay-display text-[25px] font-bold leading-[1.1] text-[#07166b]"
        >
          Order<br />Summary
        </h2>
        <div class="mt-5 space-y-3 text-[11px] text-[#323748]">
          <div class="flex justify-between gap-3">
            <span>2 Guests</span><span>5 Nights</span>
          </div>
          <div class="flex justify-between gap-3">
            <span>Premium Villa<br />x 5</span><span>$1,250.00</span>
          </div>
          <div class="flex justify-between gap-3">
            <span>Taxes &amp; Fees</span><span>$187.50</span>
          </div>
        </div>
        <div class="my-5 border-t border-[#c7c6cb]" />
        <div
          class="flex items-center justify-between gap-3 text-[11px] font-semibold text-[#10131d]"
        >
          <span>Total Paid</span
          ><strong class="sabay-display text-xl text-[#07166b]"
            >$1,437.50</strong
          >
        </div>
        <p class="mt-1 text-right text-[10px] font-medium text-[#087d72]">
          Payment successful
        </p>
      </aside>
    </section>

    <div class="mx-auto mt-8 flex max-w-140 flex-wrap justify-center gap-3">
      <NuxtLink
        to="/dashboard/bookings"
        class="inline-flex items-center gap-2 rounded-md bg-[#080d70] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_5px_12px_rgba(8,13,112,0.18)] hover:bg-[#11198e]"
      >
        <span aria-hidden="true">▣</span> View My Bookings
      </NuxtLink>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-md border border-[#378c88] px-5 py-2.5 text-xs font-semibold text-[#176b67] hover:bg-white"
        @click="printReceipt"
      >
        <span aria-hidden="true">▤</span> Print Receipt
      </button>
    </div>
  </div>
</template>
