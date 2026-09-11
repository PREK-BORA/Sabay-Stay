<template>
  <div class="min-h-screen bg-[#f2f2f2] text-slate-800">
    <section class="bg-[#0d3d8f] px-5 py-12 text-white md:px-8 lg:px-10">
      <div class="mx-auto max-w-[1200px]">
        <h1 class="text-4xl font-bold tracking-[-0.05em] md:text-[4rem]">
          Get in Touch
        </h1>
        <p class="mt-5 max-w-[760px] text-lg text-slate-200 md:text-[1.3rem]">
          Have questions? We are here to help. Send us a message and we will
          respond within 24 hours.
        </p>
      </div>
    </section>

    <section class="px-5 py-14 md:px-8 lg:px-10">
      <div
        class="mx-auto max-w-[1200px] lg:grid lg:grid-cols-[0.95fr_1.45fr] lg:gap-10"
      >
        <div>
          <h2 class="text-2xl font-bold text-[#0d224a] md:text-[2.3rem]">
            Contact Information
          </h2>

          <div class="mt-8 space-y-5">
            <div class="flex items-center gap-4 rounded-2xl bg-[#f6f7fb] p-5 shadow-sm ring-1 ring-slate-200" >
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf1ff] text-[#1c5be1]" >
                <svg viewBox="0 0 24 24"class="h-6 w-6 fill-none stroke-current stroke-[1.8]" >
                  <path
                    d="M12 21s6-5.686 6-11a6 6 0 1 0-12 0c0 5.314 6 11 6 11Z"
                  />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
              </div>
              <div>
                <div class="flex items-center gap-3">
                  <span class="text-2xl font-bold text-[#0d224a]">Visit Us</span >
                </div>
                <p class="mt-2 text-base text-slate-700">  123 Auto Tik Tla, Phnom Penh City.</p>
              </div>
            </div>

            <div class="flex items-center gap-4 rounded-2xl bg-[#f6f7fb] p-5 shadow-sm ring-1 ring-slate-200" >
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf1ff] text-[#1c5be1]" >
                <svg
                  viewBox="0 0 24 24"
                  class="h-6 w-6 fill-none stroke-current stroke-[1.8]"
                >
                  <path
                    d="M4 6.5A2.5 2.5 0 0 1 6.5 4h.86a2 2 0 0 1 1.93 1.51l.5 2.27a2 2 0 0 1-.57 1.92L7.9 10.8a15.39 15.39 0 0 0 5.3 5.3l.1-.44a2 2 0 0 1 1.92-.57l2.27.5A2 2 0 0 1 20 17.64v.86A2.5 2.5 0 0 1 17.5 21h-.7A16.8 16.8 0 0 1 4 6.2v-.7Z"
                  />
                </svg>
              </div>
              <div>
                <div class="flex items-center gap-3">
                  <span class="text-2xl font-bold text-[#0d224a]">Call Us</span>
                </div>
                <p class="mt-2 text-base text-slate-700">+(885) XXX XXX</p>
              </div>
            </div>

            <div
              class="flex items-center gap-4 rounded-2xl bg-[#f6f7fb] p-5 shadow-sm ring-1 ring-slate-200"
            >
              <div
                class="flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf1ff] text-[#1c5be1]"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-6 w-6 fill-none stroke-current stroke-[1.8]"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </div>
              <div>
                <div class="flex items-center gap-3">
                  <span class="text-2xl font-bold text-[#0d224a]">Email Us</span>
                </div>
                <p class="mt-2 text-base text-slate-700">info@sabaystay.com</p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-10 lg:mt-0">
          <div class="rounded-[20px] bg-[#f4f3f2] p-8 shadow-sm ring-1 ring-slate-200 md:p-8" >
            <button type="button"class="inline-flex items-center rounded-xl bg-[#f5c94d] px-5 py-3 text-sm font-semibold text-[#0d224a] shadow-sm transition hover:brightness-95" >
              Send us a message
            </button>

            <form @submit.prevent="submitInquiry" class="mt-8">
              <div class="grid gap-5 md:grid-cols-2">
                <div>
                  <label for="fullName"class="mb-2 block text-lg font-semibold text-[#0d224a]" >Your Name </label>
                  <input
                    id="fullName"
                    v-model="form.fullName"
                    type="text"
                    placeholder="Enter your name"
                    required
                    class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:border-[#0d224a] focus:outline-none focus:ring-2 focus:ring-[#0d224a]/10"
                  />
                </div>

                <div>
                <label for="email" class="mb-2 block text-lg font-semibold text-[#0d224a]">Your Email </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    placeholder="example@gmail.com"
                    required
                    class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:border-[#0d224a] focus:outline-none focus:ring-2 focus:ring-[#0d224a]/10"
                  />
                </div>
              </div>
             <div class="mt-5">
                <label for="phone" class="mb-2 block text-lg font-semibold text-[#0d224a]" >Your Phone </label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  placeholder="+855 12 345 678"
                  class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:border-[#0d224a] focus:outline-none focus:ring-2 focus:ring-[#0d224a]/10"
                />
              </div>

              <div class="mt-5">
                <label for="message" class="mb-2 block text-lg font-semibold text-[#0d224a]"  > Your Message  </label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="7"
                  placeholder="Write your message..."
                  required
                  class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:border-[#0d224a] focus:outline-none focus:ring-2 focus:ring-[#0d224a]/10"
                ></textarea>
              </div>

              <button type="submit"class="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d3d8f] px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:brightness-110">
                <svg viewBox="0 0 24 24"class="h-5 w-5 fill-none stroke-current stroke-[2]">
                  <path d="M5 12h14" />
                  <path d="m13 5 7 7-7 7" />
                </svg>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

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

const submitInquiry = async () => {
  try {
    console.log("Form submitted:", form.value);
    alert("Thank you for your message. We will respond within 24 hours.");

    form.value = {
      fullName: "",
      email: "",
      phone: "",
      message: "",
    };
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    alert("There was an error submitting your message. Please try again.");
  }
};
</script>
