<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuth } from "~/composables/auth/useAuth";

definePageMeta({ layout: "user", middleware: "auth" });

const { user, updateUser } = useAuth();
const name = ref("");
const email = ref("");
const phone = ref("");
const country = ref("");
const saved = ref(false);
const photoPreview = ref<string>("https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80");
const isUploading = ref(false);

onMounted(() => {
  const stored = JSON.parse(localStorage.getItem("sabaystay-user") || "null");
  name.value = stored?.name || user.value?.name || "";
  email.value = stored?.email || user.value?.email || "";
  phone.value = stored?.phone || "";
  country.value = stored?.country || "";
  if (stored?.photo) {
    photoPreview.value = stored.photo;
  }
});

function onPhotoChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  isUploading.value = true;
  const reader = new FileReader();
  reader.onload = () => {
    photoPreview.value = String(reader.result);
    isUploading.value = false;
  };
  reader.onerror = () => {
    isUploading.value = false;
  };
  reader.readAsDataURL(file);
}

function saveProfile() {
  const stored =
    JSON.parse(localStorage.getItem("sabaystay-user") || "null") || {};
  updateUser({
    ...stored,
    name: name.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    country: country.value.trim(),
    photo: photoPreview.value,
  });
  saved.value = true;
  window.setTimeout(() => (saved.value = false), 2500);
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-[#1d2f52]">My Profile</h1>
      <p class="mt-1 text-sm text-[#65728a]">
        Manage your personal information and preferences.
      </p>
    </div>

    <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
      <div class="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
        <div class="relative">
          <img
            :src="photoPreview"
            alt="Profile photo"
            class="h-28 w-28 rounded-full object-cover ring-4 ring-[#e5f0ed]"
          />
          <label
            for="photo-upload"
            class="absolute -bottom-1 -right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#0d224a] text-white shadow-md transition hover:bg-[#087d72]"
            title="Change photo"
          >
            <span aria-hidden="true">📷</span>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              class="hidden"
              @change="onPhotoChange"
            />
          </label>
        </div>
        <div class="text-center sm:text-left">
          <h2 class="text-xl font-bold text-[#0d224a]">Profile Photo</h2>
          <p class="mt-1 text-sm text-[#53637c]">
            JPG, PNG or GIF. Max 5MB.
          </p>
          <p v-if="isUploading" class="mt-2 text-xs text-[#087d72]">
            Uploading...
          </p>
        </div>
      </div>
    </section>

    <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8">
      <h2 class="text-lg font-bold text-[#0d224a]">Personal Information</h2>
      <form class="mt-6 grid gap-5 sm:grid-cols-2" @submit.prevent="saveProfile">
        <label class="text-sm font-medium text-[#1d2f52]">
          Full Name
          <input
            v-model="name"
            required
            class="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#f7f6f2] px-4 text-sm outline-none transition focus:border-[#087d72] focus:bg-white"
          />
        </label>
        <label class="text-sm font-medium text-[#1d2f52]">
          Email
          <input
            v-model="email"
            type="email"
            required
            class="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#f7f6f2] px-4 text-sm outline-none transition focus:border-[#087d72] focus:bg-white"
          />
        </label>
        <label class="text-sm font-medium text-[#1d2f52]">
          Phone
          <input
            v-model="phone"
            type="tel"
            required
            class="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#f7f6f2] px-4 text-sm outline-none transition focus:border-[#087d72] focus:bg-white"
          />
        </label>
        <label class="text-sm font-medium text-[#1d2f52]">
          Country
          <input
            v-model="country"
            required
            class="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-[#f7f6f2] px-4 text-sm outline-none transition focus:border-[#087d72] focus:bg-white"
          />
        </label>

        <div class="flex items-center gap-4 sm:col-span-2">
          <button
            type="submit"
            class="rounded-xl bg-[#0d224a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a1d3d]"
          >
            Save Changes
          </button>
          <span
            v-if="saved"
            class="text-sm font-medium text-emerald-700"
            role="status"
          >
            Profile saved successfully.
          </span>
        </div>
      </form>
    </section>
  </div>
</template>
