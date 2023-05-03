import { UqApp } from "app/UqApp";
import { EditingDetail, GenDetail, GenSheet, GenSheetAct, PageSheetAct } from "app/template/Sheet";
import { QueryMore } from "app/tool";
import { GenContact } from "../Atom";
import { Detail, Sheet } from "uqs/UqDefault";
import { Band } from "app/coms";
import { IDView } from "tonwa-app";
import { ViewItemID } from "app/template";
import { Route } from "react-router-dom";
import { GenMain, GenStart } from "app/template/Sheet";
import { GenPendFromItem } from "app/template/Sheet/GenPend";
import { GenDetailPend, GenDetailSplit } from "./Detail";

export class GenSheetStoreIn extends GenSheet {
    readonly bizEntityName = 'sheetstorein';
    protected GenMain(): new (uqApp: UqApp) => GenMain { return GenMainStoreIn; }
}

class GenMainStoreIn extends GenMain {
    readonly bizEntityName = 'mainstorein';
    readonly targetCaption = '往来单位';
    get QuerySearchItem(): QueryMore {
        return this.uqApp.objectOf(GenContact).searchAtoms;
    }
    get ViewTarget(): (props: { sheet: Sheet; }) => JSX.Element {
        return ({ sheet }: { sheet: Sheet }) => {
            return <IDView id={sheet.target} uq={this.uq} Template={ViewItemID} />;
        }
    }
    get ViewTargetBand(): (props: { sheet: Sheet; }) => JSX.Element {
        return ({ sheet }: { sheet: Sheet }) => {
            return null;
        }
    }
}

class GenStartStoreIn extends GenStart {
    override async start(): Promise<{ sheet: Sheet, editingDetails: EditingDetail[]; }> {
        let ret = await this.genSheetAct.genPend.selectPend();
        let no = await this.uq.IDNO({ ID: this.uq.Sheet });
        let sheet: Sheet = { no, target: undefined as number } as Sheet;
        let editingDetails: EditingDetail[] = ret.map(v => {
            let { item, pend, pendValue, sheet, no, id } = v;
            return {
                origin: v as Detail,
                pend: pend,
                pendValue,
                sheet,
                no,
                rows: [
                    { item, value: pendValue, origin: id } as Detail
                ],
            }
        });
        return { sheet, editingDetails };
    }
}

class GenDetailStoreIn extends GenDetailPend {
    readonly bizEntityName = 'detailstorein';
}

class GetPendStroeIn extends GenPendFromItem {
    get caption(): string { return '选择待入库' }
    get placeholderOfSearch(): string { return '待入库商品编号名称' }
}

export class GenStoreInAct extends GenSheetAct {
    get caption() { return this.genSheet.caption; }
    get path() { return this.genSheet.path; }
    protected GenSheet(): new (uqApp: UqApp) => GenSheet { return GenSheetStoreIn; }
    protected get GenDetail(): (new (uqApp: UqApp) => GenDetail) { return GenDetailStoreIn; }
    protected get GenStart() { return GenStartStoreIn; }
    protected get GenPend() { return GetPendStroeIn; }
}

function PageStoreIn() {
    return <PageSheetAct Gen={GenStoreInAct} />;
}

export function routeSheetStoreIn(uqApp: UqApp) {
    let { path } = uqApp.objectOf(GenSheetStoreIn);
    return <>
        <Route path={`${path}/:id`} element={<PageStoreIn />} />
        <Route path={path} element={<PageStoreIn />} />
    </>;
}
