import { UqApp } from "app/UqApp";
import { Gen } from "app/tool";
import { GenSheet } from "./GenSheet";
import { GenDetail } from "./GenDetail";
import { GenPend } from "./GenPend";
import { Atom, Detail, Sheet } from "uqs/UqDefault";
import { OriginDetail, SheetRow } from "../../tool";
import { GenEditing } from "./GenEditing";

export abstract class GenSheetAct extends Gen {
    protected abstract GenSheet(): new (uqApp: UqApp) => GenSheet;
    get caption() { return this.genSheet.caption; }
    get path() { return this.genSheet.path; }
    get act(): string { return '$' }

    protected readonly genSheet: GenSheet;
    readonly genPend: GenPend;
    get phrase(): string { return this.genSheet.phrase; }
    get targetCaption(): string { return this.genSheet.targetCaption; }
    get ViewTargetBand(): (props: { sheet: Sheet; }) => JSX.Element { return this.genSheet.ViewTargetBand; }
    get ViewTarget(): (props: { sheet: Sheet; }) => JSX.Element { return this.genSheet.ViewTarget; }
    get selectTarget(): (header?: string) => Promise<Atom> { return this.genSheet.selectTarget; }

    constructor(uqApp: UqApp) {
        super(uqApp);
        this.genSheet = uqApp.objectOf(this.GenSheet());
        let genDetail = this.buildGenDetail();
        const { fromPend } = this.genSheet.entity.getAct(genDetail.entity.name, this.act);
        const GenPend = this.GenPend;
        if (GenPend !== undefined) {
            this.genPend = new GenPend(uqApp, fromPend.name);
        }
    }

    newEditing(): GenEditing { return new GenEditing(this); }

    protected get GenPend(): new (uqApp: UqApp, pendName: string) => GenPend { return undefined; }
    protected abstract get GenDetail(): new (uqApp: UqApp) => GenDetail;
    genDetail: GenDetail;
    private buildGenDetail(): GenDetail {
        return this.genDetail = new this.GenDetail(this.uqApp);
    }

    async loadSheet(sheetId: number): Promise<{ sheet: Sheet; sheetRows: SheetRow[] }> {
        let { main: [sheet], details, origins, buds } = await this.uq.GetSheet.query({ id: sheetId, buds: undefined });
        let originColl: { [id: number]: Detail & { done: number; } } = {};
        for (let origin of origins) {
            let { id } = origin;
            originColl[id] = origin;
        }
        let sheetRows: SheetRow[] = details.map(v => {
            let { origin: originId, pendFrom, pendValue, sheet, no } = v;
            let origin = originColl[originId];
            let originDetail: OriginDetail = { ...origin, pend: pendFrom, pendValue, sheet, no };
            let detail: Detail = { ...v };
            return { origin: originDetail, details: [detail] };
        });
        return { sheet, sheetRows };
    }

    async loadStart(): Promise<{ sheet: Sheet; sheetRows: SheetRow[] }> {
        return { sheet: {} as Sheet, sheetRows: [] };
    }

    get ViewDetailRow() {
        return this.genDetail.ViewRow;
    }

    async book(sheetId: number) {
        await this.uq.BizSheetAct(sheetId, this.genDetail.bizEntityName, this.act);
    }

    async newSheet(target: number): Promise<Sheet> {
        let no = await this.uq.IDNO({ ID: this.uq.Sheet });
        let sheet: Sheet = {
            no,
            target,
            // phrase, 
            base: undefined,
            operator: undefined,
            value: undefined
        };
        return sheet;
    }

    // return: id
    async saveSheet(sheet: Sheet): Promise<number> {
        let { phrase } = this.genSheet;
        let ret = await this.uq.SaveSheet.submit({
            ...sheet,
            sheet: phrase,
        });
        let { id } = ret;
        return id;
    }
}
