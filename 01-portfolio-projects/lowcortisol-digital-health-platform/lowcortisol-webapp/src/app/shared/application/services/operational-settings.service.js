import { STORAGE_KEYS } from "../../infrastructure/constants/storage.keys";
import { LocalStorageService } from "../../infrastructure/storage/local-storage.service";

const defaultSettings = {
    companyName: "LowCortisol Operations",
    currency: "PEN",
    taxPercentage: 18,
    billingCycleDay: 20,
    waterRatePerM3: 5.4,
    gasRatePerM3: 2.8,
    waterMonthlyBudget: 180,
    gasMonthlyBudget: 120,
    measurementIntervalSeconds: 5,
    budgetWarningPercentage: 80,
    showEstimatedCostOnDashboard: true,
    notifyBudgetRisk: true,
    closeValvesWhenSiteDisabled: true,
};

function toNumber(value, fallback = 0) {
    const numericValue = Number(value);

    return Number.isFinite(numericValue) ? numericValue : fallback;
}

function normalizeSettings(settings = {}) {
    return {
        ...defaultSettings,
        ...settings,
        taxPercentage: Math.max(0, toNumber(settings.taxPercentage, defaultSettings.taxPercentage)),
        billingCycleDay: Math.min(
            28,
            Math.max(1, Math.round(toNumber(settings.billingCycleDay, defaultSettings.billingCycleDay)))
        ),
        waterRatePerM3: Math.max(0, toNumber(settings.waterRatePerM3, defaultSettings.waterRatePerM3)),
        gasRatePerM3: Math.max(0, toNumber(settings.gasRatePerM3, defaultSettings.gasRatePerM3)),
        waterMonthlyBudget: Math.max(0, toNumber(settings.waterMonthlyBudget, defaultSettings.waterMonthlyBudget)),
        gasMonthlyBudget: Math.max(0, toNumber(settings.gasMonthlyBudget, defaultSettings.gasMonthlyBudget)),
        measurementIntervalSeconds: Math.max(
            1,
            Math.round(toNumber(settings.measurementIntervalSeconds, defaultSettings.measurementIntervalSeconds))
        ),
        budgetWarningPercentage: Math.min(
            100,
            Math.max(1, Math.round(toNumber(settings.budgetWarningPercentage, defaultSettings.budgetWarningPercentage)))
        ),
        showEstimatedCostOnDashboard: Boolean(settings.showEstimatedCostOnDashboard),
        notifyBudgetRisk: Boolean(settings.notifyBudgetRisk),
        closeValvesWhenSiteDisabled: Boolean(settings.closeValvesWhenSiteDisabled),
    };
}

export class OperationalSettingsService {
    static getDefaultSettings() {
        return { ...defaultSettings };
    }

    static getSettings() {
        const storedSettings = LocalStorageService.get(
            STORAGE_KEYS.OPERATIONAL_SETTINGS,
            defaultSettings
        );

        return normalizeSettings(storedSettings);
    }

    static saveSettings(settings) {
        const normalizedSettings = normalizeSettings(settings);

        LocalStorageService.set(STORAGE_KEYS.OPERATIONAL_SETTINGS, normalizedSettings);

        return normalizedSettings;
    }

    static estimateCost({ waterLiters = 0, gasM3 = 0 } = {}) {
        const settings = OperationalSettingsService.getSettings();
        const waterM3 = Math.max(0, toNumber(waterLiters, 0)) / 1000;
        const normalizedGasM3 = Math.max(0, toNumber(gasM3, 0));
        const waterCost = waterM3 * settings.waterRatePerM3;
        const gasCost = normalizedGasM3 * settings.gasRatePerM3;
        const subtotal = waterCost + gasCost;
        const tax = subtotal * (settings.taxPercentage / 100);

        return {
            waterCost,
            gasCost,
            subtotal,
            tax,
            total: subtotal + tax,
        };
    }
}
