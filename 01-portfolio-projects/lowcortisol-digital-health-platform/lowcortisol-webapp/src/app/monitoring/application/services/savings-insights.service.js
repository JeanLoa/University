const HIGH_CONSUMPTION_OPERATORS = new Set([
    "greater_than",
    "greater_or_equal",
]);

const RESOURCE_TOTALS = {
    water: {
        saved: 0,
        overrun: 0,
        unit: "L",
    },
    gas: {
        saved: 0,
        overrun: 0,
        unit: "m3",
    },
};

function cloneResourceTotals() {
    return Object.fromEntries(
        Object.entries(RESOURCE_TOTALS).map(([resourceType, totals]) => [
            resourceType,
            { ...totals },
        ])
    );
}

function toNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}

function matchesContext(threshold, reading) {
    if (threshold.siteId && threshold.siteId !== reading.siteId) return false;
    if (threshold.roomId && threshold.roomId !== reading.roomId) return false;
    if (threshold.deviceGroupId && threshold.deviceGroupId !== reading.deviceGroupId) return false;
    if (threshold.sensorId && threshold.sensorId !== reading.sensorId) return false;

    return true;
}

function getSpecificityScore(threshold) {
    return [
        threshold.siteId,
        threshold.roomId,
        threshold.deviceGroupId,
        threshold.sensorId,
    ].filter(Boolean).length;
}

function findApplicableThreshold(reading, thresholds = []) {
    return thresholds
        .filter((threshold) =>
            threshold?.isActive !== false &&
            threshold.resourceType === reading.resourceType &&
            HIGH_CONSUMPTION_OPERATORS.has(threshold.operator || "greater_or_equal") &&
            toNumber(threshold.limitValue) > 0 &&
            matchesContext(threshold, reading)
        )
        .sort((left, right) => {
            const specificity = getSpecificityScore(right) - getSpecificityScore(left);
            if (specificity !== 0) return specificity;

            return toNumber(left.limitValue) - toNumber(right.limitValue);
        })[0] || null;
}

function buildSavingsPoint(reading, thresholds) {
    const threshold = findApplicableThreshold(reading, thresholds);
    if (!threshold) return null;

    const value = toNumber(reading.value);
    const limitValue = toNumber(threshold.limitValue);
    const delta = limitValue - value;
    const savingsPercent = (delta / limitValue) * 100;

    return {
        id: reading.id,
        reading,
        threshold,
        resourceType: reading.resourceType,
        value,
        unit: reading.unit || threshold.unit || RESOURCE_TOTALS[reading.resourceType]?.unit || "",
        limitValue,
        savedValue: Math.max(0, delta),
        overrunValue: Math.max(0, -delta),
        savingsPercent,
        capturedAt: reading.capturedAt ? new Date(reading.capturedAt) : new Date(),
        location: reading.location,
        status: delta >= 0 ? "active" : "critical",
    };
}

export function buildSavingsInsights(readings = [], thresholds = []) {
    const sortedReadings = readings
        .filter((reading) => reading?.id && reading?.resourceType)
        .slice()
        .sort((left, right) => new Date(left.capturedAt) - new Date(right.capturedAt));

    const points = sortedReadings
        .map((reading) => buildSavingsPoint(reading, thresholds))
        .filter(Boolean)
        .slice(-10);

    const totals = cloneResourceTotals();

    points.forEach((point) => {
        const resourceTotals = totals[point.resourceType];
        if (!resourceTotals) return;

        resourceTotals.unit = point.unit || resourceTotals.unit;
        resourceTotals.saved += point.savedValue;
        resourceTotals.overrun += point.overrunValue;
    });

    const averageSavingsPercent = points.length
        ? points.reduce((total, point) => total + point.savingsPercent, 0) / points.length
        : 0;

    const firstPoint = points[0] || null;
    const lastPoint = points[points.length - 1] || null;
    const trendPercent = firstPoint && lastPoint
        ? lastPoint.savingsPercent - firstPoint.savingsPercent
        : 0;

    return {
        hasData: points.length > 0,
        points,
        totals,
        averageSavingsPercent,
        trendPercent,
        safeReadings: points.filter((point) => point.savedValue > 0).length,
        riskReadings: points.filter((point) => point.overrunValue > 0).length,
        bestPoint: points
            .slice()
            .sort((left, right) => right.savingsPercent - left.savingsPercent)[0] || null,
    };
}
