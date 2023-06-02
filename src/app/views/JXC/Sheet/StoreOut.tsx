import { UqApp } from "app/UqApp";
import { GenDetail, GenSheet, GenSheetAct, PageSheetAct, GenSheetNoTarget } from "app/template/Sheet";
import { OriginDetail, SheetRow } from "app/tool";
import { ModalSelectContact } from "../Atom";
import { Atom, Sheet } from "uqs/UqDefault";
import { IDView, uqAppModal } from "tonwa-app";
import { ViewItemID } from "app/template";
import { Route } from "react-router-dom";
import { GenPendFromItem } from "app/template/Sheet/GenPend";
import { GenDetailPend, GenDetailSplit } from "./Detail";
import { Band } from "app/coms";

export class GenSheetStoreOut extends GenSheet {
    readonly bizEntityName = 'sheetstoreout';
    readonly bizMain = 'mainstoreout';
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

class GenDetailStoreOut extends GenDetailPend {
    readonly bizEntityName = 'detailstoreout';
}

class GetPendStroeIn extends GenPendFromItem {
    get caption(): string { return '选择待入库' }
    get placeholderOfSearch(): string { return '待入库商品编号名称' }
}

export class GenStoreOutAct extends GenSheetAct {
    protected GenSheet(): new (uqApp: UqApp) => GenSheet { return GenSheetStoreOut; }
    protected get GenDetail(): (new (uqApp: UqApp) => GenDetail) { return GenDetailStoreOut; }
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

function PageStoreOut() {
    return <PageSheetAct Gen={GenStoreOutAct} />;
}

class GenDetailStoreOutMultiStorage extends GenDetailSplit {
    readonly bizEntityName = 'detailstoreout';
    override async selectTarget(header?: string): Promise<Atom> {
        const { openModal } = uqAppModal(this.uqApp);
        const ret = await openModal(<ModalSelectContact />);
        return ret;
    }
}

export class GenSheetStoreOutMultiStorage extends GenSheetNoTarget {
    readonly bizEntityName = 'sheetstoreoutmultistorage';
    readonly bizMain = 'mainstoreout';
}

class GetPendStroeInMultiStorage extends GetPendStroeIn {
    protected pendItemToEditingRow(originDetail: OriginDetail): SheetRow {
        return {
            origin: originDetail,
            details: []
        };
    }
}

export class GenStoreOutMultiStorageAct extends GenSheetAct {
    get caption() { return this.genSheet.caption; }
    get path() { return this.genSheet.path; }
    protected GenSheet(): new (uqApp: UqApp) => GenSheet { return GenSheetStoreOutMultiStorage; }
    protected get GenDetail(): (new (uqApp: UqApp) => GenDetail) { return GenDetailStoreOutMultiStorage; }
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

function PageStoreOutMultiStorage() {
    return <PageSheetAct Gen={GenStoreOutMultiStorageAct} />;
}

export function routeSheetStoreOut(uqApp: UqApp) {
    let { path } = uqApp.objectOf(GenSheetStoreOut);
    // let { path: pathMultiStorage } = uqApp.objectOf(GenStoreOutMultiStorageAct);
    return <>
        <Route path={`${path}/:id`} element={<PageStoreOut />} />
        <Route path={path} element={<PageStoreOut />} />
    </>;
    // <Route path={`${pathMultiStorage}/:id`} element={<PageStoreOutMultiStorage />} />
    // <Route path={pathMultiStorage} element={<PageStoreOutMultiStorage />} />
}
