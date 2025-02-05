import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Page, useModal } from "tonwa-app";
import { FA } from "tonwa-com";
import { Toolbar, ViewCurSiteHeader } from "../../View";
import { TControllerSheetEdit } from "./TControlSheetEdit";
import { ViewSheetContent } from "./ViewSheetContent";
import { buttonDefs } from "./HeaderSheet";
import { useSiteRole } from "../../Site";
import { download } from "../../tools/download";
import { upload } from "./upload";

export function PageSheetView({ controller }: { controller: TControllerSheetEdit; }) {
    const modal = useModal();
    const refPrint = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef: refPrint,
    });
    let useSiteRoleReturn = useSiteRole();
    let { isAdmin } = useSiteRoleReturn.userSite;
    const { caption } = controller.storeSheet;
    async function onSubmitDebug() {
        let { error, logs } = await controller.onSubmitDebug();
        modal.open(<Page header="调试结果">
            <div className="px-3 py-2">
                <FA className="text-danger me-2" name="info-circle" />
                <span className="text-info">调试写账过程自动回滚，不会影响数据库。只保留LOG语句的结果。</span>
            </div>
            {error.length > 0 && <div className="m-3">
                <div>错误：</div>
                <div>{error}</div>
            </div>}
            <div className="m-3">
                {logs.map(v => {
                    return <div key={v.id}>
                        <pre>{JSON.stringify(v.value, undefined, 4)}</pre>
                    </div>;
                })}
            </div>
        </Page>)
    }
    function onPrint() {
        handlePrint();
        // alert('正在实现中...');
    }
    function onDownload() {
        download('sss', 'file', 'csv');
    }
    function onUpload() {
        upload();
    }
    async function onExit() {
        controller.closeModal();
    }
    let btnPrint = buttonDefs.print(onPrint);
    let btnDownload = buttonDefs.download(onDownload);
    let btnUpload = buttonDefs.upload(onUpload);
    let btnExit = buttonDefs.exit(onExit, false);
    let headerGroup = [btnExit];
    let btnSubmitDebug = buttonDefs.submitDebug(onSubmitDebug);
    let leftGroup: any[] = [];
    if (isAdmin === true) leftGroup.push(btnSubmitDebug);
    let toolGroups = [leftGroup, null, [btnDownload, btnPrint]];
    let top = <Toolbar groups={toolGroups} />;
    return <Page header={<ViewCurSiteHeader caption={caption} />}>
        <ViewSheetContent control={controller} readonly={true} />
        <ViewSheetPrint controller={controller} refPrint={refPrint} />
    </Page>;
}

function ViewSheetPrint({ controller, refPrint }: { controller: TControllerSheetEdit; refPrint: React.Ref<HTMLDivElement> }) {
    const { storeSheet } = controller;
    const { caption } = storeSheet;
    const __html = `<div class="text-center">${caption}</div>`;
    return <div className="d-none">
        <div ref={refPrint} className="print-container" style={{ margin: "0", padding: "0" }}>
            <div className="border-bottom px-3 py-2 mb-1 fs-larger text-center border-dark">{caption}</div>
            <div dangerouslySetInnerHTML={{ __html }} />
            <ViewSheetContent control={controller} readonly={true} />
        </div>
    </div>;
}
