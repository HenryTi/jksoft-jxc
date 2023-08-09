import { useState, useRef } from "react";
import { ButtonAsync, FA, LabelRow, LabelRowPropsBase } from "tonwa-com";
import { useModal } from "../UqAppBase";
import { Page } from "./page";

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
    pickValue?: (props: PickProps) => Promise<string | number>;
    ValueTemplate?: (props: { value: string | number; onValueChanged?: OnValueChanged; }) => JSX.Element;
}

export function LabelRowEdit(props: LabelRowPropsBase & EditProps) {
    let { label, value: initValue, readonly, pickValue, onValueChanged, ValueTemplate } = props;
    const { openModal, closeModal } = useModal();
    const [value, setValue] = useState(initValue);
    if (pickValue === undefined) {
        pickValue = async (pickProps) => {
            let ret = await openModal(<OneModal />); //, '修改' + label);
            return ret;
        }
    }
    async function onClick() {
        let ret = await pickValue({ label, value: initValue, });
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

    function OneModal() {
        const { closeModal } = useModal();
        const inp = useRef<HTMLInputElement>();
        async function onSave() {
            closeModal(inp.current.value);
        }
        return <Page header={label}>
            <div className="px-5 py-3">
                <div>
                    <input ref={inp} className="form-control" type="text" defaultValue={initValue} />
                </div>
                <div className="mt-3">
                    <ButtonAsync className="btn btn-primary me-3" onClick={onSave}>保存</ButtonAsync>
                    <button className="btn btn-outline-primary" onClick={() => closeModal()}>取消</button>
                </div>
            </div>
        </Page>;
    }
}
