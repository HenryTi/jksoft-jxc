import { useUqApp } from "app/UqApp";
import { GSheet, SheetRow } from "app/tool";
import { EnumAtom, Sheet } from "uqs/UqDefault";
import { IDView } from "tonwa-app";
import { useDetailQPA } from "./Detail";
import { PageSheetAct, useSelectAtom } from "app/hooks";
import { ViewAtom } from "app/hooks";

const sheet = 'SheetSale'.toLowerCase();
// const caption = '销售单';
// const targetCaption = '往来单位';

function PageSaleEdit() {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const selectAtom = useSelectAtom();
    /*
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
        return await selectAtom('Contact'.toLowerCase() as EnumAtom);
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
        // caption,
        // targetCaption,
        // ViewTargetBand,
        ViewTarget,
        selectTarget,
        loadStart,
        act,
        useDetailReturn,
    }} />;
}

export const gSale: GSheet = {
    sheet,
    // caption,
    pageEdit: <PageSaleEdit />,
}
