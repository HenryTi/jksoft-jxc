import { FA, LabelRow, Sep, SpinnerSmall } from "tonwa-com";
import { useSelectUomI } from "./useSelectUomI";
import { CaptionAtom } from "../BizAtom";
import { Atom, EnumAtom } from "uqs/UqDefault";
import { useState } from "react";
import { IDView } from "tonwa-app";
import { useUqApp } from "app/UqApp";

export interface ViewUomProps {
    atomId: number;
    uomId: number;
    className?: string;
}

export function LabelAtomUomEdit({ atomId, uomId: uomIdInit, className }: ViewUomProps) {
    const { uq } = useUqApp();
    const [uomId, setUomId] = useState(uomIdInit);
    const selectUomI = useSelectUomI();
    const viewContent = uomId === undefined ?
        <Row>/</Row>
        :
        <IDView uq={uq} id={uomId} Template={ViewUom} spinner={<Row><SpinnerSmall /></Row>} />;
    function ViewUom({ value }: { value: Atom; }) {
        return <Row>{value === null ? `Invalid id ${uomId}` : value.ex}</Row>;
    }
    async function onAtomSelectUom() {
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

    return <div className={className}>
        {viewContent}
        <Sep />
    </div>;
}
