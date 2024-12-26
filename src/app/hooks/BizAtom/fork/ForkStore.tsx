import { BizBud, EntityFork, EnumBudType } from "app/Biz";
import { EntityStore } from "app/tool";
import { atom } from "jotai";
import { useRef } from "react";
import { BudValue, Modal } from "tonwa-app";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { BizPhraseType, ParamSaveFork } from "uqs/UqDefault";
import { ViewAtom } from "../ViewAtom";
import { AtomIDValue } from "../AtomIDValue";
import { ViewForkId } from "app/coms/ViewForkId";

export enum EnumSaveFork {
    errorInput = -1,
    duplicateKey = -2,
    success = 0,
}

export interface BudValues {
    [bud: string | number]: BudValue;
}

export class ForkStore extends EntityStore<EntityFork> {
    readonly itemsAtom = atom(undefined as any[]);
    readonly baseValue: AtomIDValue;

    constructor(modal: Modal, entityFork: EntityFork, baseValue: AtomIDValue) {
        super(modal, entityFork);
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
            for (let [budId, val] of keys) {
                if (val === undefined || val === null) continue;
                switch (budId) {
                    default:
                        let bud = this.biz.budFromId(budId);
                        if (bud !== undefined) {
                            const { budDataType: { type } } = bud;
                            switch (type) {
                                default:
                                    val = Number(val);
                                    break;
                                case EnumBudType.char:
                                case EnumBudType.str:
                                    break;
                                case EnumBudType.arr:
                                    break;
                            }
                        }
                        buds[budId] = val;
                        break;
                    case noBudId: value.no = val; break;
                    case exBudId: value.ex = val; break;
                }
            }
            toValues.push(value);
        }
    }

    private addFork(specValue: any) {
        let items = getAtomValue(this.itemsAtom);
        if (items === undefined) items = [];
        const { keys, buds } = this.entity;
        let value: any = { id: specValue.id };
        const { values } = specValue;
        if (values !== undefined) {
            function conv(v: BizBud) {
                const { id } = v;
                return [id, values[id]];
            }
            value.keys = keys.map(conv);
            value.keys.push(...buds.map(conv));
        }
        this.loadItems(items, [value]);
        setAtomValue(this.itemsAtom, [...items]);
    }

    async saveFork(id: number, budValues: BudValues): Promise<EnumSaveFork> {
        const param: ParamSaveFork = {
            id,
            fork: this.entity.id,
            base: this.baseValue.id,
            values: budValues,
        };
        let results = await this.uq.SaveFork.submit(param);
        const { id: retId } = results;
        if (retId === 0) {
            console.error('input error');
            return EnumSaveFork.errorInput;
        }
        if (retId < 0) {
            return EnumSaveFork.duplicateKey;
        }
        results.values = budValues;
        this.addFork(results);
        return EnumSaveFork.success;
    }
}

export function ViewForkTop({ store }: { store: ForkStore; }) {
    const { entity, baseValue } = store;
    switch (entity.base.bizPhraseType) {
        default: return null;
        case BizPhraseType.fork:
            return <ViewForkId id={baseValue.id} />;
        case BizPhraseType.atom:
            return <ViewAtom value={baseValue.main} />;
    }
}

export function useForkStore(modal: Modal, fork: EntityFork, baseValue: AtomIDValue) {
    const ret = useRef(new ForkStore(modal, fork, baseValue));
    return ret.current;
}
