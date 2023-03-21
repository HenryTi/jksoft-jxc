import { PartProps } from "app/template/Part";
import { useUqApp } from "app/UqApp";
import { useNavigate, useParams } from "react-router-dom";
import { useModal } from "tonwa-app";
import { useEffectOnce } from "tonwa-com";
import { PageSheetEdit } from "../PageSheetEdit";
import { DetailBase, SheetBase } from "../EditingBase";
import { PartDerive } from "./PartDerive";

export function PageDeriveEdit<S extends SheetBase, D extends DetailBase>({ Part }: PartProps<PartDerive<S, D>>) {
    const sheet: any = {};
    const uqApp = useUqApp();
    const part = uqApp.objectOf(Part);
    const { editing, ModalSheetStart } = part;
    const { openModal } = useModal();
    const navigate = useNavigate();
    const { id: paramId } = useParams();
    useEffectOnce(() => {
        (async function () {
            if (paramId !== undefined) {
                let sheetDeriveId = Number(paramId);
                if (Number.isNaN(sheetDeriveId) === false) {
                    await editing.load(sheetDeriveId);
                    return;
                }
            }
            let sheetOriginId = await openModal(<ModalSheetStart Part={Part} />);
            if (sheetOriginId === undefined) {
                navigate(-1);
                return;
            }
            editing.reset();
            await editing.loadOrigin(sheetOriginId);
        })();
    });
    /*
    async function onSelectSheet() {
        let source = await openModal(<ModalSheetStart Part={Part} />);
        let index = sources.findIndex(v => v.id === source.id);
        if (index < 0) {
            let sourceId = source.id;
            let { ret } = await uq.GetDetailQPAs.query({ id: sourceId });
            source.details = ret.map(v => {
                let { id, sheet, quantity, price, amount } = v;
                let d: Partial<ReturnGetDetailSourceQPAsRet> = {
                    source: id,
                    sourceSheet: sheet,
                    sourceQuantity: quantity,
                    sourcePrice: price,
                    sourceAmount: amount,
                };
                return d;
            });
            if (sources.length === 0) {
                let IDSheet = uq.SheetStoreIn;
                let no = await uq.IDNO({ ID: IDSheet });
                let [id] = await uq.ActIX({
                    IX: uq.IxMySheet,
                    ID: IDSheet,
                    values: [{
                        ix: undefined,
                        xi: {
                            no, operator: undefined
                        }
                    }]
                });
                addSheetToCache(id);
                setSheetStoreIn({ id, no, operator: undefined });
            }
            setSources([...sources, source]);
            refSheetSelected.current = true;
        }
        closeModal(true);
    }
    async function onSubmit() {
        setIsSubmitting(true);
        let ret = await uq.BookSheetStoreIn.submit({ id: sheetStoreIn.id });
        function addDetailOnOk() {
            closeModal();
            alert('新建');
        }
        await openModal(<Page header="提交成功" back="none">
            <div className="p-3">
                {caption} <b>{sheetStoreIn.no}</b> 已提交
            </div>
            <div className="border-top p-3">
                <button className="btn btn-outline-primary" onClick={closeModal}>返回</button>
                <button className="ms-3 btn btn-outline-secondary" onClick={addDetailOnOk}>新建{caption}</button>
            </div>
        </Page>);
        removeSheetFromCache();
        setIsSubmitting(false);
        navigate(-1);
    }
     
    */
    /*
    function addSheetToCache(id: number) {
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (!data) return;
        data.items.unshift({ ix: undefined, xi: id });
    }
    function removeSheetFromCache() {
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (!data) return;
        data.removeItem<{ ix: number, xi: number }>(v => v.xi === sheetStoreIn.id) as any;
    }
    async function onRemoveSheet() {
        let message = `${caption} ${sheetStoreIn.no} 真的要作废吗？`;
        let ret = await openModal(<PageConfirm header="确认" message={message} yes="单据作废" no="不作废" />);
        if (ret === true) {
            await uq.ActIX({ IX: uq.IxMySheet, values: [{ ix: undefined, xi: -sheetStoreIn.id }] });
            removeSheetFromCache();
            navigate(-1);
        }
    }
    function Top() {
        if (sheetStoreIn === undefined) return null;
        let { no } = sheetStoreIn;
        return <div className="tonwa-bg-gray-2 p-3">
            {caption}编号：{no}
        </div>;
    }
    return <Page header={caption}>
        <Top />
        <List items={sources} ViewItem={ViewItemSheet} itemKey={item => item.id} />
        <LMR className="px-3 py-2 text-end border-top">
            <ButtonAsync className="btn btn-primary" onClick={onSubmit}>
                提交
            </ButtonAsync>
            {
                isSubmitting === false && <span>
                    <button className="btn btn-outline-primary" onClick={onSelectSheet}>
                        <FA name="plus" className="me-1" /> 增加明细
                    </button>
                    <ButtonAsync className={'btn btn-outline-primary ms-3'} onClick={onRemoveSheet}>作废</ButtonAsync>
                </span>
            }
        </LMR>
    </Page>;
    */
    async function onAddRow() {
    }
    async function onEditRow(row: any) {
    }
    return <PageSheetEdit Part={Part} sheet={sheet} onEditRow={onEditRow} onAddRow={onAddRow} />;
}
