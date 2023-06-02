import { getAtomValue, setAtomValue } from "tonwa-com";
import { GenEditingOld } from "../GenEditingOld";
import { atom, PrimitiveAtom } from "jotai";
import { GenDerive } from "./GenDerive";
import { Detail, Sheet } from "uqs/UqDefault";

interface SheetGroup {
    target: number;
    sheets: any[];
}

interface DetailDone extends Detail {
    done: number;
}

export class GenEditingDerive extends GenEditingOld {
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
        let { main: [sheet], details } = await uq.GetSheet.query({ id: sheetId, buds: undefined });
        setAtomValue(this.atomSheet, sheet);
        const groupColl: { [origin: number]: { sheet: Sheet; details: DetailDone[]; } } = {};
        let rows: { sheet: Sheet, details: DetailDone[] }[] = [];
        for (let detail of details) {
            let { origin } = detail;
            let group = groupColl[origin];
            if (group === undefined) {
                group = {
                    sheet: { id: origin } as Sheet,
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
        let { uq, uqApp } = this.gen;
        const buds = ['done'];
        let { main: [sheet], details } = await uq.GetSheet.query({ id: origin, buds: buds.join('\t') });
        let sheetDerive: Sheet = getAtomValue(this.atomSheet);
        if (sheetDerive === undefined) {
            // let user = getAtomValue(uqApp.user);
            let item = undefined;
            await this.newSheet(item/*user.id*/);
        }

        let rows = getAtomValue(this.atomRows);
        let row = { sheet, details: details.map(v => this.gen.detailFromOrigin(v)) };
        setAtomValue(
            this.atomRows,
            rows === undefined ? [row] : [...rows, row]
        );
        this.refreshSubmitable();
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
