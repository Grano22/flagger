import FlaggerRealtimeConstraint from "./FlaggerRealtimeConstraint";
import FlaggerOnlineConstraint from "../FlaggerOnlineConstraint";
import { watch, unwatch } from 'watch-object';

export default class FlaggerWhenOnlineConstraint extends FlaggerRealtimeConstraint {
    constructor() {
        const registeredEvents: Record<string, (e: any) => void> = {};
        super(new FlaggerOnlineConstraint(), {
            async setup({ deactivateFeature, triggerConstraint, isChangeable, isActive }) {
                await triggerConstraint();

                registeredEvents['online'] = async () => {
                    if (!await isActive() || await isChangeable()) {
                        await triggerConstraint();
                    }
                };

                registeredEvents['offline'] = async () => {
                    if (await isChangeable()) {
                        await deactivateFeature();
                    }
                };

                for (const registeredEventName in registeredEvents) {
                    window.addEventListener(registeredEventName, registeredEvents[registeredEventName], false);
                }

                // watch(navigator, 'onLine', async (newVal: boolean, oldVal: boolean) => {
                //     if (newVal) {
                //         await triggerConstraint();
                //     } else if (await isChangeable()) {
                //         await deactivateFeature();
                //     }
                // });
            },
            async cleanup({ deactivateFeature, isChangeable }) {
                //unwatch(navigator, 'onLine');

                for (const registeredEventName in registeredEvents) {
                    window.removeEventListener(registeredEventName, registeredEvents[registeredEventName], false);
                }

                if (await isChangeable()) {
                    await deactivateFeature();
                }
            }
        });
    }
}