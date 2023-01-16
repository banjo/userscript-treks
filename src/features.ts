// @ts-ignore isolatedModules

type States = "open" | "locked";

type Feature = {
    name: string;
    init: () => void;
    options?: {
        states?: States[];
    };
};

const features: Feature[] = [];

const add = (feature: Feature) => features.push(feature);
const get = () => features;
const init = () => features.forEach((f) => f.init());

export const featureService = { add, get, init };
