<template>
  <AppLayout>
    <section class="settings-page">
      <header class="settings-page__header">
        <div>
          <p class="settings-page__eyebrow">Configuracion</p>
          <h1>Configuracion operativa</h1>
          <p>
            Define costos, presupuestos y reglas de medicion para que el sistema
            calcule gasto estimado y riesgos de consumo con datos consistentes.
          </p>
        </div>

        <UiButton label="Guardar configuracion" @click="saveSettings" />
      </header>

      <div v-if="message" class="settings-page__message">
        {{ message }}
      </div>

      <section class="settings-page__metrics" aria-label="Resumen de configuracion">
        <article class="settings-metric">
          <span>Agua</span>
          <strong>{{ formatCurrency(form.waterRatePerM3) }}</strong>
          <small>por m3 · presupuesto {{ formatCurrency(form.waterMonthlyBudget) }}</small>
        </article>

        <article class="settings-metric">
          <span>Gas</span>
          <strong>{{ formatCurrency(form.gasRatePerM3) }}</strong>
          <small>por m3 · presupuesto {{ formatCurrency(form.gasMonthlyBudget) }}</small>
        </article>

        <article class="settings-metric">
          <span>Impuesto</span>
          <strong>{{ form.taxPercentage }}%</strong>
          <small>aplicado a estimaciones de gasto</small>
        </article>

        <article class="settings-metric">
          <span>Medicion</span>
          <strong>{{ form.measurementIntervalSeconds }}s</strong>
          <small>intervalo para lectura operativa</small>
        </article>
      </section>

      <section class="settings-page__grid">
        <UiCard
            title="Costos de recursos"
            subtitle="Valores usados para estimar el gasto de agua y gas desde los conductos."
            variant="elevated"
        >
          <div class="settings-form settings-form--two">
            <label class="settings-field">
              <span>Costo de agua por m3</span>
              <input v-model.number="form.waterRatePerM3" min="0" step="0.01" type="number" />
            </label>

            <label class="settings-field">
              <span>Presupuesto mensual de agua</span>
              <input v-model.number="form.waterMonthlyBudget" min="0" step="1" type="number" />
            </label>

            <label class="settings-field">
              <span>Costo de gas por m3</span>
              <input v-model.number="form.gasRatePerM3" min="0" step="0.01" type="number" />
            </label>

            <label class="settings-field">
              <span>Presupuesto mensual de gas</span>
              <input v-model.number="form.gasMonthlyBudget" min="0" step="1" type="number" />
            </label>
          </div>
        </UiCard>

        <UiCard
            title="Facturacion"
            subtitle="Datos base para reportes de gasto, resumen mensual y proyecciones."
            variant="elevated"
        >
          <div class="settings-form">
            <label class="settings-field">
              <span>Nombre operativo</span>
              <input v-model.trim="form.companyName" type="text" />
            </label>

            <div class="settings-form__row">
              <UiSelect
                  v-model="form.currency"
                  label="Moneda"
                  :options="currencyOptions"
              />

              <label class="settings-field">
                <span>IGV o impuesto</span>
                <input v-model.number="form.taxPercentage" min="0" step="1" type="number" />
              </label>
            </div>

            <label class="settings-field">
              <span>Dia de cierre mensual</span>
              <input v-model.number="form.billingCycleDay" max="28" min="1" step="1" type="number" />
            </label>
          </div>
        </UiCard>

        <UiCard
            title="Operacion"
            subtitle="Reglas que afectan el comportamiento de medicion y respuesta diaria."
            variant="elevated"
        >
          <div class="settings-form">
            <div class="settings-form__row">
              <label class="settings-field">
                <span>Frecuencia de medicion</span>
                <input v-model.number="form.measurementIntervalSeconds" min="1" step="1" type="number" />
              </label>

              <label class="settings-field">
                <span>Alerta de presupuesto</span>
                <input v-model.number="form.budgetWarningPercentage" max="100" min="1" step="1" type="number" />
              </label>
            </div>

            <div class="settings-toggles">
              <label class="settings-toggle">
                <input v-model="form.showEstimatedCostOnDashboard" type="checkbox" />
                <span>
                  <strong>Mostrar costo estimado en Panel</strong>
                  <small>El dashboard puede mostrar gasto acumulado junto al consumo.</small>
                </span>
              </label>

              <label class="settings-toggle">
                <input v-model="form.notifyBudgetRisk" type="checkbox" />
                <span>
                  <strong>Avisar cuando el presupuesto este en riesgo</strong>
                  <small>Activa señales tempranas antes de superar el limite mensual.</small>
                </span>
              </label>

              <label class="settings-toggle">
                <input v-model="form.closeValvesWhenSiteDisabled" type="checkbox" />
                <span>
                  <strong>Cerrar valvulas al desactivar una sede</strong>
                  <small>Evita consumo accidental cuando una ubicacion queda fuera de operacion.</small>
                </span>
              </label>
            </div>
          </div>
        </UiCard>

        <UiCard
            title="Estimacion rapida"
            subtitle="Referencia inmediata para validar si las tarifas ingresadas tienen sentido."
            variant="elevated"
        >
          <div class="settings-estimate">
            <div>
              <span>1 m3 de agua</span>
              <strong>{{ formatCurrency(estimate.waterCost) }}</strong>
            </div>

            <div>
              <span>10 m3 de gas</span>
              <strong>{{ formatCurrency(estimate.gasCost) }}</strong>
            </div>

            <div>
              <span>Total con impuesto</span>
              <strong>{{ formatCurrency(estimate.total) }}</strong>
            </div>
          </div>
        </UiCard>
      </section>

      <UiCard
          title="Donde impacta esta configuracion"
          subtitle="La aplicacion ya queda preparada para reutilizar estos parametros en las pantallas operativas."
          variant="glass"
      >
        <div class="settings-impact">
          <article>
            <strong>Panel</strong>
            <span>Consumo acumulado, costo estimado y tendencia mensual.</span>
          </article>

          <article>
            <strong>Reportes</strong>
            <span>Gasto por periodo, recurso, sede y conducto.</span>
          </article>

          <article>
            <strong>Alertas</strong>
            <span>Riesgo por presupuesto, umbrales y gasto inusual.</span>
          </article>

          <article>
            <strong>Planes</strong>
            <span>Control de capacidad y limites por sede o dispositivo.</span>
          </article>
        </div>
      </UiCard>
    </section>
  </AppLayout>
</template>

<script setup>
import { computed, reactive, ref } from "vue";

import { OperationalSettingsService } from "../../../application/services/operational-settings.service";
import AppLayout from "../../components/app-layout/app-layout.component.vue";
import UiButton from "../../components/ui-button/ui-button.component.vue";
import UiCard from "../../components/ui-card/ui-card.component.vue";
import UiSelect from "../../components/ui-select/ui-select.component.vue";

const persistedSettings = OperationalSettingsService.getSettings();

const form = reactive({
  ...persistedSettings,
});

const message = ref("");

const currencyOptions = [
  {
    label: "Soles",
    value: "PEN",
  },
  {
    label: "Dolares",
    value: "USD",
  },
];

const estimate = computed(() => {
  const waterCost = Math.max(0, Number(form.waterRatePerM3) || 0);
  const gasCost = Math.max(0, Number(form.gasRatePerM3) || 0) * 10;
  const subtotal = waterCost + gasCost;
  const tax = subtotal * ((Number(form.taxPercentage) || 0) / 100);

  return {
    waterCost,
    gasCost,
    total: subtotal + tax,
  };
});

function formatCurrency(value) {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: form.currency || "PEN",
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);
}

function saveSettings() {
  const savedSettings = OperationalSettingsService.saveSettings(form);

  Object.assign(form, savedSettings);
  message.value = "Configuracion operativa guardada correctamente.";

  window.setTimeout(() => {
    message.value = "";
  }, 3000);
}
</script>

<style scoped>
.settings-page {
  display: grid;
  gap: 22px;
}

.settings-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 22px;
}

.settings-page__eyebrow {
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 900;
  margin: 0 0 6px;
  text-transform: uppercase;
}

.settings-page__header h1 {
  color: var(--color-text);
  font-size: clamp(34px, 4vw, 46px);
  font-weight: 900;
  line-height: 1;
  margin: 0;
}

.settings-page__header p:not(.settings-page__eyebrow) {
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 10px 0 0;
  max-width: 720px;
}

.settings-page__message {
  border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
  background: #ecfdf5;
  color: var(--color-success);
  font-weight: 900;
  padding: 14px 16px;
}

.settings-page__metrics,
.settings-page__grid {
  display: grid;
  gap: 18px;
}

.settings-page__metrics {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.settings-metric {
  display: grid;
  gap: 8px;
  min-height: 148px;
  align-content: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: var(--shadow-soft);
  padding: 22px;
}

.settings-metric span,
.settings-metric small {
  color: var(--color-text-muted);
  font-weight: 800;
}

.settings-metric strong {
  color: var(--color-text);
  font-size: 30px;
  font-weight: 900;
  line-height: 1;
}

.settings-page__grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.settings-form {
  display: grid;
  gap: 16px;
}

.settings-form--two,
.settings-form__row {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.settings-field {
  display: grid;
  gap: 8px;
}

.settings-field span {
  color: var(--color-text);
  font-weight: 900;
}

.settings-field input {
  width: 100%;
  min-height: 46px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: #ffffff;
  color: var(--color-text);
  font: inherit;
  font-weight: 900;
  padding: 10px 13px;
  transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;
}

.settings-field input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08);
  outline: 0;
}

.settings-toggles {
  display: grid;
  gap: 12px;
}

.settings-toggle {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  padding: 14px;
}

.settings-toggle input {
  width: 20px;
  height: 20px;
  accent-color: var(--color-primary);
  margin-top: 2px;
}

.settings-toggle strong,
.settings-toggle small {
  display: block;
}

.settings-toggle strong {
  color: var(--color-text);
  font-weight: 900;
}

.settings-toggle small {
  color: var(--color-text-muted);
  line-height: 1.45;
  margin-top: 3px;
}

.settings-estimate {
  display: grid;
  gap: 12px;
}

.settings-estimate div,
.settings-impact article {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  padding: 14px;
}

.settings-estimate span,
.settings-impact span {
  color: var(--color-text-muted);
  line-height: 1.45;
}

.settings-estimate strong,
.settings-impact strong {
  color: var(--color-text);
  font-weight: 900;
}

.settings-impact {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.settings-impact article {
  display: grid;
  align-content: start;
  justify-content: stretch;
}

@media (max-width: 980px) {
  .settings-page__metrics,
  .settings-page__grid,
  .settings-impact {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .settings-page__header {
    display: grid;
  }

  .settings-page__metrics,
  .settings-page__grid,
  .settings-form--two,
  .settings-form__row,
  .settings-impact {
    grid-template-columns: 1fr;
  }
}
</style>
