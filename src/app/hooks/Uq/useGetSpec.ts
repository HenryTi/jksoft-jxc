import { Biz, EntityAtom } from "app/Biz";
import { EntityFork } from "app/Biz/EntityID";
import { useUqApp } from "app/UqApp";
// import { UseQueryOptions } from "app/tool";
import { useQuery } from "@tanstack/react-query";
import { isPromise } from "tonwa-uq";
import { Atom, ReturnGetForkProps, UqExt } from "uqs/UqDefault";

interface SpecAtom {
    entity: EntityAtom;
    value: Atom;
}
interface SpecItem {
    entity: EntityFork;
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
    let { data } = useQuery({
        queryKey: [specId],
        queryFn: async () => {
            return await loadSpec(uq, biz, specId);
        },
        refetchOnWindowFocus: false
        // UseQueryOptions
    });
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
    if (value !== undefined) {
        if (isPromise(value) === true) {
            let ret = await value;
            return buildSpec(biz, specId, ret);
        }
        return value;
    }

    let promiseGetSpec = cache[specId] = uq.GetFork.query({ id: specId });
    let { props } = await promiseGetSpec;
    return buildSpec(biz, specId, props);
}

function buildSpec(biz: Biz, specId: number, props: ReturnGetForkProps[]) {
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
            let spec: SpecItem = buildSpec(entity as EntityFork, row);
            specs.push(spec);
        }
    }
    function buildAtom(entity: EntityAtom, row: ReturnGetForkProps): SpecAtom {
        const { id, phrase: base, value: [no, ex] } = row;
        return {
            entity,
            value: { id, base, no, ex, },
        }
    }
    function buildSpec(entity: EntityFork, row: ReturnGetForkProps): SpecItem {
        let { keys: keysArr, buds: propsArr } = entity;
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