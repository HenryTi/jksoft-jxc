import { ViewDivProps } from "./tool";
import { ViewRowLeaf } from "./ViewRowLeaf";
import { ViewRowStem } from "./ViewRowStem";
import { useAtomValue } from "jotai";
import { FA } from "tonwa-com";

export function ViewRow(props: ViewDivProps) {
    const { valDiv, divStore: { sheetStore: { atomError } } } = props;
    const { binDiv, valRow } = valDiv;
    const { level, entityBin, subBinDiv } = binDiv;
    const { id, pend } = valRow;
    const error = useAtomValue(atomError);
    let { divLevels, pivot } = entityBin;
    if (pivot !== undefined) {
        // pivot叶层次不显示。直接白色底
        divLevels--;
    }
    let ViewRowFunc: (props: ViewDivProps) => JSX.Element;
    if (subBinDiv === undefined) {
        ViewRowFunc = ViewRowLeaf;
    }
    else {
        ViewRowFunc = ViewRowStem;
    }
    let bgRow: string = 'tonwa-bg-gray-' + (divLevels - level);
    let vErrorPend: any, vErrorBin: any;
    function viewError(err: string) {
        return <div className={'text-danger small px-3 pt-1 border-bottom ' + bgRow}>
            <FA name="exclamation-circle" className="me-2" />
            {err}
        </div>;
    }

    if (error !== undefined) {
        if (pend !== undefined) {
            let errorPend = error[pend];
            if (errorPend !== undefined) {
                vErrorPend = viewError('超过待处理数 ' + (errorPend as any).overValue);
            }
        }

        if (id !== undefined) {
            let errorBin = error[id];
            if (errorBin !== undefined) {
                vErrorPend = viewError((errorBin as any).message);
            }
        }
    }
    return <>
        {vErrorPend}
        {vErrorBin}
        <div className={'d-flex border-bottom ' + bgRow}>
            <ViewRowFunc {...props} />
        </div>
    </>
}
