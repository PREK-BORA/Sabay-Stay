<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuth } from "~/composables/auth/useAuth";
import { navigateTo, useNuxtApp } from "#imports";
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  doc, 
  updateDoc, 
  type Firestore 
} from "firebase/firestore";
import { User, LogOut, Bell, Info } from "lucide-vue-next";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: any;
}

const route = useRoute();
const { $db } = useNuxtApp();
const db = $db as Firestore | undefined;
const { isLoggedIn, user, logout } = useAuth();

const isAccountMenuOpen = ref(false);
const isNotificationOpen = ref(false);
const notifications = ref<NotificationItem[]>([]);
const navbarRef = ref<HTMLElement | null>(null);

let stopNotificationListener: (() => void) | undefined;

const navItems = [
  { name: "Home", path: "/" },
  { name: "Hotels", path: "/hotels" },
  { name: "Destinations", path: "/destinations" },
  { name: "Experiences", path: "/experiences" },
  { name: "Offers", path: "/offers" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const userInitial = computed(() =>
  (user.value?.name?.trim().charAt(0) || "U").toUpperCase()
);

const unreadCount = computed(() => 
  notifications.value.filter((n) => !n.isRead).length
);

const isBookingConfirmation = computed(() =>
  route.path.startsWith("/dashboard/bookings/")
);

const isRegisterPage = computed(() => route.path === "/auth/register");
const isLoginPage = computed(() => route.path === "/auth/login");

const isActiveLink = (path: string) => {
  if (path === "/") {
    return route.path === "/";
  }
  return route.path === path || route.path.startsWith(path + "/");
};

function toggleNotificationMenu() {
  isNotificationOpen.value = !isNotificationOpen.value;
  if (isNotificationOpen.value) {
    isAccountMenuOpen.value = false;
  }
}

function toggleAccountMenu() {
  isAccountMenuOpen.value = !isAccountMenuOpen.value;
  if (isAccountMenuOpen.value) {
    isNotificationOpen.value = false;
  }
}

function logoutUser() {
  logout();
  isAccountMenuOpen.value = false;
  isNotificationOpen.value = false;
  navigateTo("/");
}

// Mark single notification as read in Firestore
async function markAsRead(id: string) {
  if (!db) return;
  try {
    const docRef = doc(db, "notifications", id);
    await updateDoc(docRef, { isRead: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
}

// Close menus when clicking outside navbar
function handleClickOutside(event: MouseEvent) {
  if (navbarRef.value && !navbarRef.value.contains(event.target as Node)) {
    isNotificationOpen.value = false;
    isAccountMenuOpen.value = false;
  }
}

// Setup real-time notifications
function setupNotificationListener() {
  if (!db || !user.value?.id) return;

  // Clear existing listener if any
  stopNotificationListener?.();

  const q = query(
    collection(db, "notifications"),
    where("recipientId", "==", user.value.id)
  );

  stopNotificationListener = onSnapshot(q, (snapshot) => {
    notifications.value = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      title: String(docSnap.data().title || "Notification"),
      message: String(docSnap.data().message || ""),
      isRead: Boolean(docSnap.data().isRead),
      createdAt: docSnap.data().createdAt,
    }));
  });
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  setupNotificationListener();
});

// Re-subscribe if user switches or loads late
watch(() => user.value?.id, () => {
  setupNotificationListener();
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  stopNotificationListener?.();
});
</script>

<template>
  <nav
    v-if="!isBookingConfirmation && !isRegisterPage && !isLoginPage"
    ref="navbarRef"
    class="border-b bg-white relative z-50"
  >
    <div
      class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6"
    >
      <!-- Logo -->
      <NuxtLink to="/" class="text-2xl font-bold text-[#0c2349]">
        SabayStay
      </NuxtLink>

      <!-- Navigation -->
      <div class="flex items-center gap-8">
        <NuxtLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="relative py-2 text-sm transition-all duration-200"
          :class="
            isActiveLink(item.path)
              ? 'font-bold text-[#0c2349] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[#0c2349] after:content-[\'\']'
              : 'text-gray-600 hover:text-[#0c2349]'
          "
        >
          {{ item.name }}
        </NuxtLink>
      </div>

      <!-- Right side -->
      <div class="flex items-center gap-4">
        <!-- Authenticated -->
        <template v-if="isLoggedIn">
          <!-- Notification Button with Dropdown -->
          <div class="relative">
            <button
              @click.stop="toggleNotificationMenu"
              class="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none"
              aria-label="Notifications"
            >
              <Bell class="h-5 w-5 text-gray-700" />
              <span
                v-if="unreadCount > 0"
                class="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>

            <!-- Notifications Dropdown Menu -->
            <div
              v-if="isNotificationOpen"
              class="absolute right-0 z-50 mt-2 w-80 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl"
            >
              <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                <div class="flex items-center gap-2">
                  <h3 class="font-bold text-slate-900 text-sm">Notifications</h3>
                  <span
                    v-if="unreadCount > 0"
                    class="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700"
                  >
                    {{ unreadCount }} new
                  </span>
                </div>

                <NuxtLink
                  to="/dashboard/notifications"
                  @click="isNotificationOpen = false"
                  class="text-xs font-semibold text-amber-600 hover:underline"
                >
                  View all
                </NuxtLink>
              </div>

              <!-- Notifications list -->
              <div class="mt-3 max-h-72 overflow-y-auto space-y-2">
                <p v-if="!notifications.length" class="py-6 text-center text-xs text-gray-400">
                  No notifications found.
                </p>

                <div
                  v-for="item in notifications.slice(0, 5)"
                  :key="item.id"
                  @click="markAsRead(item.id)"
                  class="group flex items-start gap-2.5 rounded-xl p-2.5 text-xs transition cursor-pointer hover:bg-gray-50"
                  :class="!item.isRead ? 'bg-amber-50/50' : ''"
                >
                  <Info class="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <div class="flex-1">
                    <p class="font-semibold text-slate-800">{{ item.title }}</p>
                    <p class="mt-0.5 text-slate-500 line-clamp-2 leading-relaxed">{{ item.message }}</p>
                  </div>
                  <span
                    v-if="!item.isRead"
                    class="h-2 w-2 rounded-full bg-amber-500 shrink-0 mt-1"
                    title="Unread"
                  ></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Account Dropdown Trigger -->
          <div class="relative">
            <button
              @click.stop="toggleAccountMenu"
              class="flex items-center gap-2 rounded-full border px-3 py-1.5 transition hover:bg-gray-50"
            >
              <span
                class="flex h-8 w-8 items-center justify-center rounded-full bg-[#0c2349] text-sm font-semibold text-white"
              >
                {{ userInitial }}
              </span>

              <span class="text-sm font-medium text-gray-700">
                {{ user?.name || "Account" }}
              </span>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="isAccountMenuOpen"
              class="absolute right-0 z-50 mt-2 w-48 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl"
            >
              <NuxtLink
                to="/dashboard"
                @click="isAccountMenuOpen = false"
                class="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
              >
                <User class="h-4 w-4 text-gray-500" />
                <span>Profile</span>
              </NuxtLink>

              <button
                @click="logoutUser"
                class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut class="h-4 w-4 text-red-500" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </template>

        <!-- Guest Links -->
        <template v-else>
          <NuxtLink
            to="/auth/login"
            class="text-sm font-medium text-gray-700 hover:text-[#0c2349]"
          >
            Login
          </NuxtLink>

          <NuxtLink
            to="/auth/register"
            class="rounded-lg bg-[#0c2349] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#183765]"
          >
            Register
          </NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>