import { getAtomValue, setAtomValue } from "tonwa-com";
import { DetailBase, SheetBase, EditingBase, DetailValueBase } from "../EditingBase";
import { atom, PrimitiveAtom } from "jotai";
import { PartDerive } from "./PartDerive";

interface SheetGroup {
    target: number;
    sheets: any[];
}

export class EditingDerive<S extends SheetBase, D extends DetailValueBase> extends EditingBase<S> {
    declare protected part: PartDerive<S, any>;
    readonly atomRows: PrimitiveAtom<{ sheet: S; details: D[] }[]>;

    constructor(part: PartDerive<S, any>) {
        super(part);
        this.part = part;
        this.atomRows = atom(undefined as { sheet: S; details: D[] }[]);
    }

    reset() {
        super.reset();
        setAtomValue(this.atomRows, undefined);
    }

    getSheet(): S {
        return getAtomValue(this.atomSheet);
    }

    async load(sheetId: number) {
        let { uq } = this.part;
        let [sheet, { ret: details }] = await Promise.all([
            uq.idObj(sheetId),
            uq.GetDetailOriginQPAs.query({ id: sheetId }),
        ]);
        setAtomValue(this.atomSheet, sheet);
        const groupColl: { [origin: number]: { sheet: SheetBase; details: DetailBase[]; } } = {};
        let rows: { sheet: SheetBase, details: DetailBase[] }[] = [];
        for (let detail of details) {
            let { origin } = detail;
            let group = groupColl[origin];
            if (group === undefined) {
                group = {
                    sheet: { id: origin },
                    details: []
                }
                groupColl[origin] = group;
                rows.push(group);
            }
            group.details.push(detail);
        }
        setAtomValue(this.atomRows, rows);
        this.refreshSubmitable();
        setAtomValue(this.atomIsMine, true);
    }

    async loadOrigin(origin: number) {
        let { uq, uqApp } = this.part;
        let [sheet, { ret: details }] = await Promise.all([
            uq.idObj(origin),
            uq.GetDetailQPAsFromOrigin.query({ id: origin }),
        ]);
        let sheetDerive: S = getAtomValue(this.atomSheet);
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
        let { QueryOrigin } = this.part;
        let ret = await QueryOrigin.page({ key }, undefined, 1000);
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
