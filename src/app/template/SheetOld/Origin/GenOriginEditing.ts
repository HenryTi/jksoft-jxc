import { atom, PrimitiveAtom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { Detail, Sheet } from "uqs/UqDefault";
import { GenEditingOld } from "../GenEditingOld";
import { GenOrigin } from "./GenOrigin";

export class GenOriginEditing extends GenEditingOld {
    readonly atomDetails: PrimitiveAtom<Detail[]>;

    constructor(gen: GenOrigin) {
        super(gen);
        this.atomDetails = atom(undefined as Detail[]);
    }

    get atomRows() { return this.atomDetails; }

    reset() {
        super.reset();
        setAtomValue(this.atomDetails, undefined);
    }

    async load(id: number) {
        let { uq } = this.gen;
        let { main: [sheet], details } = await uq.GetSheet.query({ id, buds: undefined });
        setAtomValue(this.atomSheet, sheet);
        setAtomValue(this.atomRows, details);
        setAtomValue(this.atomIsMine, true);
        this.refreshSubmitable();
    }

    setSheet(sheet: Sheet) {
        setAtomValue(this.atomSheet, sheet);
    }

    private buildNewDetails(details: any[], detail: any): any[] {
        let { id } = detail;
        let index = details.findIndex(v => v.id === id);
        if (index >= 0) {
            details[index] = detail;
            return [...details];
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

    override async newSheet(target: number): Promise<Sheet> {
        let sheet = await super.newSheet(target);
        setAtomValue(this.atomDetails, []);
        return sheet;
    }

    refreshSubmitable() {
        let details = getAtomValue(this.atomDetails);
        let submitable: boolean = false;
        for (let detail of details) {
            let { value } = detail;
            if (value === undefined) continue;
            if (value === 0) continue;
            submitable = true;
            break;
        }
        setAtomValue(this.atomSubmitable, submitable);
    }
}
