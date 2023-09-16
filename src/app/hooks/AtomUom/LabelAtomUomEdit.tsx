import { FA, LabelRow, List, Sep, SpinnerSmall } from "tonwa-com";
import { useSelectUomI } from "./useSelectUomI";
import { CaptionAtom } from "../BizAtom";
import { EnumAtom } from "uqs/UqDefault";
import { useState } from "react";
import { useUqApp } from "app/UqApp";
import { AtomUomProps } from "app/tool";

export interface ViewUomProps {
    atomId: number;
    uoms: AtomUomProps[];
    className?: string;
}

export function LabelAtomUomEdit({ atomId, uoms: uomsInit, className }: ViewUomProps) {
    const { uq } = useUqApp();
    const [uoms, setUoms] = useState(uomsInit);
    const selectUomI = useSelectUomI();
    /*
    const viewContent = uomId === undefined ?
        <Row>/</Row>
        :
        <IDView uq={uq} id={uomId} Template={ViewUom} spinner={<Row><SpinnerSmall /></Row>} />;
    function ViewUom({ value }: { value: Atom; }) {
        return <Row>{value === null ? `Invalid id ${uomId}` : value.ex}</Row>;
    }
    */
    async function onAtomSelectUom() {
        /*
        let uomI = await selectUomI(uomId);
        if (uomI === undefined) return;
        if (uomI === null) {
            // something error
            console.error('something error. should not be here.');
            debugger;
            return;
        }
        setUomId(undefined);
        const { id } = uomI;
        let result = await uq.SaveAtomUom.submit({ atom: atomId, uom: id });
        setUomId(id);
        */
    }
    function Row({ children }: { children: React.ReactNode; }) {
        return <LabelRow>
            <div><CaptionAtom atom={EnumAtom.UomI} /></div>
            <div className="px-3">{children}</div>
            <div className="p-3 text-info cursor-pointer" onClick={onAtomSelectUom}>
                <FA name="pencil" />
            </div>
        </LabelRow>;
    }
    function ViewItemUom({ value }: { value: AtomUomProps }) {
        const { ex, prevEx, ratio, } = value;
        let memo: any;
        if (prevEx) {
            memo = <small className="text-secondary">{ratio}{prevEx}</small>
        }
        return <div className="px-3 py-2">
            {ex} {memo}
        </div>
    }
    return <LabelRow className={(className ?? '') + ' border-bottom'} vAlign="top">
        <div className="mt-2"><CaptionAtom atom={EnumAtom.UomI} /></div>
        <List items={uoms} ViewItem={ViewItemUom} className="w-100" />
        <div className="p-3 text-info cursor-pointer border-start" onClick={onAtomSelectUom}>
            <FA name="pencil" />
        </div>
    </LabelRow>;
}
