import { useForm } from "react-hook-form";
import { useUqApp } from "app/UqApp";
import { IDView, Page, useModal } from "tonwa-app";
import { GenProps } from "app/tool";
import { GenAssign } from "./GenAssign";
import { FormRow, FormRowsView } from "app/coms";
import { ReturnSearchAtomAssigns$page } from "uqs/UqDefault";
import { ChangeEvent, useState } from "react";
import { BizAssign } from "app/Biz";

export function PageAssignEdit({ value: assignValue, Gen }: GenProps<GenAssign> & { value: ReturnSearchAtomAssigns$page & { buds: { [assign: string]: any } }; }) {
    const uqApp = useUqApp();
    const gen = uqApp.objectOf(Gen);
    const { caption, bizAssigns } = gen;
    const { id, buds } = assignValue;
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [changed, setChanged] = useState(false);
    const { closeModal } = useModal();

    function buildRow(bizAssign: BizAssign): FormRow {
        let { caption, name } = bizAssign;
        return { name, label: caption ?? name, type: 'number', options: { value: buds[name], } };
    }
    async function onSubmit(data: any) {
        let bizAssign = bizAssigns[0];
        await gen.saveAssign(bizAssign, id, data[bizAssign.name]);
        closeModal(data);
    }
    function onChange(evt: ChangeEvent<HTMLInputElement>) {
        const { value, name } = evt.target;
        let n = Number(value);
        if (Number.isNaN(n) === true) {
            setChanged(false);
            return;
        }
        if (n !== buds[name]) {
            setChanged(true);
        }
    }
    const options = { onChange, valueAsNumber: true };
    let formRows = bizAssigns.map(v => buildRow(v));
    formRows.forEach(v => (v as any).options = { ...(v as any).options, ...options });
    formRows.push({ type: 'submit', label: '提交', options: { disabled: changed === false } });
    return <Page header={caption}>
        <div className="p-3">
            <IDView uq={gen.uq} id={id} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="container my-3 pe-5">
            <FormRowsView rows={formRows} {...{ register, errors }} />
        </form>
    </Page>
}
