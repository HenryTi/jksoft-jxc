import { EntityQuery } from "app/Biz";
import { ValuesBudsEditing } from "../../../hooks/BudsEditing";
import { Page, useModal } from "tonwa-app";
import { useForm } from "react-hook-form";
import { FormRow, FormRowsView } from "app/coms";
import { theme } from "tonwa-com";
import { ChangeEvent, useRef } from "react";
import { doQuery } from "app/hooks/Query";

export function PageQuery({ entity }: { entity: EntityQuery; }) {
    const modal = useModal();
    const { caption, name, params } = entity;
    let paramBudsEditing = new ValuesBudsEditing(modal, entity.biz, params);
    const { current: paramsData } = useRef({} as any);
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
    let formRows: FormRow[] = [
        ...paramBudsEditing.buildFormRows(),
        { type: 'submit', label: '查找', options: {}, className: undefined }
    ];
    function onChange(evt: ChangeEvent<HTMLInputElement>) {
        const { target: { name, value } } = evt;
        paramsData[name] = value;
    }
    const options = { onChange };
    formRows.forEach(v => {
        if (v === undefined) return null;
        return (v as any).options = { ...(v as any).options, ...options };
    });
    async function onSubmitForm(data: any) {
        let ret = { ...data, ...paramsData };
        await doQuery(paramBudsEditing, entity, ret);
        // modal.open(<PageFromQuery query={entity} params={ret} />);
    }
    return <Page header={caption ?? name}>
        <form className={theme.bootstrapContainer + ' my-3 '} onSubmit={handleSubmit(onSubmitForm)}>
            <FormRowsView rows={formRows} register={register} errors={errors} context={paramBudsEditing} />
        </form>
    </Page>;
}