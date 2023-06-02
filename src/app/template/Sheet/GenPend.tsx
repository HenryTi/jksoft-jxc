import { EntityPend } from "app/Biz/EntitySheet";
import { UqApp } from "app/UqApp";
import { PageQueryMore } from "app/coms";
import { GenBizEntity } from "app/tool";
import { useState } from "react";
import { uqAppModal } from "tonwa-app";
import { MutedSmall, SearchBox } from "tonwa-com";
import { UqQuery } from "tonwa-uq";
import { Detail, Sheet } from "uqs/UqDefault";
import { EditingRow, OriginDetail, SheetRow } from "../../tool";
import { ViewAMSAtomSpec, ViewAMSMetric } from "app/views/JXC/Sheet/ViewAMS";
import { GenGoods } from "app/views/JXC/Atom";

export abstract class GenPend extends GenBizEntity<EntityPend> {
    readonly bizEntityType = 'pend';
    readonly bizEntityName: string;

    constructor(uqApp: UqApp, pendName: string) {
        super(uqApp);
        this.bizEntityName = pendName;
    }

    // 打开选择页面时，自动载入数据
    get autoLoad(): boolean { return true; }
    get caption(): string { return '选择待处理' }
    get placeholderOfSearch(): string { return '待处理单据号' }
    protected abstract internalSelect(editingRows: EditingRow[]): Promise<OriginDetail[]>;
    protected pendItemToEditingRow(originDetail: OriginDetail): SheetRow {
        let { item, pend, pendValue, sheet, no, id } = originDetail;
        return {
            origin: originDetail,
            details: [
                { item, value: pendValue, origin: id } as Detail
            ]
        };
    }
    async select(editingRows: EditingRow[]): Promise<SheetRow[]> {
        let ret = await this.internalSelect(editingRows);
        if (ret === undefined) return undefined;
        let retEditingRows: SheetRow[] = ret.map(v => this.pendItemToEditingRow(v));
        return retEditingRows;
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
    protected override async internalSelect(editingRows: EditingRow[]): Promise<OriginDetail[]> {
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
    protected override async internalSelect(editingRows: EditingRow[]): Promise<OriginDetail[]> {
        let { openModal, closeModal } = uqAppModal(this.uqApp);
        const genGoods = this.uqApp.objectOf(GenGoods);
        let selectedItems: OriginDetail[] = [];
        let selectedColl: { [pendId: number]: OriginDetail } = {};
        let defaultSearchParam = { pend: this.entity.phrase, key: undefined as string };
        const ModalSelectPend = () => {
            const [searchParam, setSearchParam] = useState<{ pend: string; key: string; }>(defaultSearchParam);
            const [nextVisible, setNextVisible] = useState<boolean>(false);
            const onSearch = async (key: string) => {
                setSearchParam({ ...defaultSearchParam, key });
            }
            const onItemSelect = async (item: OriginDetail, isSelected: boolean) => {
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
            const coll: { [pend: number]: EditingRow; } = {};
            if (editingRows) {
                for (let ed of editingRows) {
                    coll[ed.origin.pend] = ed;
                }
            }
            const cnCol = ' col ';
            const ViewPendRow = ({ value: pendItem }: { value: OriginDetail }) => {
                const { pend, item, sheet, no, value, pendValue } = pendItem;
                const htmlId = String(pend);
                let ed = coll[pend];
                let selected = ed !== undefined;
                // <IDView uq={this.uq} id={item} Template={ViewItemID} />
                // <IDView uq={this.uq} id={item} Template={Template} />
                return <div className="form-check mx-3 my-2 d-flex">
                    <input type="checkbox" className="form-check-input me-3"
                        id={htmlId}
                        disabled={selected}
                        onChange={evt => onItemSelect(pendItem, evt.currentTarget.checked)}
                        defaultChecked={selected || selectedColl[pend] !== undefined}
                    />
                    <label className="form-check-label container flex-grow-1" htmlFor={htmlId}>
                        <div className="row">
                            <ViewAMSAtomSpec genGoods={genGoods} id={item} className={cnCol} />
                            <div className={cnCol}>
                                <div className="text-break me-3">
                                    <MutedSmall>{this.uqApp.genSheets[sheet].caption}编号</MutedSmall> {no}
                                </div>
                                <div>
                                    <MutedSmall>在单</MutedSmall> {value}
                                    <ViewAMSMetric genGoods={genGoods} id={item} />
                                </div>
                            </div>
                            <div className={cnCol + " flex-grow-1 text-end "}>
                                <MutedSmall>待处理</MutedSmall> {pendValue}<ViewAMSMetric genGoods={genGoods} id={item} />
                            </div>
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
            const itemKey = (item: any) => {
                return item.id;
            }
            return <PageQueryMore header={this.caption}
                query={queryMore}
                param={searchParam}
                sortField="id"
                ViewItem={ViewPendRow}
                Bottom={Buttom}
                itemKey={itemKey}
            >
                <SearchBox className="p-3" placeholder={this.placeholderOfSearch} onSearch={onSearch} />
            </PageQueryMore>;
        }
        let ret = await openModal(<ModalSelectPend />);
        return ret;
    }
}
