export function filterUndefined(obj: any) {
    if (obj === null) return null;
    if (typeof obj !== 'object') return obj;
    let ret = {} as any;
    for (let i in obj) {
        let v = obj[i];
        if (typeof v === 'string') {
            let s = v as string;
            if (s.trim().length === 0) continue;
        }
        ret[i] = v;
    }
    return ret;
}
