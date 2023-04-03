import { useForm } from "react-hook-form";
import { useUqApp } from "app/UqApp";
import { IDView, Page, useModal } from "tonwa-app";
import { GenProps } from "app/tool";
import { GenSetting } from "./GenSetting";
import { FormRow, FormRowsView } from "app/coms";
import { ReturnSearchItemSettings$page } from "uqs/UqDefault";
import { ChangeEvent, useState } from "react";
import { BizPropSetting } from "app/Biz";

export function PageSettingEdit({ value: settingValue, Gen }: GenProps<GenSetting> & { value: ReturnSearchItemSettings$page & { settings: { [setting: string]: any } }; }) {
    const uqApp = useUqApp();
    const gen = uqApp.objectOf(Gen);
    const { caption, bizSettings } = gen;
    const { id, settings } = settingValue;
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [changed, setChanged] = useState(false);
    const { closeModal } = useModal();

    function buildRow(bizSetting: BizPropSetting): FormRow {
        let { caption, name } = bizSetting;
        return { name, label: caption ?? name, type: 'number', options: { value: settings[name], } };
    }
    async function onSubmit(data: any) {
        let bizSetting = bizSettings[0];
        // let settingValue = data[bizSetting.name];
        await gen.saveSetting(bizSetting, id, data[bizSetting.name]);
        closeModal(data);
    }
    function onChange(evt: ChangeEvent<HTMLInputElement>) {
        const { value, name } = evt.target;
        let n = Number(value);
        if (Number.isNaN(n) === true) {
            setChanged(false);
            return;
        }
        if (n !== settings[name]) {
            setChanged(true);
        }
    }
    let cnLabel = 'text-end';
    const options = { onChange, valueAsNumber: true };
    let formRows = bizSettings.map(v => buildRow(v));
    formRows.forEach(v => (v as any).options = { ...(v as any).options, ...options });
    formRows.push({ type: 'submit', label: '提交', options: { disabled: changed === false } });
    return <Page header={caption}>
        <div className="p-3">
            <IDView uq={gen.uq} id={id} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="container my-3 pe-5">
            <FormRowsView rows={formRows} {...{ labelClassName: cnLabel, register, errors }} />
        </form>
    </Page>
}
