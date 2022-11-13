import FlaggerSupportChecker from "./FlaggerSupportChecker";
import {z} from "zod";

const FlaggerWebAuthSupportCheckerOptions = z.object({

});

export default class FlaggerWebAuthSupportChecker extends FlaggerSupportChecker<typeof FlaggerWebAuthSupportCheckerOptions> {
    readonly name = 'webAuth';

    constructor() {
        super(FlaggerWebAuthSupportCheckerOptions);
    }

    protected async canSupportFeature(options: z.infer<typeof FlaggerWebAuthSupportCheckerOptions>): Promise<boolean> {
        return typeof window.PublicKeyCredential !== 'undefined';
    }
}