import { useUqApp } from "app/UqApp";
import { useEffect, useState } from "react";
import { AtomMetric, AtomMetricSpec } from "uqs/UqDefault";

/*
function wrapPromise(promise: Promise<any>) {
    let status = 'pending';
    let response: any;
    const suspender = promise.then(
        res => {
            status = 'success';
            response = res;
        },
        err => {
            status = 'error';
            response = err;
        },
    );
    const handler: { [key: string]: () => any } = {
        pending: () => {
            throw suspender;
        },
        error: () => {
            throw response;
        },
        default: () => response,
    };
    const read = () => {
        let func = handler[status];
        const result = func ? func() : handler.default();
        return result;
    };
    return { read };
}
*/
export function useValueId<T = any>(id: number): T {
    const { uq } = useUqApp();
    const [value, setValue] = useState({} as T);
    useEffect(() => {
        (async function () {
            if (id === undefined || id === null) return;
            let obj = await uq.idObj(id);
            setValue(obj);
        })();
    }, [id]);
    return value;
}

function useIdCache(id: number) {
    const { uq } = useUqApp();
    if (id === undefined) return {};
    return uq.idCache(id);
}

function useAtomMetricCache(id: number) {
    let am = useIdCache(id);
    let { atom: atomId, metricItem: metricItemId } = am;
    let atom = useIdCache(atomId);
    let metricItem = useIdCache(metricItemId);
    return { atom, metricItem };
}

// id of Atom
export function useBizAtom(id: number) {
    const uqApp = useUqApp();
    const atom = useValueId(id);
    let viewAtom: any;
    if (atom !== undefined) {
        let { $phrase } = atom;
        if ($phrase !== undefined) {
            const gAtom = uqApp.gAtoms[$phrase];
            if (gAtom !== undefined) {
                viewAtom = <gAtom.ViewItem value={atom} />;
            }
        }
    }
    return {
        atom,
        viewAtom,
    };
}

// id of AtomMetric
export function useBizAtomMetric(id: number) {
    const uqApp = useUqApp();
    let value = useValueId<AtomMetric>(id);
    let { atom: atomId, metricItem: metricItemId } = value;
    let atom = useIdCache(atomId);
    let metricItem = useIdCache(metricItemId);
    let viewAtom: any;
    if (atom !== undefined) {
        let { $phrase } = atom;
        if ($phrase !== undefined) {
            const gAtom = uqApp.gAtoms[$phrase];
            if (gAtom !== undefined) {
                viewAtom = <gAtom.ViewItem value={atom} />;
            }
        }
    }
    let viewMetricItem = <>{metricItem?.ex}</>;
    return {
        atom,
        metricItem,
        viewAtom,
        viewMetricItem,
    }
}

// id of AtomMetricSpce
export function useBizAtomMetricSpec(id: number) {
    const uqApp = useUqApp();
    let value = useValueId<AtomMetricSpec>(id);
    let { atomMetric: atomMetricId, spec: specId } = value;
    let spec = useIdCache(specId);
    let { atom, metricItem } = useAtomMetricCache(atomMetricId);
    let viewAtom: any;
    if (atom !== undefined) {
        let { $phrase } = atom;
        if ($phrase !== undefined) {
            const gAtom = uqApp.gAtoms[$phrase];
            if (gAtom !== undefined) {
                viewAtom = <gAtom.ViewItem value={atom} />;
            }
        }
    }
    let viewSpec: any;
    if (spec !== undefined) {
        let { $entity } = spec;
        if ($entity !== undefined) {
            const gSpec = uqApp.spec($entity);
            viewSpec = <gSpec.View value={spec} />;
        }
    }
    let viewMetricItem = <>{metricItem?.ex}</>;
    return {
        spec,
        atom,
        metricItem,
        viewAtom,
        viewMetricItem,
        viewSpec,
    }
}
