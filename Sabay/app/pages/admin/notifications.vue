<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { definePageMeta, useNuxtApp } from "#imports";

definePageMeta({ layout: "admin", middleware: "admin" });

interface AdminNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  time: string;
}

const { $db } = useNuxtApp() as any;
const notifications = ref<AdminNotification[]>([]);
const loading = ref(true);
let unsubscribe = () => {};
const unreadCount = computed(() => notifications.value.filter((item) => !item.isRead).length);

function formatTime(value: any) {
  const date = value?.toDate?.() || (value ? new Date(value) : null);
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleString() : "Just now";
}

async function markRead(id: string) {
  const notification = notifications.value.find((item) => item.id === id);
  if (notification && !notification.isRead && $db) await updateDoc(doc($db, "notifications", id), { isRead: true });
}

async function markAllRead() {
  await Promise.all(notifications.value.filter((item) => !item.isRead).map((item) => markRead(item.id)));
}

onMounted(() => {
  if (!$db) { loading.value = false; return; }
  unsubscribe = onSnapshot(query(collection($db, "notifications"), where("recipientId", "==", "admin")), (snapshot) => {
    notifications.value = snapshot.docs.map((item) => {
      const data = item.data();
      return { id: item.id, title: String(data.title || "Notification"), message: String(data.message || ""), isRead: Boolean(data.isRead), time: formatTime(data.createdAt) };
    });
    loading.value = false;
  }, () => { loading.value = false; });
});

onUnmounted(() => unsubscribe());
</script>

<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div><h1 class="text-3xl font-bold text-slate-900">Notifications</h1><p class="mt-1 text-sm text-slate-500">New booking requests and account activity.</p></div>
      <button v-if="unreadCount" type="button" class="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700" @click="markAllRead">Mark all as read</button>
    </div>
    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <p v-if="loading" class="p-8 text-center text-sm text-slate-500">Loading notifications...</p>
      <p v-else-if="!notifications.length" class="p-8 text-center text-sm text-slate-500">No admin notifications yet.</p>
      <button v-for="item in notifications" :key="item.id" type="button" class="flex w-full items-start gap-4 border-b border-slate-100 p-5 text-left last:border-0" :class="item.isRead ? 'bg-white' : 'bg-amber-50/50'" @click="markRead(item.id)">
        <span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" :class="item.isRead ? 'bg-slate-300' : 'bg-amber-500'" />
        <span class="min-w-0 flex-1"><span class="block font-bold text-slate-900">{{ item.title }}</span><span class="mt-1 block text-sm text-slate-600">{{ item.message }}</span><span class="mt-2 block text-xs text-slate-400">{{ item.time }}</span></span>
      </button>
    </div>
  </section>
</template>
