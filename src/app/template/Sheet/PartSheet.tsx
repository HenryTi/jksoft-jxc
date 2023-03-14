import { PageMoreCacheData } from "app/coms";
import { UqApp } from "app/UqApp";
import { atom, PrimitiveAtom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { UqAction, UqID, UqIX, UqQuery } from "tonwa-uq";
import { DetailQPA } from "uqs/JsTicket";
import { PartInput, PartProps } from "../Part";

export interface Editing<S extends SheetBase, R = any> {
    atomSheet: PrimitiveAtom<S>;
    get atomRows(): PrimitiveAtom<R>;
    atomSubmitable: PrimitiveAtom<boolean>;
    atomIsMine: PrimitiveAtom<boolean>;
    bookSheet(): Promise<void>;
    discard(): Promise<void>;
}

export abstract class EditingBase<S extends SheetBase, R = any> implements Editing<S, R> {
    protected part: PartSheet<S, any>;
    readonly atomSheet: PrimitiveAtom<S>;
    readonly atomSubmitable: PrimitiveAtom<boolean>;
    readonly atomIsMine: PrimitiveAtom<boolean>;

    constructor(part: PartSheet<S, any>) {
        this.part = part;
        this.atomSheet = atom(undefined as S);
        this.atomSubmitable = atom(false);
        this.atomIsMine = atom(false);
    }

    reset(): void {
        setAtomValue(this.atomSheet, undefined);
        setAtomValue(this.atomSubmitable, false);
        setAtomValue(this.atomIsMine, false);
    }

    async load(sheet: number) {
    }

    async newSheet(target: number) {
        let { uq, ID } = this.part;
        let no = await uq.IDNO({ ID });
        let sheet = this.part.buildSheet(undefined, no, target);
        setAtomValue(this.atomSheet, sheet);
        return sheet;
    }

    async setAsMine() {
        const isMine = getAtomValue(this.atomIsMine);
        if (isMine === true) return;
        let { uqApp, uq, ID, IxMySheet } = this.part;
        const sheet = getAtomValue(this.atomSheet);
        let [id] = await uq.ActIX({
            IX: IxMySheet,
            ID: ID,
            values: [{
                ix: undefined,
                xi: sheet,
            }]
        });
        sheet.id = id;
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            data.addItem({ ix: undefined, xi: id });
        }
        setAtomValue(this.atomIsMine, true);
    }

    abstract get atomRows(): PrimitiveAtom<R>;

    async setDetail(detail: any): Promise<number> {
        let { uq, IDDetail } = this.part;
        let retId = await uq.ActID({
            ID: IDDetail,
            value: detail
        });
        await this.setAsMine();
        this.updateDetail(detail);
        return retId;
    }

    updateDetail(detail: any) {
        this.refreshSubmitable();
    }

    refreshSubmitable() {
    }

    async discard() {
        let { uq, IxMySheet } = this.part;
        let sheet = getAtomValue(this.atomSheet);
        await uq.ActIX({ IX: IxMySheet, values: [{ ix: undefined, xi: -sheet.id }] });
        this.removeSheetFromCache();
    }

    private removeSheetFromCache() {
        let { uqApp } = this.part;
        let sheet = getAtomValue(this.atomSheet);
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            let sheetId = sheet.id;
            data.removeItem<{ ix: number, xi: number }>(v => v.xi === sheetId) as any;
        }
    }

    async bookSheet() {
        let { ActBookSheet } = this.part;
        let sheet = getAtomValue(this.atomSheet);
        await ActBookSheet.submit({ id: sheet.id });
        this.removeSheetFromCache();
    }
}

export interface SheetBase { id?: number; no?: string; }
export interface DetailBase { id?: number; }
export interface DetailQuantityBase { id?: number; quantity: number; }
export interface DetailValueBase { id?: number; value: number; }
export abstract class PartSheet<S extends SheetBase = any, D extends DetailBase = any> extends PartInput {
    readonly IxMySheet: UqIX<any>;

    abstract get pathNew(): string;
    abstract get pathEdit(): string;

    abstract get IDDetail(): UqID<DetailQPA>;
    abstract get QueryGetDetails(): UqQuery<{ id: number }, { ret: any[] }>;
    abstract get ActBookSheet(): UqAction<any, any>;
    abstract get QuerySearchSheetItem(): UqQuery<any, any>;

    abstract get ModalSheetStart(): (props: PartProps<PartSheet<S, D>>) => JSX.Element;
    abstract get PageSheetDetail(): <T extends PartSheet<S, D>>(props: (PartProps<T> & { detail: Partial<D>; })) => JSX.Element;
    abstract get PageDetailItemSelect(): () => JSX.Element;
    abstract get ViewItemEditRow(): (props: { row: any; Part: new (uqApp: UqApp) => PartSheet<S, D> }) => JSX.Element;
    abstract get ViewTarget(): (props: { sheet: S; }) => JSX.Element;
    abstract get ViewTargetBand(): (props: { sheet: S; }) => JSX.Element;
    abstract buildDetailFromSelectedItem: (selectedItem: any) => any;
    abstract buildSheet(id: number, no: string, target: number): S;

    readonly editing: Editing<S>;

    constructor(uqApp: UqApp) {
        super(uqApp);
        let uq = this.uq;
        this.IxMySheet = uq.IxMySheet;
    }

    // 单据列表项显示
    ViewSheetListItem = ({ value }: { value: S }) => {
        return <div className="d-flex">
            <div className="me-3 w-4c text-secondary">{this.caption}</div>
            <div className="me-3 w-8c fw-bold">{value.no}</div>
            <this.ViewTarget sheet={value} />
        </div>
    }
}
