import { useState } from "react";
import { FA, LabelRow, LabelRowPropsBase } from "tonwa-com";
import { UqAppBase, useUqAppBase } from "../UqAppBase";
import { RegisterOptions, useForm } from "react-hook-form";

export type OnValueChanged = (value: string | number) => Promise<void>;

export interface PickProps {
    label: string | JSX.Element;
    value: string | number;
    type: 'string' | 'number';
    onValueChanged?: OnValueChanged;
}

export interface EditProps {
    label: string | JSX.Element;
    value: string | number;
    type: 'string' | 'number';
    readonly?: boolean;         // default: false
    onValueChanged?: OnValueChanged;
    options?: RegisterOptions;
    pickValue?: (uqApp: UqAppBase, props: PickProps, options: RegisterOptions) => Promise<string | number>;
    ValueTemplate?: (props: { value: string | number; onValueChanged?: OnValueChanged; }) => JSX.Element;
}

export function LabelRowEdit(props: LabelRowPropsBase & EditProps) {
    const uqApp = useUqAppBase();
    let { label, value: initValue, type, readonly, pickValue: pickValueProp, options, onValueChanged, ValueTemplate } = props;
    const [value, setValue] = useState(initValue);
    /*
    if (pickValueProp === undefined) {
        pickValueProp = pickValue;
    }
    */
    async function onClick() {
        let ret = await pickValueProp(uqApp, { label, value: initValue, type, }, options);
        if (ret !== undefined) {
            setValue(ret);
            await onValueChanged?.(ret);
        }
    }
    let right: any = <span className="p-3">&nbsp;</span>;
    if (pickValueProp !== null) {
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
