import { useUqApp } from "app/UqApp";
import { AtomSpec, AtomUom, Uom } from "app/tool";
import { useEffect, useState } from "react";

export function useValueId<T = any>(id: number): T {
    const { uq } = useUqApp();
    const [value, setValue] = useState({} as T);
    useEffect(() => {
        (async function () {
            if (id === undefined || id === null) return;
            let obj = await uq.idObj(id);
            setValue(obj ?? {});
        })();
    }, [id]);
    return value;
}

function useIdCache(id: number) {
    const { uq } = useUqApp();
    if (id === undefined) return {};
    return uq.idCache(id);
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

// id of AtomUom
export function useBizAtomUom(id: number) {
    const uqApp = useUqApp();
    let value = useValueId<AtomUom>(id);
    let { atom: atomId, uom: uomId } = value;
    let atom = useIdCache(atomId);
    let uom: Uom = useIdCache(uomId);
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
    let viewUom = <>{uom?.ex}</>;
    return {
        atom,
        uom,
        viewAtom,
        viewUom,
    }
}

// id of AtomSpce
export function useBizAtomSpec(id: number) {
    const uqApp = useUqApp();
    let value = useValueId<AtomSpec>(id);
    let { atom, uom, spec: specValue } = value;
    let spec = useIdCache(specValue?.id);
    let viewAtom: any;
    if (atom !== undefined) {
        let { phrase } = atom;
        if (phrase !== undefined) {
            const gAtom = uqApp.gAtoms[phrase];
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
    let viewUom = <>{uom?.ex}</>;
    return {
        spec,
        atom,
        uom,
        viewAtom,
        viewUom,
        viewSpec,
    }
}
