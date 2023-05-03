import { UqApp } from "app/UqApp";
import { GenSheet, GenSheetAct, GenMain, GenStart, PageSheetAct, EditingDetail } from "app/template/Sheet";
import { QueryMore } from "app/tool";
import { GenContact } from "../Atom";
import { Detail, Sheet } from "uqs/UqDefault";
import { Band, PageQueryMore } from "app/coms";
import { IDView, uqAppModal } from "tonwa-app";
import { ViewItemID } from "app/template";
import { FA, LMR, SearchBox } from "tonwa-com";
import { Route } from "react-router-dom";
import { useState } from "react";
import { GenDetailQPA } from "./Detail";

export class GenSheetPurchase extends GenSheet {
    readonly bizEntityName = 'sheetpurchase';

    constructor(uqApp: UqApp) {
        super(uqApp);
    }

    protected GenMain(): new (uqApp: UqApp) => GenMain { return GenMainPurchase; }
}

class GenMainPurchase extends GenMain {
    readonly bizEntityName = 'mainpurchase';
    readonly QuerySearchItem: QueryMore;
    readonly targetCaption = '往来单位';
    readonly ViewTarget: (props: { sheet: Sheet; }) => JSX.Element;
    readonly ViewTargetBand: (props: { sheet: Sheet; }) => JSX.Element;

    constructor(uqApp: UqApp) {
        super(uqApp);
        this.QuerySearchItem = uqApp.objectOf(GenContact).searchAtoms;
        this.ViewTarget = ({ sheet }: { sheet: Sheet }) => {
            return <IDView id={sheet.target} uq={this.uq} Template={ViewItemID} />;
        }
        this.ViewTargetBand = ({ sheet }: { sheet: Sheet }) => {
            return <Band label={this.targetCaption}>
                <this.ViewTarget sheet={sheet} />
            </Band>;
        }
    }
}

class GenStartPurchase extends GenStart {
    override async start(): Promise<{ sheet: Sheet, editingDetails: EditingDetail[] }> {
        let { openModal, closeModal } = uqAppModal(this.uqApp);
        const Modal = () => {
            const { genSheet, caption } = this.genSheetAct;
            const { genMain } = genSheet;
            const { targetCaption, QuerySearchItem } = genMain;
            const [searchParam, setSearchParam] = useState<{ key: string; }>(undefined);
            async function onSearch(key: string) {
                setSearchParam({
                    key,
                });
            }
            function ItemView({ value }: { value: any }) {
                return <LMR className="px-3 py-2 align-items-center">
                    <FA name="angle-right" className="me-3" />
                    <span>{JSON.stringify(value)}</span>
                    <span />
                </LMR>;
            }
            const query = QuerySearchItem;
            const onItemClick = async (item: any) => {
                let no = await this.uq.IDNO({ ID: this.uq.Sheet });
                let main = { no, target: item.id };
                closeModal({ sheet: main, editingDetails: [] });
            }
            return <PageQueryMore header={`新建${caption}`}
                query={query}
                param={searchParam}
                sortField="id"
                ViewItem={ItemView}
                onItemClick={onItemClick}
            >
                <div className="m-3">
                    选择{targetCaption}
                </div>
                <SearchBox className="px-3 py-2" onSearch={onSearch} placeholder={targetCaption} />
            </PageQueryMore>;
        }
        let ret = await openModal(<Modal />);
        return ret;
    }
}

class GenDetailPurchase extends GenDetailQPA {
    readonly bizEntityName = 'detailpurchase';
}

export class GenPurchaseAct extends GenSheetAct {
    protected GenSheet(): new (uqApp: UqApp) => GenSheet { return GenSheetPurchase; }

    get caption() { return this.genSheet.caption; }
    get path() { return this.genSheet.path; }
    protected get GenDetail() { return GenDetailPurchase; }
    get PageSheetDetail(): (props: { detail: Detail; }) => JSX.Element {
        return (props: { detail: Detail; }) => {
            return <div></div >;
        }
    }
    protected get GenStart() { return GenStartPurchase; }
}

function PagePurchaseEdit() {
    return <PageSheetAct Gen={GenPurchaseAct} />;
}

export function routeSheetPurchase(uqApp: UqApp) {
    let { path } = uqApp.objectOf(GenSheetPurchase);
    return <>
        <Route path={`${path}/:id`} element={<PagePurchaseEdit />} />
        <Route path={path} element={<PagePurchaseEdit />} />
    </>;
}
