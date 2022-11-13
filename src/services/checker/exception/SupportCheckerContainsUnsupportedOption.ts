import FlaggerSupportChecker from "../FlaggerSupportChecker";

export default class SupportCheckerContainsUnsupportedOption extends Error {
    constructor(supportChecker: FlaggerSupportChecker<any>, unsupportedOption: string) {
        super(`Support checker ${supportChecker.name} contains unsupported option ${unsupportedOption}`);
    }
}