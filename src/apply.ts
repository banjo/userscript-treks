// @ts-ignore isolatedModules

import { featureService } from "./features";
import { waitForSave } from "./utils/baseUtils";

export function initApplicator() {
    applyOnInputFieldChange();
    applyOnPeriodChange();
    applyOnStateChange();
}

function applyOnStateChange() {
    const openStateButton = document.querySelector("#lockButton");
    if (openStateButton instanceof HTMLButtonElement) {
        openStateButton.addEventListener("click", () => {
            setTimeout(() => {
                featureService.init();
            }, 1000);
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
