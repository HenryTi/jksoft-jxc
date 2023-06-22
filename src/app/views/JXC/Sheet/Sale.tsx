import { UqApp } from "app/UqApp";
import { GenSheet, GenSheetAct, PageSheetAct } from "app/template/Sheet";
import { SheetRow } from "app/tool";
import { ModalSelectContact } from "../Atom";
import { Atom, Sheet } from "uqs/UqDefault";
import { Band } from "app/coms";
import { IDView, uqAppModal } from "tonwa-app";
import { ViewItemID } from "app/template";
import { Route } from "react-router-dom";
import { GenDetailQPA } from "./Detail";

export class GenSheetSale extends GenSheet {
    readonly bizEntityName = 'sheetsale';
    readonly bizMain = 'mainsale';
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

class GenDetailSale extends GenDetailQPA {
    readonly bizEntityName = 'detailsale';
}

export class GenSaleAct extends GenSheetAct {
    protected GenSheet(): new (uqApp: UqApp) => GenSheet { return GenSheetSale; }
    protected get GenDetail() { return GenDetailSale; }
    async loadStart(): Promise<{ sheet: Sheet; sheetRows: SheetRow[] }> {
        let targetAtom = await this.genSheet.selectTarget();
        let no = await this.uq.IDNO({ ID: this.uq.Sheet });
        let main = { no, target: targetAtom.id } as Sheet;
        return { sheet: main, sheetRows: [] };
    }

}

function PageSaleEdit() {
    return <PageSheetAct Gen={GenSaleAct} />;
}

export function routeSheetSale(uqApp: UqApp) {
    let { path } = uqApp.objectOf(GenSheetSale);
    return <>
        <Route path={`${path}/:id`} element={<PageSaleEdit />} />
        <Route path={path} element={<PageSaleEdit />} />
    </>;
}
