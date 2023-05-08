import { UqApp } from "app/UqApp";
import { GenSheet, GenSheetAct, GenMain, PageSheetAct, EditingRow, SheetRow } from "app/template/Sheet";
import { QueryMore } from "app/tool";
import { GenContact, ModalSelectContact } from "../Atom";
import { Atom, Detail, Sheet } from "uqs/UqDefault";
import { Band } from "app/coms";
import { IDView, uqAppModal } from "tonwa-app";
import { ViewItemID } from "app/template";
import { Route } from "react-router-dom";
import { GenDetailQPA } from "./Detail";

export class GenSheetPurchase extends GenSheet {
    readonly bizEntityName = 'sheetpurchase';
    readonly bizMain = 'mainpurchase';
    // protected GenMain(): new (uqApp: UqApp) => GenMain { return GenMainPurchase; }
    readonly targetCaption = '往来单位';
    get ViewTarget(): (props: { sheet: Sheet; }) => JSX.Element {
        return ({ sheet }: { sheet: Sheet }) => {
            return <IDView id={sheet.target} uq={this.uq} Template={ViewItemID} />;
        }
    }
    get ViewTargetBand(): ({ sheet }: { sheet: Sheet }) => JSX.Element {
        return ({ sheet }: { sheet: Sheet }) => {
            return <Band label={this.targetCaption}>
                <this.ViewTarget sheet={sheet} />
            </Band>;
        }
    }
    readonly selectTarget = async (header?: string): Promise<Atom> => {
        const { openModal } = uqAppModal(this.uqApp);
        let ret = await openModal<Atom>(<ModalSelectContact />);
        return ret;
    }
}

/*
class GenMainPurchase extends GenMain {
    readonly bizEntityName = 'mainpurchase';
    readonly targetCaption = '往来单位';
    get ViewTarget(): (props: { sheet: Sheet; }) => JSX.Element {
        return ({ sheet }: { sheet: Sheet }) => {
            return <IDView id={sheet.target} uq={this.uq} Template={ViewItemID} />;
        }
    }
    get ViewTargetBand(): ({ sheet }: { sheet: Sheet }) => JSX.Element {
        return ({ sheet }: { sheet: Sheet }) => {
            return <Band label={this.targetCaption}>
                <this.ViewTarget sheet={sheet} />
            </Band>;
        }
    }
    readonly selectTarget = async (header?: string): Promise<Atom> => {
        const { openModal } = uqAppModal(this.uqApp);
        let ret = await openModal<Atom>(<ModalSelectContact />);
        return ret;
    }
}
*/

class GenDetailPurchase extends GenDetailQPA {
    readonly bizEntityName = 'detailpurchase';
}

export class GenPurchaseAct extends GenSheetAct {
    protected GenSheet(): new (uqApp: UqApp) => GenSheet { return GenSheetPurchase; }
    protected get GenDetail() { return GenDetailPurchase; }
    protected async loadStart(): Promise<{ sheet: Sheet; sheetRows: SheetRow[] }> {
        let targetAtom = await this.genSheet.selectTarget();
        let no = await this.uq.IDNO({ ID: this.uq.Sheet });
        let main = { no, target: targetAtom.id } as Sheet;
        return { sheet: main, sheetRows: [] };
    }

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
