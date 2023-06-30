import { UqApp } from "app/UqApp";
import { Gen } from "app/tool";
import { Atom, Detail, EnumSheet, Sheet } from "uqs/UqDefault";
import { OriginDetail, SheetRow } from "../../tool";
import { Biz, EntitySheet } from "app/Biz";
import { OptionsSheetAct } from "./useSheetAct";

export class GenSheetAct extends Gen {
    // private readonly options: OptionsSheet;
    // protected abstract GenSheet(): new (uqApp: UqApp) => GenSheet;
    readonly caption: string;
    // get path() { return this.genSheet.path; }
    readonly act: string;

    readonly entitySheet: EntitySheet;
    // protected readonly genSheet: GenSheet;
    readonly targetCaption: string;
    readonly ViewTargetBand: (props: { sheet: Sheet; }) => JSX.Element;
    readonly ViewTarget: (props: { sheet: Sheet; }) => JSX.Element;
    readonly selectTarget: (header?: string) => Promise<Atom>;

    constructor(uqApp: UqApp, act: string, options: OptionsSheetAct) {
        super(uqApp);
        const { biz } = uqApp;
        this.act = act;
        let { sheet, caption, targetCaption,
            ViewTargetBand, ViewTarget, selectTarget,
            loadStart
        } = options;
        this.caption = caption;
        this.targetCaption = targetCaption;
        this.ViewTargetBand = ViewTargetBand;
        this.ViewTarget = ViewTarget;
        this.selectTarget = selectTarget;
        this.entitySheet = biz.entities[sheet] as EntitySheet;
        this.loadStart = loadStart;

        // this.genSheet = uqApp.objectOf(this.GenSheet());
        // let genDetail = this.buildGenDetail();
        /*
        const { fromPend } = this.genSheet.entity.getAct(genDetail.entity.name, this.act);
        const GenPend = this.GenPend;
        if (GenPend !== undefined) {
            this.genPend = new GenPend(uqApp, fromPend.name);
        }
        */
    }

    // newEditing(): GenEditing { return new GenEditing(this); }

    // protected get GenPend(): new (uqApp: UqApp, pendName: string) => GenPend { return undefined; }
    // protected abstract get GenDetail(): new (uqApp: UqApp) => GenDetail;
    // genDetail: GenDetail;
    //private buildGenDetail(): GenDetail {
    //    return this.genDetail = new this.GenDetail(this.uqApp);
    //}

    readonly loadStart: () => Promise<{ sheet: Sheet; sheetRows: SheetRow[] }> = async () => {
        return { sheet: {} as Sheet, sheetRows: [] };
    }

    /*
    get ViewDetailRow() {
        return this.genDetail.ViewRow;
    }
    */
    /*
    async book(sheetId: number, detailName: string) {
    }
    */

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
}
