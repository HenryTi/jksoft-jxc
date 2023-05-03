import { Gen } from "app/tool";
import { GenSheetAct } from "./GenSheetAct";
import { UqApp } from "app/UqApp";
import { Sheet } from "uqs/UqDefault";
import { EditingDetail } from "./EditingDetail";

export abstract class GenStart extends Gen {
    protected readonly genSheetAct: GenSheetAct;
    constructor(uqApp: UqApp, genSheetAct: GenSheetAct) {
        super(uqApp);
        this.genSheetAct = genSheetAct;
    }
    async start(): Promise<{ sheet: Sheet, editingDetails: EditingDetail[]; }> { return; }
}
