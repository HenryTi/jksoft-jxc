import { EntitySpec, PickSpec } from "app/Biz";
import { ViewAtom } from "app/hooks/BizAtom";
import { Atom } from "uqs/UqDefault";
import { useCallback } from "react";
import { BudsEditing, NamedResults, PickResult } from "../store";
import { DivStore } from "../store";
import { useUqApp } from "app/UqApp";
import { useModal } from "tonwa-app";
import { useForm } from "react-hook-form";
import { Band, FormRow, FormRowsView } from "app/coms";
import { Page } from "tonwa-app";
import { theme } from "tonwa-com";
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

export function usePickFromSpec() {
    const { uq } = useUqApp();
    const modal = useModal();
    // const returnUsePickSpec = usePickSpec();
    return useCallback(async function (divStore: DivStore, namedResults: NamedResults, binPick: PickSpec): Promise<PickResult> {
        let { pickParams, from } = binPick;
        let retAtom = namedResults[pickParams[0]?.bud] as Atom;
        const viewTop = <div>
            <ViewAtom value={retAtom} />
        </div>;
        // const buttonCaption = '提交';
        // const buttonClassName = 'btn btn-primary';

        //let propsPickSpec:PropsPickSpec = {
        let base = retAtom?.id;
        let entitySpec = from;
        // viewTop,
        // buttonCaption,
        // buttonClassName,
        //}
        //        async function pickSpec(propsPickSpec: PropsPickSpec): Promise<{ retSpec: { id: number; }; retViewTop?: any; }> {
        // const { base, entitySpec, viewTop } = propsPickSpec;
        const { ix } = entitySpec;
        let budsEditing: BudsEditing;
        if (ix === true) {
            let { ret } = await uq.GetSpecsFromBase.query({ base });
            let retSpec: any;
            switch (ret.length) {
                default:
                    return await modal.open(<PagePickSelect />);
                case 0: retSpec = { id: base }; break;
                case 1: retSpec = ret[0]; break;
            }
            return retSpec;
        }
        else {
            const { keys, buds: props } = entitySpec;
            let buds = [...keys];
            if (props !== undefined) buds.push(...props);
            budsEditing = new BudsEditing(buds)
            let ret = await modal.open(<PagePickSpec />);
            return ret;
        }

        function PagePickSpec() {
            const { id: entityId, caption, name, keys, buds: props } = entitySpec;
            const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
            const submitCaption = '提交';
            const submitClassName: string = undefined;

            let formRows: FormRow[] = [
                // ...keys.map(v => budFormRow(v, true)),
                // ...(props ?? []).map(v => budFormRow(v)),
                ...budsEditing.buildFormRows(),
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
                let retSpec = Object.assign({ id, base }, data);
                modal.close(retSpec);
            }
            return <Page header={caption ?? name}>
                <div className="pt-3 tonwa-bg-gray-2">
                    <Band>
                        <div className="mx-3">{viewTop}</div>
                    </Band>
                </div>
                <div className="m-3">
                    <form className={theme.bootstrapContainer} onSubmit={handleSubmit(onSubmitForm)}>
                        <FormRowsView rows={formRows} register={register} errors={errors} />
                    </form>
                </div>
            </Page>;
        }

        function PagePickSelect() {
            function onClick() {
                modal.close({ id: 100 });
            }
            return <Page header="选择">
                <button className="btn btn-primary" onClick={onClick}>确定</button>
            </Page>;
        }
        /*
        };

        let ret = await pickSpec({
            base: retAtom?.id,
            entitySpec: from,
            viewTop,
            buttonCaption,
            buttonClassName,
        });
        return ret;
        */
    }, []);
}
