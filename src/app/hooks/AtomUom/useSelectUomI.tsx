import { useUqApp } from "app/UqApp";
import { LMR, List } from "tonwa-com";
import { Page, PageSpinner, useModal } from "tonwa-app";
import { Atom, EnumAtom } from "uqs/UqDefault";
import { useRef } from "react";
import { ViewAtom, useSelectAtom } from "../BizAtom";
import { BI, PageQueryMore } from "app/coms";

export function useSelectUomI() {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const { openModal, closeModal } = useModal();
    const refAtomUomId = useRef<number>(undefined);
    const selectAtom = useSelectAtom();

    async function selectUomI(uom: Atom) {
        let ret = await openModal(<PageUomIList />);
        return ret;

        function PageUomIList() {
            async function getUomIList(param: any, pageStart: any, pageSize: number) {
                const { $page } = await uq.GetUomIListOfUom.page(param, pageStart, pageSize);
                return $page;
            }
            const param = { uom: uom.id };
            function ViewItem({ value }: { value: any }) {
                return <div className="px-3 py-2"><ViewAtom value={value} /></div>;
            }
            async function onItemClick(item: any) {
                closeModal(item);
            }
            return <PageQueryMore
                header={'选择 - ' + uom.ex}
                sortField="id"
                param={param}
                query={getUomIList}
                ViewItem={ViewItem}
                onItemClick={onItemClick}
            >
            </PageQueryMore>;
        }
    }

    async function selectUomX(uomId: number) {
        openModal(<PageSpinner />);
        const { UomI, UomX } = await uq.GetUomI.query({ id: uomId });
        closeModal();
        let retUomI = UomI[0];
        let uomI: Atom = retUomI;
        if (UomX.length === 0) {
            uomI = await selectAtomUom(undefined);
            return uomI;
        }
        let uomX: Atom;
        function setUomX(uomId: number) {
            if (uomI.id === uomId) {
                uomX = uomI;
            }
            else {
                uomX = UomX.find(v => v.id === uomId);
            }
        }
        // 重新选择计量单位之后，可能会还是选择当下的。这时候，默认换算单位还是要对
        if (refAtomUomId.current !== undefined) {
            setUomX(refAtomUomId.current);
        }
        if (uomX === undefined) {
            setUomX(uomId);
        }
        return await openModal(<PageUomX />);
        function PageUomX() {
            function onOk() {
                closeModal(uomX);
            }
            function onOther() {
                closeModal(null);
            }
            function ViewRadio({ atom, children, className }: { atom: Atom; children: React.ReactNode; className?: string; }) {
                function onCheck() {
                    uomX = atom;
                }
                const { no, ex } = atom;
                return <label className={'px-3 py-3 ' + (className ?? '')}>
                    <input type="radio"
                        className="me-4 form-check-input"
                        name={'uomI-id-' + uomI.id}
                        value={atom.id}
                        defaultChecked={atom === uomX}
                        onChange={onCheck} />
                    {children}
                </label>;
            }
            function ViewUomX({ value }: { value: any }) {
                const { ex, no, ratio } = value;
                return <ViewRadio atom={value}>
                    <b className="d-inline-block w-min-8c me-4">{ex}</b>
                    <span> = {ratio} {uomI.ex}</span>
                </ViewRadio>;
            }
            return <Page header="选择计量单位">
                <LMR className="px-3 py-3 tonwa-bg-gray-2 border-bottom align-items-center">
                    <div>{retUomI.uomEx} {retUomI.uomDiscription}</div>
                    <button className="btn btn-link" onClick={onOther}>
                        其它计量单位
                        <BI name="chevron-double-right" />
                    </button>
                </LMR>
                <ViewRadio atom={uomI} className="border-bottom border-2">
                    <b className="d-inline-block w-min-8c me-4 text-primary">{uomI.ex}</b>
                </ViewRadio>
                <List items={UomX} ViewItem={ViewUomX} />
                <LMR className="px-3 py-3">
                    <button className="btn btn-primary" onClick={onOk}>提交</button>
                </LMR>
            </Page>;
        };
    }

    async function selectAtomUom(uomId: number) {
        let uomI: Atom;
        if (uomId === undefined) {
            let uom = await selectAtom(undefined);
            if (uom === undefined) return;
            uomI = await selectUomI(uom);
            if (uomI === undefined) return;
            // uomId = uomI.id;
            return uomI;
        }
        uomI = await selectUomX(uomId);
        if (uomI === null) {
            uomI = await selectAtomUom(undefined);
        }
        return uomI;
    }

    return async function (uomId: number) {
        refAtomUomId.current = uomId;
        return await selectAtomUom(uomId);
    }
}
