// @ts-ignore isolatedModules

import { featureService } from "./features";
import { isPeriodOpen, waitForSave } from "./utils/baseUtils";

export function initApplicator() {
    applyOnInputFieldChange();
    applyOnPeriodChange();
    applyOnOpenStateChange();
}

function applyOnOpenStateChange() {
    const openStateButton = document.querySelector("#lockButton");
    if (openStateButton instanceof HTMLButtonElement) {
        openStateButton.addEventListener("click", () => {
            const features = featureService.get();
            let shouldInit = false;

            features.forEach((feature) => {
                if (feature.options?.states) {
                    if (
                        isPeriodOpen() &&
                        feature.options.states.includes("open")
                    ) {
                        shouldInit = true;
                    } else if (
                        !isPeriodOpen() &&
                        feature.options.states.includes("locked")
                    ) {
                        shouldInit = true;
                    }
                }
            });

            if (shouldInit) {
                setTimeout(() => {
                    featureService.init();
                }, 1000);
            }
        });
    }
}

function applyOnPeriodChange() {
    const periodButtons = Array.from(document.querySelectorAll(".btn-period"));
    periodButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setTimeout(() => {
                featureService.init();
            }, 1000);
        });
    });
}

function applyOnInputFieldChange() {
    const inputField = Array.from(document.querySelectorAll("input.time"));

    inputField.forEach((input) => {
        if (input instanceof HTMLInputElement) {
            input.addEventListener("keyup", async () => {
                await waitForSave();
                featureService.init();
            });
        }
    });
}
