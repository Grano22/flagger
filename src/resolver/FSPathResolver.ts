import RuntimeEnvAware from "../RuntimeEnvAware";
import DetectedUnknownRuntimeEnvironment from "./exception/DetectedUnknownRuntimeEnvironment";

export default class FSPathResolver extends RuntimeEnvAware {
    public resolveRelativeToRootScript(subPath: string): string
    {
        if (this.isNodeJs()) {
            const path = require('path') || import('path');

            if (typeof require.main !== 'undefined' && typeof require.main.filename === 'string') {
                return path.resolve(path.dirname(require.main.filename), subPath);
            }

            // if (path.resolve('.')) {
            //     return path.resolve('.');
            // }

            // if (typeof __filename === 'undefined') {
            //     return (function() {
            //         return path.dirname(path.fileURLToPath(import.meta.url));
            //     })();
            // }

            const fs = require('fs') || import('fs');

            return path.resolve(path.dirname(fs.realpathSync(__filename)), subPath);
        }

        if (this.isBrowser()) {
            const currentScript = (document.currentScript ?
                document.currentScript :
                document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1]) as HTMLScriptElement;

            return currentScript.src + subPath;
        }

        throw new DetectedUnknownRuntimeEnvironment('CannotResolveCurrentPath');
    }
}