import { useUqApp } from "app/UqApp";
import { GSheet, SheetRow } from "app/tool";
import { ViewItemContact } from "../Atom";
import { EnumAtom, EnumSheet, Sheet } from "uqs/UqDefault";
import { IDView } from "tonwa-app";
import { Band } from "app/coms";
import { selectAtom, usePendFromItem, PageSheetAct } from "app/hooks";
import { EntitySheet } from "app/Biz";
import { ViewPendRow } from "./ViewPendRow";
import { useDetailPend } from "./Detail/Pend/useDetailPend";

const sheet = EnumSheet.SheetStoreIn;
const caption = '入库单';
const targetCaption = '往来单位';
function PageStoreIn() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const act = '$';
    const detail = 'detailstorein';
    const entity = biz.entities[sheet] as EntitySheet;
    const { fromPend } = entity.getAct(detail, act);
    const selectPend = usePendFromItem({
        pendName: fromPend.name,
        ViewPendRow,
        caption: '选择待入库',
        placeholderOfSearch: '待入库商品编号名称',
    });
    function ViewTargetBand({ sheet }: { sheet: Sheet; }) {
        return <Band label={targetCaption}>
            <ViewTarget sheet={sheet} />
        </Band>;
    }
    function ViewTarget({ sheet }: { sheet: Sheet; }) {
        return <IDView id={sheet.target} uq={uq} Template={ViewItemContact} />;
    }
    async function selectTarget() {
        return await selectAtom(uqApp, EnumAtom.Contact);
    }
    async function loadStart(): Promise<{ sheet: Sheet; sheetRows: SheetRow[] }> {
        let sheetRows = await selectPend(undefined);
        if (sheetRows === undefined) {
            return undefined;
        }
        let target: number;
        if (selectTarget !== undefined) {
            let targetAtom = await selectTarget(/*'选择仓库'*/);
            target = targetAtom.id;
        }
        let no = await uq.IDNO({ ID: uq.Sheet });
        let sheet: Sheet = {
            no,
            target,
            // phrase, 
            base: undefined,
            operator: undefined,
            value: undefined
        };
        return { sheet, sheetRows };
        /*
        let targetAtom = await selectTarget();
        if (targetAtom === undefined) return;
        let no = await uq.IDNO({ ID: uq.Sheet });
        let main = { no, target: targetAtom.id } as Sheet;
        return { sheet: main, sheetRows: [] };
        */
    }
    const useDetailReturn = useDetailPend({ detail, selectPend });
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
export const gStoreIn: GSheet = {
    sheet,
    caption,
    pageEdit: <PageStoreIn />,
}
