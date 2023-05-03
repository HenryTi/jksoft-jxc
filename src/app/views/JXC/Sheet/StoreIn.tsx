import { UqApp } from "app/UqApp";
import { EditingDetail, GenDetail, GenSheet, GenSheetAct, PageSheetAct } from "app/template/Sheet";
import { QueryMore } from "app/tool";
import { GenContact } from "../Atom";
import { Sheet } from "uqs/UqDefault";
import { IDView } from "tonwa-app";
import { ViewItemID } from "app/template";
import { Route } from "react-router-dom";
import { GenMain, GenStart } from "app/template/Sheet";
import { GenPendFromItem } from "app/template/Sheet/GenPend";
import { GenDetailPend, GenDetailSplit } from "./Detail";
import { Band } from "app/coms";

export class GenSheetStoreIn extends GenSheet {
    readonly bizEntityName = 'sheetstorein';
    protected GenMain(): new (uqApp: UqApp) => GenMain { return GenMainStoreIn; }
}

class GenMainStoreIn extends GenMain {
    readonly bizEntityName = 'mainstorein';
    readonly targetCaption = '仓库';
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
            return <Band label={this.targetCaption}>
                <this.ViewTarget sheet={sheet} />
            </Band>;
        }
    }
}

class GenStartStoreIn extends GenStart {
    override async start(): Promise<{ sheet: Sheet, editingDetails: EditingDetail[]; }> {
        let editingDetails = await this.genSheetAct.genPend.select(undefined);
        if (editingDetails === undefined) {
            return undefined;
        }

        let target = await this.genSheetAct.genSheet.genMain.selectTarget('选择仓库');
        let no = await this.uq.IDNO({ ID: this.uq.Sheet });
        let sheet: Sheet = { no, target } as Sheet;
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

class GenDetailStoreInMultiStorage extends GenDetailSplit {
    readonly bizEntityName = 'detailstorein';
}

export class GenStoreInMultiStorage extends GenSheetAct {
    get caption() { return this.genSheet.caption + '-多仓'; }
    get path() { return this.genSheet.path + '-multi'; }
    protected GenSheet(): new (uqApp: UqApp) => GenSheet { return GenSheetStoreIn; }
    protected get GenDetail(): (new (uqApp: UqApp) => GenDetail) { return GenDetailStoreInMultiStorage; }
    protected get GenStart() { return GenStartStoreIn; }
    protected get GenPend() { return GetPendStroeIn; }
}

function PageStoreInMultiStorage() {
    return <PageSheetAct Gen={GenStoreInMultiStorage} />;
}

export function routeSheetStoreIn(uqApp: UqApp) {
    let { path } = uqApp.objectOf(GenSheetStoreIn);
    let { path: pathMultiStorage } = uqApp.objectOf(GenStoreInMultiStorage);
    return <>
        <Route path={`${path}/:id`} element={<PageStoreIn />} />
        <Route path={path} element={<PageStoreIn />} />
        <Route path={`${pathMultiStorage}/:id`} element={<PageStoreInMultiStorage />} />
        <Route path={pathMultiStorage} element={<PageStoreInMultiStorage />} />
    </>;
}
