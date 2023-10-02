import { EntityAtom, EntitySpec } from "app/Biz/EntityAtom";
import { useUqApp } from "app/UqApp";
import { AtomUomProps } from "app/tool";
import { useCallback } from "react";
import { Page, useModal } from "tonwa-app";
import { FA, LMR, List, Sep } from "tonwa-com";

export interface PropsPickAtomUom {
    base: number;
    entityAtom: EntityAtom;
    viewTop: any;
    buttonCaption: string | JSX.Element;
    buttonClassName: string;
}

export function usePickAtomUom() {
    const { uq } = useUqApp();
    const { openModal, closeModal } = useModal();
    return useCallback(async function (props: PropsPickAtomUom) {
        const { base, entityAtom, viewTop, buttonCaption, buttonClassName } = props;
        const { uom } = entityAtom;
        if (uom === false) {
            return { id: base };
        }
        // let { uoms: uomsArr } = await uq.GetAtom.query({ id: base });
        let uoms: any[] = []; //readUoms(uomsArr);
        let ret = await openModal(<PageSelectUom />);
        return ret;

        function PageSelectUom() {
            const onUomSelect = (uomParam: AtomUomProps) => {
                let uom = uomParam as any;
                closeModal(uom);
            }
            function ViewItem({ value }: { value: AtomUomProps; }) {
                let { ex } = value;
                return <LMR className="px-3 py-2">
                    <div className="fw-bold">{ex}</div>
                    <FA name="angle-right" />
                </LMR>
            }
            async function onClick() {
                closeModal(1);
            }
            return <Page header="计量单位">
                {viewTop}
                <Sep sep={2} />
                <List items={uoms} onItemClick={onUomSelect} ViewItem={ViewItem} />
                <Sep sep={2} />
                <button className={buttonClassName} onClick={onClick}>{buttonCaption}</button>
            </Page>;
        }
    }, []);
}
