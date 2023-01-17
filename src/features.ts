// @ts-ignore isolatedModules

import { initApplicator } from "./apply";
import { isPeriodOpen } from "./utils/baseUtils";

type States = "open" | "locked";

export type Feature = {
    name: string;
    init: () => void;
    options?: {
        states?: States[];
    };
};

function shouldInitBasedOnPeriodState(feature: Feature) {
    let shouldInit = false;

    if (feature.options?.states) {
        if (isPeriodOpen() && feature.options.states.includes("open")) {
            shouldInit = true;
        } else if (
            !isPeriodOpen() &&
            feature.options.states.includes("locked")
        ) {
            shouldInit = true;
        }
    } else {
        shouldInit = true;
    }

    return shouldInit;
}

const features: Feature[] = [];

const add = (feature: Feature) => features.push(feature);
const get = () => features;
const init = () => {
    features.forEach((f) => {
        if (shouldInitBasedOnPeriodState(f)) f.init();
    });

    initApplicator();
};

export const featureService = { add, get, init };
