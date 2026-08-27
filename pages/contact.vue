<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>Contact Us</h1>
        <p>We are here to help with your next booking.</p>
      </div>
    </section>

    <!-- Main Content -->
    <section class="contact-content">
      <div class="container">
        <div class="content-grid">
          <!-- Inquiry Form -->
          <div class="inquiry-section">
            <h2>Inquire</h2>
            <p class="description">
              Share your travel aspirations. A dedicated specialist will respond
              within two hours.
            </p>

            <form @submit.prevent="submitInquiry" class="inquiry-form">
              <!-- Full Name -->
              <div class="form-group">
                <label for="fullname">FULL NAME</label>
                <input
                  id="fullname"
                  v-model="form.fullName"
                  type="text"
                  placeholder="Your name"
                  required
                />
              </div>

              <!-- Email Address -->
              <div class="form-group">
                <label for="email">EMAIL ADDRESS</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <!-- Inquiry Type -->
              <div class="form-group">
                <label for="inquiryType">INQUIRY TYPE</label>
                <select id="inquiryType" v-model="form.inquiryType" required>
                  <option value="">Select inquiry type</option>
                  <option value="private-villa">
                    Private Villa Reservation
                  </option>
                  <option value="luxury-hotel">Luxury Hotel Booking</option>
                  <option value="experience">Experience Booking</option>
                  <option value="concierge">Concierge Service</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <!-- Message -->
              <div class="form-group">
                <label for="message">MESSAGE</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  placeholder="Detail your specific requirements..."
                  rows="6"
                  required
                ></textarea>
              </div>

              <!-- Submit Button -->
              <button type="submit" class="btn-submit">
                Send Inquiry
                <span class="arrow">→</span>
              </button>
            </form>
          </div>

          <!-- Immediate Assistance & Global Offices -->
          <div class="right-section">
            <!-- Immediate Assistance -->
            <div class="assistance-section">
              <h3>Immediate Assistance</h3>
              <p class="description">
                Connect instantly with our global butler desk.
              </p>

              <div class="assistance-methods">
                <div class="assistance-item">
                  <div class="icon whatsapp">💬</div>
                  <div class="details">
                    <h4>WhatsApp Concierge</h4>
                    <p>Avg. response: 5 mins</p>
                  </div>
                  <span class="arrow-link">→</span>
                </div>

                <div class="assistance-item">
                  <div class="icon phone">☎️</div>
                  <div class="details">
                    <h4>24/7 Butler Support</h4>
                    <p>+1 (800) SABAYUP</p>
                  </div>
                  <span class="arrow-link">→</span>
                </div>
              </div>
            </div>

            <!-- Global Offices -->
            <div class="offices-section">
              <h3>Global Offices</h3>

              <div class="office">
                <h4>PARIS</h4>
                <p>15 Place Vendôme, 75001</p>
                <div class="office-map">
                  <img
                    src="https://via.placeholder.com/400x200?text=Paris"
                    alt="Paris Office Map"
                  />
                </div>
              </div>

              <div class="office">
                <h4>TOKYO</h4>
                <p>Ginza 8-Chome, Chuo City</p>
              </div>

              <div class="office">
                <h4>NEW YORK</h4>
                <p>111 West 57th St, Manhattan</p>
              </div>
            </div>
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
  inquiryType: string;
  message: string;
}

const form = ref<ContactForm>({
  fullName: "",
  email: "",
  inquiryType: "",
  message: "",
});

const submitInquiry = async () => {
  try {
    // TODO: Implement form submission to backend
    console.log("Form submitted:", form.value);
    alert("Thank you for your inquiry! We will respond within 2 hours.");

    // Reset form
    form.value = {
      fullName: "",
      email: "",
      inquiryType: "",
      message: "",
    };
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    alert("There was an error submitting your inquiry. Please try again.");
  }
};
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background: #fff;
}

/* Hero Section */
.hero-section {
  background:
    linear-gradient(
      135deg,
      rgba(25, 35, 71, 0.95) 0%,
      rgba(25, 35, 71, 0.85) 100%
    ),
    url("https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaC1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80");
  background-size: cover;
  background-position: center;
  padding: 100px 20px;
  text-align: center;
  color: white;
  margin-bottom: 60px;
}

.hero-content h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: -1px;
}

.hero-content p {
  font-size: 18px;
  opacity: 0.95;
  max-width: 600px;
  margin: 0 auto;
}

/* Main Content */
.contact-content {
  padding: 40px 20px 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
}

/* Inquiry Section */
.inquiry-section h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #192347;
}

.inquiry-section .description {
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
  line-height: 1.6;
}

.inquiry-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #192347;
  margin-bottom: 8px;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #192347;
  box-shadow: 0 0 0 2px rgba(25, 35, 71, 0.1);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #999;
}

.btn-submit {
  background: #192347;
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  align-self: flex-start;
  margin-top: 12px;
}

.btn-submit:hover {
  background: #0f1a35;
  transform: translateX(4px);
}

.btn-submit .arrow {
  font-size: 16px;
  transition: transform 0.3s ease;
}

.btn-submit:hover .arrow {
  transform: translateX(4px);
}

/* Right Section */
.right-section {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Immediate Assistance */
.assistance-section h3,
.offices-section h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #192347;
}

.assistance-section .description {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
}

.assistance-methods {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.assistance-item {
  background: #e8f5e9;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.assistance-item:hover {
  background: #dcecd8;
  border-color: #4caf50;
  transform: translateX(4px);
}

.assistance-item .icon {
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 50%;
  flex-shrink: 0;
}

.assistance-item .details {
  flex: 1;
}

.assistance-item h4 {
  font-size: 14px;
  font-weight: 600;
  color: #192347;
  margin: 0 0 4px;
}

.assistance-item p {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.assistance-item .arrow-link {
  color: #4caf50;
  font-weight: 600;
  transition: transform 0.3s ease;
}

.assistance-item:hover .arrow-link {
  transform: translateX(4px);
}

/* Global Offices */
.offices-section {
  border-top: 1px solid #e0e0e0;
  padding-top: 40px;
}

.offices-section h3 {
  margin-bottom: 24px;
}

.office {
  margin-bottom: 28px;
}

.office h4 {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #192347;
  margin: 0 0 6px;
}

.office p {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px;
  line-height: 1.5;
}

.office-map {
  width: 100%;
  height: 200px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 16px;
}

.office-map img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Responsive Design */
@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .hero-content h1 {
    font-size: 36px;
  }

  .hero-content p {
    font-size: 16px;
  }

  .inquiry-section h2 {
    font-size: 24px;
  }

  .assistance-section h3,
  .offices-section h3 {
    font-size: 18px;
  }
}
</style>
