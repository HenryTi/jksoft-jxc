import { useCallback } from "react";

export function useT<T extends (string | number)>(t: (str: T) => any, p?: (str: any) => any): ((string: T) => any) {
    let callback = useCallback((str: T) => {
        let ret = t(str);
        if (ret) return ret;
        return p?.(str) ?? str;
    }, [t]);
    return callback;
}
