import { NavLink, Outlet } from "react-router-dom";
import { FA } from "tonwa-com";
import { theme } from "tonwa-com";

interface PageTabsLayoutProps {
    tabs: { to: string; caption: string; icon: string }[];
}

export function PageTabsLayout({ tabs }: PageTabsLayoutProps) {
    function tabClassName({ isActive }: {
        isActive: boolean;
        isPending: boolean;
    }) {
        return 'flex-fill mx-1 text-center py-1 ' +
            (isActive === true ? 'text-primary' : 'text-secondary');
    }
    let vICP = <div className="bg-white small text-center">
        <a href="https://beian.miit.gov.cn" target="_blank" className="small text-body-tertiary">苏ICP备11035425号-2</a>
    </div>
    let vTabs = <>
        <div className={' d-flex ' + theme.bootstrapContainer}>
            {tabs.map(v => {
                const { to, caption, icon } = v;
                return <NavLink key={caption} to={to} className={tabClassName} replace={true} >
                    <FA name={icon} /> <br />
                    {caption}
                </NavLink>;
            })}
        </div>
        {vICP}
    </>;

    return <div className='d-flex flex-column flex-fill h-100'>
        <div className='flex-fill d-flex'>
            <Outlet />
        </div>
        <div className='invisible'>
            {vTabs}
        </div>
        <div className='tonwa-bg-gray-3 position-fixed bottom-0 w-100 bottom-top'>
            {vTabs}
        </div>
    </div>;
}
