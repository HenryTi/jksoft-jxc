import { from62, to62 } from "tonwa-com";
import { BizBud, EntityAtom, EntityID, EnumBudType } from "app/Biz";
import { EntityStore, QueryMore, readBuds } from "app/tool";
import { PageBizAtomSelectType } from "./PageBizAtomSelectType";
import { useParams } from "react-router-dom";
import { useUqApp } from "app/UqApp";
import { useMemo, useRef } from "react";
import { Modal, useModal } from "tonwa-app";

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

export class AtomStore extends EntityStore<EntityAtom> {
    readonly pathView: string;
    readonly pathList: string;

    constructor(modal: Modal, entity: EntityAtom) {
        super(modal, entity);
        this.pathView = entity.name;
        this.pathList = entity.name + '-list';
    }

    async getAtom(id: number) {
        const { biz, uq } = this.entity;
        let ret = await this.getAtomBase(id);
        let { main } = ret;
        let { phrase } = main;
        let entityID = biz.entityFromId<EntityID>(phrase);
        return {
            ...ret, entityID, id
        };
    }

    private async getAtomBase(id: number) {
        const { uq, biz } = this.entity;
        let { props } = await uq.GetAtom.query({ id });
        let { main, buds } = readBuds(biz, id, props);
        return {
            main, buds
        };
    }
    /*
    async saveField(id: number, name: string, value: string | number) {
        const { uq } = this.entity;
        await uq.ActIDProp(uq.Atom, id, name, value);
    }

    async saveBudValue(id: number, bizBud: BizBud, value: string | number) {
        let int: number, dec: number, str: string;
        const { budDataType, id: phraseId } = bizBud;
        switch (budDataType.type) {
            default:
            case EnumBudType.int: int = value as number; break;
            case EnumBudType.dec: dec = value as number; break;
            case EnumBudType.str: str = value as string; break;
        }
        const { uq } = this.entity;
        await uq.SaveBudValue.submit({
            id,
            phraseId,
            int, dec, str
        });
    }
    */
    readonly searchItems: QueryMore = async (param: any, pageStart: any, pageSize: number) => {
        let newParam = { phrase: this.entity.id, ...param };
        let query = this.entity.uq.GetIDList;
        let { $page, props, atoms, specs } = await query.page(newParam, pageStart, pageSize);
        this.cacheIdAndBuds(props, atoms, specs);
        return $page;
    }

    async selectLeafAtom(entityAtom: EntityAtom): Promise<EntityAtom> {
        if (entityAtom === undefined) entityAtom = this.entity;
        const { subClasses: children } = entityAtom;
        switch (children.length) {
            case 0: return entityAtom;
            case 1: return children[0] as EntityAtom;
            default:
                let page = <PageBizAtomSelectType entityAtom={entityAtom} caption="选择类型" />;
                if (!page) return entityAtom;
                let ea = await this.modal.open<EntityAtom>(page);
                if (ea === undefined) return undefined;
                let ret = await this.selectLeafAtom(ea);
                return ret;
        }
    }

    async directListCount(): Promise<number> {
        let ret = await this.entity.uq.GetIDListCount.query({ phrase: this.entity.id });
        return ret.ret[0].count;
    }

    async setIDBase(id: number, base: number) {
        await this.entity.uq.SetIDBase.submit({ id, base });
    }
}

export function useAtomStore() {
    const { atom } = useParams();
    let atomPhraseId = from62(atom);
    const modal = useModal();
    const uqApp = useUqApp();
    const { biz } = uqApp;
    let entity = biz.entityFromId<EntityAtom>(atomPhraseId);
    const store = useMemo(() => new AtomStore(modal, entity), [atomPhraseId])
    /*
    let entity = options.entityAtom;
    if (entity === undefined) {
        entity = biz.entityFromId<EntityAtom>(atomPhraseId);
    }
    */
    return store;
}
