import { BizBud, EntityAtom, EntityID, EntityFork } from "tonwa";
import { EntityStore } from "app/tool";
import { WritableAtom, atom } from "jotai";
import { Modal } from "tonwa-app";
import { Atom, BizPhraseType, ParamSearchAtomBuds } from "uqs/UqDefault";

export abstract class IDSelectStore<E extends EntityID> extends EntityStore<E> {
    protected bizBuds: BizBud[];

    constructor(modal: Modal, entity: E, buds: number[], noMedsMessage?: string) {
        super(modal, entity);
        this.bizBuds = (buds === undefined) ? [] : buds.map(v => this.biz.budFromId(v));
    }

    abstract search(param: any, pageStart: any, pageSize: number): Promise<any[]>;
}

class SpecSelectStore extends IDSelectStore<EntityFork> {
    async search(param: any, pageStart: any, pageSize: number): Promise<any[]> {
        let ret = await this.client.GetSpecListFromBase(param.base, this.entity.id);
        // let { ret } = results;
        return ret;
    }
}

class AtomSelectStore extends IDSelectStore<EntityAtom> {
    async search(param: any, pageStart: any, pageSize: number) {
        const searchParam: ParamSearchAtomBuds = {
            phrase: this.entity.id,
            buds: this.bizBuds?.map(v => v.id),
            key: param?.key,
        }
        let rowMeds: RowMed[] = [];
        let result = await this.client.SearchAtomBuds(searchParam, pageStart, pageSize);
        let { $page, meds, budsInt, budsDec, budsStr } = result;
        let rowMedColl: { [id: number]: RowMed } = {};
        let medColl: { [id: number]: Med } = {};
        for (let row of $page) {
            let rowMed: RowMed = { atom: row as any, meds: [] };
            rowMedColl[row.id] = rowMed;
            rowMeds.push(rowMed);
        }

        for (let m of meds as Med[]) {
            let med: Med = { ...m, values: [] };
            medColl[m.id] = med;
            rowMedColl[m.main].meds.push(med);
        }

        let bizBudColl: { [bud: number]: number; } = {};
        const budRow = (row: any) => {
            let { id, bud } = row;
            let index = bizBudColl[bud];
            if (index === undefined) {
                let bizBud = this.biz.budFromId(bud);
                index = this.bizBuds.indexOf(bizBud);
                bizBudColl[bud] = index;
            }
            let med = medColl[id];
            med.values[index] = row.value;
        }
        for (let row of budsInt) budRow(row);
        for (let row of budsDec) budRow(row);
        for (let row of budsStr) budRow(row);
        for (let rowMed of rowMeds) {
            for (let med of rowMed.meds) {
                med.atomValues = atom(med.values);
            }
        }
        return rowMeds;
    }
}

export interface Med {
    id: number;
    main: number;
    detail: number;
    values: number[];
    atomValues: WritableAtom<number[], any, any>;
}

export interface RowMed {
    atom: Atom;
    meds: Med[];
}

export function createIDSelectStore(modal: Modal, entity: EntityID): IDSelectStore<EntityID> {
    if (entity === undefined) return undefined;
    switch (entity.bizPhraseType) {
        default: return undefined;
        case BizPhraseType.fork: return new SpecSelectStore(modal, entity as EntityFork, [], undefined);
        case BizPhraseType.atom: return new AtomSelectStore(modal, entity as EntityAtom, [], undefined);
    }
}
