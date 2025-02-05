import { JSX } from "react";
import { FA } from "tonwa-com";
import { StoreSheet } from "../../Store";
import { ItemDef, ToolGroup, ToolItem, Toolbar, toolButtonDef, toolIconDef } from "app/coms";

const btn = ' btn ';
const btnSm = ' btn btn-sm ';
interface ButtonDefs {
    submit: ItemDef<any>;
    submitDebug: ItemDef<any>;
    batchSelect: ItemDef<any>;
    print: ItemDef<any>;
    addDetail: ItemDef<any>;    // 直接输入明细
    addPend: ItemDef<any>;      // 选待处理
    test: ItemDef<any>;
    discard: ItemDef<any>;
    exit: ItemDef<any>;
    download: ItemDef<any>;
    upload: ItemDef<any>;
}
export const buttonDefs: ButtonDefs = {
    submit: toolButtonDef({ caption: '提交', /*icon: 'send-o', */className: btn + ' btn-success' }),
    submitDebug: toolButtonDef({ caption: '调试提交', /*icon: 'send-o', */className: btn + ' btn-success' }),
    batchSelect: toolButtonDef({ caption: '批选', /*icon: 'print', */className: btn + ' btn-primary' }),
    print: toolButtonDef({ caption: '打印', /*icon: 'print'*/ }),
    addDetail: toolButtonDef({ caption: '明细', icon: 'plus', className: btn + ' btn-primary' }),
    addPend: toolButtonDef({ caption: '待办', icon: 'plus', className: btn + ' btn-primary' }),
    test: toolButtonDef({ caption: '测试', icon: undefined }),
    discard: toolButtonDef({ caption: '作废', /*icon: 'trash-o'*/ }),
    exit: toolIconDef({ caption: '退出', icon: 'times', className: ' px-2 ' }),
    download: toolButtonDef({ caption: '导出' }),
    upload: toolButtonDef({ caption: '导入' }),
}

export function headerSheet({ store, toolGroups, headerGroup }: { store: StoreSheet; toolGroups: (ToolItem[] | JSX.Element)[]; headerGroup?: ToolItem[]; }) {
    const { caption, backIcon } = store;
    return {
        header: <div className="py-2 px-3">
            <FA name={backIcon} className="me-3" />
            <span className="">{caption}</span>
        </div>,
        right: <div className="">
            <ToolGroup group={headerGroup} />
        </div>,
        top: <Toolbar groups={toolGroups} />,
    }
}
