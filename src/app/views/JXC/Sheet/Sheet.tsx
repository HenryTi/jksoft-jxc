import { GSheet, SheetRow } from "app/tool";
import { EnumAtom, EnumSheet, Sheet } from "uqs/UqDefault";
import { useDetailQPA } from "./Detail";
import { PageSheetAct, useSelectAtom } from "app/hooks";
import { IDView } from "tonwa-app";
import { useUqApp } from "app/UqApp";
import { ViewAtom } from "app/hooks";
import { useParams } from "react-router-dom";

//const sheet = EnumSheet.SheetPurchase;
//const targetCaption = '往来单位';

export function PageEdit() {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const { sheet } = useParams();
    const selectAtom = useSelectAtom();
    function ViewTarget({ sheet }: { sheet: Sheet; }) {
        return <IDView id={sheet.target} uq={uq} Template={ViewAtom} />;
    }
    async function selectTarget() {
        return await selectAtom('contact' as EnumAtom);
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
        sheet: sheet as EnumSheet,
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
