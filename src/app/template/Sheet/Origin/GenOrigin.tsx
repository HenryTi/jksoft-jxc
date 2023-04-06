import { UqApp } from "app/UqApp";
import { GenProps } from "app/tool";
import { GenSheet } from "../GenSheet";
import { EditingOrigin } from "./EditingOrigin";
import { PageOriginNew } from "./PageOriginNew";
import { QueryMore } from "app/tool";
import { Atom, Detail, Sheet } from "uqs/UqDefault";
import { FA, LMR } from "tonwa-com";
import { IDView } from "tonwa-app";
import { Band } from "app/coms";
import { ViewItemID } from "app/template/Atom";

export abstract class GenOrigin extends GenSheet {
    abstract QuerySearchItem: QueryMore;
    abstract ModalSelectDetailAtom: () => JSX.Element;
    abstract get PageSheetDetail(): <T extends GenSheet>(props: (GenProps<T> & { detail: Detail; })) => JSX.Element;
    abstract PageSheetEdit: () => JSX.Element;

    readonly ViewNO: (props: { no: string }) => JSX.Element;
    readonly ViewItemEditRow: ({ row }: { row: any; }) => JSX.Element;
    readonly ViewTarget: (props: { sheet: Sheet; }) => JSX.Element;
    readonly ViewTargetBand: (props: { sheet: Sheet; }) => JSX.Element;

    readonly ModalSheetStart: (props: GenProps<GenSheet>) => JSX.Element;
    declare readonly editing: EditingOrigin;

    constructor(uqApp: UqApp) {
        super(uqApp);

        let uq = this.uq;
        this.ModalSheetStart = PageOriginNew as any;
        this.editing = new EditingOrigin(this);

        this.ViewItemEditRow = function ({ row }: { row: Detail }) {
            let { item, value, v1: price, v2: amount } = row;
            return <LMR className="px-3 py-2">
                <IDView uq={uq} id={item} Template={ViewItemID} />
                <div className="align-self-end text-end d-flex align-items-end">
                    <div>
                        <span><small>单价:</small> {price?.toFixed(4)} <small>金额:</small> {amount.toFixed(4)}</span>
                        <br />
                        <small>数量:</small> <b>{value}</b>
                    </div>
                    <FA name="pencil-square-o" className="ms-3 text-info" />
                </div>
            </LMR>;
        }

        this.ViewNO = function ({ no }: { no: string }) {
            return <Band label={'编号'}>
                {no}
            </Band>
        }

        this.ViewTarget = function ({ sheet }: { sheet: Sheet }) {
            return <IDView id={sheet.item} uq={uq} Template={ViewItemID} />;
        }

        this.ViewTargetBand = ({ sheet }: { sheet: Sheet }) => {
            return <Band label={'往来单位'}>
                <this.ViewTarget sheet={sheet} />
            </Band>;
        }
    }
}
