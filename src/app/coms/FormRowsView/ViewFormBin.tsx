import { JSX } from "react";
import { EnumSysBud } from "app/Biz";
import { Band, FormBin, FormContext } from "./FormRowsView";

export function ViewFormBin({ row, label, formContext }: {
    row: FormBin;
    label: string | JSX.Element;
    formContext: FormContext;
}) {
    const { default: defaultValue, bud } = row;
    let cnInput = 'form-control form-control-sm bg-body-secondary';
    if (defaultValue === undefined) return null;
    let budVals = formContext.store.getCacheBudProps(defaultValue);
    let content: any;
    if (budVals === undefined) content = defaultValue;
    else content = budVals[EnumSysBud.sheetNo];
    return <Band label={label}>
        <div className={cnInput}>
            {content}
        </div>
    </Band>
}
