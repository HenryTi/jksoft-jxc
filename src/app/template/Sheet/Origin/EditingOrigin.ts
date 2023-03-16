import { PageMoreCacheData } from "app/coms";
import { atom, PrimitiveAtom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { SheetBase, EditingBase, DetailQuantityBase } from "../EditingBase";
import { PartOrigin } from "./PartOrigin";

export class EditingOrigin<S extends SheetBase, D extends DetailQuantityBase> extends EditingBase<S> {
    readonly atomDetails: PrimitiveAtom<D[]>;

    constructor(part: PartOrigin<S, D>) {
        super(part);
        this.atomDetails = atom(undefined as D[]);
    }

    get atomRows() { return this.atomDetails; }

    reset() {
        super.reset();
        setAtomValue(this.atomDetails, undefined);
    }

    async load(id: number) {
        let { uq, QueryGetDetails } = this.part;
        let [sheet, { ret: details }] = await Promise.all([
            uq.idObj(id),
            QueryGetDetails.query({ id }),
        ]);
        setAtomValue(this.atomSheet, sheet);
        setAtomValue(this.atomRows, details);
        setAtomValue(this.atomIsMine, true);
        this.refreshSubmitable();
    }

    async removeEmptySheet() {
        let sheet = getAtomValue(this.atomSheet);
        if (sheet === undefined) return;
        let details = getAtomValue(this.atomDetails);
        if (details?.length > 0) return;
        let { uqApp, uq, ID, IxMySheet, QueryGetDetails } = this.part;
        let sheetId = sheet.id;
        await uq.ActIX({
            IX: IxMySheet,
            ID: ID,
            values: [{
                ix: undefined,
                xi: -sheetId
            }]
        });
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            data.removeItem<{ xi: number }>(v => v.xi === sheetId);
        }
    }

    setSheet(sheet: S) {
        setAtomValue(this.atomSheet, sheet);
    }

    setDetails(detais: D[]) {
        setAtomValue(this.atomDetails, detais);
    }

    private buildNewDetails(details: any[], detail: any): any[] {
        let { id } = detail;
        let index = details.findIndex(v => v.id === id);
        if (index >= 0) {
            return [...details.splice(index, 1, detail)];
        }
        else {
            return [...details, detail];
        }
    }

    protected updateDetailAtom(detail: any): void {
        let details = getAtomValue(this.atomDetails);
        let newDetails = this.buildNewDetails(details, detail);
        setAtomValue(this.atomDetails, newDetails);
    }

    override async newSheet(target: number): Promise<S> {
        let sheet = await super.newSheet(target);
        setAtomValue(this.atomDetails, []);
        return sheet;
    }

    refreshSubmitable() {
        let details = getAtomValue(this.atomDetails);
        let submitable: boolean = false;
        for (let detail of details) {
            let { quantity } = detail;
            if (quantity === undefined) continue;
            if (quantity === 0) continue;
            submitable = true;
            break;
        }
        setAtomValue(this.atomSubmitable, submitable);
    }
}
