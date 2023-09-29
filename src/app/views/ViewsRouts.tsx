import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Page, PageTabsLayout, PageSpinner } from 'tonwa-app';
import { pathMe, routeMe, TabMe } from './Me';
import { pathJXC, routeJCX, TabJXC } from './JXC';
import { useUqApp } from 'app/UqApp';
import { AppLogin, AppRegister, routePrivacy } from 'app/brand';
import { useAtomValue } from 'jotai';
import { PageNoSite, routeAdmin } from './Admin';
import { routeSiteAdmin } from './Admin/site';
// import { useBiz } from 'app/hooks';

export function ViewsRoutes() {
    let uqApp = useUqApp();
    // useBiz();
    let { user: atomUser, atomSiteLogined } = uqApp;
    let user = useAtomValue(atomUser);
    let siteLogined = useAtomValue(atomSiteLogined);
    let homeLayout: JSX.Element;
    if (siteLogined !== true) {
        homeLayout = <PageSpinner />;
        return <Suspense fallback={<PageSpinner />}>
            <BrowserRouter basename='jksoft-jxc'>
                <Routes>
                    <Route path="/" element={homeLayout} />
                </Routes>
            </BrowserRouter>
        </Suspense>;
    }
    if (user === undefined) {
        homeLayout = <PageNoSite />;
    }
    else {
        homeLayout = <PageTabsLayout tabs={[
            { to: '/' + pathJXC, caption: '首页', icon: 'home' },
            // adminTab,
            { to: '/' + pathMe, caption: '我的', icon: 'user' },
        ]} />;
    }

    return <Suspense fallback={<PageSpinner header="..." />}>
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
                {routeSiteAdmin}
                <Route path="/test" element={<Page header="Test">test</Page>} />
                <Route path="/login/*" element={<AppLogin />} />
                <Route path="/register" element={<AppRegister />} />
                {routePrivacy}
            </Routes>
        </BrowserRouter>
    </Suspense>;
}
