<script setup lang="ts">
import { ref } from "vue";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from "lucide-vue-next";

interface ContactForm {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

const form = ref<ContactForm>({
  fullName: "",
  email: "",
  phone: "",
  message: "",
});

const isSubmitting = ref(false);
const submitStatus = ref<"idle" | "success" | "error">("idle");

const submitInquiry = async () => {
  isSubmitting.value = true;
  submitStatus.value = "idle";

  try {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    console.log("Form submitted:", form.value);
    submitStatus.value = "success";

    form.value = {
      fullName: "",
      email: "",
      phone: "",
      message: "",
    };
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    submitStatus.value = "error";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50 font-normal text-slate-800">
    <!-- Header Banner -->
    <header class="bg-[#07166b] py-14 px-4 sm:px-6 lg:px-8 text-white">
      <div class="mx-auto max-w-7xl">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-normal tracking-wide text-amber-400 backdrop-blur-md">
          <MessageSquare class="h-3.5 w-3.5" />
          Get In Touch
        </span>
        <h1 class="sabay-display mt-4 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
          We'd love to hear from you
        </h1>
        <p class="mt-4 mb-7 max-w-2xl text-sm font-normal text-slate-200">
          Have a question about a stay or need assistance with your booking? Send us a message and our team will get back to you within 24 hours.
        </p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-12 lg:items-start">
        
        <!-- Contact Info Sidebar -->
        <aside class="space-y-4 lg:col-span-5">
          <div>
            <h2 class="text-xl font-bold text-slate-900">
              Contact Details
            </h2>
            <p class="mt-1 text-xs font-normal text-slate-500">
              Reach out directly or visit our office in Phnom Penh.
            </p>
          </div>

          <div class="space-y-3 pt-2">
            <!-- Visit Card -->
            <div class="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#07166b]">
                <MapPin class="h-5 w-5" />
              </div>
              <div>
                <h3 class="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Visit Us
                </h3>
                <p class="mt-1 text-sm font-normal text-slate-800">
                  123 Sabaystay, Phnom Penh City
                </p>
                <p class="text-xs font-normal text-slate-500">Cambodia</p>
              </div>
            </div>

            <!-- Call Card -->
            <div class="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#07166b]">
                <Phone class="h-5 w-5" />
              </div>
              <div>
                <h3 class="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Call Us
                </h3>
                <a href="tel:+85512345678" class="mt-1 block text-sm font-normal text-slate-800 hover:text-amber-600">
                  +855 12 345 678
                </a>
                <p class="text-xs font-normal text-slate-500">Mon - Sun, 8:00 AM - 8:00 PM</p>
              </div>
            </div>

            <!-- Email Card -->
            <div class="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#07166b]">
                <Mail class="h-5 w-5" />
              </div>
              <div>
                <h3 class="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Email Us
                </h3>
                <a href="mailto:info@sabaystay.com" class="mt-1 block text-sm font-normal text-slate-800 hover:text-amber-600">
                  info@sabaystay.com
                </a>
                <p class="text-xs font-normal text-slate-500">24/7 online support</p>
              </div>
            </div>
          </div>
        </aside>

        <!-- Form Section -->
        <section class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
          <h2 class="text-xl font-bold text-slate-900">
            Send Message
          </h2>
          <p class="mt-1 text-xs font-normal text-slate-500">
            Fill in the form below and we will respond as soon as possible.
          </p>

          <!-- Feedback Alerts -->
          <div
            v-if="submitStatus === 'success'"
            class="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-normal text-emerald-800"
          >
            <CheckCircle2 class="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Thank you! Your message has been sent successfully.</span>
          </div>

          <div
            v-if="submitStatus === 'error'"
            class="mt-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-normal text-rose-800"
          >
            <AlertCircle class="h-4 w-4 shrink-0 text-rose-600" />
            <span>Something went wrong. Please check your details and try again.</span>
          </div>

          <form @submit.prevent="submitInquiry" class="mt-6 space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <!-- Name Input -->
              <div>
                <label for="fullName" class="block text-xs font-normal text-slate-700">
                  Your Name <span class="text-rose-500">*</span>
                </label>
                <input
                  id="fullName"
                  v-model="form.fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  class="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-normal text-slate-800 outline-none focus:border-[#07166b] focus:bg-white focus:ring-1 focus:ring-[#07166b]"
                />
              </div>

              <!-- Email Input -->
              <div>
                <label for="email" class="block text-xs font-normal text-slate-700">
                  Your Email <span class="text-rose-500">*</span>
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  class="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-normal text-slate-800 outline-none focus:border-[#07166b] focus:bg-white focus:ring-1 focus:ring-[#07166b]"
                />
              </div>
            </div>

            <!-- Phone Input -->
            <div>
              <label for="phone" class="block text-xs font-normal text-slate-700">
                Phone Number <span class="text-slate-400">(Optional)</span>
              </label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                placeholder="+855 12 345 678"
                class="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-normal text-slate-800 outline-none focus:border-[#07166b] focus:bg-white focus:ring-1 focus:ring-[#07166b]"
              />
            </div>

            <!-- Message Textarea -->
            <div>
              <label for="message" class="block text-xs font-normal text-slate-700">
                Your Message <span class="text-rose-500">*</span>
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                placeholder="How can we help you?"
                required
                class="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-normal text-slate-800 outline-none focus:border-[#07166b] focus:bg-white focus:ring-1 focus:ring-[#07166b]"
              ></textarea>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#07166b] px-5 py-2.5 text-xs font-normal text-white transition hover:bg-[#07166b]/90 disabled:opacity-50 sm:w-auto"
            >
              <Send class="h-3.5 w-3.5" />
              <span>{{ isSubmitting ? "Sending..." : "Send Message" }}</span>
            </button>
          </form>
        </section>

      </div>
    </main>
  </div>
</template>