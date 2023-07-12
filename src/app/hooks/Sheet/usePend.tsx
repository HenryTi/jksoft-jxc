import { EntityPend } from "app/Biz/EntitySheet";
import { useUqApp } from "app/UqApp";
import { PageQueryMore } from "app/coms";
import { useState } from "react";
import { useModal } from "tonwa-app";
import { SearchBox } from "tonwa-com";
import { UqQuery } from "tonwa-uq";
import { Detail, Sheet } from "uqs/UqDefault";
import { EditingRow, OriginDetail, SheetRow } from "../../tool";

export interface OptionsUsePend {
    pendName: string;
    caption: string;
    placeholderOfSearch: string;
    autoLoad?: boolean;
}

export async function selectPend(editingRows: EditingRow[], internalSelect: (editingRows: EditingRow[]) => Promise<OriginDetail[]>): Promise<SheetRow[]> {
    function pendItemToEditingRow(originDetail: OriginDetail): SheetRow {
        let { item, pend, pendValue, sheet, no, id } = originDetail;
        return {
            origin: originDetail,
            details: [
                { item, value: pendValue, origin: id } as Detail
            ]
        };
    }
    let ret = await internalSelect(editingRows);
    if (ret === undefined) return undefined;
    let retEditingRows: SheetRow[] = ret.map(v => pendItemToEditingRow(v));
    return retEditingRows;
}

export interface UsePendFromSheetReturn {
    (editingRows: EditingRow[]): Promise<SheetRow[]>;
}
function usePendFromSheet(options: OptionsUsePend & { querySelectSheet: UqQuery<any, any>; }): UsePendFromSheetReturn {
    const { uq, biz } = useUqApp();
    const { openModal, closeModal } = useModal();
    const { pendName, caption, placeholderOfSearch, querySelectSheet } = options;
    const entityPend = biz.entities[pendName] as EntityPend;

    async function selectSheet(): Promise<Sheet> {
        const ModalSelectSheet = () => {
            function ViewSheetRow({ value }: { value: any; }): JSX.Element {
                return <div className="px-3 py-2">{JSON.stringify(value)}</div>;
            }

            const [searchParam, setSearchParam] = useState<{ pend: string; key: string; }>(undefined);
            const onSearch = async (key: string) => {
                setSearchParam({ pend: entityPend.phrase, key });
            }
            const onItemClick = async (item: any) => {
                closeModal(item);
            }
            const queryMore = async (param: any, pageStart: any, pageSize: number): Promise<any[]> => {
                let { $page } = await querySelectSheet.page(param, pageStart, pageSize);
                return $page;
            }
            return <PageQueryMore header={caption}
                query={queryMore}
                param={searchParam}
                sortField="id"
                ViewItem={ViewSheetRow}
                onItemClick={onItemClick}
            >
                <SearchBox className="p-3" placeholder={placeholderOfSearch} onSearch={onSearch} allowEmptySearch={true} />
            </PageQueryMore>;
        }
        let sheet = await openModal(<ModalSelectSheet />);
        return sheet;
    }

    async function selectPendSheet(editingRows: EditingRow[]): Promise<OriginDetail[]> {
        let sheet = await selectSheet();
        let querySelectPendFromSheetId = uq.GetPendDetailFromSheetId;
        let ret = await querySelectPendFromSheetId.query({ pend: entityPend.phrase, sheetId: sheet.id });
        return ret.ret;
    }

    async function select(editingRows: EditingRow[]) {
        return await selectPend(editingRows, selectPendSheet);
    }
    return select;
}

export function usePendFromNo(options: OptionsUsePend) {
    const { uq } = useUqApp();
    let ret = usePendFromSheet({
        ...options,
        querySelectSheet: uq.GetPendSheetFromNo
    });
    return ret;
}

export function usePendFromTarget(options: OptionsUsePend) {
    const { uq } = useUqApp();
    let ret = usePendFromSheet({
        ...options,
        querySelectSheet: uq.GetPendSheetFromTarget
    });
    return ret;
}
