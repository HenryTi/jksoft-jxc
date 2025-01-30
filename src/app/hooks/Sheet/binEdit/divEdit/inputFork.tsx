import { BinInputFork, BizBud, EntityID, ValueSetType } from "tonwa";
import { Page } from "tonwa-app";
import { theme } from "tonwa-com";
import { Band } from "app/coms";
import { Atom, ParamSaveFork } from "uqs/UqDefault";
import { EnumBudType } from "tonwa";
import { getDays } from "app/tool";
import { btnNext, cnNextClassName } from "../../store";
import { InputProps } from "./inputBase";
import { ViewIBaseFromId } from "../ViewDiv/ViewIBase";
import { ValuesBudsEditing } from "app/hooks/BudsEditing";
import { PickResult } from "app/hooks/Calc";
import { FormBudsEditing } from "app/hooks/View";


export interface PropsInputFork extends InputProps<BinInputFork> {
};

export async function inputFork(props: PropsInputFork): Promise<PickResult> {
    const { binInput, editing } = props;
    const { valDiv, binStore } = editing;
    const { sheetStore, client, modal, biz } = binStore;
    const { baseExp, baseBud, params } = binInput;
    const seedName = '.i';
    editing.addFormula(seedName, baseExp ?? baseBud.valueSet, false); // baseBud.valueSetType === ValueSetType.init);
    const seed = editing.getValue(seedName) as number;
    if (seed === undefined) {
        debugger;
        throw Error('input fork must have seed');
    }
    editing.setNamedValue('%base', seed);
    let paramValues: { [budId: number | string]: any };
    // 暂时先按赋值处理，以后可以处理:=
    let entityFork = binInput.fork;
    if (entityFork === undefined) {
        let { entityID } = sheetStore.getCacheAtom(seed);
        entityFork = entityID.fork;
    }
    if (entityFork === undefined) {
        // alert('no entity fork');
        return { id: seed, };   // 没有批次定义
    }
    const { id: entityId, preset, keys, buds: forkBuds } = entityFork;
    let paramsDefined: boolean;
    if (params.length === 1) {
        const { bud, valueSet, valueSetType } = params[0];
        if (bud === undefined) {
            paramValues = editing.calcValue(valueSet) as any;
            if (paramValues !== undefined) {
                paramsDefined = (valueSetType === ValueSetType.equ);
            }
            else {
                paramsDefined = false;
            }
        }
    }
    if (paramsDefined === undefined) {
        let paramsSetCount = 0;
        paramValues = {};
        for (let { bud, valueSet, valueSetType } of params) {
            paramValues[bud.id] = editing.calcValue(valueSet);
            if (valueSetType === ValueSetType.equ) ++paramsSetCount;
        }
        paramsDefined = (paramsSetCount === keys.length + forkBuds.length);
    }
    async function saveFork(isFormInput: boolean, data: any) {
        function budValueFromData(bud: BizBud) {
            const { id, name, budDataType } = bud;
            let v: any;
            if (isFormInput === true) {
                v = data[name];
                switch (budDataType.type) {
                    default:
                        if (v === '') v = undefined;
                        break;
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
                values[bud.id] = v;
            }
            return values;
        }
        const values = buildValues([...keys, ...forkBuds]);
        const param: ParamSaveFork = {
            id: undefined,
            fork: entityId,
            base: seed,
            values,
        };
        let results = await client.SaveFork(param);
        let { id } = results;
        if (id < 0) id = -id;
        let retSpec = Object.assign(data, { id, base: seed });

        sheetStore.addBizForks([{
            id,
            seed,
            phrase: entityId,
        }],
            [...keys, ...forkBuds].map(v => ({
                id,
                bud: v.id,
                value: budValueFromData(v),
            })));
        return retSpec;
    }
    let ret: any;
    if (paramsDefined === true) {
        ret = await saveFork(false, paramValues);
    }
    else if (preset === true) {
        let ret = await client.GetSpecsFromBase(seed);
        let retSpec: any;
        switch (ret.length) {
            default:
                return await modal.open(<PagePickSelect />);
            case 0: retSpec = { id: seed }; break;
            case 1: retSpec = ret[0]; break;
        }
        ret = retSpec;
    }
    else {
        let buds = [...keys];
        if (forkBuds !== undefined) buds.push(...forkBuds);
        let budsEditing = new ValuesBudsEditing(modal, biz, buds);
        budsEditing.setNamedValue('%base', seed);
        budsEditing.initBudValues(paramValues);
        ret = await modal.open(<PagePickSpec />);
        function PagePickSpec() {
            const { caption } = entityFork;
            const onSubmitForm = async (data: any) => {
                let retSpec = await saveFork(true, data);
                modal.close(retSpec);
            }
            const { bootstrapContainer } = theme;
            return <Page header={caption}>
                <div className={bootstrapContainer + ' pt-3 tonwa-bg-gray-2 '}>
                    <Band>
                        <div className="mx-3">
                            <ViewIBaseFromId sheetStore={sheetStore} valDiv={valDiv} iBase={seed} />
                        </div>
                    </Band>
                </div>
                <div className="m-3">
                    <FormBudsEditing
                        className={bootstrapContainer}
                        budsEditing={budsEditing}
                        onSubmit={onSubmitForm}
                        submit={btnNext}
                        submitClassName={cnNextClassName} />
                </div>
            </Page>;
        }
    }
    if (ret !== undefined) {
        const { id, base } = ret;
        // const { bizForkColl } = sheetStore;
        sheetStore.setCacheFork(id, base, keys);
        /*
        let pAtom = sheetStore.getCacheAtom(base);
        let atom: Atom;
        let entityID: EntityID;
        if (pAtom !== undefined) {
            atom = pAtom.atom;
            entityID = pAtom.entityID;
        }
        // sheetStore.set
        bizForkColl[id] = {
            atom,
            entityID,
            buds: keys,
        }
        */
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
