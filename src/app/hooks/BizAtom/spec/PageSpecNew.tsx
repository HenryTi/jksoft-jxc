import { Page, useModal } from "tonwa-app";
import { BudValues, EnumSaveSpec, SpecStore } from "./SpecStore";
import { useForm } from "react-hook-form";
import { Band, FormRow, FormRowsView } from "app/coms";
import { EnumBudType } from "app/Biz";
import { getDays } from "app/tool";
import { theme } from "tonwa-com";
import { ValuesBudsEditing } from "app/hooks/BudsEditing";

export function PageSpecNew({ store }: { store: SpecStore; }) {
    const modal = useModal();
    const { caption, name, keys, buds: props } = store.entity;
    const { register, handleSubmit, formState: { errors }, setError } = useForm({ mode: 'onBlur' });
    const submitCaption = '提交';
    const submitClassName: string = undefined;
    let buds = [...keys];
    if (props !== undefined) buds.push(...props);
    const budsEditing = new ValuesBudsEditing(modal, store.biz, buds);
    let formRows: FormRow[] = [
        ...budsEditing.buildFormRows(),
        { type: 'submit', label: submitCaption, options: {}, className: submitClassName }
    ];
    const onSubmitForm = async (data: any) => {
        const keyValues: BudValues = {};
        for (let key of keys) {
            const { name, budDataType } = key;
            let v = data[name];
            switch (budDataType.type) {
                case EnumBudType.date: v = getDays(v); break;
            }
            if (budDataType.dataType === 'number') {
                if (v === '') v = null;
            }
            keyValues[name] = v;
        }
        const propValues: BudValues = {};
        for (let prop of props) {
            const { name, budDataType } = prop;
            let v = data[name];
            if (budDataType.dataType === 'number') {
                if (v === '') v = null;
            }
            propValues[name] = v;
        }
        let results = await store.saveSpec(undefined, keyValues, propValues);
        switch (results) {
            case EnumSaveSpec.success:
                modal.close();
                break;
            case EnumSaveSpec.errorInput:
                alert('key input error');
                break;
            case EnumSaveSpec.duplicateKey:
                let err = `关键字 ${keys.map(v => v.caption).join(',')} 重复`;
                // alert(err);
                setError(keys[0].name, { message: err });
                break;
        }
    }
    return <Page header={caption}>
        <div className="pt-3 tonwa-bg-gray-2">
            <Band>
                <div className="mx-3">{store.topViewAtom()}</div>
            </Band>
        </div>
        <div className="m-3">
            <form className={theme.bootstrapContainer} onSubmit={handleSubmit(onSubmitForm)}>
                <FormRowsView rows={formRows} register={register} errors={errors} context={budsEditing} />
            </form>
        </div>
    </Page>;
    //}
}
