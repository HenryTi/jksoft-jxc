import { Entity, EntityQuery, EntityBook } from "tonwa";
import { ToolButton } from "app/coms";
import { Modal } from "tonwa-app";
import { BizPhraseType } from "uqs/UqDefault";
// import { PageQuery } from "./PageQuery";
import { PageBook } from "./PageBook";
import { PageFromQuery, QueryStore } from "app/hooks/Query";

export function adminData(modal: Modal, entity: Entity) {
    let onAct: () => void;
    switch (entity.bizPhraseType) {
        default:
            return;
        case BizPhraseType.query:
            onAct = () => {
                let queryStore = new QueryStore(modal, entity as EntityQuery);
                modal.open(<PageFromQuery queryStore={queryStore}
                    query={entity as EntityQuery} binPick={undefined}
                    editing={undefined} pickResultType={undefined} />);
            }
            break;
        case BizPhraseType.book:
            onAct = () => {
                modal.open(<PageBook entity={entity as EntityBook} />);
            }
            break;
    }
    return new ToolButton(
        { caption: '数据', icon: 'search' },
        onAct,
    );
}
