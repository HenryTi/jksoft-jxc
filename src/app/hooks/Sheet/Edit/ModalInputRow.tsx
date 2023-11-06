import { useForm } from "react-hook-form";
import { Band, FormRowsView } from "app/coms";
import { ViewSpec } from "app/hooks/View";
import { Page, useModal } from "tonwa-app";
import { ChangeEvent, useState } from "react";
import { Row } from "./SheetStore";
import { ButtonAsync, FA } from "tonwa-com";
import { BizBud } from "app/Biz";
import { RowStore } from "./binPick";

export function ModalInputRow({ row, rowStore }: { row: Row; rowStore: RowStore; }) {
    const { closeModal } = useModal();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({ mode: 'onBlur' });
    const { props, section } = row;
    const { entityBin } = section.coreDetail;
    const { i: budI, x: budX } = entityBin;
    const [submitable, setSubmitable] = useState(rowStore.submitable);
    async function onChange(evt: ChangeEvent<HTMLInputElement>) {
        const { type, value: valueInputText, name } = evt.target;
        let valueInput: any;
        if (type === 'number') {
            if (valueInputText.trim().length === 0) {
                valueInput = undefined;
            }
            else {
                let v = Number(valueInputText);
                valueInput = Number.isNaN(v) === true ? undefined : v;
            }
        }
        else {
            valueInput = valueInputText;
        }
        rowStore.setValue(name, valueInput, (name, value) => {
            setValue(name, value);
        });
        setSubmitable(rowStore.submitable);
    }
    const options = { onChange };
    const formRows = rowStore.buildFormRows();
    formRows.forEach(v => {
        if (v === undefined) return null;
        return (v as any).options = { ...(v as any).options, ...options };
    });
    formRows.push({ type: 'submit', label: '提交', options: { disabled: submitable === false } });

    async function onSubmit(data: any) {
        // rowStore.setData(data);
        closeModal(true);
    }

    async function onDel() {
        await row.delFromSection();
        closeModal();
    }
    const right = <ButtonAsync onClick={onDel} className="btn btn-sm btn-primary me-1">
        <FA name="trash" fixWidth={true} />
    </ButtonAsync>;
    function ViewIdField({ bud, value }: { bud: BizBud; value: number; }) {
        if (bud === undefined) return null;
        const { caption, name } = bud;
        return <Band label={caption ?? name} className="border-bottom py-2">
            <div className="px-3">
                <ViewSpec id={value} />
            </div>
        </Band>;
    }
    return <Page header="输入明细" right={right}>
        <div className="py-1 tonwa-bg-gray-2 mb-3 container">
            <ViewIdField bud={budI} value={rowStore.binDetail.i} />
            <ViewIdField bud={budX} value={rowStore.binDetail.x} />
        </div>
        <form className="container" onSubmit={handleSubmit(onSubmit)}>
            <FormRowsView rows={formRows} register={register} errors={errors} />
        </form>
    </Page>;
}
