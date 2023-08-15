import { useState, useRef } from "react";
import { ButtonAsync, FA, LabelRow, LabelRowPropsBase } from "tonwa-com";
import { uqAppModal, useModal } from "../UqAppBase";
import { Page } from "./page";
import { RegisterOptions, useForm } from "react-hook-form";
import { uqApp } from "app";
import { FormRow, FormRowsView } from "app/coms";

export type OnValueChanged = (value: string | number) => Promise<void>;

export interface PickProps {
    label: string | JSX.Element;
    value: string | number;
    onValueChanged?: OnValueChanged;
}

export interface EditProps {
    label: string | JSX.Element;
    value: string | number;
    readonly?: boolean;         // default: false
    onValueChanged?: OnValueChanged;
    options?: RegisterOptions;
    pickValue?: (props: PickProps, options: RegisterOptions) => Promise<string | number>;
    ValueTemplate?: (props: { value: string | number; onValueChanged?: OnValueChanged; }) => JSX.Element;
}

export function LabelRowEdit(props: LabelRowPropsBase & EditProps) {
    let { label, value: initValue, readonly, pickValue: pickValueProp, options, onValueChanged, ValueTemplate } = props;
    const [value, setValue] = useState(initValue);
    if (pickValueProp === undefined) {
        pickValueProp = pickValue;
    }
    async function onClick() {
        let ret = await pickValueProp({ label, value: initValue, }, options);
        if (ret !== undefined) {
            setValue(ret);
            await onValueChanged?.(ret);
        }
    }
    let right: any = <span className="p-3">&nbsp;</span>;
    if (pickValue !== null) {
        if (readonly !== true) {
            right = <div onClick={onClick} className="cursor-pointer p-3"><FA name="pencil" className="text-info" /></div>;
        }
    }
    let viewValue = ValueTemplate === undefined ?
        <>{value}</>
        :
        <ValueTemplate value={value} onValueChanged={onValueChanged} />;
    return <LabelRow {...props}>
        {label}
        <div className="ms-3 position-relative">{viewValue}</div>
        {right}
    </LabelRow>;
}

export async function pickValue(pickProps: PickProps, options: RegisterOptions) {
    const { label, value } = pickProps;
    const { openModal } = uqAppModal(uqApp);
    let ret = await openModal(<OneModal />); //, '修改' + label);
    return ret;
    function OneModal() {
        const { closeModal } = useModal();
        const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
        // const inp = useRef<HTMLInputElement>();
        async function onSubmit(data: any) {
            closeModal(data['value']);
        }
        const formRows: FormRow[] = [
            { name: 'value', label, type: 'number', options },
            { type: 'submit', label: '提交', options: {} }
        ];
        return <Page header={label}>
            <div className="px-5 py-3">
                <form className="container" onSubmit={handleSubmit(onSubmit)}>
                    <FormRowsView rows={formRows} register={register} errors={errors} />
                </form>
            </div>
        </Page>;
        /*
                <div>
                    <input ref={inp} className="form-control" type="text" defaultValue={value} />
                </div>
                <div className="mt-3">
                    <ButtonAsync className="btn btn-primary me-3" onClick={onSave}>保存</ButtonAsync>
                    <button className="btn btn-outline-primary" onClick={() => closeModal()}>取消</button>
                </div>
        */
    }
}

