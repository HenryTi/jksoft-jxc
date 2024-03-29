import { DivEditing, UseInputsProps } from "../store";
import { FA, getAtomValue } from "tonwa-com";
import { ValRow, btnNext, cnNextClassName } from "../tool";
import { UqApp } from "app";
import { Modal, Page, useModal } from "tonwa-app";
import { FormRowsView } from "app/coms";
import { useForm } from "react-hook-form";
import { ChangeEvent, useState } from "react";
import { BinRow } from "app/Biz";

export interface InputDivProps extends UseInputsProps {
    uqApp: UqApp;
    modal: Modal;
    binRow: BinRow;
}

export async function inputDiv(props: InputDivProps): Promise<BinRow> {
    const { modal, divStore, binDiv, binRow } = props;
    let divEditing = new DivEditing(divStore, binDiv, binRow);
    if (divEditing.isInputNeeded() === true) {
        if (await modal.open(<PageInput divEditing={divEditing} />) !== true) return;
    }
    return divEditing.binRow;
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
        alert('prev');
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
    return <Page header={binDiv.ui?.caption}>
        <div className="my-3">
            <form className="container" onSubmit={handleSubmit(onSubmitForm)}>
                <FormRowsView rows={formRows} register={register} errors={errors} />
            </form>
        </div>
    </Page>
}