export interface ActionOptions {
    onSuccess?: (...args: any[]) => void;
    onError?: (...args: any[]) => void;
}