import { UqApp } from "app/UqApp";
import { AtomMetricSpec, Gen } from "app/tool";
import { GenSheet } from "./GenSheet";
import { GenEditing } from "./GenEditing";
import { GenDetail } from "./GenDetail";
import { GenPend } from "./GenPend";
import { Atom, Detail, Sheet } from "uqs/UqDefault";
import { setAtomValue } from "tonwa-com";
import { EditingRow, OriginDetail, SheetRow } from "../../tool";

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
    createEditing(): GenEditing {
        return new GenEditing(this);
    }

    protected get GenPend(): new (uqApp: UqApp, pendName: string) => GenPend { return undefined; }
    protected abstract get GenDetail(): new (uqApp: UqApp) => GenDetail;
    genDetail: GenDetail;
    private buildGenDetail(): GenDetail {
        return this.genDetail = new this.GenDetail(this.uqApp);
    }

    async start(genEditing: GenEditing, sheetId: number): Promise<boolean> {
        if (sheetId !== undefined) {
            let ret = await this.loadSheet(sheetId);
            this.setEditing(genEditing, ret);
            return true;
        }

        let ret = await this.loadStart();
        if (ret === undefined) {
            return false;
        }

        this.setEditing(genEditing, ret);
        return true;
    }

    private setEditing(genEditing: GenEditing, { sheet, sheetRows }: { sheet: Sheet; sheetRows: SheetRow[]; }) {
        genEditing.addRows(sheetRows);
        setAtomValue(genEditing.atomSheet, sheet);
        // setAtomValue(genEditing.atomIsMainSaved, sheetRows.length > 0);
    }

    protected async loadSheet(sheetId: number): Promise<{ sheet: Sheet; sheetRows: SheetRow[] }> {
        let { main: [sheet], details, origins, assigns } = await this.uq.GetSheet.query({ id: sheetId, assigns: undefined });
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
            //let genSpec = this.genDetail.genAtomSpec.genSpecFromAtom(atom);
            //if (genSpec !== undefined) {
            //let spec = genSpec.entity.fromValues(specValues);
            //spec.id = specId;
            /*
            let atomMetricSpec: AtomMetricSpec = {
                atom: {
                    base: undefined,
                    id: atomId,
                    no: atomNo,
                    ex: atomEx,
                    phrase: atom,
                },
                atomMetric,
                metricItem: {
                    id: metric,
                    no: metricNo,
                    ex: metricEx,
                    base: undefined,
                    div: undefined,
                    value: undefined,
                    template: undefined,
                },
                //spec,
            };
            */
            // detail.atomMetricSpec = atomMetricSpec;
            //}
            return { origin: originDetail, details: [detail] };
        });
        return { sheet, sheetRows };
    }

    protected async loadStart(): Promise<{ sheet: Sheet; sheetRows: SheetRow[] }> {
        return { sheet: {} as Sheet, sheetRows: [] };
    }

    get ViewRow() {
        return this.genDetail.ViewRow;
    }

    async book(sheetId: number) {
        await this.uq.BizSheetAct(sheetId, this.genDetail.bizEntityName, this.act);
    }

    async addRow(genEditing: GenEditing) {
        let sheetRows = await this.genDetail.addRow(genEditing);
        if (sheetRows === undefined) return;
        // 如果第一次生成明细，则保存主表
        // await genEditing.saveSheet();
        await genEditing.saveRows(sheetRows);
        genEditing.addRows(sheetRows);
    }

    async editRow(genEditing: GenEditing, editingRow: EditingRow) {
        let { editRow } = this.genDetail;
        if (editRow === undefined) return;
        await editRow(genEditing, editingRow as any);
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
