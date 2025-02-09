import { Link, Route } from "react-router-dom";
import { Page } from "tonwa-app";

export const pathPrivacy = '/privacy';
export const routePrivacy = <>
    <Route path={pathPrivacy} element={<PagePrivacy />} />
</>;

export function PrivacyLink() {
    return <div className="d-flex p-3 align-items-center justify-content-center bg-light border-top">
        <Link to={pathPrivacy} className="small d-inline-block ">
            隐私政策
        </Link>
        <div className="bg-white small text-center ms-3">
            <a href="https://beian.miit.gov.cn" target="_blank" className="small text-body-tertiary">苏ICP备11035425号-2</a>
        </div>
    </div>;
}

export function PagePrivacy() {
    return <Page auth={false} header="隐私政策">
        <div className="d-grid p-3">
            {privacy.split('\n').map((v, index) => <p key={index}>{v}</p>)}
        </div>
    </Page>
}

const privacy = `
我们将保护您的隐私

同花
`;
