import { UqApp } from "app/UqApp";
import { EditingRow, GenDetail, GenSheet, GenSheetAct, PageSheetAct, OriginDetail, SheetRow, GenMainNoTarget, GenSheetNoTarget } from "app/template/Sheet";
import { QueryMore } from "app/tool";
import { GenContact, ModalSelectContact } from "../Atom";
import { Atom, Sheet } from "uqs/UqDefault";
import { IDView, uqAppModal } from "tonwa-app";
import { ViewItemID } from "app/template";
import { Route } from "react-router-dom";
import { GenMain } from "app/template/Sheet";
import { GenPendFromItem } from "app/template/Sheet/GenPend";
import { GenDetailPend, GenDetailSplit } from "./Detail";
import { Band } from "app/coms";

export class GenSheetStoreIn extends GenSheet {
    readonly bizEntityName = 'sheetstorein';
    //protected GenMain(): new (uqApp: UqApp) => GenMain { return GenMainStoreIn; }
    readonly bizMain = 'mainstorein';
    readonly targetCaption = '仓库';
    readonly ViewTarget = ({ sheet }: { sheet: Sheet; }): JSX.Element => {
        return <IDView id={sheet.target} uq={this.uq} Template={ViewItemID} />;
    }
    readonly ViewTargetBand = ({ sheet }: { sheet: Sheet; }): JSX.Element => {
        return <Band label={this.targetCaption}>
            <this.ViewTarget sheet={sheet} />
        </Band>;
    }
    readonly selectTarget = async (header?: string): Promise<Atom> => {
        const { openModal } = uqAppModal(this.uqApp);
        // 这里实际应该选择仓库。以后再改
        let ret = await openModal<Atom>(<ModalSelectContact />);
        return ret;
    }
}
/*
class GenMainStoreIn extends GenMain {
    readonly bizEntityName = 'mainstorein';
    readonly targetCaption = '仓库';
    readonly ViewTarget = ({ sheet }: { sheet: Sheet; }): JSX.Element => {
        return <IDView id={sheet.target} uq={this.uq} Template={ViewItemID} />;
    }
    readonly ViewTargetBand = ({ sheet }: { sheet: Sheet; }): JSX.Element => {
        return <Band label={this.targetCaption}>
            <this.ViewTarget sheet={sheet} />
        </Band>;
    }
    readonly selectTarget = async (header?: string): Promise<Atom> => {
        const { openModal } = uqAppModal(this.uqApp);
        // 这里实际应该选择仓库。以后再改
        let ret = await openModal<Atom>(<ModalSelectContact />);
        return ret;
    }
}
*/

class GenDetailStoreIn extends GenDetailPend {
    readonly bizEntityName = 'detailstorein';
}

class GetPendStroeIn extends GenPendFromItem {
    get caption(): string { return '选择待入库' }
    get placeholderOfSearch(): string { return '待入库商品编号名称' }
}

export class GenStoreInAct extends GenSheetAct {
    protected GenSheet(): new (uqApp: UqApp) => GenSheet { return GenSheetStoreIn; }
    protected get GenDetail(): (new (uqApp: UqApp) => GenDetail) { return GenDetailStoreIn; }
    protected get GenPend() { return GetPendStroeIn; }
    protected override async loadStart(): Promise<{ sheet: Sheet, sheetRows: SheetRow[]; }> {
        let sheetRows = await this.genPend.select(undefined);
        if (sheetRows === undefined) {
            return undefined;
        }
        let target: number;
        let { selectTarget } = this.genSheet;
        if (selectTarget !== undefined) {
            let targetAtom = await selectTarget('选择仓库');
            target = targetAtom.id;
        }
        let sheet = await this.newSheet(target);
        return { sheet, sheetRows };
    }
}

function PageStoreIn() {
    return <PageSheetAct Gen={GenStoreInAct} />;
}

class GenDetailStoreInMultiStorage extends GenDetailSplit {
    readonly bizEntityName = 'detailstorein';
    readonly selectTarget = async (header?: string): Promise<Atom> => {
        const { openModal } = uqAppModal(this.uqApp);
        const ret = await openModal(<ModalSelectContact />);
        return ret;
    }
}

export class GenSheetStoreInMultiStorage extends GenSheetNoTarget {
    readonly bizEntityName = 'sheetstoreinmultistorage';
    readonly bizMain = 'mainstorein';
    // protected GenMain(): new (uqApp: UqApp) => GenMain { return GenMainStoreInMultiStorage; }
}
/*
class GenMainStoreInMultiStorage extends GenMainNoTarget {
    readonly bizEntityName = 'mainstorein';
}
*/
class GetPendStroeInMultiStorage extends GetPendStroeIn {
    protected pendItemToEditingRow(originDetail: OriginDetail): SheetRow {
        return {
            origin: originDetail,
            details: []
        };
    }
}

export class GenStoreInMultiStorageAct extends GenSheetAct {
    get caption() { return this.genSheet.caption; }
    get path() { return this.genSheet.path; }
    protected GenSheet(): new (uqApp: UqApp) => GenSheet { return GenSheetStoreInMultiStorage; }
    protected get GenDetail(): (new (uqApp: UqApp) => GenDetail) { return GenDetailStoreInMultiStorage; }
    protected get GenPend() { return GetPendStroeInMultiStorage; }
    protected override async loadStart(): Promise<{ sheet: Sheet, sheetRows: SheetRow[]; }> {
        let sheetRows = await this.genPend.select(undefined);
        if (sheetRows === undefined) {
            return undefined;
        }
        let sheet = await this.newSheet(undefined);
        return { sheet, sheetRows };
    }
}

function PageStoreInMultiStorage() {
    return <PageSheetAct Gen={GenStoreInMultiStorageAct} />;
}

export function routeSheetStoreIn(uqApp: UqApp) {
    let { path } = uqApp.objectOf(GenSheetStoreIn);
    let { path: pathMultiStorage } = uqApp.objectOf(GenStoreInMultiStorageAct);
    return <>
        <Route path={`${path}/:id`} element={<PageStoreIn />} />
        <Route path={path} element={<PageStoreIn />} />
        <Route path={`${pathMultiStorage}/:id`} element={<PageStoreInMultiStorage />} />
        <Route path={pathMultiStorage} element={<PageStoreInMultiStorage />} />
    </>;
}
