import { GSheet, SheetRow } from "app/tool";
import { Atom, EnumSheet, Sheet } from "uqs/UqDefault";
import { useDetailQPA } from "./Detail";
import { useSheetAct } from "app/hooks";
import { IDView, uqAppModal } from "tonwa-app";
import { Band } from "app/coms";
import { useUqApp } from "app/UqApp";
import { ModalSelectContact, ViewItemContact } from "../Atom";

/*
export class GenSheetPurchase extends GenSheet {
    readonly bizEntityName = 'sheetpurchase';
    readonly bizMain = 'mainpurchase';
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

class GenDetailPurchase extends GenDetailQPA {
    readonly bizEntityName = 'detailpurchase';
}

export class GenPurchaseAct extends GenSheetAct {
    protected GenSheet(): new (uqApp: UqApp) => GenSheet { return GenSheetPurchase; }
    protected get GenDetail() { return GenDetailPurchase; }
    async loadStart(): Promise<{ sheet: Sheet; sheetRows: SheetRow[] }> {
        let targetAtom = await this.genSheet.selectTarget();
        if (targetAtom === undefined) return;
        let no = await this.uq.IDNO({ ID: this.uq.Sheet });
        let main = { no, target: targetAtom.id } as Sheet;
        return { sheet: main, sheetRows: [] };
    }
}
*/

const sheet = EnumSheet.SheetPurchase;
const caption = '采购单';
const targetCaption = '往来单位';

function PagePurchaseEdit() {
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
    const detail = 'detailpurchase';
    const useDetailReturn = useDetailQPA({ detail });
    const ret = useSheetAct({
        sheet,
        act: '$',
        caption,
        targetCaption,
        ViewTargetBand,
        ViewTarget,
        selectTarget,
        loadStart,
        useDetailReturn,
    });
    return ret;
    // return <PageSheetAct Gen={GenPurchaseAct} />;
}
/*
export function routeSheetPurchase(uqApp: UqApp) {
    let { path } = uqApp.objectOf(GenSheetPurchase);
    return <>
        <Route path={`${path}/:id`} element={<PagePurchaseEdit />} />
        <Route path={path} element={<PagePurchaseEdit />} />
    </>;
}
*/
export const gPurchase: GSheet = {
    sheet,
    caption,
    pageEdit: <PagePurchaseEdit />,
}
