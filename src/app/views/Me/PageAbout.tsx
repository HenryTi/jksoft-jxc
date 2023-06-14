import { Page } from "tonwa-app";
import { useUqApp } from "app/UqApp";

export function PageAbout() {
    let app = useUqApp();
    return <Page header='关于APP'>
        <div className="py-5 px-3 my-3 w-max-30c mx-auto bg-white">
            <div className="text-center mb-5 position-relative">
                <small className="text-muted position-absolute"
                    style={{ right: '0', top: '-2.8rem' }}>
                    版本: {app.version}
                </small>
                <i className="text-danger position-absolute top-0 start-0 fa fa-fire fa-2x"
                    style={{ left: '2rem', top: '0.5rem' }} />
                <b className="text-danger h5 mb-0">
                    <span className="text-primary">同</span>
                    <b className="mx-1">花</b>
                </b>
                <br />
                <small className="text-info">企业管理系统开发平台</small>
            </div>
            <ul>
                <li>面向企业业务的UQ数据库编程语言。</li>
                <li>自适应网页编程。</li>
                <li>前台代码跟服务器代码协同。</li>
            </ul>
            <div className="mt-5 text-center">
                <small className="text-muted me-2">by</small>
                同花
            </div>
        </div>
    </Page>;
}
