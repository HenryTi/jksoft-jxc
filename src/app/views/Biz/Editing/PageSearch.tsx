import { BizBud, EntitySheet } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { PageQueryMore } from "app/coms";
import { EditBudInline, OnBudChanged, PageRefId, ValuesBudsEditing } from "app/hooks";
import { IDViewUserSite } from "app/tool";
import { ChangeEvent, useRef, useState } from "react";
import { BudCheckValue, Page, useModal } from "tonwa-app";
import { ButtonAsync, EasyTime, FA, SearchBox, Sep } from "tonwa-com";
import { User } from "tonwa-uq";

export function PageSearch() {
    const modal = useModal();
    const { biz } = useUqApp();
    function onSearchAll() {
        modal.open(<PageSearchAll />);
    }
    return <Page header="单据搜索">
        <SearchLink caption="全部单据" iconColor="text-warning" textColor="text-body" onClick={onSearchAll} />
        <Sep />
        {biz.sheets.map(v => {
            return <div key={v.id}>
                <SearchSheetLink sheet={v} />
                <Sep />
            </div>
        })}
    </Page>;
}

function SearchLink({ caption, iconColor, textColor, onClick }: { caption: string; iconColor: string; textColor: string; onClick: () => void }) {
    return <div className="px-4 py-2 d-flex align-items-center cursor-pointer" onClick={onClick}>
        <FA name="search" className={'me-4 ' + iconColor} size="lg" />
        <span className={textColor}>{caption}</span>
    </div>
}

function SearchSheetLink({ sheet }: { sheet: EntitySheet }) {
    const modal = useModal();
    const { caption, name } = sheet;
    function onSearch() {
        modal.open(<PageSearchSheet sheet={sheet} />);
    }
    return <SearchLink caption={caption ?? name} iconColor="text-info" textColor="text-primary" onClick={onSearch} />;
}

function PageSearchAll() {
    const { uq } = useUqApp();
    const [searchParam, setSearchParam] = useState<{ no: string; paramMain: any; paramDetail: any; phrase: number; }>(undefined);
    async function onSearch(key: string) {
        setSearchParam({
            no: key?.trim(),
            phrase: undefined,
            paramMain: undefined,
            paramDetail: undefined,
        });
    }
    return <PageQueryMore
        query={uq.SearchAllSheets}
        param={searchParam}
        sortField="id"
        ViewItem={SheetItem}
        header="全部单据搜索">
        <div className="tonwa-bg-gray-2 border-bottom">
            <SearchBox onSearch={onSearch} placeholder="单据编号" className="mx-3 my-3" />
        </div>
    </PageQueryMore>
}

interface SearchSheetParam {
    i: number;
    x: number;
    buds: [number, any][];
}
export function PageSearchSheet({ sheet }: { sheet: EntitySheet; }) {
    const { uq } = useUqApp();
    let { name, caption, search } = sheet;
    if (caption === undefined) caption = name;
    const { current: paramValues } = useRef<any>({});
    const [searchParam, setSearchParam] = useState<{ no: string; paramMain: any; paramDetail: any; phrase: number; }>(undefined);
    async function onSearch() {
        let paramMain: Partial<SearchSheetParam>;
        let paramDetail: Partial<SearchSheetParam>;
        for (let { bin, buds: budsSearch } of search) {
            let i: number;
            let x: number;
            let buds: [number, any][] = [];
            for (let bud of budsSearch) {
                const { id } = bud;
                const { i: iBud, x: xBud } = bin;
                let val = paramValues[id];
                if (val === undefined) continue;
                if (typeof val === 'string') {
                    if ((val as string).trim().length === 0) continue;
                }
                if (id === iBud.id) i = val;
                else if (id === xBud?.id) x = val;
                else buds.push([id, val]);
            }
            if (buds.length === 0) buds = undefined;
            let ret = { i, x, buds };
            if (bin === sheet.main) {
                paramMain = ret;
            }
            else {
                paramDetail = ret;
            }
        }
        setSearchParam({
            no: paramValues.no?.trim(),
            phrase: sheet.id,
            paramMain,
            paramDetail,
        });
    }
    function onBudChanged(bud: BizBud, value: string | number | BudCheckValue) {
        paramValues[bud.id] = value as any;
    }
    function onNoChange(evt: ChangeEvent<HTMLInputElement>) {
        let no = evt.currentTarget.value.trim();
        if (no.length === 0) no = undefined;
        paramValues['no'] = no;
    }
    let vSearchNo = <div key="$no" className="col-3">
        <div className="small text-secondary-subtle">{caption}编号</div>
        <div className="py-1">
            <input type="text" className="form-control border-secondary-subtle py-2" onChange={onNoChange} />
        </div>
    </div>;
    let budArr: BizBud[] = [];
    let vBudParams: any;
    if (search !== undefined) {
        for (let { bin, buds } of search) {
            budArr.push(...buds);
        }
        vBudParams = <ViewParams vSearchNo={vSearchNo} budArr={budArr} onBudChanged={onBudChanged} />;
    }

    return <PageQueryMore
        query={uq.SearchAllSheets}
        param={searchParam}
        sortField="id"
        ViewItem={SheetItem}
        header={caption + '搜索'}>
        <div className="tonwa-bg-gray-2 border-bottom">
            {vBudParams}
            <ButtonAsync className="mx-3 my-3 btn btn-primary" onClick={onSearch}>
                <FA name="search" className="me-2" />
                搜索
            </ButtonAsync>
        </div>
    </PageQueryMore>
}

function ViewParams({ vSearchNo, budArr, onBudChanged }: { vSearchNo: any; budArr: BizBud[]; onBudChanged: OnBudChanged; }) {
    const modal = useModal();
    const uqApp = useUqApp();
    let valuesBudsEditing = new ValuesBudsEditing(modal, uqApp.biz, budArr);
    let budEditings = valuesBudsEditing.createBudEditings();
    let { length } = budEditings;
    let propRow: any[] = [vSearchNo];
    const propRowArr: any[][] = [propRow];
    for (let i = 0; i < length; i++) {
        let budEditing = budEditings[i];
        const { bizBud, required } = budEditing;
        const cn = required === true ? ' text-primary ' : ' text-secodary ';
        let { id, caption, name } = bizBud;
        propRow.push(<div key={id} className="col-3">
            <div className={'small ' + cn}>{caption ?? name}</div>
            <div className="py-1"><EditBudInline budEditing={budEditing} id={undefined} value={undefined} onChanged={onBudChanged} /></div>
        </div>);
        if (i === length - 1) break;
        if (propRow.length % 4 === 0) {
            propRow = [];
            propRowArr.push(propRow);
        }
    }
    let viewRowArr: any;
    if (length > 0) {
        viewRowArr = propRowArr.map((row, index) => <div key={index} className="row py-3 border-bottom border-secondary-subtle">
            {row}
        </div>);
    }

    return <div className="mx-3">
        {viewRowArr}
    </div>;
}

function SheetItem({ value }: { value: any; }) {
    const modal = useModal();
    const { biz, uq } = useUqApp();
    const { id, no, phrase, operator } = value;
    let entity = biz.entityFromId(phrase);
    function onSheet() {
        modal.open(<PageRefId id={id} />);
    }
    return <div className="px-3 py-2 d-flex align-items-center cursor-pointer" onClick={onSheet}>
        <div className="me-4">
            <FA name="file-text-o" className="text-primary" />
        </div>
        <div className="w-min-12c small">{entity.caption ?? entity.name}</div>
        <div className="w-min-16c">{no}</div>
        <div className="me-3">
            <IDViewUserSite uq={uq} userSite={operator} Template={ViewUserAssigned} />
        </div>
        <div className="small text-secondary">
            <EasyTime date={id / (1024 * 1024) * 60} />
        </div>
    </div>;
}

function ViewUserAssigned({ user, assigned }: { user: User; assigned: string; }): JSX.Element {
    if (!user) return <div>user is empty</div>;
    let { name, nick, icon } = user;
    let content: any;
    if (assigned !== undefined) {
        content = <>
            <div>{assigned}</div>
        </>;
    }
    else if (nick !== undefined) {
        content = <>
            <div>{nick}</div>
        </>;
    }
    else {
        content = <>
            <div>{name}</div>
        </>;
    }
    return <div className="d-flex">
        <div>{content}</div>
    </div>;
}