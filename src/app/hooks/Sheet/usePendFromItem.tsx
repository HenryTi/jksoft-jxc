import { EntityPend } from "app/Biz/EntitySheet";
import { useUqApp } from "app/UqApp";
import { PageQueryMore } from "app/coms";
import { useState } from "react";
import { uqAppModal } from "tonwa-app";
import { SearchBox } from "tonwa-com";
import { EditingRow, OriginDetail, SheetRow } from "../../tool";
import { OptionsUsePend, selectPend } from "./usePend";

export interface PropsViewPendRow {
    value: OriginDetail;
    onItemSelect: (item: OriginDetail, isSelected: boolean) => Promise<void>;
    selectedColl: { [pendId: number]: OriginDetail };
    coll: { [pend: number]: EditingRow; };
}
export type TypeViewPendRow = (props: PropsViewPendRow) => JSX.Element;

export interface OptionsUsePendFromItem extends OptionsUsePend {
    ViewPendRow: TypeViewPendRow;
}
export function usePendFromItem(options: OptionsUsePendFromItem) {
    let { pendName, ViewPendRow, autoLoad, caption, placeholderOfSearch } = options;
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    if (caption === undefined) caption = '选择待处理';
    if (placeholderOfSearch === undefined) placeholderOfSearch = '待处理单据号';
    let entityPend = biz.entities[pendName] as EntityPend;
    async function internalSelect(editingRows: EditingRow[]): Promise<OriginDetail[]> {
        let { openModal, closeModal } = uqAppModal(uqApp);
        let selectedItems: OriginDetail[] = [];
        let selectedColl: { [pendId: number]: OriginDetail } = {};
        let defaultSearchParam = { pend: entityPend.phrase, key: undefined as string };
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
                let { $page } = await uq.GetPendDetailFromItem.page(param, pageStart, pageSize);
                return $page;
            }
            const coll: { [pend: number]: EditingRow; } = {};
            if (editingRows) {
                for (let ed of editingRows) {
                    coll[ed.origin.pend] = ed;
                }
            }
            const ViewItemPendRow = ({ value: pendItem }: { value: OriginDetail }) => {
                return <ViewPendRow value={pendItem} onItemSelect={onItemSelect} selectedColl={selectedColl} coll={coll} />
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
            return <PageQueryMore header={caption}
                query={queryMore}
                param={searchParam}
                sortField="id"
                ViewItem={ViewItemPendRow}
                Bottom={Buttom}
                itemKey={itemKey}
            >
                <SearchBox className="p-3" placeholder={placeholderOfSearch} onSearch={onSearch} />
            </PageQueryMore>;
        }
        let ret = await openModal(<ModalSelectPend />);
        return ret;
    }

    async function select(editingRows: EditingRow[]) {
        return await selectPend(editingRows, internalSelect);
    }
    return select;
}
