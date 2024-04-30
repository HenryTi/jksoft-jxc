import { DivEditing, btnNext, cnNextClassName } from "../../store";
import { FA } from "tonwa-com";
import { Page, useModal } from "tonwa-app";
import { theme } from "tonwa-com";
import { Band, FormRowsView } from "app/coms";
import { useForm } from "react-hook-form";
import { ChangeEvent, useState } from "react";
import { BizBud } from "app/Biz";
import { ViewSpecBaseOnly, ViewSpecNoAtom } from "app/hooks/View";
import { RowCols, ViewAtomTitles, ViewShowBuds } from "app/hooks/tool";

export function PageInputDiv({ divEditing }: { divEditing: DivEditing; }) {
    const modal = useModal();
    const { divStore, values: valRow } = divEditing;
    const { binDivRoot: binDiv, sheetStore } = divStore;
    const { register, setValue, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [submitable, setSubmitable] = useState(divEditing.submitable);
    let formRows = divEditing.buildFormRows();
    async function onChange(evt: ChangeEvent<HTMLInputElement>) {
        divEditing.stopInitFormula();
        const { type, value: valueInputText, name } = evt.target;
        divEditing.onChange(name, type as 'number' | 'text', valueInputText, (name, value) => {
            setValue(name, value);
        });
        setSubmitable(divEditing.submitable);
    }
    const options = { onChange };
    formRows.forEach(v => {
        if (v === undefined) return null;
        return (v as any).options = { ...(v as any).options, ...options };
    });
    function onPrev() {
        modal.close();
    }
    formRows.push({
        type: 'submit',
        label: btnNext,
        options: { disabled: submitable === false },
        className: cnNextClassName,
        right: <div className="align-self-center">
            <div className="cursor-pointer text-info p-2 small border border-info rounded-3" onClick={onPrev}>
                <FA name="arrow-left" className="me-2" />
                上一步
            </div>
        </div>
    });
    function onSubmitForm(data: any) {
        if (divEditing.submitable === false) {
            setSubmitable(divEditing.submitable);
            return;
        }
        modal.close(true);
    }
    let vi: any = undefined;
    let vx: any = undefined;
    let { binDivBuds } = binDiv;
    let { budI, budIBase, budX, budXBase } = binDivBuds;
    if (budI !== undefined) {
        vi = viewIdField(budI, valRow.i);
    }
    else if (budIBase !== undefined) {
        // vi = viewIdField(budIBase, p.iBase);
    }
    if (budX !== undefined) {
        vx = viewIdField(budX, valRow.x);
    }
    else if (budIBase !== undefined) {
        // vx = viewIdField(budX, valRow.x);
    }
    function viewIdField(bud: BizBud, value: number) {
        let { caption, name } = bud;
        const { budsColl, bizAtomColl } = sheetStore;
        const budValueColl = budsColl[value];
        if (caption === undefined) {
            if (name[0] !== '.') caption = name;
        }
        return <Band label={caption} className="border-bottom py-2">
            <ViewSpecBaseOnly id={value} bold={true} />
            <ViewAtomTitles budValueColl={budValueColl} bud={bud} atomColl={bizAtomColl} />
            <RowCols>
                <ViewSpecNoAtom id={value} />
            </RowCols>
            <RowCols>
                <ViewShowBuds bud={bud} budValueColl={budValueColl} noLabel={false} atomColl={bizAtomColl} />
            </RowCols>
        </Band>;
    }
    return <Page header={binDiv.ui?.caption ?? '输入明细'}>
        {
            (vi || vx) && <div className={' py-1 tonwa-bg-gray-2 mb-3 ' + theme.bootstrapContainer}>
                {vi}
                {vx}
            </div>
        }
        <form className={theme.bootstrapContainer} onSubmit={handleSubmit(onSubmitForm)}>
            <FormRowsView rows={formRows} register={register} errors={errors} setValue={setValue} />
        </form>
    </Page>
}
