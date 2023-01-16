// @ts-ignore isolatedModules
import { featureService } from "./features";
import { hasLoaded } from "./utils/baseUtils";
import "./features/fillWeek";
import "./features/comment";

const startupInterval = setInterval(() => {
    if (hasLoaded()) {
        clearInterval(startupInterval);
        featureService.init();
    }
}, 50);
