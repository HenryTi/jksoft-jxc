import { useForm } from "react-hook-form";
import { useUqApp } from "app/UqApp";
import { FormRow, FormRowsView } from "app/coms";
import { useQuery } from "react-query";
import { IDView, Page, PropEdit, useModal } from "tonwa-app";
import { BandCom, BandContainerContext, BandDecimal, BandString, ButtonAsync, FA, List, Sep } from "tonwa-com";
import { EnumAtom, SumFormula, SumFormulaType } from "uqs/UqDefault";
import React, { useState } from "react";

export const pathSumFormula = 'admin-sum-formula';

const label = {
    caption: '标题',
    person: '个人',
    group: '小组',
    sourceSubject: '源科目',
    peronPost: '岗位',
    groupPost: '职能组',
    sumSubject: '科目',
    ratio: '换算率',
    formula: '公式',
    input: '请输入',
};

const personProps: PageAddFormulaProps = {
    //formulaType: SumFormulaType.person,
    postAtom: EnumAtom.SumPersonPost,
    postLabel: label.peronPost,
    header: label.person,
}
const personArr: [string, string][] = [
    ['subject', label.sourceSubject],
    ['post', label.peronPost],
    ['sumSubject', label.sumSubject],
];

const groupProps: PageAddFormulaProps = {
    //formulaType: SumFormulaType.group,
    postAtom: EnumAtom.SumGroupPost,
    postLabel: label.groupPost,
    header: label.group,
};
const groupArr: [string, string][] = [
    ['subject', label.sourceSubject],
    ['post', label.groupPost],
    ['sumSubject', label.sumSubject],
];

export function PageSumFormula() {
    const { uq } = useUqApp();
    const { openModal, closeModal } = useModal();
    const { data: [persons, groups] } = useQuery('formulas', async () => {
        let { ret } = await uq.GetAllFormula.query({});
        let persons: SumFormula[] = [];
        let groups: SumFormula[] = [];
        for (let r of ret) {
            switch (r.formulaType) {
                case SumFormulaType.person:
                    persons.push(r);
                    break;
                case SumFormulaType.group:
                    groups.push(r);
                    break;
            }
        }
        return [persons, groups]
    });

    function viewArr(arr: [string, number][]) {
        return arr.map(([title, id], index) => {
            return <div key={index} className="me-5">
                <div className="small text-secondary my-1">{title}</div>
                <IDView uq={uq} id={id} Template={ViewAtom} />
            </div>
        });
    }
    function ViewItemBase({ value, arr }: { value: SumFormula; arr: [string, number][]; }) {
        const { caption, ratio } = value;
        return <div className="px-3 py-2 d-flex">
            <div className="flex-grow-1">
                <div><b>{caption}</b></div>
                <div className="d-flex">
                    {viewArr(arr)}
                </div>
            </div>
            <div className="fs-4 me-5">{ratio}</div>
        </div>
    }

    function ListFormula({ items, arr, caption, type }: { items: SumFormula[]; arr: [string, string][]; caption: string; type: SumFormulaType; }) {
        const [formulas, setFormulas] = useState<SumFormula[]>(items);
        function onItemClick(item: any) {
            async function onInvalid() {
                let { id } = item;
                await uq.ChangeSumFormula.submit({ id, start: undefined, end: undefined, ratio: undefined });
                let index = formulas.findIndex(v => v.id === id);
                if (index >= 0) formulas.splice(index, 1);
                setFormulas([...formulas]);
                closeModal();
            }
            async function onValueChanged(name: string, value: any) {
                let { id } = item;
                let index = formulas.findIndex(v => v.id === id);
                if (index < 0) return;
                let formula = formulas[index];
                async function changeCaption() {
                    await uq.ChangeSumFormulaCaption.submit({ id, caption: value });
                    formula.caption = value;
                }
                async function changeRatio() {
                    let results = await uq.ChangeSumFormula.submit({ id, start: undefined, end: undefined, ratio: value });
                    formula.id = results.id;
                    formula.ratio = value;
                }
                switch (name) {
                    case 'caption': await changeCaption(); break;
                    case 'ratio': await changeRatio(); break;
                }
                formulas.splice(index, 1, formula);
                setFormulas([...formulas]);
            }
            openModal(<PageViewFormula value={item} onInvalid={onInvalid} onValueChanged={onValueChanged} arr={arr} />);
        }
        function ViewItem({ value }: { value: SumFormula }) {
            const arrLabel: [string, number][] = arr.map(([prop, label]) => [label, (value as any)[prop]]);
            return <ViewItemBase value={value} arr={arrLabel} />;
        }
        const cnHeader = ' px-3 pt-2 pb-2 tonwa-bg-gray-2 small d-flex align-items-end';
        async function onSubmit(data: any) {
            const param = { ...data, formulaType: type };
            let { id } = await uq.SaveSumFormula.submit(param);
            param.id = id;
            formulas.unshift(param);
            setFormulas([...formulas]);
            closeModal();
        }
        function onAddFormula() {
            const props = type === SumFormulaType.person ? personProps : groupProps;
            openModal(<PageAddFormula onSubmit={onSubmit} {...props} />);
        }
        function ListHeader() {
            return <div className={cnHeader}>
                <div className="flex-grow-1">{caption}</div>
                <button className="btn btn-sm btn-outline-primary" onClick={onAddFormula}><FA name="plus" /></button>
            </div>
        }
        return <>
            <ListHeader />
            <List items={formulas} ViewItem={ViewItem} onItemClick={onItemClick} />
        </>;
    }

    const { formula, person, group } = label;
    return <Page header={formula}>
        <ListFormula caption={person + formula} type={SumFormulaType.person} items={persons} arr={personArr} />
        <Sep className="mb-3" />
        <ListFormula caption={group + formula} type={SumFormulaType.group} items={groups} arr={groupArr} />
    </Page>
}

interface PageAddFormulaProps {
    postAtom: EnumAtom;
    postLabel: string;
    header: string;
}

function PageAddFormula({ postAtom, postLabel, header, onSubmit }: PageAddFormulaProps & { onSubmit: (data: any) => void; }) {
    const { input, caption, sourceSubject, sumSubject, ratio } = label;
    const formRows: FormRow[] = [
        { name: 'caption', label: label.caption, type: 'text', options: { maxLength: 100, required: input + caption } },
        { name: 'subject', label: label.sourceSubject, atom: EnumAtom.Subject, options: { required: input + sourceSubject } },
        { name: 'post', label: postLabel, atom: postAtom, options: { required: input + postLabel } },
        { name: 'sumSubject', label: label.sumSubject, atom: EnumAtom.Subject, options: { required: input + sumSubject } },
        { name: 'ratio', label: label.ratio, type: 'number', options: { required: input + ratio } },
        { type: 'submit' },
    ];
    const { register, handleSubmit, formState: { errors }, clearErrors, setValue } = useForm({ mode: 'onBlur' });
    return <Page header={header + label.formula}>
        <form onSubmit={handleSubmit(onSubmit)} className="container my-3 pe-5">
            <FormRowsView rows={formRows} setValue={setValue} clearErrors={clearErrors} {...{ register, errors }} />
        </form>
    </Page>;
}

function PageViewFormula({ value, arr, onInvalid, onValueChanged }: {
    value: SumFormula;
    arr: [string, string][];
    onInvalid: () => Promise<void>;
    onValueChanged: (name: string, value: any) => Promise<void>;
}) {
    const { uq } = useUqApp();
    async function onValuesChanged({ name, value, preValue }: { name: string; value: any; preValue: any; }, context: BandContainerContext<any>) {
        await onValueChanged(name, value);
    }
    const { caption } = value;
    return <Page header={caption ?? label.formula}>
        <PropEdit className="container" values={value} onValuesChanged={onValuesChanged} labelSize={3} >
            <BandString label={label.caption} name="caption" placeholder="公式标题" />
            <Sep />
            {
                arr.map((v, index) => {
                    const [prop, label] = v;
                    const propValue = (value as any)[prop];
                    return <React.Fragment key={index}>
                        <BandCom label={label}>
                            <IDView uq={uq} id={propValue} Template={ViewAtom} />
                        </BandCom>
                        <Sep />
                    </React.Fragment>;
                })
            }
            <BandDecimal label={label.ratio} name="ratio" />
            <Sep />
        </PropEdit>
        <div className="text-end p-3">
            <ButtonAsync className="btn btn-sm btn-outline-primary" onClick={onInvalid}>
                <FA name="trash" />
            </ButtonAsync>
        </div>
    </Page>;
}

function ViewAtom({ value }: { value: any }) {
    const { no, ex } = value;
    return <>{ex} &nbsp; <small className="text-muted">{no}</small></>;
}
