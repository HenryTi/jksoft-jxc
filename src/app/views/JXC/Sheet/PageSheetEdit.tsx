import { GSheet, SheetRow } from "app/tool";
import { Bin, BizPhraseType, EnumAtom, Sheet } from "uqs/UqDefault";
import { useDetailQPA } from "./Detail";
import { PageSheetAct, usePick, useSelectAtom } from "app/hooks";
import { IDView, Page } from "tonwa-app";
import { useUqApp } from "app/UqApp";
import { ViewAtom } from "app/hooks";
import { useParams } from "react-router-dom";
import { EntitySheet } from "app/Biz";

export function PageSheetEdit() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const { sheet } = useParams();
    // const selectAtom = useSelectAtom();
    const entitySheet = biz.entityFrom62(sheet) as EntitySheet; // .entities[sheet] as EntitySheet;
    const pick = usePick();
    function ViewTarget({ sheet }: { sheet: Sheet & Bin; }) {
        return <IDView id={sheet.i} uq={uq} Template={ViewAtom} />;
    }
    async function selectTarget() {
        //return await selectAtom('contact' as EnumAtom);
        let { main: entityMain } = entitySheet;
        let retPick = await pick(entityMain.i);
        if (retPick === undefined) return;
        let { atom, spec } = retPick;
        let { props } = await uq.GetAtom.query({ id: atom });
        return props[0] as any;
    }
    async function loadStart(): Promise<{ sheet: Sheet; sheetRows: SheetRow[] }> {
        let targetAtom = await selectTarget();
        if (targetAtom === undefined) return;
        let no = await uq.IDNO({ ID: uq.Sheet });
        let main = { no, i: targetAtom.id } as Sheet & Bin;
        return { sheet: main, sheetRows: [] };
    }
    const detail = 'detailpurchase';
    const useDetailReturn = useDetailQPA({ detail });
    if (entitySheet === undefined || entitySheet.type !== 'sheet') {
        return <Page header="unreachable">
            <div className="m-3">
                unreachable {sheet}
            </div>
        </Page>
    }
    return <PageSheetAct {...{
        entitySheet,
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
