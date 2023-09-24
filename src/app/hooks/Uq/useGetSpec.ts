import { Biz, EntityAtom } from "app/Biz";
import { EntitySpec } from "app/Biz/EntityAtom";
import { useUqApp } from "app/UqApp";
import { UseQueryOptions } from "app/tool";
import { useQuery } from "react-query";
import { Atom, UqExt } from "uqs/UqDefault";

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

    let { ret } = await uq.GetSpec.query({ id: specId });
    let atom: SpecAtom;
    let specs: SpecItem[] = [];
    let len = ret.length;
    let i = 0;
    let id: number;
    for (; i < len;) {
        let row = ret[i++];
        const { prop, value } = row;
        id = Number(value);
        let entity = biz.entities[prop];
        let { type } = entity;
        if (type === 'atom') {
            atom = buildAtom(entity as EntityAtom);
            break;
        }
        if (type === 'spec') {
            let spec: SpecItem = buildSpec(entity as EntitySpec);
            specs.push(spec);
        }
    }
    function buildAtom(entity: EntityAtom): SpecAtom {
        let no: string, ex: string;
        for (; i < len;) {
            let { prop, value } = ret[i++];
            switch (prop) {
                case 'no': no = value; break;
                case 'ex': ex = value; break;
            }
        }
        return {
            entity,
            value: {
                id,
                base: undefined,
                no,
                ex,
            },
        }
    }
    function buildSpec(entity: EntitySpec): SpecItem {
        let { keys: keysArr, props: propsArr } = entity;
        let coll: { [bud: string]: string | number } = {};
        let keys: (string | number)[] = [];
        let props: (string | number)[] = [];
        for (; i < len;) {
            let { prop, value } = ret[i];
            let p = prop.indexOf('.');
            if (p < 0) break;
            coll[prop] = value;
            i++;
        }

        for (let k of keysArr) {
            keys.push(coll[k.phrase]);
        }
        for (let p of propsArr) {
            props.push(coll[p.phrase]);
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