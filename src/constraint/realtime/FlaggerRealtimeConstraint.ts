import FlaggerConstraint from "../FlaggerConstraint";
import FlaggerFeature from "../../feature/FlaggerFeature";
import FlaggerFeatureStatus from "../../FlaggerFeatureStatus";

interface TrackerSetup {
    triggerConstraint: () => Promise<void>;
    deactivateFeature: () => Promise<void>;
    isChangeable: () => Promise<boolean>;
    finish: () => Promise<void>;
    isActive: () => Promise<boolean>;
}

interface ConstraintTracker {
    setup(trackerActions: TrackerSetup): Promise<void>;
    cleanup(trackerActions: Pick<TrackerSetup, 'deactivateFeature' | 'isChangeable'>): Promise<void>;
}

enum FlaggerRealtimeConstraintState {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    FAILED = 'FAILED',
    FINISHED = 'FINISHED'
}

/** @internal */
export default /*abstract*/ class FlaggerRealtimeConstraint {
    #constraint: FlaggerConstraint;
    #state: FlaggerRealtimeConstraintState;
    #tracker: ConstraintTracker;
    #trackerSetup: TrackerSetup | null;

    /*protected*/ constructor(constraint: FlaggerConstraint, tracker: ConstraintTracker) {
        this.#constraint = constraint;
        this.#state = FlaggerRealtimeConstraintState.INACTIVE;
        this.#tracker = tracker;
        this.#trackerSetup = null;
    }

    public stop() {
        if (
            this.#state !== FlaggerRealtimeConstraintState.ACTIVE ||
            !this.#trackerSetup
        ) {
            throw new Error('Feature constraint is not active');
        }

        this.#tracker.cleanup({
            deactivateFeature: this.#trackerSetup.deactivateFeature,
            isChangeable: this.#trackerSetup.isChangeable
        });
        this.#state = FlaggerRealtimeConstraintState.INACTIVE;
    }

    public resume() {
        try {
            if (
                this.#state !== FlaggerRealtimeConstraintState.INACTIVE ||
                !this.#trackerSetup
            ) {
                throw new Error('Feature constraint is not stopped');
            }

            this.#tracker.setup(this.#trackerSetup);
            this.#state = FlaggerRealtimeConstraintState.ACTIVE;
        } catch(err) {
            this.#state = FlaggerRealtimeConstraintState.FAILED;
        }
    }

    public async start(feature: FlaggerFeature): Promise<void> {
        try {
            if (
                this.#state !== FlaggerRealtimeConstraintState.INACTIVE
            ) {
                throw new Error('Feature constraint must be inactive before start');
            }

            this.#trackerSetup = {
                triggerConstraint: async () =>
                {
                    if (await this.#constraint.checkIfShouldBeActivated()) {
                        feature.activate();

                        if (!feature.isChangeable) {
                            this.#state = FlaggerRealtimeConstraintState.FINISHED;
                        }
                    }
                },
                deactivateFeature: async () => {
                    feature.deactivate();
                },
                finish: async () => {
                    this.#state = FlaggerRealtimeConstraintState.FINISHED;
                },
                isChangeable: async () => feature.isChangeable,
                isActive: async () => feature.status === FlaggerFeatureStatus.ACTIVATED
            };

            await this.#tracker.setup(this.#trackerSetup);
            this.#state = FlaggerRealtimeConstraintState.ACTIVE;
        } catch (err) {
            this.#state = FlaggerRealtimeConstraintState.FAILED;
        }
    }
}