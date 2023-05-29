import { BizBud, Entity, OpBuds } from "app/Biz";
import { UqApp } from "app/UqApp";
import { Gen } from "app/tool";
import { Atom, WritableAtom, atom } from "jotai";
import { Atom as UqAtom } from "uqs/UqDefault";

export class GenBuds extends Gen {
    readonly entity: Entity;

    constructor(uqApp: UqApp, entity: string | Entity, budNames: string[]) {
        super(uqApp);
        if (typeof entity === 'string') {
            this.entity = this.biz.entities[entity.toLowerCase()];
        }
        else {
            this.entity = entity;
        }
        this.opBuds = new OpBuds(this.entity, budNames);
    }

    readonly opBuds: OpBuds;

    get bizBuds(): BizBud[] {
        return this.opBuds.bizBuds;
    }

    async saveBud(bizBud: BizBud, id: number, value: any) {
        return await this.opBuds.save(bizBud, id, value);
    }

    async saveBuds(bizBud: BizBud, data: { [id: number]: number; }) {
        let promises: Promise<any>[] = [];
        for (let i in data) {
            let v = data[i];
            if (v === undefined) continue;
            promises.push(this.saveBud(bizBud, Number(i), v));
        }
        await Promise.all(promises);
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
    atom: UqAtom;
    meds: Med[];
}

export abstract class GenBudsSearch extends Gen {
    readonly genBuds: GenBuds;
    readonly entityAtom: string;
    constructor(genBuds: GenBuds, entityAtom: string) {
        super(genBuds.uqApp);
        this.genBuds = genBuds;
        this.entityAtom = entityAtom;
    }

    protected abstract SearchEntityBuds(param: any, pageStart: any, pageSize: number): Promise<{ $page: any[]; meds: any[], buds: any[] }>;

    search = async (param: any, pageStart: any, pageSize: number) => {
        let { entity, opBuds, bizBuds } = this.genBuds;
        const searchParam = {
            phrase: this.entityAtom,
            budType: opBuds.budType,
            names: bizBuds?.map(v => v.phrase).join('\t'),
            ...param
        }
        let rowMeds: RowMed[] = [];
        let result = await this.SearchEntityBuds(searchParam, pageStart, pageSize);
        let { $page, meds, buds } = result;
        let rowMedColl: { [id: number]: RowMed } = {};
        let medColl: { [id: number]: Med } = {};
        for (let row of $page) {
            let rowMed: RowMed = { atom: row, meds: [] };
            rowMedColl[row.id] = rowMed;
            rowMeds.push(rowMed);
        }

        for (let m of meds as Med[]) {
            let med: Med = { ...m, values: [] };
            medColl[m.id] = med;
            rowMedColl[m.main].meds.push(med);
        }

        let bizBudColl: { [phrase: string]: number; } = {};
        for (let row of buds) {
            let { id, phrase } = row;
            let index = bizBudColl[phrase];
            if (index === undefined) {
                let bizBud = opBuds.getBizBud(phrase);
                index = opBuds.bizBuds.indexOf(bizBud);
                bizBudColl[phrase] = index;
            }
            let med = medColl[id];
            med.values[index] = row.value;
        }
        for (let rowMed of rowMeds) {
            for (let med of rowMed.meds) {
                med.atomValues = atom(med.values);
            }
        }
        return rowMeds;
    }
}
/*
export class GenAtomBudsSearch extends GenBudsSearch {
    protected SearchEntityBuds(param: any, pageStart: any, pageSize: number): Promise<{ $page: any[]; meds: any[]; buds: any[] }> {
        return this.uq.SearchAtomBuds.page(param, pageStart, pageSize);
    }
}
*/
export class GenAMSBudsSearch extends GenBudsSearch {
    protected async SearchEntityBuds(param: any, pageStart: any, pageSize: number): Promise<{ $page: any[]; meds: any[]; buds: any[] }> {
        let ret = await this.uq.SearchAtomMetricBuds.page(param, pageStart, pageSize);
        return ret;
    }
}
