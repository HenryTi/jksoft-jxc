import { useUqApp } from "app/UqApp";
import { GSheet, SheetRow } from "app/tool";
import { ModalSelectContact, ViewItemContact } from "../Atom";
import { Atom, EnumSheet, Sheet } from "uqs/UqDefault";
import { Band } from "app/coms";
import { IDView, uqAppModal } from "tonwa-app";
import { useDetailQPA } from "./Detail";
import { useSheetAct } from "app/hooks";

/*
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

export function routeSheetSale(uqApp: UqApp) {
    let { path } = uqApp.objectOf(GenSheetSale);
    return <>
        <Route path={`${path}/:id`} element={<PageSaleEdit />} />
        <Route path={path} element={<PageSaleEdit />} />
    </>;
}
*/
const sheet = EnumSheet.SheetSale;
const caption = '销售单';
const targetCaption = '往来单位';

function PageSaleEdit() {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    function ViewTargetBand({ sheet }: { sheet: Sheet; }) {
        return <Band label={targetCaption}>
            <ViewTarget sheet={sheet} />
        </Band>;
    }
    function ViewTarget({ sheet }: { sheet: Sheet; }) {
        return <IDView id={sheet.target} uq={uq} Template={ViewItemContact} />;
    }
    async function selectTarget() {
        const { openModal } = uqAppModal(uqApp);
        let ret = await openModal<Atom>(<ModalSelectContact />);
        return ret;
    }
    async function loadStart(): Promise<{ sheet: Sheet; sheetRows: SheetRow[] }> {
        let targetAtom = await selectTarget();
        if (targetAtom === undefined) return;
        let no = await uq.IDNO({ ID: uq.Sheet });
        let main = { no, target: targetAtom.id } as Sheet;
        return { sheet: main, sheetRows: [] };
    }
    const act = '$';
    const detail = 'detailsale';
    const useDetailReturn = useDetailQPA({ detail });
    const ret = useSheetAct({
        sheet,
        caption,
        targetCaption,
        ViewTargetBand,
        ViewTarget,
        selectTarget,
        loadStart,
        act,
        useDetailReturn,
    });
    return ret;
}

export const gSale: GSheet = {
    sheet,
    caption,
    pageEdit: <PageSaleEdit />,
}
