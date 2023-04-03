import { getAtomValue, setAtomValue } from "tonwa-com";
import { Editing } from "../Editing";
import { atom, PrimitiveAtom } from "jotai";
import { GenDerive } from "./GenDerive";
import { Detail, FlowState, Sheet } from "uqs/UqDefault";

interface SheetGroup {
    target: number;
    sheets: any[];
}

export class EditingDerive extends Editing {
    declare protected gen: GenDerive;
    readonly atomRows: PrimitiveAtom<{ sheet: Sheet; details: Detail[] }[]>;

    constructor(gen: GenDerive) {
        super(gen);
        this.gen = gen;
        this.atomRows = atom(undefined as { sheet: Sheet; details: Detail[] }[]);
    }

    reset() {
        super.reset();
        setAtomValue(this.atomRows, undefined);
    }

    getSheet(): Sheet {
        return getAtomValue(this.atomSheet);
    }

    async load(sheetId: number) {
        let { uq } = this.gen;
        let [sheet, { ret: details }] = await Promise.all([
            uq.idObj(sheetId),
            uq.GetDetailOrigin.query({ id: sheetId }),
        ]);
        setAtomValue(this.atomSheet, sheet);
        const groupColl: { [origin: number]: { sheet: Sheet; details: Detail[]; } } = {};
        let rows: { sheet: Sheet, details: Detail[] }[] = [];
        for (let detail of details) {
            let { item } = detail;
            let group = groupColl[item];
            if (group === undefined) {
                group = {
                    sheet: { id: item } as Sheet,
                    details: []
                }
                groupColl[item] = group;
                rows.push(group);
            }
            group.details.push(detail);
        }
        setAtomValue(this.atomRows, rows);
        this.refreshSubmitable();
        setAtomValue(this.atomIsMine, true);
    }

    async loadOrigin(origin: number) {
        let { uq, uqApp } = this.gen;
        let [sheet, { ret: details }] = await Promise.all([
            uq.idObj(origin),
            uq.GetDetailOrigin.query({ id: origin }),
        ]);
        let sheetDerive: Sheet = getAtomValue(this.atomSheet);
        if (sheetDerive === undefined) {
            let user = getAtomValue(uqApp.user);
            await this.newSheet(user.id);
        }

        let rows = getAtomValue(this.atomRows);
        let row = { sheet, details: details as any[] };
        setAtomValue(
            this.atomRows,
            rows === undefined ? [row] : [...rows, row]
        );
        this.refreshSubmitable();
    }

    async search(key: string): Promise<SheetGroup[]> {
        let { QueryOrigin, typePhrase } = this.gen;
        let ret = await QueryOrigin.page({ sheet: typePhrase, state: FlowState.Ready, key }, undefined, 1000);
        // 按target分组
        const groupColl: { [target: number]: SheetGroup } = {};
        for (let v of ret.$page) {
            let { target } = v;
            let group = groupColl[target];
            if (group === undefined) {
                groupColl[target] = group = {
                    target,
                    sheets: []
                };
            }
            group.sheets.push(v);
        }
        return Object.keys(groupColl).map(v => groupColl[Number(v)]);
    }

    protected updateDetailAtom(detail: any): void {
        let { id } = detail;
        let rows = getAtomValue(this.atomRows);
        for (let row of rows) {
            let { details } = row;
            let index = details.findIndex(v => v.id === id);
            if (index >= 0) {
                details.splice(index, 1, detail);
                break;
            }
        }
        setAtomValue(this.atomRows, [...rows]);
    }

    refreshSubmitable() {
        let rows = getAtomValue(this.atomRows);
        let submitable: boolean = false;
        for (let row of rows) {
            for (let detail of row.details) {
                let { value } = detail;
                if (value === undefined) continue;
                if (value === 0) continue;
                submitable = true;
                break;
            }
            if (submitable === true) break;
        }
        setAtomValue(this.atomSubmitable, submitable);
    }
}
