import { FormRow, FormRowsView } from "app/coms";
import { getDays } from "app/tool";
import { useForm, RegisterOptions } from "react-hook-form";
import { Page, PickProps, UqAppBase, uqAppModal, useModal } from "tonwa-app";

export async function pickValue(uqApp: UqAppBase, pickProps: PickProps, options: RegisterOptions) {
    const { label, value, type } = pickProps;
    const { openModal, closeModal } = uqAppModal(uqApp);
    let ret = await openModal(<PagePickValue label={label} value={value as any} type={type} options={options} />); //, '修改' + label);
    return ret;
}

interface Props<T extends string | number> {
    label: string | JSX.Element; value: T; type: string; step?: string;
    options: RegisterOptions;
};
export function PagePickValue<T extends string | number>({ label, value, type, options, step }: Props<T>) {
    const { closeModal } = useModal();
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
    async function onSubmit(data: any) {
        let { value } = data;
        /*
        if (value !== undefined) {
            switch (type) {
                case 'date': value = getDays(value); break;
            }
        }
        */
        closeModal(value);
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
}
