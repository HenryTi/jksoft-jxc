import { useForm } from "react-hook-form";
import { EntityAtom, EntitySubject } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { FormRow, FormRowsView, PageQuery, PageQueryMore } from "app/coms";
import { OptionsUseBizAtom, pathAtomNew, useBizAtom } from "app/hooks";
import { ViewItemID } from "app/views/ViewItemID";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { IDView, LinkModal, Page, useModal } from "tonwa-app";
import { CheckAsync, FA, List, Sep, useEffectOnce } from "tonwa-com";
import { Atom, EnumAtom, ReturnGetAllFormulaPhrases, SumFormula, SumFormulaType, UqExt } from "uqs/UqDefault";

export const pathSumFormula = 'admin-sum-formula';

const options: OptionsUseBizAtom = {
    atomName: EnumAtom.SumGroup,
};

interface Subj {
    name: string;
    caption: string;
}
interface Formula {
    id: number;
    formulaType: any;
    subject: Subj;
    post: Subj;
    sumSubject: Subj;
    caption: string;
    start: Date;
    end: Date;
    ratio: number;
}

export function PageSumFormula() {
    const { uq } = useUqApp();
    const { openModal } = useModal();
    const { data: [personFormulas, groupFormulas] } = useQuery('SumFormula', async () => {
        let { ret, phrases } = await uq.GetAllFormula.query({});
        const coll: { [id: number]: Subj } = {};
        for (let p of phrases) {
            coll[p.id] = p;
        }
        let personFormulas: Formula[] = [];
        let groupFormulas: Formula[] = [];
        for (let r of ret) {
            let { subject: subjectId, post: postId, sumSubject: subSubjectId } = r;
            let subject: Subj | number = coll[subjectId] ?? { name: String(subjectId), caption: undefined };
            let post: Subj | number = coll[postId] ?? { name: String(postId), caption: undefined };
            let sumSubject: Subj | number = coll[subSubjectId] ?? { name: String(subSubjectId), caption: undefined };
            let f: Formula = {
                ...r, subject, post, sumSubject,
            }
            switch (r.formulaType) {
                case SumFormulaType.person:
                    personFormulas.push(f);
                    break;
                case SumFormulaType.group:
                    groupFormulas.push(f);
                    break;
            }
        }
        return [personFormulas, groupFormulas];
    });
    function viewArr(arr: [string, Subj][]) {
        return arr.map(([title, { name, caption }], index) => {
            const content = (caption === undefined) ?
                <>{name}</>
                :
                <><b>{name}</b> <small>{caption}</small></>;
            return <div key={index} className="me-5">
                <div className="small">{title}</div>
                {content}
            </div>
        });
    }
    function ViewItemPerson({ value }: { value: Formula }) {
        const { caption, ratio, subject, post, sumSubject } = value;
        const arr: [string, Subj][] = [
            ['科目', subject],
            ['岗位', post],
            ['目标科目', sumSubject],
        ];
        return <div className="px-3 py-2 d-flex">
            <div className="flex-grow-1">
                <div>{caption}</div>
                <div className="d-flex">
                    {viewArr(arr)}
                </div>
            </div>
            <div className="fs-4">{ratio}</div>
        </div>
    }
    function ViewItemGroup({ value }: { value: Formula }) {
        const { caption, ratio, subject, post, sumSubject } = value;
        const arr: [string, Subj][] = [
            ['科目', subject],
            ['岗位', post],
            ['目标科目', sumSubject],
        ];
        return <div className="px-3 py-2 d-flex">
            <div className="flex-grow-1">
                <div>{caption}</div>
                <div className="d-flex">
                    {viewArr(arr)}
                </div>
            </div>
            <div className="fs-4">{ratio}</div>
        </div>
    }
    const cnHeader = ' px-3 pt-2 pb-2 tonwa-bg-gray-2 small d-flex align-items-end';
    function ListHeader({ caption, type }: { caption: string; type: SumFormulaType; }) {
        function onAddFormula() {
            openModal(<PageAddFormula type={type} />);
        }
        return <div className={cnHeader}>
            <div className="flex-grow-1">{caption}</div>
            <button className="btn btn-sm btn-outline-primary" onClick={onAddFormula}><FA name="plus" /></button>
        </div>
    }
    return <Page header={`公式`}>
        <ListHeader caption="个人公式" type={SumFormulaType.person} />
        <List items={personFormulas} ViewItem={ViewItemPerson} />
        <Sep className="mb-3" />
        <ListHeader caption="小组公式" type={SumFormulaType.group} />
        <List items={groupFormulas} ViewItem={ViewItemGroup} />
    </Page>
}

const pageStart: number = undefined;
const pageSize: number = 1000;
async function searchAtoms(uq: UqExt, atom: EnumAtom): Promise<any[]> {
    // , param: any, pageStart: any, pageSize: number
    let newParam = { atom: `atom.${atom}`, ...{ key: undefined } };
    let query = uq.SearchAtom;
    let { $page } = await query.page(newParam, pageStart, pageSize);
    return $page;
};


function PageAddFormula({ type }: { type: SumFormulaType; }) {
    const { uq } = useUqApp();
    function ViewItem({ value: { no, ex } }: { value: Atom }) {
        let content = ex ?
            <>{ex} <small className="text-muted">{no}</small></>
            :
            <>{no}</>;
        return <div className="px-3 py-2">
            {content}
        </div>
    }

    const formRows: FormRow[] = [
        {
            name: 'no',
            label: 'NOLabel',
            type: 'text',
            options: { maxLength: 20, disabled: true }
        },
        { name: 'ex', label: 'exLabel', type: 'text', options: { maxLength: 50 } },
        { name: 'subject', label: '科目', atom: EnumAtom.Subject },
        { type: 'submit', label: '下一步' },
    ];
    const { register, handleSubmit, formState: { errors }, } = useForm({ mode: 'onBlur' });
    async function onSubmit(data: any) {
        // let ret = await actSave(entity, no, data);
        //navigate(`../${pathView}/${ret.id}`, { replace: true });
        alert('a');
    }
    const header = (type === SumFormulaType.person ? '个人' : '小组') + '公式';
    return <Page header={header}>
        <form onSubmit={handleSubmit(onSubmit)} className="container my-3 pe-5">
            <FormRowsView rows={formRows} {...{ register, errors }} />
        </form>
    </Page>;
}

/*
<div className="px-3 py-2 small tonwa-bg-gray-2">科目</div>
{subjects.map((v, index) => {
    return <ViewItem key={index} value={v} />;
})}
<div className="px-3 py-2 small tonwa-bg-gray-2">岗位</div>
{sumPersonPosts.map((v, index) => {
    return <ViewItem key={index} value={v} />;
})}
<div className="px-3 py-2 small tonwa-bg-gray-2">组类别</div>
{subGroupPosts.map((v, index) => {
    return <ViewItem key={index} value={v} />;
})}
*/

/*
const { data: [subjects
    //, sumPersonPosts, subGroupPosts
] } = useQuery('subject post', async () => {
    const results = await Promise.all([
        searchAtoms(uq, EnumAtom.Subject),
        //searchAtoms(uq, EnumAtom.SumPersonPost),
        //searchAtoms(uq, EnumAtom.SumGroupPost),
    ]);
    return results;
});
*/