import { FormRow, FormRowsView } from "app/coms";
import { GSpec, PropsSpecEdit, SpecBatchValid } from "app/tool";
import { useForm } from "react-hook-form";
import { EasyDate } from "tonwa-com";

function Edit({ className, spec, submitCaption, submitClassName, onSubmit }: PropsSpecEdit<SpecBatchValid>) {
    let { no, 效期 } = spec;
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
    let formRows: FormRow[] = [
        { name: 'no', label: '批号', type: 'string', options: { value: no, maxLength: 20, } },
        { name: '效期', label: '效期', type: 'string', options: { value: 效期, maxLength: 10, } },
        { type: 'submit', label: submitCaption, options: {}, className: submitClassName }
    ];
    const onSubmitForm = (data: any) => {
        onSubmit?.(data);
    }
    return <div className={className}>
        <form className="container" onSubmit={handleSubmit(onSubmitForm)}>
            <FormRowsView rows={formRows} register={register} errors={errors} />
        </form>
    </div>
}

function View(props: { className?: string; value: SpecBatchValid; }) {
    let { className, value } = props;
    let { no, 效期 } = value;
    return <div className={className}>
        <div><small className="text-muted">批号</small> {no}</div>
        <div><small className="text-muted">效期</small> <EasyDate date={效期} /></div>
    </div>
}

export const gSpecBatchValid: GSpec<SpecBatchValid> = {
    name: 'batchvalid',
    Edit,
    View,
};
