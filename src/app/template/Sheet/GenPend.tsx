import { EntityPend } from "app/Biz/EntitySheet";
import { UqApp } from "app/UqApp";
import { PageQueryMore } from "app/coms";
import { GenBizEntity } from "app/tool";
import { useState } from "react";
import { IDView, uqAppModal } from "tonwa-app";
import { MutedSmall, SearchBox } from "tonwa-com";
import { UqQuery } from "tonwa-uq";
import { Detail, Sheet } from "uqs/UqDefault";
import { ViewItemID } from "../Atom";
import { EditingDetail } from "./EditingDetail";

export interface PendItem extends Detail {
    pend: number;
    pendValue: number;
    sheet: string;          // sheet phrase
    no: string;             // sheet no
}
export abstract class GenPend extends GenBizEntity<EntityPend> {
    readonly bizEntityType = 'pend';
    readonly bizEntityName: string;
    get entity(): EntityPend { return this.biz.pends[this.bizEntityName] }

    constructor(uqApp: UqApp, pendName: string) {
        super(uqApp);
        this.bizEntityName = pendName;
    }

    // 打开选择页面时，自动载入数据
    get autoLoad(): boolean { return true; }
    get caption(): string { return '选择待处理' }
    get placeholderOfSearch(): string { return '待处理单据号' }
    protected abstract internalSelect(editingDetails: EditingDetail[]): Promise<PendItem[]>;
    async select(editingDetails: EditingDetail[]): Promise<EditingDetail[]> {
        let ret = await this.internalSelect(editingDetails);
        if (ret === undefined) return undefined;
        let retEditingDetails: EditingDetail[] = ret.map(v => {
            let { item, pend, pendValue, sheet, no, id } = v;
            return {
                origin: v as Detail,
                pendFrom: pend,
                pendValue,
                sheet,
                no,
                rows: [
                    { item, value: pendValue, origin: id } as Detail
                ],
            }
        });
        return retEditingDetails;
    }
}

export abstract class GenPendSheet extends GenPend {
    protected abstract get querySelectSheet(): UqQuery<any, any>;
    get querySelectPendFromSheetId() { return this.uq.GetPendDetailFromSheetId }
    get ViewSheetRow(): (props: { value: any; }) => JSX.Element {
        return ({ value }: { value: any; }) => {
            return <div className="px-3 py-2">{JSON.stringify(value)}</div>;
        };
    }
    protected async selectSheet(): Promise<Sheet> {
        let { openModal, closeModal } = uqAppModal(this.uqApp);
        const ModalSelectSheet = () => {
            const [searchParam, setSearchParam] = useState<{ pend: string; key: string; }>(undefined);
            const onSearch = async (key: string) => {
                setSearchParam({ pend: this.entity.phrase, key });
            }
            const onItemClick = async (item: any) => {
                closeModal(item);
            }
            const queryMore = async (param: any, pageStart: any, pageSize: number): Promise<any[]> => {
                let { $page } = await this.querySelectSheet.page(param, pageStart, pageSize);
                return $page;
            }
            return <PageQueryMore header={this.caption}
                query={queryMore}
                param={searchParam}
                sortField="id"
                ViewItem={this.ViewSheetRow}
                onItemClick={onItemClick}
            >
                <SearchBox className="p-3" placeholder={this.placeholderOfSearch} onSearch={onSearch} allowEmptySearch={true} />
            </PageQueryMore>;
        }
        let sheet = await openModal(<ModalSelectSheet />);
        return sheet;
    }
    protected override async internalSelect(editingDetails: EditingDetail[]): Promise<PendItem[]> {
        let sheet = await this.selectSheet();
        let ret = await this.querySelectPendFromSheetId.query({ pend: this.entity.phrase, sheetId: sheet.id });
        return ret.ret;
    }
}

export class GenPendFromNo extends GenPendSheet {
    get querySelectSheet() {
        return this.uq.GetPendSheetFromNo;
    }
}

export class GenPendFromTarget extends GenPendSheet {
    get querySelectSheet() {
        return this.uq.GetPendSheetFromTarget;
    }
}

export class GenPendFromItem extends GenPend {
    protected override async internalSelect(editingDetails: EditingDetail[]): Promise<PendItem[]> {
        let { openModal, closeModal } = uqAppModal(this.uqApp);
        let selectedItems: PendItem[] = [];
        let selectedColl: { [pendId: number]: PendItem } = {};
        let defaultSearchParam = { pend: this.entity.phrase, key: undefined as string };
        const ModalSelectPend = () => {
            const [searchParam, setSearchParam] = useState<{ pend: string; key: string; }>(defaultSearchParam);
            const [nextVisible, setNextVisible] = useState<boolean>(false);
            const onSearch = async (key: string) => {
                setSearchParam({ ...defaultSearchParam, key });
            }
            const onItemSelect = async (item: PendItem, isSelected: boolean) => {
                // closeModal(item);
                let { pend } = item;
                if (isSelected === true) {
                    selectedColl[pend] = item;
                    selectedItems.push(item);
                }
                else {
                    delete selectedColl[pend];
                    let index = selectedItems.findIndex(v => v === item);
                    if (index >= 0) selectedItems.splice(index, 1);
                }
                setNextVisible(selectedItems.length > 0);
            }
            const queryMore = async (param: any, pageStart: any, pageSize: number): Promise<any[]> => {
                let { $page } = await this.uq.GetPendDetailFromItem.page(param, pageStart, pageSize);
                return $page;
            }
            const coll: { [pend: number]: EditingDetail; } = {};
            if (editingDetails) {
                for (let ed of editingDetails) {
                    coll[ed.pendFrom] = ed;
                }
            }
            const ViewPendRow = ({ value: pendItem }: { value: PendItem }) => {
                const { pend, item, sheet, no, value, pendValue } = pendItem;
                const htmlId = String(pend);
                let ed = coll[pend];
                let selected = ed !== undefined;
                return <div className="form-check mx-3 my-2">
                    <input type="checkbox" className="form-check-input me-3"
                        id={htmlId}
                        disabled={selected}
                        onChange={evt => onItemSelect(pendItem, evt.currentTarget.checked)}
                        defaultChecked={selected || selectedColl[pend] !== undefined}
                    />
                    <label className="form-check-label d-flex" htmlFor={htmlId}>
                        <div className="me-3"><IDView uq={this.uq} id={item} Template={ViewItemID} /></div>
                        <div className="text-break me-3">
                            <MutedSmall>{this.uqApp.genSheets[sheet].caption}编号</MutedSmall> {no}
                        </div>
                        <div>
                            <MutedSmall>数量</MutedSmall> {value}
                        </div>
                        <div className="flex-grow-1 text-end">
                            <MutedSmall>待处理量</MutedSmall> {pendValue}
                        </div>
                    </label>
                </div>;
            }
            const onNext = () => {
                closeModal(selectedItems);
            }
            const Buttom = ({ items }: { items: any[]; }) => {
                if (items === undefined || items === null) return null;
                if (items.length === 0) return null;
                return <div className="my-3 mx-3">
                    <button className="btn btn-primary" onClick={onNext} disabled={!nextVisible}>下一步</button>
                </div>;
            }
            // onItemSelect={onItemSelect}
            return <PageQueryMore header={this.caption}
                query={queryMore}
                param={searchParam}
                sortField="id"
                ViewItem={ViewPendRow}
                Bottom={Buttom}
            >
                <SearchBox className="p-3" placeholder={this.placeholderOfSearch} onSearch={onSearch} />
            </PageQueryMore>;
        }
        let ret = await openModal(<ModalSelectPend />);
        return ret;
    }
}
