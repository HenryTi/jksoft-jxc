import { useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { Modal, useModal } from "tonwa-app";
import { from62, to62 } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { BizBud, EntityAtom, EntityID, EnumBudType } from "../../Biz";
import { StoreEntity } from "../../Store";
import { QueryMore } from "./PageQueryMore";
import { PageBizAtomSelectType } from "./PageBizAtomSelectType";
import { readBuds } from "./readBuds";

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

export class AtomStore extends StoreEntity<EntityID> {
    readonly pathView: string;
    readonly pathList: string;

    constructor(modal: Modal, entity: EntityID) {
        super(modal, entity);
        this.pathView = entity.name;
        this.pathList = entity.name + '-list';
    }

    async getAtom(id: number) {
        const { biz } = this.entity;
        let ret = await this.getAtomBase(id);
        let { main } = ret;
        let { phrase } = main;
        let entityID = biz.entityFromId<EntityID>(phrase);
        return {
            ...ret, entityID, id
        };
    }

    private async getAtomBase(id: number) {
        const { biz } = this.entity;
        let props = await biz.client.GetAtom(id);
        let { main, buds } = readBuds(biz, id, props);
        return {
            main, buds
        };
    }

    saveField = async (id: number, name: string, value: string | number) => {
        const { biz } = this.entity;
        await biz.client.ActIDProp(id, name, value);
    }

    saveBudValue = async (id: number, bizBud: BizBud, value: string | number) => {
        let int: number, dec: number, str: string;
        const { budDataType, id: phraseId } = bizBud;
        switch (budDataType.type) {
            default:
            case EnumBudType.int: int = value as number; break;
            case EnumBudType.dec: dec = value as number; break;
            case EnumBudType.str: str = value as string; break;
        }
        const { biz } = this.entity;
        await biz.client.SaveBudValue({ id, phraseId, int, dec, str });
    }

    readonly searchItems: QueryMore = async (param: any, pageStart: any, pageSize: number) => {
        let newParam = { phrase: this.entity.id, ...param };
        let { $page, props, atoms, forks } = await this.client.GetIDList(newParam, pageStart, pageSize);
        // let { $page, props, atoms, forks } = await query.page(newParam, pageStart, pageSize);
        this.cacheIdAndBuds(props, atoms, forks);
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
        return this.client.GetIDListCount(this.entity.id);
        // let ret = await this.entity.uq.GetIDListCount.query({ phrase: this.entity.id });
        // return ret.ret[0].count;
    }

    async setIDBase(id: number, base: number) {
        // await this.entity.uq.SetIDBase.submit({ id, base });
        this.client.SetIDBase(id, base);
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
