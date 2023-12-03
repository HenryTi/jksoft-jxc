import { useCallback } from "react";
import { PickResult } from "../NamedResults";
import { PendInputSpec } from "app/Biz";
import { Page, useModal } from "tonwa-app";
import { useForm } from "react-hook-form";
import { Band, FormRow, FormRowsView } from "app/coms";
import { useUqApp } from "app/UqApp";
import { ParamSaveSpec } from "uqs/UqDefault";
import { EnumBudType } from "app/Biz";
import { getDays } from "app/tool";
import { budFormRow } from "app/hooks/Bud";
import { InputProps } from "./usePendInputs";
import { Calc } from "app/hooks/Calc";
import { ViewAtomId } from "app/hooks/BizAtom";
import { PendProxyHander } from "../tool";
import { FA } from "tonwa-com";


export interface PropsInputSpec extends InputProps<PendInputSpec> {
    // base: number;
    // entitySpec: EntitySpec;
    // viewTop: any;
    // buttonCaption: string | JSX.Element;
    // buttonClassName: string;
};

export function useInputSpec() {
    const { uq } = useUqApp();
    const { openModal, closeModal } = useModal();
    // return: { retSpec: { id: number; }; retViewTop?: any; }
    async function func(props: PropsInputSpec): Promise<PickResult> {
        const { namedResults, binInput, pendRow } = props;
        const { entityPend } = binInput;
        const formulas: [string, string][] = [
            ['base', binInput.baseExp],
        ];
        const calc = new Calc(formulas, namedResults);
        const pendProxyHander = new PendProxyHander(entityPend);
        calc.addValues('pend', new Proxy(pendRow, pendProxyHander));
        const base = calc.results['base'] as number;
        const viewTop = <ViewAtomId id={base} />;
        const { spec: entitySpec } = binInput;
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
            /*{
                retSpec,
                retViewTop: viewTop,
            }*/
        }
        else {
            let ret = await openModal(<PagePickSpec />);
            return ret;
        }

        function PagePickSpec() {
            const { id: entityId, caption, name, keys, props } = entitySpec;
            const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
            const submitCaption = <>下一步 <FA name="arrow-right" className="ms-2" /></>;
            const submitClassName: string = "btn btn-outline-primary";

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
                let retSpec = Object.assign(data, { id });
                closeModal(retSpec);
            }
            return <Page header={caption ?? name}>
                <div className="pt-3 tonwa-bg-gray-2">
                    <Band>
                        <div className="mx-3">{viewTop}</div>
                    </Band>
                </div>
                <div className="m-3">
                    <form className="container" onSubmit={handleSubmit(onSubmitForm)}>
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
    return useCallback(func, []);
}