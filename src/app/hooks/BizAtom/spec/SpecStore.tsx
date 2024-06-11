import { EntitySpec } from "app/Biz";
import { Store } from "app/tool";
import { atom } from "jotai";
import { useRef } from "react";
import { BudValue } from "tonwa-app";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { ParamSaveSpec, Spec } from "uqs/UqDefault";
import { ViewAtom } from "../ViewAtom";

export interface SpecBaseValue {
    id: number;
    main: any;
    buds: { [prop: number]: BudValue; };
}

export enum EnumSaveSpec {
    errorInput = -1,
    duplicateKey = -2,
    success = 0,
}

export interface BudValues {
    [bud: string]: BudValue;
}

export class SpecStore extends Store<EntitySpec> {
    readonly itemsAtom = atom(undefined as any[]);
    readonly baseValue: SpecBaseValue;

    constructor(entitySpec: EntitySpec, baseValue: SpecBaseValue) {
        super(entitySpec);
        this.baseValue = baseValue;
    }

    async load() {
        let { ret } = await this.uq.GetSpecListFromBase.query({ base: this.baseValue.id, phrase: this.entity.id });
        let values: any[] = [];
        this.loadItems(values, ret);
        setAtomValue(this.itemsAtom, values);
    }

    private loadItems(toValues: any[], items: any[]) {
        const { noBud, exBud } = this.entity;
        const noBudId = noBud === undefined ? 0 : noBud.id;
        const exBudId = exBud === undefined ? 0 : exBud.id;
        for (let item of items) {
            const { id, keys } = item;
            let value: any = { id };
            for (let [bud, val] of keys) {
                switch (bud) {
                    default: value[bud] = val; break;
                    case noBudId: value.no = val; break;
                    case exBudId: value.ex = val; break;
                }
            }
            toValues.push(value);
        }
    }

    private addSpec(specValue: any) {
        let items = getAtomValue(this.itemsAtom);
        if (items === undefined) items = [];
        const { keys, buds } = this.entity;
        let value: any = { id: specValue.id };
        const { keys: keyValues, props: budValues } = specValue;
        value.keys = keyValues !== undefined ? keys.map(v => [v.id, keyValues[v.name]]) : [];
        if (budValues !== undefined) {
            value.keys.push(...buds.map(v => [v.id, budValues[v.name]]));
        }
        this.loadItems(items, [value]);
        setAtomValue(this.itemsAtom, [...items]);
    }

    async saveSpec(id: number, keyValues: BudValues, propValues: BudValues): Promise<EnumSaveSpec> {
        const param: ParamSaveSpec = {
            id,
            spec: this.entity.id,
            base: this.baseValue.id,
            keys: keyValues,
            props: propValues,
        };
        let results = await this.uq.SaveSpec.submit(param);
        const { id: retId } = results;
        if (retId === 0) {
            console.error('input error');
            return EnumSaveSpec.errorInput;
        }
        if (retId < 0) {
            return EnumSaveSpec.duplicateKey;
        }
        results.keys = keyValues;
        results.props = propValues;
        this.addSpec(results);
        return EnumSaveSpec.success;
    }

    topViewAtom() {
        return <ViewAtom value={this.baseValue.main} />;
    }
}

export function useSpecStore(spec: EntitySpec, baseValue: SpecBaseValue) {
    const ret = useRef(new SpecStore(spec, baseValue));
    return ret.current;
}
