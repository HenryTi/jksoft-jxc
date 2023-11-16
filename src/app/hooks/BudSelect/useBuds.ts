import { BizBud, Entity, EnumBudType } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { WritableAtom, atom } from "jotai";
import { Atom, ParamSearchAtomBuds, Atom as UqAtom } from "uqs/UqDefault";
import { useCallback } from "react";

interface OptionsUseBuds {
    entity: Entity;
    buds: number[];
    noMedsMessage?: string,
}
export function useBuds({ entity, buds, noMedsMessage }: OptionsUseBuds) {
    const uqApp = useUqApp();
    const { biz } = uqApp;
    let bizBuds: BizBud[] = (buds === undefined) ? [] : buds.map(v => biz.budFromId(v));

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

export function useAtomBudsSearch(options: OptionsUseBuds) {
    const { uq, biz } = useUqApp();
    const { entity, bizBuds, noMedsMessage, saveBuds } = useBuds(options);

    const search = useCallback(async function (param: any, pageStart: any, pageSize: number) {
        const searchParam: ParamSearchAtomBuds = {
            phrase: entity.id,
            buds: bizBuds?.map(v => v.id),
            key: param?.key,
        }
        let rowMeds: RowMed[] = [];
        let result = await uq.SearchAtomBuds.page(searchParam, pageStart, pageSize);
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
        function budRow(row: any) {
            let { id, bud } = row;
            let index = bizBudColl[bud];
            if (index === undefined) {
                let bizBud = biz.budFromId(bud);
                index = bizBuds.indexOf(bizBud);
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
    }, []);
    return {
        search,
        saveBuds,
        noMedsMessage,
        bizBuds,
        entity,
    }
}
