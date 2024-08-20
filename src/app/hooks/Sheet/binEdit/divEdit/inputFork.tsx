import { BinInputFork, BizBud, EntityID, ValueSetType } from "app/Biz";
import { Page } from "tonwa-app";
import { theme } from "tonwa-com";
import { useForm } from "react-hook-form";
import { Band, FormRow, FormRowsView } from "app/coms";
import { Atom, ParamSaveSpec } from "uqs/UqDefault";
import { EnumBudType } from "app/Biz";
import { getDays } from "app/tool";
import { btnNext, cnNextClassName } from "../../store";
import { InputProps } from "./inputBase";
import { ViewIBaseFromId } from "../ViewDiv/ViewIBase";
import { ValuesBudsEditing } from "app/hooks/BudsEditing";
import { PickResult } from "app/hooks/Calc";


export interface PropsInputFork extends InputProps<BinInputFork> {
};

export async function inputFork(props: PropsInputFork): Promise<PickResult> {
    const { binInput, editing } = props;
    const { valDiv, divStore } = editing;
    const { sheetStore, uq, modal, biz } = divStore;
    const { baseExp, baseBud, params } = binInput;
    const baseName = '.i';
    editing.addFormula(baseName, baseExp ?? baseBud.valueSet, false); // baseBud.valueSetType === ValueSetType.init);
    const base = editing.getValue(baseName) as number;
    if (base === undefined) {
        debugger;
        throw Error('input spec must have base');
    }
    const paramValues: { [budId: number]: any } = {};
    // 暂时先按赋值处理，以后可以处理:=
    let entityFork = binInput.spec;
    if (entityFork === undefined) {
        let { atom: atomObj, entityID } = sheetStore.bizAtomColl[base];
        entityFork = entityID.fork;
    }
    if (entityFork === undefined) {
        alert('no entity fork');
        return;
    }
    const { id: entityId, preset, keys, buds: forkBuds } = entityFork;
    let paramsSetCount = 0;
    for (let { bud, valueSet, valueSetType } of params) {
        paramValues[bud.id] = editing.calcValue(valueSet);
        if (valueSetType === ValueSetType.equ) ++paramsSetCount;
    }
    async function saveSpec(isFormInput: boolean, data: any) {
        function budValueFromData(bud: BizBud) {
            const { id, name, budDataType } = bud;
            let v: any;
            if (isFormInput === true) {
                v = data[name];
                switch (budDataType.type) {
                    case EnumBudType.date: v = getDays(v); break;
                }
            }
            else {
                v = data[id];
            }
            return v;
        }
        function buildValues(buds: BizBud[]) {
            let values: { [bud: string]: number | string } = {};
            for (let bud of buds) {
                let v = budValueFromData(bud);
                values[bud.name] = v;
            }
            return values;
        }
        const keyValues = buildValues(keys);
        const propValues = buildValues(forkBuds);
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
        let retSpec = Object.assign(data, { id, base });

        sheetStore.addBizSpecs([{
            id,
            atom: base,
        }],
            [...keys, ...forkBuds].map(v => ({
                id,
                phrase: v.id,
                value: budValueFromData(v),
            })));
        return retSpec;
    }
    let ret: any;
    if (paramsSetCount === keys.length + forkBuds.length) {
        ret = await saveSpec(false, paramValues);
    }
    else if (preset === true) {
        let { ret } = await uq.GetSpecsFromBase.query({ base });
        let retSpec: any;
        switch (ret.length) {
            default:
                return await modal.open(<PagePickSelect />);
            case 0: retSpec = { id: base }; break;
            case 1: retSpec = ret[0]; break;
        }
        ret = retSpec;
    }
    else {
        let buds = [...keys];
        if (forkBuds !== undefined) buds.push(...forkBuds);
        let budsEditing = new ValuesBudsEditing(modal, biz, buds);
        budsEditing.initBudValues(paramValues);
        ret = await modal.open(<PagePickSpec />);
        function PagePickSpec() {
            const { caption } = entityFork;
            const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
            const submitCaption = btnNext;
            const submitClassName: string = cnNextClassName;

            let formRows: FormRow[] = [
                ...budsEditing.buildFormRows(),
                { type: 'submit', label: submitCaption, options: {}, className: submitClassName }
            ];
            const onSubmitForm = async (data: any) => {
                let retSpec = await saveSpec(true, data);
                modal.close(retSpec);
            }
            const { bootstrapContainer } = theme;
            return <Page header={caption}>
                <div className={bootstrapContainer + ' pt-3 tonwa-bg-gray-2 '}>
                    <Band>
                        <div className="mx-3">
                            <ViewIBaseFromId sheetStore={sheetStore} valDiv={valDiv} iBase={base} />
                        </div>
                    </Band>
                </div>
                <div className="m-3">
                    <form className={bootstrapContainer} onSubmit={handleSubmit(onSubmitForm)}>
                        <FormRowsView rows={formRows} register={register} errors={errors} context={budsEditing} />
                    </form>
                </div>
            </Page>;
        }
    }
    if (ret !== undefined) {
        const { id, base } = ret;
        const { bizForkColl: bizSpecColl, bizAtomColl } = sheetStore;
        let pAtom = bizAtomColl[base];
        let atom: Atom;
        let entityID: EntityID;
        if (pAtom !== undefined) {
            atom = pAtom.atom;
            entityID = pAtom.entityID;
        }
        bizSpecColl[id] = {
            atom,
            entityID,
            buds: keys,
        }
    }
    return ret;

    function PagePickSelect() {
        function onClick() {
            modal.close({ id: 100 });
        }
        return <Page header="选择">
            <button className="btn btn-primary" onClick={onClick}>确定</button>
        </Page>;
    }
};
