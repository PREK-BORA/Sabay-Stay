<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-3xl font-serif font-bold text-gray-900">Revenue Overview</h1>
        <p class="text-gray-500 text-sm mt-1">Track your earnings, analyze trends, and optimize your pricing strategy.</p>
      </div>
      <div class="flex gap-3">
        <select class="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 font-medium">
          <option>Year to Date (2026)</option>
        </select>
        <button class="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 font-medium flex items-center gap-2">
          📥 Export
        </button>
      </div>
    </div>

    <!-- Stat Boxes -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <span class="text-xs text-gray-400 font-semibold block mb-2 uppercase tracking-wide">Total Earnings</span>
        <div class="flex items-baseline justify-between">
          <h3 class="text-3xl font-serif font-bold text-gray-900">$124,500</h3>
          <span class="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">+14.2% vs last period</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <span class="text-xs text-gray-400 font-semibold block mb-2 uppercase tracking-wide">Net Payouts</span>
        <div class="flex items-baseline justify-between">
          <h3 class="text-3xl font-serif font-bold text-gray-900">$108,315</h3>
          <span class="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">+12.5% vs last period</span>
        </div>
      </div>

      <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <span class="text-xs text-gray-400 font-semibold block mb-2 uppercase tracking-wide">Pending Payouts</span>
        <h3 class="text-3xl font-serif font-bold text-gray-900">$16,185</h3>
        <p class="text-xs text-gray-400 mt-1">Next payout: Oct 18, 2026 ($4,200) • <a href="#" class="underline">View details</a></p>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Revenue Over Time -->
      <div class="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <h2 class="font-serif text-lg font-bold text-gray-900">Revenue Over Time</h2>
          <div class="flex text-xs bg-gray-100 p-1 rounded-md">
            <button class="px-3 py-1 bg-white rounded shadow-xs font-semibold">Monthly</button>
            <button class="px-3 py-1 text-gray-500">Quarterly</button>
          </div>
        </div>
        <!-- Bar Chart Representation -->
        <div class="h-48 flex items-end justify-between gap-3 pt-6 border-b border-gray-100">
          <div v-for="(bar, i) in monthlyBars" :key="i" class="flex-1 flex flex-col items-center gap-2">
            <div :style="{ height: bar.height }" :class="bar.highlight ? 'bg-indigo-950' : 'bg-indigo-200'" class="w-full rounded-t-sm transition-all"></div>
            <span class="text-xs text-gray-400">{{ bar.month }}</span>
          </div>
        </div>
      </div>

      <!-- Revenue by Source + Smart Insights -->
      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 class="font-serif text-lg font-bold text-gray-900 mb-4">Revenue by Source</h2>
          <div class="space-y-3 text-xs">
            <div>
              <div class="flex justify-between mb-1">
                <span>SabayStay Direct</span>
                <span class="font-bold">65%</span>
              </div>
              <div class="w-full bg-gray-100 h-1.5 rounded-full"><div class="bg-indigo-950 h-full w-[65%]"></div></div>
            </div>
            <div>
              <div class="flex justify-between mb-1">
                <span>Partner Networks</span>
                <span class="font-bold">25%</span>
              </div>
              <div class="w-full bg-gray-100 h-1.5 rounded-full"><div class="bg-emerald-500 h-full w-[25%]"></div></div>
            </div>
            <div>
              <div class="flex justify-between mb-1">
                <span>Corporate Stays</span>
                <span class="font-bold">10%</span>
              </div>
              <div class="w-full bg-gray-100 h-1.5 rounded-full"><div class="bg-amber-400 h-full w-[10%]"></div></div>
            </div>
          </div>
        </div>

        <div class="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100">
          <h3 class="text-xs font-bold text-indigo-950 uppercase mb-2 flex items-center gap-1">✨ Smart Insights</h3>
          <p class="text-xs text-indigo-900 leading-relaxed">Based on upcoming local events, we suggest increasing your weekend rates for <strong>Villa Azul</strong> by 15% next month.</p>
        </div>
      </div>
    </div>

    <!-- Lower Section: Property Performance & Recent Payouts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Property Performance -->
      <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 class="font-serif text-lg font-bold text-gray-900 mb-4">Property Performance</h2>
        <div class="space-y-4">
          <div v-for="prop in properties" :key="prop.name" class="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-gray-200"></div>
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ prop.name }}</p>
                <p class="text-xs text-gray-400">{{ prop.location }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-gray-900">${{ prop.revenue }}</p>
              <p class="text-xs text-gray-400">{{ prop.bookings }} Bookings</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Payouts -->
      <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 class="font-serif text-lg font-bold text-gray-900 mb-4">Recent Payouts</h2>
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="text-gray-400 border-b border-gray-100">
              <th class="pb-2 font-medium">Date</th>
              <th class="pb-2 font-medium">Amount</th>
              <th class="pb-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="payout in payouts" :key="payout.date" class="border-b border-gray-50">
              <td class="py-3 text-gray-600">{{ payout.date }}</td>
              <td class="py-3 font-bold text-gray-900">${{ payout.amount }}</td>
              <td class="py-3">
                <span :class="payout.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'" class="px-2 py-0.5 rounded-full font-medium">
                  {{ payout.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const monthlyBars = ref([
  { month: 'Jan', height: '40%' },
  { month: 'Feb', height: '45%' },
  { month: 'Mar', height: '60%' },
  { month: 'Apr', height: '70%' },
  { month: 'May', height: '90%', highlight: true },
  { month: 'Jun', height: '80%' }
])

const properties = ref([
  { name: 'Villa Azul', location: 'Uluwatu, Bali', revenue: '62,400', bookings: 52 },
  { name: 'The Skyline Loft', location: 'Downtown, NY', revenue: '45,100', bookings: 38 },
  { name: 'Palm Hideaway', location: 'Tulum, MX', revenue: '17,000', bookings: 15 }
])

const payouts = ref([
  { date: 'Sep 15, 2026', amount: '8,450.00', status: 'Paid' },
  { date: 'Sep 01, 2026', amount: '9,200.00', status: 'Paid' },
  { date: 'Aug 15, 2026', amount: '12,100.00', status: 'Paid' }
])

definePageMeta({
  layout: 'owner'
})
</script>