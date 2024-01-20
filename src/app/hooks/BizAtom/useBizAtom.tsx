import { QueryMore, readBuds } from "app/tool";
import { UqApp, useUqApp } from "app/UqApp";
import { Biz, BizBud, EntityAtom, EnumBudType } from "app/Biz";
import { BudValue, uqAppModal } from "tonwa-app";
import { PageBizAtomSelectType } from "./PageBizAtomSelectType";
import { UqExt } from "uqs/UqDefault";
import { useParams } from "react-router-dom";
import { from62, to62 } from "tonwa-com";

function atomInPath(main: string, atomPhraseId: number | string) {
    let p: string;
    if (typeof atomPhraseId === 'string') {
        if (atomPhraseId !== ':atom') debugger;
        p = atomPhraseId;
    }
    else {
        p = to62(atomPhraseId);
    }
    return `${main}/${p}`;
}
const atom = 'atom';

export function buildPathAtom(main: string) {
    return {
        new: function (atomPhraseId: number | string) {
            return `${atomInPath(main, atomPhraseId)}/new`;
        },
        list: function (atomPhraseId: number | string) {
            return `${atomInPath(main, atomPhraseId)}/list`;
        },
        view: function (atomPhraseId: number | string, id?: number) {
            return `${atomInPath(main, atomPhraseId)}/${to62(id) ?? ':id'}`;
        },
        edit: function (atomPhraseId: number | string, id?: number) {
            return `${atomInPath(main, atomPhraseId)}/${to62(id) ?? ':id'}`;
        },
        index: function (atomPhraseId: number | string, id?: number) {
            return `${atomInPath(main, atomPhraseId)}/${to62(id) ?? ':id'}`;
        }
    }
}

export const pathAtom = buildPathAtom(atom);

export interface OptionsUseBizAtom {
    atomName: string;
    NOLabel?: string;
    exLabel?: string;
}

export interface UseBizAtomReturn {
    uqApp: UqApp;
    biz: Biz;
    entity: EntityAtom;
    // uom: boolean;
    pathView: string;
    pathList: string;
    getAtom(id: number): Promise<{
        main: any;
        buds: { [bud: number]: BudValue; };
    }>;
    saveField: (id: number, name: string, value: string | number) => Promise<void>;
    saveBud: (id: number, bizBud: BizBud, value: string | number) => Promise<void>;
    searchAtoms: QueryMore;
    selectLeafAtom: (entityAtom: EntityAtom) => Promise<EntityAtom>;
}

async function getAtomBase(uq: UqExt, id: number) {
    let { props } = await uq.GetAtom.query({ id });
    let { main, buds } = readBuds(id, props);
    return {
        main, buds
    };
}

export async function getAtomWithProps(biz: Biz, uq: UqExt, id: number): Promise<any> {
    let { main, buds } = await getAtomBase(uq, id);
    let ret = { ...main };
    let { phrase: phraseId } = main;
    let entity = biz.entityFromId(phraseId);
    function setBud(bud: number, value: BudValue) {
        let bizBud = entity.budColl[bud];
        (ret as any)[bizBud.name] = value;
    }
    for (let i in buds) setBud(Number(i), buds[i]);
    return ret;
}

export function useBizAtom(options: OptionsUseBizAtom): UseBizAtomReturn {
    const { atom } = useParams();
    let atomPhraseId = from62(atom);
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const entity = biz.entityFromId<EntityAtom>(atomPhraseId);
    // const phrase = entity.phrase;
    const pathView = entity.name;
    const pathList = entity.name + '-list';

    async function getAtom(id: number) {
        let ret = await getAtomBase(uq, id);
        let { main } = ret;
        let { phrase } = main;
        let entityAtom = biz.entityFromId<EntityAtom>(phrase);
        return {
            ...ret, entityAtom
        };
    }

    async function saveField(id: number, name: string, value: string | number) {
        await uq.ActIDProp(uq.Atom, id, name, value);
    }

    async function saveBud(id: number, bizBud: BizBud, value: string | number) {
        let int: number, dec: number, str: string;
        const { budDataType, id: phraseId } = bizBud;
        switch (budDataType.type) {
            default:
            case EnumBudType.int: int = value as number; break;
            case EnumBudType.dec: dec = value as number; break;
            case EnumBudType.str: str = value as string; break;
        }
        await uq.SaveBudValue.submit({
            id,
            phraseId,
            int, dec, str
        });
    }
    async function searchAtoms(param: any, pageStart: any, pageSize: number): Promise<any[]> {
        let newParam = { atom: atomPhraseId, ...param };
        let query = uq.SearchAtom;
        let { $page } = await query.page(newParam, pageStart, pageSize);
        return $page;
    };
    async function selectLeafAtom(entityAtom: EntityAtom): Promise<EntityAtom> {
        if (entityAtom === undefined) entityAtom = entity;
        const { openModal } = uqAppModal(uqApp);
        const { subClasses: children } = entityAtom;
        switch (children.length) {
            case 0: return entityAtom;
            case 1: return children[0] as EntityAtom;
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
        pathView,
        pathList,
        getAtom,
        saveField,
        saveBud,
        searchAtoms,
        selectLeafAtom,
    };
}