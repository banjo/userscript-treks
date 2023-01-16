// @ts-ignore isolatedModules
import { featureService } from "./features";
import { hasLoaded } from "./utils/baseUtils";
import "./features/fillWeek";
import "./features/comment";
import { initApplicator } from "./apply";

const startupInterval = setInterval(() => {
    if (hasLoaded()) {
        clearInterval(startupInterval);
        featureService.init();
        initApplicator();
    }
}, 50);
