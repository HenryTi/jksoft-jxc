import { FormRow, FormRowsView } from "app/coms";
import { GenSpec, PropsSpecEdit } from "app/template";
import { GSpec, SpecShoe } from "app/tool";
import { useForm } from "react-hook-form";

function Edit({ className, spec, submitCaption, submitClassName, onSubmit }: PropsSpecEdit<SpecShoe>): JSX.Element {
    let { size, color } = spec;
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
    let formRows: FormRow[] = [
        { name: 'size', label: '尺码', type: 'string', options: { value: size, maxLength: 10, } },
        { name: 'color', label: '颜色', type: 'string', options: { value: color, maxLength: 10, } },
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

function View(props: { className?: string; value: SpecShoe; }): JSX.Element {
    let { className, value } = props;
    let { size, color } = value;
    return <div className={className}>
        <small className="text-muted">尺码</small> {size}
        &nbsp;
        <small className="text-muted">颜色</small> {color}
    </div>
}

export const gSpecSheo: GSpec<SpecShoe> = {
    name: 'specshoe',
    Edit,
    View,
};

export class GenSpecShoe extends GenSpec {
    readonly bizEntityName = 'specshoe';
    override Edit({ className, spec, submitCaption, submitClassName, onSubmit }: PropsSpecEdit<SpecShoe>): JSX.Element {
        let { size, color } = spec;
        const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
        let formRows: FormRow[] = [
            { name: 'size', label: '尺码', type: 'string', options: { value: size, maxLength: 10, } },
            { name: 'color', label: '颜色', type: 'string', options: { value: color, maxLength: 10, } },
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
    override View(props: { className?: string; value: SpecShoe; }): JSX.Element {
        let { className, value } = props;
        let { size, color } = value;
        return <div className={className}>
            <small className="text-muted">尺码</small> {size}
            &nbsp;
            <small className="text-muted">颜色</small> {color}
        </div>
    }
}
