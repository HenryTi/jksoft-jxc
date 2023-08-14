import { useUqApp } from "app/UqApp";
import { GSheet, SheetRow } from "app/tool";
import { EnumAtom, EnumSheet, Sheet } from "uqs/UqDefault";
import { Band } from "app/coms";
import { IDView } from "tonwa-app";
import { useDetailQPA } from "./Detail";
import { selectAtom, PageSheetAct } from "app/hooks";
import { ViewAtom } from "../../ViewAtom";

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
        return <IDView id={sheet.target} uq={uq} Template={ViewAtom} />;
    }
    async function selectTarget() {
        return await selectAtom(uqApp, EnumAtom.Contact);
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
    return <PageSheetAct {...{
        sheet,
        caption,
        targetCaption,
        ViewTargetBand,
        ViewTarget,
        selectTarget,
        loadStart,
        act,
        useDetailReturn,
    }} />;
}

export const gSale: GSheet = {
    sheet,
    caption,
    pageEdit: <PageSaleEdit />,
}
