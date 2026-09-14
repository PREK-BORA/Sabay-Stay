<script setup lang="ts">
import { useHotels } from '~/composables/useHotels'

const { hotels, loading, deleteHotel } = useHotels()

// Confirm before delete
const handleDelete = async (id: number, name: string) => {
  if (confirm(`តើអ្នកប្រាកដថាចង់លុបសណ្ឋាគារ "${name}" នេះមែនទេ?`)) {
    await deleteHotel(id)
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
      <div>
        <h3 class="font-serif font-bold text-slate-900 text-lg">Hotel Management</h3>
        <p class="text-xs text-slate-400">គ្រប់គ្រងបញ្ជីសណ្ឋាគារទាំងអស់ក្នុងប្រព័ន្ធ</p>
      </div>
      <NuxtLink 
        to="/admin/hotels/new" 
        class="px-4 py-2 bg-indigo-900 text-white rounded-xl text-xs font-semibold hover:bg-indigo-800 transition-colors shadow-sm"
      >
        + Add Hotel
      </NuxtLink>
    </div>

    <!-- Table Content -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm text-slate-600">
        <thead class="bg-slate-50 text-xs uppercase text-slate-400 font-semibold border-b border-slate-100">
          <tr>
            <th class="px-6 py-3">Hotel</th>
            <th class="px-6 py-3">Location</th>
            <th class="px-6 py-3">Price / Night</th>
            <th class="px-6 py-3">Rating</th>
            <th class="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        
        <tbody class="divide-y divide-slate-100">
          <!-- Loading State -->
          <tr v-if="loading">
            <td colspan="5" class="px-6 py-8 text-center text-slate-400 text-sm">
              ⏳ កំពុងទាញយកទិន្នន័យសណ្ឋាគារ...
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-else-if="!hotels || hotels.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-slate-400 text-sm">
              🏨 មិនទាន់មានទិន្នន័យសណ្ឋាគារនៅឡើយទេ។
            </td>
          </tr>

          <!-- Data List -->
          <tr 
            v-else 
            v-for="h in hotels" 
            :key="h.id" 
            class="hover:bg-slate-50/50 transition-colors"
          >
            <!-- Image & Name -->
            <td class="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
              <img 
                v-if="h.image" 
                :src="h.image" 
                :alt="h.name"
                class="w-10 h-10 rounded-lg object-cover border border-slate-100" 
              />
              <div v-else class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                🏨
              </div>
              <span>{{ h.name || 'N/A' }}</span>
            </td>

            <td class="px-6 py-4 text-xs">{{ h.location || 'N/A' }}</td>
            <td class="px-6 py-4 font-bold text-slate-900">${{ h.price || 0 }}</td>
            <td class="px-6 py-4">
              <span class="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold">
                ★ {{ h.rating || '4.8' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right space-x-3">
              <!-- Edit Link -->
              <NuxtLink 
                :to="`/admin/hotels/${h.id}`" 
                class="text-indigo-600 hover:text-indigo-800 text-xs font-semibold"
              >
                Edit
              </NuxtLink>

              <!-- Delete Button -->
              <button 
                @click="handleDelete(h.id, h.name)" 
                class="text-rose-600 hover:text-rose-800 text-xs font-semibold cursor-pointer"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>