import { GSheet, SheetRow } from "app/tool";
import { EnumAtom, EnumSheet, Sheet } from "uqs/UqDefault";
import { useDetailQPA } from "./Detail";
import { PageSheetAct, useSelectAtom } from "app/hooks";
import { IDView } from "tonwa-app";
import { useUqApp } from "app/UqApp";
import { ViewAtom } from "../../ViewAtom";

const sheet = EnumSheet.SheetPurchase;
//const targetCaption = '往来单位';

function PagePurchaseEdit() {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const selectAtom = useSelectAtom();
    /*
    const targetCaption = sheet
    function ViewTargetBand({ sheet }: { sheet: Sheet; }) {
        return <Band label={targetCaption}>
            <ViewTarget sheet={sheet} />
        </Band>;
    }
    */
    function ViewTarget({ sheet }: { sheet: Sheet; }) {
        return <IDView id={sheet.target} uq={uq} Template={ViewAtom} />;
    }
    async function selectTarget() {
        return await selectAtom(EnumAtom.Contact);
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
    return <PageSheetAct {...{
        sheet,
        act: '$',
        // caption,
        // targetCaption,
        // ViewTargetBand,
        ViewTarget,
        selectTarget,
        loadStart,
        useDetailReturn,
    }} />;
}

export const gPurchase: GSheet = {
    sheet,
    pageEdit: <PagePurchaseEdit />,
}
