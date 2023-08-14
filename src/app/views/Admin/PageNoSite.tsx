import { Page } from "tonwa-app";
export function PageNoSite() {
    return <Page header={null}>
        <div className='m-3'>
            <i className="bi-dash-circle-fill text-danger fs-larger me-3" />
            没有授权。请联系管理员
        </div>
    </Page>;
}
