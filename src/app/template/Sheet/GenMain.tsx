import { EntityMain } from "app/Biz/EntitySheet";
import { PageQueryMore } from "app/coms";
import { GenBizEntity, QueryMore } from "app/tool";
import { useState } from "react";
import { uqAppModal } from "tonwa-app";
import { FA, LMR, SearchBox } from "tonwa-com";
import { Sheet } from "uqs/UqDefault";

export abstract class GenMain extends GenBizEntity<EntityMain> {
    readonly bizEntityType = 'main';
    get entity(): EntityMain { return this.biz.mains[this.bizEntityName] }
    abstract get targetCaption(): string;
    abstract get ViewTargetBand(): (props: { sheet: Sheet; }) => JSX.Element;
    abstract get ViewTarget(): (props: { sheet: Sheet; }) => JSX.Element;
    abstract get QuerySearchItem(): QueryMore;

    async selectTarget(header?: string): Promise<number> {
        let { openModal, closeModal } = uqAppModal(this.uqApp);
        const Modal = () => {
            // const { genSheet, caption } = this.genSheetAct;
            // const { genMain } = genSheet;
            const { targetCaption, QuerySearchItem } = this;
            const [searchParam, setSearchParam] = useState<{ key: string; }>(undefined);
            async function onSearch(key: string) {
                setSearchParam({
                    key,
                });
            }
            function ItemView({ value }: { value: any }) {
                return <LMR className="px-3 py-2 align-items-center">
                    <FA name="angle-right" className="me-3" />
                    <span>{JSON.stringify(value)}</span>
                    <span />
                </LMR>;
            }
            const query = QuerySearchItem;
            const onItemClick = async (item: any) => {
                closeModal(item.id);
                /*
                let no = await this.uq.IDNO({ ID: this.uq.Sheet });
                let main = { no, target: item.id };
                closeModal({ sheet: main, editingDetails: [] });
                */
            }
            return <PageQueryMore header={header ?? '选择' + this.targetCaption}
                query={query}
                param={searchParam}
                sortField="id"
                ViewItem={ItemView}
                onItemClick={onItemClick}
            >
                <div className="m-3">
                    选择{targetCaption}
                </div>
                <SearchBox className="px-3 py-2" onSearch={onSearch} placeholder={targetCaption} />
            </PageQueryMore>;
        }
        let ret = await openModal(<Modal />);
        return ret;
    }
}
