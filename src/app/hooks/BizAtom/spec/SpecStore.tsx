import { EntityFork } from "app/Biz";
import { EntityStore } from "app/tool";
import { atom } from "jotai";
import { useRef } from "react";
import { BudValue, Modal } from "tonwa-app";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { BizPhraseType, ParamSaveSpec, Spec } from "uqs/UqDefault";
import { ViewAtom } from "../ViewAtom";
import { AtomIDValue } from "../AtomIDValue";
import { ViewSpecId } from "app/coms/ViewSpecId";

export enum EnumSaveSpec {
    errorInput = -1,
    duplicateKey = -2,
    success = 0,
}

export interface BudValues {
    [bud: string]: BudValue;
}

export class SpecStore extends EntityStore<EntityFork> {
    readonly itemsAtom = atom(undefined as any[]);
    readonly baseValue: AtomIDValue;

    constructor(modal: Modal, entitySpec: EntityFork, baseValue: AtomIDValue) {
        super(modal, entitySpec);
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
            let buds: any = {};
            let value: any = { id, buds };
            for (let [bud, val] of keys) {
                switch (bud) {
                    default: buds[bud] = val; break;
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
        switch (this.entity.base.bizPhraseType) {
            case BizPhraseType.fork:
                return <ViewSpecId id={this.baseValue.id} />;
            case BizPhraseType.atom:
                return <ViewAtom value={this.baseValue.main} />;
        }
    }
}

export function useSpecStore(modal: Modal, spec: EntityFork, baseValue: AtomIDValue) {
    const ret = useRef(new SpecStore(modal, spec, baseValue));
    return ret.current;
}
