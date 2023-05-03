import { UqApp } from "app/UqApp";
import { Gen } from "app/tool";
import { GenSheet } from "./GenSheet";
import { GenStart } from "./GenStart";
import { GenEditing } from "./GenEditing";
import { GenDetail } from "./GenDetail";
import { GenPend } from "./GenPend";

export abstract class GenSheetAct extends Gen {
    protected abstract GenSheet(): new (uqApp: UqApp) => GenSheet;
    abstract get caption(): string;
    abstract get path(): string;
    get act(): string { return '$' }

    readonly genSheet: GenSheet;
    readonly genPend: GenPend;

    constructor(uqApp: UqApp) {
        super(uqApp);
        this.genSheet = uqApp.objectOf(this.GenSheet());
        let genDetail = this.genDetail;
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

    protected get GenStart(): new (uqApp: UqApp, genSheetAct: GenSheetAct) => GenStart { return undefined; }
    private _genStart: GenStart;
    get genStart(): GenStart {
        if (this._genStart !== undefined) return this._genStart;
        let Gen = this.GenStart;
        if (Gen === undefined) return undefined;
        return this._genStart = new Gen(this.uqApp, this);
    }

    protected abstract get GenDetail(): new (uqApp: UqApp) => GenDetail;
    private _genDetail: GenDetail;
    get genDetail(): GenDetail {
        if (this._genDetail !== undefined) return this._genDetail;
        return this._genDetail = new this.GenDetail(this.uqApp);
    }
}
