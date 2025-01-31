import { Page, useModal } from "tonwa-app";
import { BudValues, EnumSaveFork, ForkStore, ViewForkTop } from "./ForkStore";
import { useForm } from "react-hook-form";
import { Band, FormRow, FormRowsView } from "app/coms";
import { EnumBudType } from "tonwa";
import { getDays } from "app/tool";
import { theme } from "tonwa-com";
import { FormBudsStore, ValuesBudsEditing } from "app/Store";

export function PageForkNew({ store }: { store: ForkStore; }) {
    const modal = useModal();
    const { caption, name, keys, buds: props, biz } = store.entity;
    const { register, handleSubmit, formState: { errors }, setError } = useForm({ mode: 'onBlur' });
    const submitCaption = '提交';
    const submitClassName: string = undefined;
    let buds = [...keys];
    if (props !== undefined) buds.push(...props);
    const budsEditing = new FormBudsStore(modal, new ValuesBudsEditing(store.biz, buds));
    let formRows: FormRow[] = [
        ...budsEditing.buildFormRows(),
        { type: 'submit', label: submitCaption, options: {}, className: submitClassName }
    ];
    const onSubmitForm = async (data: any) => {
        const values: BudValues = {};
        for (let bud of buds) {
            const { id, name, budDataType } = bud;
            let v = data[name];
            switch (budDataType.type) {
                case EnumBudType.date: v = getDays(v); break;
            }
            if (
                (typeof v === 'string' && (v as string).trim().length === 0)
                || (Number.isNaN(v) === true)
            ) {
                v = null;
            }
            if (budDataType.dataType === 'number') {
                if (v === '') v = null;
            }
            values[id] = v;
        }
        let results = await store.saveFork(undefined, values);
        switch (results) {
            case EnumSaveFork.success:
                modal.close();
                break;
            case EnumSaveFork.errorInput:
                alert('key input error');
                break;
            case EnumSaveFork.duplicateKey:
                let err = `关键字 ${keys.map(v => v.caption).join(',')} 重复`;
                // alert(err);
                setError(keys[0].name, { message: err });
                break;
        }
    }
    return <Page header={caption}>
        <div className="pt-3 tonwa-bg-gray-2">
            <Band>
                <div className="mx-3">
                    <ViewForkTop store={store} />
                </div>
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
