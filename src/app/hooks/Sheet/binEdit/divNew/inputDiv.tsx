import { DivEditing, UseInputsProps, ValRow, btnNext, cnNextClassName } from "../../store";
import { FA } from "tonwa-com";
import { UqApp } from "app";
import { Modal, Page, useModal } from "tonwa-app";
import { theme } from "tonwa-com";
import { FormRowsView } from "app/coms";
import { useForm } from "react-hook-form";
import { ChangeEvent, useState } from "react";

export interface InputDivProps extends UseInputsProps {
    uqApp: UqApp;
    modal: Modal;
    valRow: ValRow;
}

export async function inputDiv(props: InputDivProps): Promise<ValRow> {
    const { modal, divStore, binDiv, valRow, namedResults, pendRow, valDiv } = props;
    let divEditing = new DivEditing(divStore, namedResults, binDiv, valDiv, valRow);
    if (divEditing.isInputNeeded() === true) {
        if (await modal.open(<PageInput divEditing={divEditing} />) !== true) return;
    }
    return divEditing.valRow;
}

function PageInput({ divEditing }: { divEditing: DivEditing; }) {
    const modal = useModal();
    const { divStore: { binDiv } } = divEditing;
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
    let vi = divEditing.viewI();
    let vx = divEditing.viewX();
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