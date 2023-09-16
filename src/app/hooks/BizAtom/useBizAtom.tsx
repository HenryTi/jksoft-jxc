import { AtomUomProps, QueryMore, readBuds, readUoms } from "app/tool";
import { UqApp, useUqApp } from "app/UqApp";
import { Biz, BizBud, EntityAtom } from "app/Biz";
import { uqAppModal } from "tonwa-app";
import { PageBizAtomSelectType } from "./PageBizAtomSelectType";
import { EnumAtom, UqExt } from "uqs/UqDefault";
import { useLocation, useParams } from "react-router-dom";
import { BudValue } from "../model";

export function pathAtomNew(atomName: string) {
    return `atom/${atomName}/new`;
}

export function pathAtomList(atomName: string) {
    return `atom/${atomName}/list`;
}

export function pathAtomView(atomName: string, id?: number) {
    return `atom/${atomName}/view/${id ?? ':id'}`;
}

export function pathAtomEdit(atomName: string, id?: number) {
    return `atom/${atomName}/edit/${id ?? ':id'}`;
}

export function pathAtom(atomName: string, id?: number) {
    return `atom/${atomName}/${id ?? ':id'}`;
}

export interface OptionsUseBizAtom {
    atomName: EnumAtom;
    NOLabel?: string;
    exLabel?: string;
}

export interface UseBizAtomReturn {
    uqApp: UqApp;
    biz: Biz;
    entity: EntityAtom;
    uom: boolean;
    pathView: string;
    pathList: string;
    getAtom(id: number): Promise<{
        main: any;
        buds: { [prop: string]: { bud: number; phrase: string; value: BudValue; } };
        uoms: AtomUomProps[];
        entityAtom: EntityAtom;
    }>;
    getEntityAtom: (phrase: string) => EntityAtom;
    saveField: (id: number, name: string, value: string | number) => Promise<void>;
    saveBud: (id: number, bizBud: BizBud, value: string | number) => Promise<void>;
    searchAtoms: QueryMore;
    selectLeafAtom: (entityAtom: EntityAtom) => Promise<EntityAtom>;
}

async function getAtomBase(uq: UqExt, id: number) {
    let { main: [main], budsInt, budsDec, budsStr, budsCheck, uoms: uomsArr } = await uq.GetAtom.query({ id });
    let buds = readBuds({ budsInt, budsDec, budsStr, budsCheck });
    let uoms = readUoms(uomsArr);
    return {
        main, buds, uoms
    };
}

export async function getAtomWithProps(uq: UqExt, id: number): Promise<any> {
    let { main, buds } = await getAtomBase(uq, id);
    let ret = { ...main };
    function setBud({ bud, phrase, value }: { bud: number; phrase: string; value: BudValue; }) {
        let p = phrase.lastIndexOf('.');
        let name = phrase.substring(p + 1);
        (ret as any)[name] = value;
    }
    for (let i in buds) setBud(buds[i]);
    return ret;
}

export function useBizAtom(options: OptionsUseBizAtom): UseBizAtomReturn {
    const a = useLocation();
    const { atom: atomPhrase } = useParams();
    // const { atomName: atomPhrase } = options;
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    // const biz = useBiz();
    const entity = biz.entities[atomPhrase] as EntityAtom;
    const phrase = entity.phrase;
    const pathView = entity.name;
    const pathList = entity.name + '-list';

    function getEntityAtom(phrase: string): EntityAtom {
        return biz.entities[phrase] as EntityAtom;
    }

    async function getAtom(id: number) {
        let ret = await getAtomBase(uq, id);
        let { main } = ret;
        let { phrase } = main;
        let entityAtom = biz.entities[phrase] as EntityAtom;
        return {
            ...ret, entityAtom
        };
    }

    async function saveField(id: number, name: string, value: string | number) {
        await uq.ActIDProp(uq.Atom, id, name, value);
    }

    async function saveBud(id: number, bizBud: BizBud, value: string | number) {
        let int: number, dec: number, str: string;
        const { budDataType, phrase } = bizBud;
        switch (budDataType.type) {
            default:
            case 'int': int = value as number; break;
            case 'dec': dec = value as number; break;
            case 'str': str = value as string; break;
        }
        await uq.SaveBudValue.submit({
            id,
            phrase,
            int, dec, str
        });
    }
    async function searchAtoms(param: any, pageStart: any, pageSize: number): Promise<any[]> {
        let newParam = { atom: phrase, ...param };
        let query = uq.SearchAtom;
        let { $page } = await query.page(newParam, pageStart, pageSize);
        return $page;
    };
    async function selectLeafAtom(entityAtom: EntityAtom): Promise<EntityAtom> {
        if (entityAtom === undefined) entityAtom = entity;
        const { openModal } = uqAppModal(uqApp);
        const { children } = entityAtom;
        switch (children.length) {
            case 0: return entityAtom;
            case 1: return children[0];
            default:
                let page = <PageBizAtomSelectType entityAtom={entityAtom} caption="选择类型" />;
                if (!page) return entityAtom;
                let ea = await openModal<EntityAtom>(page);
                if (ea === undefined) return undefined;
                let ret = await selectLeafAtom(ea);
                return ret;
        }
    }
    return {
        uqApp,
        biz,
        entity,
        uom: entity.uom,
        pathView,
        pathList,
        getAtom,
        getEntityAtom,
        saveField,
        saveBud,
        searchAtoms,
        selectLeafAtom,
    };
}