import { Page, useModal } from "tonwa-app";
import { useSheetStore } from "./SheetStore";
import { usePick } from "app/hooks/BizPick";
import { ButtonAsync, FA, LMR, useEffectOnce } from "tonwa-com";
import { ViewMain } from "./ViewMain";
import { ModalDetail } from "./ModalDetail";
import { ViewDetail } from "./ViewDetail";
import { useAtomValue } from "jotai";
import { PageInputRow } from "./PageInputRow";
import { PageInputPend } from "./PageInputPend";

export function PageSheetEdit() {
    const store = useSheetStore();
    const pick = usePick();
    const { openModal, closeModal } = useModal();
    useEffectOnce(() => {
        (async function () {
            const { main, detail } = store;
            await main.pickTarget(pick);
            await detailInputSection();
        })();
    });
    async function detailInputSection() {
        openModal(<ModalDetail />);
    }

    const { id, caption, main, detail } = store;

    async function onSubmit() {

    }
    async function onAddRow() {
        const { entityDetail } = detail;
        const { pend } = entityDetail;
        let inputed: any;
        if (pend !== undefined) {
            inputed = await openModal(<PageInputPend />);
        }
        else {
            inputed = await openModal(<PageInputRow />);
        }
        await detail.addRow();
    }
    function onRemoveSheet() {

    }

    let submitable = useAtomValue(detail.submitable);
    let sections = useAtomValue(detail.sections);
    let btnSubmit: any, cnAdd: string;
    if (sections.length === 0) {
        cnAdd = 'btn btn-primary me-3';
    }
    else {
        btnSubmit = <ButtonAsync className="btn btn-primary" onClick={onSubmit} disabled={!submitable}>提交</ButtonAsync>;
        cnAdd = 'btn btn-outline-primary me-3';
    }

    return <Page header={caption}>
        <ViewMain main={main} />
        <ViewDetail detail={detail} />
        <LMR className="px-3 py-3 border-top">
            <button className={cnAdd} onClick={onAddRow}>
                <FA name="plus" className="me-1" />
                明细
            </button>
            {id && <button className={'btn btn-outline-primary'} onClick={onRemoveSheet}>作废</button>}
        </LMR>
    </Page>
}
