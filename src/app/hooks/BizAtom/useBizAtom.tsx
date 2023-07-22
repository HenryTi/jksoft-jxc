import { QueryMore } from "app/tool";
import { UqApp, useUqApp } from "app/UqApp";
import { Biz, BizBud, EntityAtom } from "app/Biz";
import { uqAppModal } from "tonwa-app";
import { PageBizAtomSelectType } from "./PageBizAtomSelectType";
import { Atom, EnumAtom } from "uqs/UqDefault";

export function pathAtomNew(atomName: string) {
    return `${atomName}-new`;
}

export function pathAtomList(atomName: string) {
    return `${atomName}-list`;
}

export interface ViewPropRowProps {
    name: string;
    label: string;
    readonly?: boolean;
}

export interface ViewPropProps extends ViewPropRowProps {
    id: number;
    value: string | number;
    ValueTemplate?: (props: { value: any; }) => JSX.Element;
    savePropMain: (id: number, name: string, value: string | number) => Promise<void>;
    savePropEx: (id: number, bizBud: BizBud, value: string | number) => Promise<void>;
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
    metric: string;
    pathView: string;
    pathList: string;
    getEntityAtom: (phrase: string) => EntityAtom;
    savePropMain: (id: number, name: string, value: string | number) => Promise<void>;
    savePropEx: (id: number, bizBud: BizBud, value: string | number) => Promise<void>;
    searchAtoms: QueryMore;
    selectLeafAtom: (entityAtom: EntityAtom) => Promise<EntityAtom>;
}

export function useBizAtom(options: OptionsUseBizAtom): UseBizAtomReturn {
    const { atomName: atomPhrase } = options;
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const entity = biz.entities[atomPhrase] as EntityAtom;
    const phrase = entity.phrase;
    const pathView = entity.name;
    const pathList = entity.name + '-list';
    // const phrase = `${entity.type}.${entity.name}`;

    function getEntityAtom(phrase: string): EntityAtom {
        return biz.entities[phrase] as EntityAtom;
    }

    async function savePropMain(id: number, name: string, value: string | number) {
        await uq.ActIDProp(uq.Atom, id, name, value);
    }

    async function savePropEx(id: number, bizBud: BizBud, value: string | number) {
        // let { entity } = this;
        // let { props } = entity;
        // let bizProp = props.get(name);
        let int: number, dec: number, str: string;
        switch (bizBud.budDataType.type) {
            default:
            case 'int': int = value as number; break;
            case 'dec': dec = value as number; break;
            case 'str': str = value as string; break;
        }
        await uq.SaveBud.submit({
            id,
            phrase: bizBud.phrase,
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
        metric: entity.metric,
        pathView,
        pathList,
        getEntityAtom,
        savePropMain,
        savePropEx,
        searchAtoms,
        selectLeafAtom,
    };
}