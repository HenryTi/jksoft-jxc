import { FormRow, FormRowsView } from "app/coms";
import { useForm, RegisterOptions } from "react-hook-form";
import { Page, PickProps, UqAppBase, uqAppModal } from "tonwa-app";

export async function pickValue(uqApp: UqAppBase, pickProps: PickProps, options: RegisterOptions) {
    const { label, value, type } = pickProps;
    const { openModal, closeModal } = uqAppModal(uqApp);
    let ret = await openModal(<OneModal />); //, '修改' + label);
    return ret;
    function OneModal() {
        const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
        // const inp = useRef<HTMLInputElement>();
        async function onSubmit(data: any) {
            closeModal(data['value']);
        }
        const formRows: FormRow[] = [
            { name: 'value', label, type, options: { ...options, value }, },
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
}
