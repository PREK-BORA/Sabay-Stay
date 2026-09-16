<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { definePageMeta, useNuxtApp } from '#imports';
import { useAuth } from '~/composables/auth/useAuth';
import { useFavorites } from "~/composables/user/useFavorites";

definePageMeta({ layout: "user", middleware: "auth" });

const { user } = useAuth();
const { favorites } = useFavorites();
const { $db } = useNuxtApp() as any;
const bookingCount = ref(0);
const totalFavorites = computed(() => favorites.value.length);
const rewardPoints = computed(() => 500 + bookingCount.value * 1000);
let unsubscribe = () => {};

onMounted(() => {
  if (!$db || !user.value?.id) return;
  unsubscribe = onSnapshot(query(collection($db, "bookings"), where("userId", "==", user.value.id)), (snapshot) => {
    bookingCount.value = snapshot.docs.filter((item) => String(item.data().status || "").toLowerCase() !== "cancelled").length;
  });
});

onUnmounted(() => unsubscribe());
</script>

<template>

  <div class="space-y-8">
    <div>
      <h1 class="text-3xl font-serif font-bold text-slate-900">
        Welcome back, {{ user?.name || "Traveler" }}.
      </h1>
      <p class="mt-1 text-sm text-slate-500">
        Here is a summary of your recent travels and upcoming adventures.
      </p>
    </div>

    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div
        class="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Total Bookings
          </p>
          <p class="mt-3 text-3xl font-bold text-slate-900">
            {{ bookingCount }}
          </p>
        </div>
        <span
          class="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-xl text-indigo-600"
          >✈</span
        >
      </div>
      <div
        class="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-wider text-slate-400"
          >
            Saved Places
          </p>
          <p class="mt-3 text-3xl font-bold text-slate-900">
            {{ totalFavorites }}
          </p>
        </div>
        <span
          class="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-xl text-rose-500"
          >♡</span
        >
      </div>
      <div class="rounded-2xl bg-indigo-950 p-6 text-white shadow-md">
        <p
          class="text-xs font-semibold uppercase tracking-wider text-indigo-300"
        >
          Member Points
        </p>
        <p class="mt-3 text-3xl font-bold">
          {{ rewardPoints.toLocaleString() }}
        </p>
        <p class="mt-4 text-xs font-medium text-indigo-300">
          SabayStay Elite Tier
        </p>
      </div>
    </div>
  </div>
</template>
