import { GSheet, SheetRow } from "app/tool";
import { Atom, EnumSheet, Sheet } from "uqs/UqDefault";
import { useDetailQPA } from "./Detail";
import { useSheetAct } from "app/hooks";
import { IDView, uqAppModal } from "tonwa-app";
import { Band } from "app/coms";
import { useUqApp } from "app/UqApp";
import { ModalSelectContact, ViewItemContact } from "../Atom";

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
}

export const gPurchase: GSheet = {
    sheet,
    caption,
    pageEdit: <PagePurchaseEdit />,
}
