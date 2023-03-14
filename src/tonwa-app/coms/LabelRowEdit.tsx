import { useMemo, ChangeEvent } from "react";
import { atom, useAtom, useAtomValue } from "jotai";
import { ButtonAsync, FA, LabelRow, LabelRowPropsBase } from "tonwa-com";
import { useModal } from "../UqAppBase";

export interface EditProps {
    label: string | JSX.Element;
    value: string | number;
    readonly?: boolean;         // default: false
    onValueChanged?: (value: string | number) => Promise<void> | void;
    Edit?: (props: EditProps) => JSX.Element;
}

export function LabelRowEdit(props: LabelRowPropsBase & EditProps) {
    const { label, value: initValue, readonly, onValueChanged, Edit } = props;
    const { openModal, closeModal } = useModal();
    const atomValue = useMemo(() => atom(initValue), [initValue]);
    const [value, setValue] = useAtom(atomValue);
    async function onClick() {
        let ret = await openModal(<OneModal />); //, '修改' + label);
        if (ret !== undefined) {
            setValue(ret);
        }
    }
    let right: any = <span className="p-3">&nbsp;</span>;
    if (readonly !== true) {
        right = <div onClick={onClick} className="cursor-pointer p-3"><FA name="pencil" className="text-info" /></div>;
    }
    return <LabelRow {...props}>
        {label}
        <div className="ms-3">{value}</div>
        {right}
    </LabelRow>;

    function OneModal() {
        const { closeModal } = useModal();
        const defaultValue = useAtomValue(atomValue);
        let value = defaultValue;
        function onChange(e: ChangeEvent) {
            value = (e.target as HTMLInputElement).value;
        }
        async function onSave() {
            await onValueChanged?.(value);
            closeModal(value);
        }
        return <div className="p-3">
            <div>
                <input className="form-control" type="text" defaultValue={defaultValue} onChange={onChange} />
            </div>
            <div className="mt-3">
                <ButtonAsync className="btn btn-primary me-3" onClick={onSave}>保存</ButtonAsync>
                <button className="btn btn-outline-primary" onClick={() => closeModal()}>取消</button>
            </div>
        </div>;
    }
}
