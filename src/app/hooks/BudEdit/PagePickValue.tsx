import { FormRow, FormRowsView } from "app/coms";
import { useForm, RegisterOptions } from "react-hook-form";
import { Page, PickProps, UqAppBase, uqAppModal, useModal } from "tonwa-app";

export async function pickValue(uqApp: UqAppBase, pickProps: PickProps, options: RegisterOptions) {
    const { label, value, type } = pickProps;
    const { openModal, closeModal } = uqAppModal(uqApp);
    let ret = await openModal(<PagePickValue label={label} value={value as any} type={type} options={options} />); //, '修改' + label);
    return ret;
}

export function PagePickValue<T extends string | number>({ label, value, type, options, step }: { label: string | JSX.Element; value: T | string; type: string; step?: string; options: RegisterOptions; }) {
    const { closeModal } = useModal();
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
    async function onSubmit(data: any) {
        closeModal(data['value']);
    }
    const formRows: FormRow[] = [
        { name: 'value', label, type, options: { ...options, value }, step },
        { type: 'submit', label: '提交', options: {} }
    ];
    return <Page header={label}>
        <div className="px-5 py-3">
            <form className="container" onSubmit={handleSubmit(onSubmit)}>
                <FormRowsView rows={formRows} register={register} errors={errors} />
            </form>
        </div>
    </Page>;
    /*
            <div>
                <input ref={inp} className="form-control" type="text" defaultValue={value} />
            </div>
            <div className="mt-3">
                <ButtonAsync className="btn btn-primary me-3" onClick={onSave}>保存</ButtonAsync>
                <button className="btn btn-outline-primary" onClick={() => closeModal()}>取消</button>
            </div>
    */
}
