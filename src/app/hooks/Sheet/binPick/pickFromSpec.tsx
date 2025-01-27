import { JSX } from "react";
import { EntityFork, PickSpec } from "app/Biz";
import { ViewAtomId } from "app/hooks/BizAtom";
import { useForm } from "react-hook-form";
import { Band, FormRow, FormRowsView } from "app/coms";
import { Page } from "tonwa-app";
import { theme } from "tonwa-com";
import { ParamSaveFork } from "uqs/UqDefault";
import { EnumBudType } from "app/Biz";
import { getDays } from "app/tool";
import { BudsEditing, ValuesBudsEditing } from "app/hooks/BudsEditing";
import { PagePickSelect, PickResult } from "app/hooks";

export interface PropsPickSpec {
    base: number;
    entitySpec: EntityFork;
    viewTop: any;
    buttonCaption: string | JSX.Element;
    buttonClassName: string;
};

export async function pickFromSpec(editing: BudsEditing, binPick: PickSpec): Promise<PickResult> {
    const { modal, biz, uq } = editing;
    let { pickParams, from } = binPick;
    const pickName = binPick.name;
    // const calc = new Calc([[pickName, binPick.baseParam]], editing.namedResults);
    // let base = calc.getValue(pickName) as number;
    let base = editing.calcValue(binPick.baseParam) as number;
    if (base === undefined) {
        debugger;
    }
    const viewTop = <div>
        <ViewAtomId id={base} />
    </div>;
    let entitySpec = from;
    const { preset, id: specPhrase, keys } = entitySpec;
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
    const { buds: props } = entitySpec;
    let buds = [...keys];
    if (props !== undefined) buds.push(...props);
    let budsEditing = new ValuesBudsEditing(modal, biz, buds)
    let ret = await modal.open(<PagePickSpec />);
    return ret;

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
            // const keyValues: { [bud: string]: number | string } = {};
            const values: { [bud: string]: number | string } = {};
            for (let key of keys) {
                const { id, name, budDataType } = key;
                let v = data[name];
                switch (budDataType.type) {
                    case EnumBudType.date: v = getDays(v); break;
                }
                values[id] = v;
            }
            const param: ParamSaveFork = {
                id: undefined,
                fork: entityId,
                base,
                values,
            };
            let results = await uq.SaveFork.submit(param);
            let { id } = results;
            if (id < 0) id = -id;
            let retSpec = Object.assign({ id, base }, data);
            modal.close(retSpec);
        }
        return <Page header={caption}>
            <div className="pt-3 tonwa-bg-gray-2">
                <Band>
                    <div className="mx-3">{viewTop}</div>
                </Band>
            </div>
            <div className="m-3">
                <form className={theme.bootstrapContainer} onSubmit={handleSubmit(onSubmitForm)}>
                    <FormRowsView rows={formRows} register={register} errors={errors} context={budsEditing} />
                </form>
            </div>
        </Page>;
    }
}