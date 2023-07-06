import { useUqApp } from "app/UqApp";
import { PageSheetAct, selectAtom, usePendFromItem } from "app/hooks";
import { GSheet, SheetRow } from "app/tool";
import { ViewItemContact } from "../Atom";
import { EnumAtom, EnumSheet, Sheet } from "uqs/UqDefault";
import { IDView } from "tonwa-app";
import { Band } from "app/coms";
import { EntitySheet } from "app/Biz";
import { useDetailPend } from "./Detail/Pend/useDetailPend";
import { ViewPendRow } from "./ViewPendRow";

const sheet = EnumSheet.SheetStoreOut;
const caption = '出库单';
const targetCaption = '往来单位';
function PageStoreOut() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const act = '$';
    const detail = 'detailstoreout';
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
export const gStoreOut: GSheet = {
    sheet,
    caption,
    pageEdit: <PageStoreOut />,
}
