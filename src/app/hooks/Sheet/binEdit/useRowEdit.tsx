import { Page, useModal } from "tonwa-app";
import { theme } from "tonwa-com";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Band, FormRowsView } from "app/coms";
import { ViewSpec, ViewSpecBaseOnly, ViewSpecNoAtom } from "app/hooks/View";
import { ChangeEvent, useState } from "react";
import { ButtonAsync, FA } from "tonwa-com";
import { BizBud } from "app/Biz";
import { BinEditing, BinBudsEditing, ValDiv, ValDivBase } from "../store";
import { RowCols, ViewAtomTitles, ViewShowBuds } from "app/hooks/tool";

export function useRowEdit() {
    const modal = useModal();
    return useCallback(async (binEditing: BinEditing, valDiv: ValDivBase) => {
        const { entityBin } = binEditing;
        const { i: budI, x: budX } = entityBin;
        const { atomParams } = budI;
        if (atomParams !== undefined) {
            const { name, caption } = budI;
            await modal.open(<Page header={caption ?? name}>
            </Page>);
        }
        let ret = await modal.open(<ModalInputRow binEditing={binEditing} valDiv={valDiv} />);
        return ret;
    }, []);
}

function ModalInputRow({ binEditing, valDiv }: { binEditing: BinBudsEditing; valDiv: ValDivBase }) {
    const { closeModal } = useModal();
    const { register, handleSubmit, setValue, setError, trigger, formState: { errors } } = useForm({ mode: 'onBlur' });
    const { entityBin, values: binDetail, sheetStore } = binEditing;
    const { i: budI, iBase: budIBase, x: budX, xBase: budXBase } = entityBin;
    const [submitable, setSubmitable] = useState(binEditing.submitable);
    async function onChange(evt: ChangeEvent<HTMLInputElement>) {
        const { type, value: valueInputText, name } = evt.target;
        binEditing.onChange(name, type as 'number' | 'text', valueInputText, (name, value) => {
            setValue(name, value);
        });
        setSubmitable(binEditing.submitable);
    }
    const options = { onChange };
    const formRows = binEditing.buildFormRows(true);
    formRows.forEach(v => {
        if (v === undefined) return null;
        return (v as any).options = { ...(v as any).options, ...options };
    });
    formRows.push({ type: 'submit', label: '提交', options: { disabled: submitable === false } });

    async function onSubmit(data: any) {
        if (await trigger(undefined, { shouldFocus: true }) === false) return;
        if (data.value === 0) {
            setError('value', { message: '不能为 0' });
            return;
        }
        closeModal(true);
    }

    async function onDel() {
        await binEditing.onDel();
        closeModal();
    }
    let right: any;
    if (binEditing.onDel !== undefined) {
        right = <ButtonAsync onClick={onDel} className="btn btn-sm btn-primary me-1">
            <FA name="trash" fixWidth={true} />
        </ButtonAsync>;
    }
    function ViewIdField({ bud, budBase, value, base }: { bud: BizBud; budBase: BizBud; value: number; base: number; }) {
        if (bud === undefined) return null;
        const { caption, name } = bud;
        const { budsColl, bizAtomColl } = sheetStore;
        const budValueColl = budsColl[base ?? value];
        return <Band label={caption ?? name} className="border-bottom py-2">
            <ViewSpecBaseOnly id={value} bold={true} />
            <ViewAtomTitles budValueColl={budValueColl} bud={budBase ?? bud} atomColl={bizAtomColl} />
            <RowCols>
                <ViewSpecNoAtom id={value} />
            </RowCols>
            <RowCols>
                <ViewShowBuds bud={bud} budValueColl={budValueColl} noLabel={false} atomColl={bizAtomColl} />
            </RowCols>
        </Band>;
    }
    return <Page header="输入明细" right={right}>
        <div className={' py-1 tonwa-bg-gray-2 mb-3 ' + theme.bootstrapContainer}>
            <ViewIdField bud={budI} budBase={budIBase} value={binDetail.i} base={valDiv?.iBase} />
            <ViewIdField bud={budX} budBase={budXBase} value={binDetail.x} base={valDiv?.xBase} />
        </div>
        <form className={theme.bootstrapContainer} onSubmit={handleSubmit(onSubmit)}>
            <FormRowsView rows={formRows} register={register} errors={errors} />
        </form>
    </Page>;
}
