import { useForm } from "react-hook-form";
import { useUqApp } from "app/UqApp";
import { IDView, Page, useModal } from "tonwa-app";
import { Med, RowMed } from "./useBuds";
import { Band, FormRow, FormRowsView } from "app/coms";
import { ChangeEvent, useState } from "react";
import { FA } from "tonwa-com";
import { Entity } from "app/Biz";
import { Uom } from "app/tool";
import { ViewAtom } from "app/views";

export function PageAssignEdit({ rowMed, entity, noMedsMessage }: { rowMed: RowMed; entity: Entity; noMedsMessage: string; }) {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const { caption } = entity;
    const { atom, meds } = rowMed;
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [changed, setChanged] = useState(false);
    const { closeModal } = useModal();

    function ViewUom({ value }: { value: Uom; }) {
        let { ex } = value;
        return <>{ex}</>;
    }
    function buildRow(med: Med): FormRow {
        let { main, detail } = med;
        let label = <IDView uq={uq} id={detail} Template={ViewUom} />;
        return { name: String(med.id), label, type: 'number', options: { value: med.values?.[0], } };
    }
    async function onSubmit(data: any) {
        closeModal(data);
    }
    function onChange(evt: ChangeEvent<HTMLInputElement>) {
        const { value, name } = evt.target;
        let n = Number(value);
        if (Number.isNaN(n) === true) {
            setChanged(false);
            return;
        }
        else {
            setChanged(true);
            return;
        }
        /*
        if (n !== buds[name]) {
            setChanged(true);
        }
        */
    }
    const options = { onChange, valueAsNumber: true };
    let formRows = meds.map(v => buildRow(v));
    let noMeds: any;
    if (meds.length === 0) {
        noMeds = <Band label="">
            <div className="pt-3 text-danger">
                <FA name="times-circle" className="me-3" />
                {noMedsMessage}
            </div>
        </Band>
    }
    formRows.forEach(v => (v as any).options = { ...(v as any).options, ...options });
    formRows.push({ type: 'submit', label: '提交', options: { disabled: changed === false } });
    return <Page header={caption}>
        <div className="px-3 py-3 tonwa-bg-gray-2"><ViewAtom value={atom} /></div>
        {noMeds}
        <form onSubmit={handleSubmit(onSubmit)} className="container my-3 pe-5">
            <FormRowsView rows={formRows} {...{ register, errors }} />
        </form>
    </Page>
}
