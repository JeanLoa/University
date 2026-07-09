import { Anomaly } from "../model/anomaly.entity";

export class AnomalyDetectionService {
    static detect(reading) {
        const thresholds = {
            water: {
                warning: 260,
                critical: 320,
            },
            gas: {
                warning: 90,
                critical: 120,
            },
        };

        const resourceThreshold = thresholds[reading.resourceType];

        if (!resourceThreshold) {
            return null;
        }

        if (reading.value >= resourceThreshold.critical) {
            return new Anomaly({
                id: `ANOM-${Date.now()}`,
                readingId: reading.id,
                siteId: reading.siteId,
                resourceType: reading.resourceType,
                severity: "critical",
                description: `Consumo crítico de ${reading.resourceLabel}: ${reading.value} ${reading.unit}`,
            });
        }

        if (reading.value >= resourceThreshold.warning) {
            return new Anomaly({
                id: `ANOM-${Date.now()}`,
                readingId: reading.id,
                siteId: reading.siteId,
                resourceType: reading.resourceType,
                severity: "warning",
                description: `Consumo elevado de ${reading.resourceLabel}: ${reading.value} ${reading.unit}`,
            });
        }

        return null;
    }
}