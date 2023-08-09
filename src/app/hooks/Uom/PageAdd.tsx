import { FormRow, FormRowsView } from "app/coms";
import { useForm } from "react-hook-form";
import { Page, useModal } from "tonwa-app";
import { MetricItem } from "uqs/UqDefault";

interface Props {
    no?: string;
    div?: MetricItem;
}

export function PageAdd({ no, div }: Props) {
    const { closeModal } = useModal();
    const { register, handleSubmit, formState: { errors }, } = useForm({ mode: 'onBlur' });
    async function onSubmit(data: any) {
        closeModal({ ...data, no, $div: div });
        // alert(JSON.stringify(data));
        // let ret = await actSave(entityAtom, no, data);
        // navigate(`../${genAtomView.path}/${ret.id}`, { replace: true });
    }
    const formRows: FormRow[] = [
        {
            name: 'no',
            label: '编号',
            type: 'text',
            options: { maxLength: 20, disabled: true, value: no }
        },
        { name: 'ex', label: '名称', type: 'text', options: { maxLength: 50 } },
    ];

    if (div !== undefined) {
        formRows.push({ name: 'value', label: '换算率', type: 'number', right: div.ex, options: { required: '换算率是必须的', min: 1, } });
    }
    formRows.push({ type: 'submit', label: '提交' });

    return <Page header="新增计量单位">
        <form onSubmit={handleSubmit(onSubmit)} className="container my-3 pe-5">
            <FormRowsView rows={formRows} {...{ register, errors }} />
        </form>
    </Page>
}
