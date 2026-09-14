<script setup lang="ts">
import { onMounted, ref } from "vue";

definePageMeta({ layout: "user", middleware: "auth" });

interface Review {
  id: string;
  property: string;
  text: string;
  rating: number;
  createdAt: string;
}

const reviewText = ref("");
const rating = ref(5);
const hoverRating = ref(0);
const submitted = ref(false);
const reviews = ref<Review[]>([]);

onMounted(() => {
  const stored = localStorage.getItem("sabaystay-reviews");
  if (stored) {
    try {
      reviews.value = JSON.parse(stored);
    } catch {
      reviews.value = [];
    }
  }
});

function getStarArray(value: number): number[] {
  return Array.from({ length: 5 }, (_, index) => index + 1);
}

function setRating(value: number) {
  rating.value = value;
}

function submitReview() {
  if (!reviewText.value.trim()) return;

  const review: Review = {
    id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `rev-${Date.now()}`,
    property: "The Azure Retreat",
    text: reviewText.value.trim(),
    rating: rating.value,
    createdAt: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  reviews.value.unshift(review);
  localStorage.setItem("sabaystay-reviews", JSON.stringify(reviews.value));
  reviewText.value = "";
  rating.value = 5;
  submitted.value = true;
  window.setTimeout(() => (submitted.value = false), 2500);
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-[#1d2f52]">Reviews</h1>
      <p class="mt-1 text-sm text-[#65728a]">
        Share your stay experience with future travelers.
      </p>
    </div>

    <section
      class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:p-8"
    >
      <h2 class="text-lg font-bold text-[#0d224a]">
        Write a review for The Azure Retreat
      </h2>
      <form class="mt-6 space-y-5" @submit.prevent="submitReview">
        <div>
          <label class="text-sm font-medium text-[#1d2f52]">Rating</label>
          <div class="mt-2 flex items-center gap-1">
            <button
              v-for="star in getStarArray(5)"
              :key="star"
              type="button"
              class="text-2xl transition"
              :class="
                star <= (hoverRating || rating)
                  ? 'text-amber-500'
                  : 'text-slate-300'
              "
              @mouseenter="hoverRating = star"
              @mouseleave="hoverRating = 0"
              @click="setRating(star)"
            >
              ★
            </button>
          </div>
        </div>
        <label class="block text-sm font-medium text-[#1d2f52]">
          Your Review
          <textarea
            v-model="reviewText"
            rows="4"
            required
            placeholder="Tell us about your experience..."
            class="mt-2 w-full rounded-xl border border-slate-200 bg-[#f7f6f2] px-4 py-3 text-sm outline-none transition focus:border-[#087d72] focus:bg-white"
          />
        </label>
        <div class="flex items-center gap-4">
          <button
            type="submit"
            class="rounded-xl bg-[#0d224a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0a1d3d]"
          >
            Submit Review
          </button>
          <span
            v-if="submitted"
            class="text-sm font-medium text-emerald-700"
            role="status"
          >
            Review submitted successfully.
          </span>
        </div>
      </form>
    </section>

    <section class="space-y-4">
      <h2 class="text-lg font-bold text-[#0d224a]">Your Reviews</h2>
      <div
        v-if="reviews.length === 0"
        class="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200"
      >
        <p class="text-sm text-[#53637c]">
          You haven't submitted any reviews yet.
        </p>
      </div>
      <article
        v-for="review in reviews"
        :key="review.id"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-200"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 class="font-semibold text-[#0d224a]">{{ review.property }}</h3>
            <p class="mt-1 text-xs text-[#65728a]">{{ review.createdAt }}</p>
          </div>
          <div class="flex gap-0.5 text-amber-500">
            <span
              v-for="star in getStarArray(review.rating)"
              :key="star"
              aria-hidden="true"
            >
              ★
            </span>
          </div>
        </div>
        <p class="mt-3 text-sm leading-6 text-[#53637c]">{{ review.text }}</p>
      </article>
    </section>
  </div>
</template>
