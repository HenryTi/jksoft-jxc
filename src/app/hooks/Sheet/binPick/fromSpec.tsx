import { EntityFork, PickSpec } from "app/Biz";
import { ViewAtom, ViewAtomId } from "app/hooks/BizAtom";
import { Atom } from "uqs/UqDefault";
import { useCallback } from "react";
import { NamedResults, PickResult } from "../store";
import { DivStore } from "../store";
import { useUqApp } from "app/UqApp";
import { useModal } from "tonwa-app";
import { useForm } from "react-hook-form";
import { Band, FormRow, FormRowsView } from "app/coms";
import { Page } from "tonwa-app";
import { List, theme } from "tonwa-com";
import { ParamSaveSpec } from "uqs/UqDefault";
import { EnumBudType } from "app/Biz";
import { getDays } from "app/tool";
import { ValuesBudsEditing } from "app/hooks/BudsEditing";
import { Calc } from "app/hooks/Calc";
import { RowColsSm } from "app/hooks/tool";
import { PagePickSelect, ViewBud } from "app/hooks";

export interface PropsPickSpec {
    base: number;
    entitySpec: EntityFork;
    viewTop: any;
    buttonCaption: string | JSX.Element;
    buttonClassName: string;
};

export function usePickFromSpec() {
    const { uq } = useUqApp();
    const modal = useModal();
    return useCallback(async function (divStore: DivStore, namedResults: NamedResults, binPick: PickSpec): Promise<PickResult> {
        let { pickParams, from } = binPick;
        const pickName = binPick.name;
        const calc = new Calc([[pickName, binPick.baseParam]], namedResults);
        let base = calc.getValue(pickName) as number;
        const viewTop = <div>
            <ViewAtomId id={base} />
        </div>;
        let entitySpec = from;
        const { preset, id: specPhrase, keys } = entitySpec;
        let budsEditing: ValuesBudsEditing;
        if (preset === true) {
            let retSpec = await modal.open(<PagePickSelect entity={entitySpec} base={base} />);
            /*
            let { ret } = await uq.GetSpecListFromBase.query({ base, phrase: specPhrase });
            let retSpec: any;
            switch (ret.length) {
                default:
                    retSpec = await modal.open(<PagePickSelect entity={entitySpec} base={base} />);
                    break;
                case 1:
                    retSpec = ret[0];
                    break;
            }
            */
            return retSpec;
        }
        else {
            const { buds: props } = entitySpec;
            let buds = [...keys];
            if (props !== undefined) buds.push(...props);
            budsEditing = new ValuesBudsEditing(buds)
            let ret = await modal.open(<PagePickSpec />);
            return ret;
        }

        function PagePickSpec() {
            const { id: entityId, caption, name, keys, buds: props } = entitySpec;
            const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
            const submitCaption = '提交';
            const submitClassName: string = undefined;

            let formRows: FormRow[] = [
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
                    id: undefined,
                    spec: entityId,
                    base,
                    keys: keyValues,
                    props: propValues,
                };
                let results = await uq.SaveSpec.submit(param);
                let { id } = results;
                if (id < 0) id = -id;
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
    }, []);
}
