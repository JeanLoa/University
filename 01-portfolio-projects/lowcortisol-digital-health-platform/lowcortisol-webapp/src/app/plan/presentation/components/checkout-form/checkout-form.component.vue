<template>
  <Teleport to="body">
    <div
        class="checkout-backdrop"
        @click.self="emit('close')"
    >
      <section class="checkout-modal">
        <button
            class="modal-close"
            type="button"
            aria-label="Close"
            @click="emit('close')"
        >
          ×
        </button>

        <div class="checkout-header">
          <div>
            <span class="checkout-badge">
              {{ t("plans.page.checkoutTitle") }}
            </span>

            <h2>
              {{ t("plans.page.selectedPlan") }}
            </h2>

            <p class="checkout-subtitle">
              {{ t("plans.page.checkoutSubtitle") }}
            </p>
          </div>

          <div class="selected-plan-card">
            <span>{{ plan.name }}</span>
            <strong>S/ {{ Number(plan.price || 0).toFixed(2) }}</strong>
            <small>{{ t("plans.page.monthly") }}</small>
          </div>
        </div>

        <form
            class="checkout-form"
            @submit.prevent="handleSubmit"
        >
          <label class="form-field">
            <span>{{ t("plans.page.cardholderName") }}</span>
            <input
                v-model="checkout.cardholderName"
                type="text"
                autocomplete="cc-name"
                required
                placeholder="Jean Loa"
            />
          </label>

          <label class="form-field">
            <span>{{ t("plans.page.cardNumber") }}</span>
            <input
                v-model="checkout.cardNumber"
                type="text"
                inputmode="numeric"
                autocomplete="cc-number"
                maxlength="19"
                required
                placeholder="4242 4242 4242 4242"
                @input="handleCardNumberInput"
            />
          </label>

          <div class="checkout-row">
            <label class="form-field">
              <span>{{ t("plans.page.expirationDate") }}</span>
              <input
                  v-model="checkout.expirationDate"
                  type="text"
                  inputmode="numeric"
                  autocomplete="cc-exp"
                  maxlength="5"
                  required
                  placeholder="MM/YY"
                  @input="handleExpirationDateInput"
              />
            </label>

            <label class="form-field">
              <span>{{ t("plans.page.securityCode") }}</span>
              <input
                  v-model="checkout.securityCode"
                  type="text"
                  inputmode="numeric"
                  autocomplete="cc-csc"
                  maxlength="3"
                  required
                  placeholder="123"
                  @input="handleSecurityCodeInput"
              />
            </label>
          </div>

          <div class="checkout-actions">
            <button
                class="btn-secondary"
                type="button"
                @click="emit('close')"
            >
              {{ t("plans.page.closeForm") }}
            </button>

            <button
                class="btn-primary"
                type="submit"
            >
              {{ t("plans.page.confirmPurchase") }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive } from "vue";

import { useTranslation } from "../../../../../../shared/application/services/translation.service";

defineProps({
  plan: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["submit", "close"]);

const { t } = useTranslation();

const checkout = reactive({
  cardholderName: "",
  cardNumber: "",
  expirationDate: "",
  securityCode: "",
});

onMounted(() => {
  document.body.classList.add("modal-open");
  window.addEventListener("keydown", handleEscape);
});

onBeforeUnmount(() => {
  document.body.classList.remove("modal-open");
  window.removeEventListener("keydown", handleEscape);
});

function handleEscape(event) {
  if (event.key === "Escape") {
    emit("close");
  }
}

function onlyNumbers(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatCardNumber(value) {
  return onlyNumbers(value)
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
}

function formatExpirationDate(value) {
  const numbers = onlyNumbers(value).slice(0, 4);

  if (numbers.length === 0) {
    return "";
  }

  if (numbers.length === 1) {
    const firstDigit = Number(numbers);

    if (firstDigit > 1) {
      return `0${firstDigit}`;
    }

    return numbers;
  }

  let month = numbers.slice(0, 2);
  let monthNumber = Number(month);

  if (monthNumber < 1) {
    month = "01";
  }

  if (monthNumber > 12) {
    month = "12";
  }

  if (numbers.length <= 2) {
    return month;
  }

  const yearInput = numbers.slice(2);
  const currentYearShort = new Date().getFullYear() % 100;

  if (yearInput.length === 1) {
    return `${month}/${yearInput}`;
  }

  let yearNumber = Number(yearInput);

  if (yearNumber < currentYearShort) {
    yearNumber = currentYearShort;
  }

  const year = String(yearNumber).padStart(2, "0");

  return `${month}/${year}`;
}

function formatSecurityCode(value) {
  return onlyNumbers(value).slice(0, 3);
}

function handleCardNumberInput(event) {
  checkout.cardNumber = formatCardNumber(event.target.value);
  event.target.value = checkout.cardNumber;
}

function handleExpirationDateInput(event) {
  checkout.expirationDate = formatExpirationDate(event.target.value);
  event.target.value = checkout.expirationDate;
}

function handleSecurityCodeInput(event) {
  checkout.securityCode = formatSecurityCode(event.target.value);
  event.target.value = checkout.securityCode;
}

function handleSubmit() {
  emit("submit", {
    cardholderName: checkout.cardholderName,
    cardNumber: checkout.cardNumber,
    expirationDate: checkout.expirationDate,
    securityCode: checkout.securityCode,
  });
}
</script>

<style scoped>
.checkout-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(8px);
  animation: fade-in 0.2s ease;
}

.checkout-modal {
  position: relative;
  width: min(100%, 720px);
  max-height: min(92vh, 820px);
  overflow-y: auto;
  border-radius: 28px;
  background:
      radial-gradient(circle at top left, rgba(47, 128, 237, 0.18), transparent 36%),
      var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 30px 90px rgba(15, 23, 42, 0.35);
  padding: 34px;
  animation: modal-pop 0.24s ease;
}

.modal-close {
  position: absolute;
  top: 18px;
  right: 20px;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 999px;
  background: var(--color-surface-soft);
  color: var(--color-text);
  font-size: 30px;
  line-height: 1;
  cursor: pointer;
  font-weight: 700;
}

.modal-close:hover {
  transform: scale(1.05);
}

.checkout-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  align-items: start;
  margin-bottom: 28px;
  padding-right: 44px;
}

.checkout-badge {
  display: inline-flex;
  width: fit-content;
  margin-bottom: 14px;
  padding: 8px 14px;
  border-radius: 999px;
  background: #eaf4ff;
  color: var(--color-primary);
  border: 1px solid #bfdbfe;
  font-weight: 900;
  font-size: 0.85rem;
}

.checkout-header h2 {
  margin: 0 0 10px;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
}

.checkout-subtitle {
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
}

.selected-plan-card {
  min-width: 190px;
  display: grid;
  gap: 6px;
  border-radius: 22px;
  padding: 20px;
  background: #eaf4ff;
  border: 1px solid #bfdbfe;
  text-align: right;
}

.selected-plan-card span {
  color: var(--color-text-muted);
  font-weight: 900;
}

.selected-plan-card strong {
  font-size: 2rem;
  color: var(--color-text);
}

.selected-plan-card small {
  color: var(--color-text-muted);
  font-weight: 900;
}

.checkout-form {
  display: grid;
  gap: 18px;
}

.checkout-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.form-field {
  display: grid;
  gap: 8px;
}

.form-field span {
  color: var(--color-text-muted);
  font-weight: 900;
}

.form-field input {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  color: var(--color-text);
  padding: 15px 16px;
  outline: none;
  font-weight: 800;
}

.form-field input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(47, 128, 237, 0.12);
}

.checkout-actions {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  margin-top: 8px;
}

.btn-secondary {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  color: var(--color-text);
  font-weight: 900;
  padding: 14px 18px;
  cursor: pointer;
}

.btn-secondary:hover {
  transform: translateY(-1px);
}

@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes modal-pop {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.96);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 760px) {
  .checkout-modal {
    padding: 26px;
    border-radius: 22px;
  }

  .checkout-header {
    grid-template-columns: 1fr;
    padding-right: 38px;
  }

  .selected-plan-card {
    text-align: left;
  }

  .checkout-row {
    grid-template-columns: 1fr;
  }

  .checkout-actions {
    flex-direction: column-reverse;
  }

  .checkout-actions .btn-primary,
  .checkout-actions .btn-secondary {
    width: 100%;
  }
}
</style>