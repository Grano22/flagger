export default abstract class RuntimeEnvAware {
    public isBrowser(): boolean
    {
        return typeof navigator !== 'undefined' && typeof navigator.userAgent !== 'undefined';
    }

    public isNodeJs(): boolean
    {
        return typeof process !== 'undefined' && process.release.name === 'node';
    }
}