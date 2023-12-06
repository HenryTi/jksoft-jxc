import { Biz, EntityAtom } from "app/Biz";
import { EntitySpec } from "app/Biz/EntityAtom";
import { useUqApp } from "app/UqApp";
import { UseQueryOptions } from "app/tool";
import { useQuery } from "react-query";
import { Atom, ReturnGetSpecProps, UqExt } from "uqs/UqDefault";

interface SpecAtom {
    entity: EntityAtom;
    value: Atom;
}
interface SpecItem {
    entity: EntitySpec;
    id: number;
    keys: (string | number)[];
    props: (string | number)[];
}

interface SpecItems {
    atom: SpecAtom;
    specs: SpecItem[];
}

export function useGetSpec(specId: number) {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    let { data } = useQuery([specId], async () => {
        return await loadSpec(uq, biz, specId);
    }, UseQueryOptions);
    return data;
}

const cache: { [id: number]: any } = {};
const empty: SpecItems = {
    atom: {
        entity: undefined,
        value: undefined,
    },
    specs: [],
};

export async function loadSpec(uq: UqExt, biz: Biz, specId: number): Promise<SpecItems> {
    if (specId === undefined || specId === 0) {
        return empty;
    }
    let value = cache[specId];
    if (value === null) return empty;
    if (value !== undefined) return value;

    let { props } = await uq.GetSpec.query({ id: specId });
    let atom: SpecAtom;
    let specs: SpecItem[] = [];
    let len = props.length;
    let i = 0;
    for (; i < len;) {
        let row = props[i++];
        const { phrase } = row;
        // id = Number(value);
        let entity = biz.entityFromId(phrase);
        let { type } = entity;
        if (type === 'atom') {
            atom = buildAtom(entity as EntityAtom, row);
            break;
        }
        if (type === 'spec') {
            let spec: SpecItem = buildSpec(entity as EntitySpec, row);
            specs.push(spec);
        }
    }
    function buildAtom(entity: EntityAtom, row: ReturnGetSpecProps): SpecAtom {
        const { id, phrase: base, value: [no, ex] } = row;
        return {
            entity,
            value: { id, base, no, ex, },
        }
    }
    function buildSpec(entity: EntitySpec, row: ReturnGetSpecProps): SpecItem {
        let { keys: keysArr, props: propsArr } = entity;
        let coll: { [bud: number]: string | number } = {};
        let keys: (string | number)[] = [];
        let props: (string | number)[] = [];
        const { id, value: arr } = row;
        for (let [bud, value] of arr) {
            coll[bud] = value;
        }

        for (let k of keysArr) {
            keys.push(coll[k.id]);
        }
        for (let p of propsArr) {
            props.push(coll[p.id]);
        }
        return {
            entity,
            id,
            keys,
            props,
        }
    }
    return cache[specId] = {
        atom,
        specs
    };
}