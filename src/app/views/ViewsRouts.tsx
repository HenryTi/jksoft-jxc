import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Page, PageTabsLayout, PageSpinner } from 'tonwa-app';
import { pathMe, routeMe, TabMe } from './Me';
import { pathJXC, routeJCX, TabJXC } from './JXC';
// import { adminTab, routeAdmin, routeAdminTab } from 'app/views/admin';
import { useUqApp } from 'app/UqApp';
import { AppLogin, AppRegister, routePrivacy } from 'app/brand';
import { useAtomValue } from 'jotai';
import { routeAdmin } from './Admin';

export function ViewsRoutes() {
    let uqApp = useUqApp();
    let { user: atomUser, atomSiteLogined } = uqApp;
    let user = useAtomValue(atomUser);
    let siteLogined = useAtomValue(atomSiteLogined);
    let homeLayout: JSX.Element = (user !== undefined && siteLogined !== true) ?
        <div>
            <div className='m-3'>
                没有授权。请联系管理员
            </div>
        </div>
        :
        <PageTabsLayout tabs={[
            { to: '/' + pathJXC, caption: '首页', icon: 'home' },
            // adminTab,
            { to: '/' + pathMe, caption: '我的', icon: 'user' },
        ]} />;

    return <Suspense fallback={<PageSpinner />}>
        <BrowserRouter basename='jksoft-jxc'>
            <Routes>
                <Route path="/" element={homeLayout}>
                    <Route index element={<TabJXC />} />
                    <Route path={pathJXC + '/*'} element={<TabJXC />} />
                    <Route path={pathMe + '/*'} element={<TabMe />} />
                </Route>
                {routeMe}
                {routeJCX(uqApp)}
                {routeAdmin(uqApp)}
                <Route path="/test" element={<Page header="Test">test</Page>} />
                <Route path="/login/*" element={<AppLogin />} />
                <Route path="/register" element={<AppRegister />} />
                {routePrivacy}
            </Routes>
        </BrowserRouter>
    </Suspense>;
}
