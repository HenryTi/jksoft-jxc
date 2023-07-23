import { EntityAtom } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { PageQuery, PageQueryMore } from "app/coms";
import { OptionsUseBizAtom, pathAtomNew, useBizAtom } from "app/hooks";
import { ViewItemID } from "app/views/JXC/ViewItemID";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { LinkModal, Page, useModal } from "tonwa-app";
import { CheckAsync, FA, List, Sep, useEffectOnce } from "tonwa-com";
import { Atom, EnumAtom, SumFormula, SumFormulaType } from "uqs/UqDefault";

export const pathSumFormula = 'admin-sum-formula';

const options: OptionsUseBizAtom = {
    atomName: EnumAtom.SumGroup,
};

export function PageSumFormula() {
    const { uq } = useUqApp();
    const { data: [personFormulas, groupFormulas] } = useQuery('SumFormula', async () => {
        let [{ ret }, { ret: phrases }] = await Promise.all([
            uq.GetAllFormula.query({}),
            uq.$AllPhrases.query({}),
        ]);
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
    function ViewItemPerson({ value }: { value: SumFormula }) {
        const { caption, ratio, subject, post, sumSubject } = value;
        const arr = [
            ['科目', subject],
            ['岗位', post],
            ['目标科目', sumSubject],
        ];
        return <div className="px-3 py-2 d-flex">
            <div className="flex-grow-1">
                <div>{caption}</div>
                <div className="d-flex">
                    {
                        arr.map(([title, value], index) => {
                            return <div key={index} className="me-5">
                                <div className="small">{title}</div>
                                <div>{value}</div>
                            </div>

                        })
                    }
                </div>
            </div>
            <div className="fs-4">{ratio}</div>
        </div>
    }
    function ViewItemGroup({ value }: { value: SumFormula }) {
        const { caption, ratio, subject, post, sumSubject } = value;
        const arr = [
            ['科目', subject],
            ['岗位', post],
            ['目标科目', sumSubject],
        ];
        return <div className="px-3 py-2 d-flex">
            <div className="flex-grow-1">
                <div>{caption}</div>
                <div className="d-flex">
                    {
                        arr.map(([title, value], index) => {
                            return <div key={index} className="me-5">
                                <div className="small">{title}</div>
                                <div>{value}</div>
                            </div>

                        })
                    }
                </div>
            </div>
            <div className="fs-4">{ratio}</div>
        </div>
    }
    const cnHeader = ' px-3 pt-2 pb-2 tonwa-bg-gray-2 small d-flex align-items-end';
    function ListHeader({ caption }: { caption: string; }) {
        return <div className={cnHeader}>
            <div className="flex-grow-1">{caption}</div>
            <button className="btn btn-sm btn-outline-primary"><FA name="plus" /></button>
        </div>
    }
    return <Page header={`公式`}>
        <ListHeader caption="个人公式" />
        <List items={personFormulas} ViewItem={ViewItemPerson} />
        <Sep className="mb-3" />
        <ListHeader caption="小组公式" />
        <List items={groupFormulas} ViewItem={ViewItemGroup} />
    </Page>
}

function PageOneFormula({ group }: { group: Atom; }) {
    const { uq } = useUqApp();
    const none = <div className='m-3 small text-muted'>[无]</div>;
    function ViewItemPerson({ value }: { value: Atom & { selected: number; } }) {
        async function onCheckChanged(name: string, checked: boolean) {
            let act: number = checked === true ? 1 : -1;
            await uq.SetSumGroupPerson.submit({ group: group.id, person: value.id, act, });
        }
        return <CheckAsync labelClassName="d-flex px-3 py-2" onCheckChanged={onCheckChanged} defaultChecked={value.selected === 1}>
            <ViewItemID value={value} />
        </CheckAsync>;
    }
    return <PageQueryMore header={`成员`}
        query={uq.SearchGroupPersons}
        param={{ group: group.id, key: undefined, }}
        sortField="id"
        ViewItem={ViewItemPerson}
        none={none}
    >
        <div className="p-3 tonwa-bg-gray-2">
            <ViewItemID value={group} />
        </div>
    </PageQueryMore>;
}
