import FlaggerConstraintInterface from "./FlaggerConstraintInterface";
import {z} from "zod";
import {cookieStore} from "cookie-store";
import FlaggerActivator from "../activator/FlaggerActivator";
import FlaggerConstraint from "./FlaggerConstraint";

const FlaggerCookieConstraintConfig = z.object({
    cookieName: z.string()
});

type FlaggerCookieConstraintConfigType = z.infer<typeof FlaggerCookieConstraintConfig>;

export default class FlaggerCookieConstraint extends FlaggerConstraint<FlaggerCookieConstraintConfigType> implements FlaggerConstraintInterface {
    constructor(config: FlaggerCookieConstraintConfigType) {
        super(config, FlaggerCookieConstraintConfig);
    }

    async canBeActivated(): Promise<boolean> {
        return !!(await cookieStore.get(this.config.cookieName));
    }
}