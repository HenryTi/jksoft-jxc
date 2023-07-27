import { useForm } from "react-hook-form";
import { useUqApp } from "app/UqApp";
import { FormRow, FormRowsView } from "app/coms";
import { useQuery } from "react-query";
import { IDView, Page, useModal } from "tonwa-app";
import { FA, List, Sep } from "tonwa-com";
import { EnumAtom, SumFormula, SumFormulaType } from "uqs/UqDefault";

export const pathSumFormula = 'admin-sum-formula';

const label = {
    caption: '标题',
    sourceSubject: '源科目',
    peronPost: '岗位',
    groupPost: '职能组',
    sumSubject: '科目',
    ratio: '换算率',
};

const personProps: PageAddFormulaProps = {
    formulaType: SumFormulaType.person,
    postAtom: EnumAtom.SumPersonPost,
    postLabel: label.peronPost,
    header: '个人',
}

const groupProps: PageAddFormulaProps = {
    formulaType: SumFormulaType.group,
    postAtom: EnumAtom.SumGroupPost,
    postLabel: label.groupPost,
    header: '小组',
};

export function PageSumFormula() {
    const { uq } = useUqApp();
    const { openModal, closeModal } = useModal();
    const { data: [personFormulas, groupFormulas] } = useQuery('SumFormula', async () => {
        let { ret } = await uq.GetAllFormula.query({});
        let personFormulas: SumFormula[] = [];
        let groupFormulas: SumFormula[] = [];
        for (let r of ret) {
            switch (r.formulaType) {
                case SumFormulaType.person:
                    personFormulas.push(r);
                    break;
                case SumFormulaType.group:
                    groupFormulas.push(r);
                    break;
            }
        }
        return [personFormulas, groupFormulas];
    });
    function ViewAtom({ value }: { value: any }) {
        const { no, ex } = value;
        return <>{ex} &nbsp; <small className="text-muted">{no}</small></>;
    }
    function viewArr(arr: [string, number][]) {
        return arr.map(([title, id], index) => {
            return <div key={index} className="me-5">
                <div className="small text-secondary my-1">{title}</div>
                <IDView uq={uq} id={id} Template={ViewAtom} />
            </div>
        });
    }
    function ViewItemBase({ value, arr }: { value: SumFormula; arr: [string, number][]; }) {
        const { caption, ratio, subject, post, sumSubject } = value;
        return <div className="px-3 py-2 d-flex">
            <div className="flex-grow-1">
                <div><b>{caption}</b></div>
                <div className="d-flex">
                    {viewArr(arr)}
                </div>
            </div>
            <div className="fs-4">{ratio}</div>
        </div>
    }
    function ViewItemPerson({ value }: { value: SumFormula }) {
        const { subject, post, sumSubject } = value;
        const arr: [string, number][] = [
            [label.sourceSubject, subject],
            [label.peronPost, post],
            [label.sumSubject, sumSubject],
        ];
        return <ViewItemBase value={value} arr={arr} />;
    }
    function ViewItemGroup({ value }: { value: SumFormula }) {
        const { subject, post, sumSubject } = value;
        const arr: [string, number][] = [
            [label.sourceSubject, subject],
            [label.groupPost, post],
            [label.sumSubject, sumSubject],
        ];
        return <ViewItemBase value={value} arr={arr} />;
    }
    const cnHeader = ' px-3 pt-2 pb-2 tonwa-bg-gray-2 small d-flex align-items-end';
    function ListHeader({ caption, type }: { caption: string; type: SumFormulaType; }) {
        async function onSubmit(data: any) {
            const param = { ...data, formulaType: type };
            await uq.SaveSumFormula.submit(param);
            closeModal();
        }
        function onAddFormula() {
            const props = type === SumFormulaType.person ? personProps : groupProps;
            openModal(<PageAddFormula onSubmit={onSubmit} {...props} />);
        }
        return <div className={cnHeader}>
            <div className="flex-grow-1">{caption}</div>
            <button className="btn btn-sm btn-outline-primary" onClick={onAddFormula}><FA name="plus" /></button>
        </div>
    }
    async function onFormulaClick(item: SumFormula) {
        openModal(<PageViewFormula value={item} />);
    }
    return <Page header={`公式`}>
        <ListHeader caption="个人公式" type={SumFormulaType.person} />
        <List items={personFormulas} ViewItem={ViewItemPerson} onItemClick={onFormulaClick} />
        <Sep className="mb-3" />
        <ListHeader caption="小组公式" type={SumFormulaType.group} />
        <List items={groupFormulas} ViewItem={ViewItemGroup} onItemClick={onFormulaClick} />
    </Page>
}

interface PageAddFormulaProps {
    formulaType: SumFormulaType,
    postAtom: EnumAtom;
    postLabel: string;
    header: string;
}

function PageAddFormula({ formulaType, postAtom, postLabel, header, onSubmit }: PageAddFormulaProps & { onSubmit: (data: any) => void; }) {
    const formRows: FormRow[] = [
        { name: 'caption', label: label.caption, type: 'text', options: { maxLength: 100, required: '请输入标题' } },
        { name: 'subject', label: label.sourceSubject, atom: EnumAtom.Subject, options: { required: '请输入' + label.sourceSubject } },
        { name: 'post', label: postLabel, atom: postAtom, options: { required: '请输入' + postLabel } },
        { name: 'sumSubject', label: label.sumSubject, atom: EnumAtom.Subject, options: { required: '请输入' + label.sumSubject } },
        { name: 'ratio', label: label.ratio, type: 'number', options: { required: '请输入' + label.ratio } },
        { type: 'submit', label: '提交' },
    ];
    const { register, handleSubmit, formState: { errors }, clearErrors, setValue } = useForm({ mode: 'onBlur' });
    return <Page header={header + '公式'}>
        <form onSubmit={handleSubmit(onSubmit)} className="container my-3 pe-5">
            <FormRowsView rows={formRows} setValue={setValue} clearErrors={clearErrors} {...{ register, errors }} />
        </form>
    </Page>;
}

function PageViewFormula({ value: { caption } }: { value: SumFormula; }) {
    return <Page header={caption ?? '公式'}>

    </Page>;
}
