import { EntitySpec } from "app/Biz";
import { Store } from "app/tool";
import { atom } from "jotai";
import { useRef } from "react";
import { BudValue } from "tonwa-app";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { Spec } from "uqs/UqDefault";
import { ViewAtom } from "../ViewAtom";

export interface SpecBaseValue {
    id: number;
    main: any;
    buds: { [prop: number]: BudValue; };
}

export class SpecStore extends Store<EntitySpec> {
    readonly itemsAtom = atom(undefined as Spec[]);
    readonly baseValue: SpecBaseValue;

    constructor(entitySpec: EntitySpec, baseValue: SpecBaseValue) {
        super(entitySpec);
        this.baseValue = baseValue;
    }

    async load() {
        setAtomValue(this.itemsAtom, []);
    }

    async addSpec(specValue: Spec) {
        let items = getAtomValue(this.itemsAtom);
        if (items === undefined) items = [specValue];
        else items.unshift(specValue);
        setAtomValue(this.itemsAtom, [...items]);
    }

    topViewAtom() {
        return <ViewAtom value={this.baseValue.main} />;
    }
}

export function useSpecStore(spec: EntitySpec, baseValue: SpecBaseValue) {
    const ret = useRef(new SpecStore(spec, baseValue));
    return ret.current;
}
