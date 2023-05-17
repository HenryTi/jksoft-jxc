import { UQsMan } from "tonwa-uq";
import { Uq } from "./Uq";

export function uqsProxy(uqsMan: UQsMan) {
    const uqs: { [key: string]: any } = {};
    function setUq(uqKey: string, proxy: any): void {
        if (!uqKey) return;
        let lower = uqKey.toLowerCase();
        uqs[uqKey] = proxy;
        if (lower !== uqKey) uqs[lower] = proxy;
    }
    const { uqMans } = uqsMan;
    const len = uqMans.length;
    console.log('uqMans', uqMans);
    for (let i = 0; i < len; i++) {
        const uqMan = uqMans[i];
        let uq = new Uq(uqMan);
        let proxy = uq.$_createProxy();
        setUq(uqMan.getUqKey(), proxy);
        setUq(uqMan.getUqKeyWithConfig(), proxy);
        if (i === 0) setUq('uqdefault', proxy);
    }
    function onUqProxyError(key: string) {
        for (let i in uqs) {
            let uqReact = uqs[i];
            uqReact.localMap.removeAll();
        }
        console.error(`uq proxy ${key} error`);
    }
    return new Proxy(uqs, {
        get: (target, key, receiver) => {
            let lk = (key as string).toLowerCase();
            let ret = target[lk];
            if (ret !== undefined) return ret;
            debugger;
            console.error(`controller.uqs.${String(key)} undefined`);
            onUqProxyError(String(key));
            return undefined;
        },
    });
}
