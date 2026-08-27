<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-serif font-bold text-gray-900">Earnings & Financials</h1>
        <p class="text-sm text-gray-500 mt-1">Track revenue performance and payment payouts.</p>
      </div>

      <div class="flex items-center gap-3">
        <select v-model="selectedYear" class="bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-2 text-sm outline-none">
          <option value="2026">Year 2026</option>
          <option value="2025">Year 2025</option>
        </select>
        <button class="px-4 py-2 bg-indigo-950 text-white text-sm font-medium rounded-xl shadow-sm hover:bg-indigo-900">
          Download Report
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Gross Revenue</span>
        <div class="text-3xl font-serif font-bold text-gray-900 mt-2">$24,850.00</div>
        <div class="text-xs text-emerald-600 mt-1 font-medium">↑ +14.2% from last month</div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Net Payout Received</span>
        <div class="text-3xl font-serif font-bold text-emerald-700 mt-2">$21,122.50</div>
        <div class="text-xs text-gray-400 mt-1">After 15% platform commission</div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Payout</span>
        <div class="text-3xl font-serif font-bold text-amber-600 mt-2">$3,727.50</div>
        <div class="text-xs text-gray-400 mt-1">Scheduled for Sep 01, 2026</div>
      </div>
    </div>

    <!-- Payout History Table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-lg font-serif font-bold text-gray-900">Payout History</h2>
      </div>

      <table class="w-full text-left border-collapse text-sm">
        <thead>
          <tr class="bg-gray-50 text-xs text-gray-400 border-b border-gray-100 uppercase tracking-wider">
            <th class="py-3 px-6 font-medium">Payout ID</th>
            <th class="py-3 px-6 font-medium">Date</th>
            <th class="py-3 px-6 font-medium">Method</th>
            <th class="py-3 px-6 font-medium">Gross Amount</th>
            <th class="py-3 px-6 font-medium">Net Payout</th>
            <th class="py-3 px-6 font-medium text-right">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="payout in payouts" :key="payout.id" class="hover:bg-gray-50/50 transition-colors">
            <td class="py-4 px-6 font-medium text-gray-900">{{ payout.id }}</td>
            <td class="py-4 px-6 text-gray-600">{{ payout.date }}</td>
            <td class="py-4 px-6 text-gray-600">{{ payout.method }}</td>
            <td class="py-4 px-6 font-medium text-gray-900">${{ payout.gross }}</td>
            <td class="py-4 px-6 font-bold text-emerald-700">${{ payout.net }}</td>
            <td class="py-4 px-6 text-right">
              <span 
                :class="payout.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
                class="px-2.5 py-1 text-xs rounded-full font-medium"
              >
                {{ payout.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'owner'
})

const selectedYear = ref('2026')

const payouts = ref([
  { id: 'PO-8821', date: '2026-08-01', method: 'Direct Bank Transfer (****4821)', gross: '8,500.00', net: '7,225.00', status: 'Completed' },
  { id: 'PO-7712', date: '2026-07-01', method: 'Direct Bank Transfer (****4821)', gross: '7,800.00', net: '6,630.00', status: 'Completed' },
  { id: 'PO-6603', date: '2026-06-01', method: 'Direct Bank Transfer (****4821)', gross: '8,550.00', net: '7,267.50', status: 'Completed' }
])
</script>