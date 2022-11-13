declare module 'watch-object' {
    export const watch: (obj: object, propName: string, watcher: (...args: any[]) => void) => void;
    export const unwatch: (obj: object, propName: string) => void;
}
