import { useUqApp } from "app";

export function useBiz() {
    const uqApp = useUqApp();
    return uqApp.biz;
}