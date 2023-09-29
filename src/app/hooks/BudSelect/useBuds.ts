import { BizBud, Entity, EnumBudType } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { WritableAtom, atom } from "jotai";
import { ParamSearchAtomBuds, Atom as UqAtom } from "uqs/UqDefault";
import { UqQuery } from "tonwa-uq";

interface OptionsUseBuds {
    entity: string;
    budNames: string[] | string;
    noMedsMessage?: string,
}
export function useBuds({ entity: entityName, budNames, noMedsMessage }: OptionsUseBuds) {
    const uqApp = useUqApp();
    const { biz } = uqApp;
    const entity: Entity = biz.entities[entityName.toLowerCase()];
    let buds: string[];
    switch (typeof budNames) {
        default: buds = budNames; break;
        case 'undefined': buds = []; break;
        case 'string': buds = [budNames]; break;
    }
    let bizBuds: BizBud[] = buds.map(v => getBizBud(v));

    // name: or phrase
    function getBizBud(name: string): BizBud {
        const parts = name.toLowerCase().split('.');
        const { length } = parts;
        if (length > 3) {
            throw new Error(`error Bud name '${name}'`);
        }
        let ent: Entity, budName: string;
        if (length === 1) {
            ent = entity;
            budName = name;
        }
        else {
            if (length === 3) {
                parts.splice(0, 1);
            }
            ent = biz.entities[parts[0]];
            if (ent === undefined) {
                throw new Error(`'${name}' is not a valid bud`);
            }
            budName = parts[1];
        }
        let bizBud = bizBudOfEntity(ent, budName);
        return bizBud;
        function bizBudOfEntity(entity: Entity, budName: string): BizBud {
            if (entity === undefined) {
                throw new Error('no Entity in bizBudOfEntity');
            }
            let bud = entity.buds[budName];
            if (bud !== undefined) return bud;
            throw new Error(`unknown Bud '${budName}' of Entity '${entity.phrase}'`);
        }
    }

    async function saveBuds(bizBud: BizBud, data: { [id: number]: number; }) {
        let promises: Promise<any>[] = [];
        for (let i in data) {
            let v = data[i];
            if (v === undefined) continue;
            promises.push(saveBud(bizBud, Number(i), v));
        }
        await Promise.all(promises);
        async function saveBud(bizBud: BizBud, id: number, budValue: any) {
            let { id: phraseId } = bizBud;
            let int: number, dec: number, str: string;
            switch (bizBud.budDataType.type) {
                case EnumBudType.int: int = budValue; break;
                case EnumBudType.dec: dec = budValue; break;
                case EnumBudType.char: str = budValue; break;
            }
            let param = {
                phraseId, id, int, dec, str
            };
            let { entity } = bizBud;
            let ret = await entity.uq.SaveBudValue.submit({ ...param });
            return ret;
        }
    }

    noMedsMessage = noMedsMessage ?? 'no meds';

    return {
        entity,
        noMedsMessage,
        saveBuds,
        bizBuds,
        getBizBud,
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

function useBudsSearch(options: OptionsUseBuds, QuerySearchBuds: UqQuery<any, any>) {
    const { entity, bizBuds, noMedsMessage, saveBuds, getBizBud } = useBuds(options);

    function SearchEntityBuds(param: any, pageStart: any, pageSize: number): Promise<{ $page: any[]; meds: any[]; budsInt: any[]; budsDec: any[]; budsStr: any[]; }> {
        return QuerySearchBuds.page(param, pageStart, pageSize);
    }

    async function search(param: any, pageStart: any, pageSize: number) {
        const searchParam: ParamSearchAtomBuds = {
            phrase: entity.phrase,
            budNames: bizBuds?.map(v => v.phrase).join('\t'),
            key: param?.key,
        }
        let rowMeds: RowMed[] = [];
        let result = await SearchEntityBuds(searchParam, pageStart, pageSize);
        let { $page, meds, budsInt, budsDec, budsStr } = result;
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
        function budRow(row: any) {
            let { id, phrase } = row;
            let index = bizBudColl[phrase];
            if (index === undefined) {
                let bizBud = getBizBud(phrase);
                index = bizBuds.indexOf(bizBud);
                bizBudColl[phrase] = index;
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
    return {
        search,
        saveBuds,
        noMedsMessage,
        bizBuds,
        entity,
    }
}

export function useAtomBudsSearch(options: OptionsUseBuds) {
    const { uq } = useUqApp();
    let ret = useBudsSearch(options, uq.SearchAtomBuds);
    return ret;
}

export function useAMSBudsSearch(options: OptionsUseBuds) {
    const { uq } = useUqApp();
    let ret = useBudsSearch(options, uq.SearchAtomUomBuds);
    return ret;
}
