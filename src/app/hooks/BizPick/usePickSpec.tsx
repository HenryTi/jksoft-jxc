import { useForm } from "react-hook-form";
import { EntitySpec } from "app/Biz/EntityAtom";
import { Band, FormRow, FormRowsView } from "app/coms";
import { useCallback } from "react";
import { Page, bootstrapContainer, useModal } from "tonwa-app";
import { budFormRow } from "../Bud";
import { useUqApp } from "app/UqApp";
import { ParamSaveSpec } from "uqs/UqDefault";
import { EnumBudType } from "app/Biz";
import { getDays } from "app/tool";

export interface PropsPickSpec {
    base: number;
    entitySpec: EntitySpec;
    viewTop: any;
    buttonCaption: string | JSX.Element;
    buttonClassName: string;
};

export function usePickSpec() {
    const { uq } = useUqApp();
    const { openModal, closeModal } = useModal();
    async function pickSpec(propsPickSpec: PropsPickSpec): Promise<{ retSpec: { id: number; }; retViewTop?: any; }> {
        const { base, entitySpec, viewTop } = propsPickSpec;
        const { ix } = entitySpec;
        if (ix === true) {
            let { ret } = await uq.GetSpecsFromBase.query({ base });
            let retSpec: any;
            switch (ret.length) {
                default:
                    return await openModal(<PagePickSelect />);
                case 0: retSpec = { id: base }; break;
                case 1: retSpec = ret[0]; break;
            }
            return retSpec;
        }
        else {
            let ret = await openModal(<PagePickSpec />);
            return ret;
        }

        function PagePickSpec() {
            const { id: entityId, caption, name, keys, buds: props } = entitySpec;
            const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
            const submitCaption = '提交';
            const submitClassName: string = undefined;

            let formRows: FormRow[] = [
                ...keys.map(v => budFormRow(v, true)),
                ...(props ?? []).map(v => budFormRow(v)),
                { type: 'submit', label: submitCaption, options: {}, className: submitClassName }
            ];
            const onSubmitForm = async (data: any) => {
                const keyValues: { [bud: string]: number | string } = {};
                for (let key of keys) {
                    const { name, budDataType } = key;
                    let v = data[name];
                    switch (budDataType.type) {
                        case EnumBudType.date: v = getDays(v); break;
                    }
                    keyValues[name] = v;
                }
                const propValues: { [bud: string]: number | string } = {};
                for (let prop of props) {
                    const { name } = prop;
                    propValues[name] = data[name];
                }
                const param: ParamSaveSpec = {
                    spec: entityId,
                    base,
                    keys: keyValues,
                    props: propValues,
                };
                let results = await uq.SaveSpec.submit(param);
                const { id } = results;
                let retSpec = Object.assign({ id }, data);
                closeModal(retSpec);
            }
            return <Page header={caption ?? name}>
                <div className="pt-3 tonwa-bg-gray-2">
                    <Band>
                        <div className="mx-3">{viewTop}</div>
                    </Band>
                </div>
                <div className="m-3">
                    <form className={bootstrapContainer} onSubmit={handleSubmit(onSubmitForm)}>
                        <FormRowsView rows={formRows} register={register} errors={errors} />
                    </form>
                </div>
            </Page>;
        }

        function PagePickSelect() {
            function onClick() {
                closeModal({ id: 100 });
            }
            return <Page header="选择">
                <button className="btn btn-primary" onClick={onClick}>确定</button>
            </Page>;
        }
    };
    return useCallback(pickSpec, []);
}
