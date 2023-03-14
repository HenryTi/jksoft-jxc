import React, { ReactElement, Suspense, useRef } from "react";
import { atom, useAtomValue, WritableAtom } from 'jotai';
import { PageSpinner } from "./PageSpinner";
import { setAtomValue } from "tonwa-com";

interface TabObject {
    id: number;
    name: string;
    tag: string | JSX.Element;
    content: JSX.Element;
    mountable: WritableAtom<boolean, any, any>;           // 只有在点击tab之后，才初始化
    store?: any;
    element?: HTMLElement;
}

interface TabProps {
    tag: string | JSX.Element;
    children: React.ReactNode;
}

export function Tab(props: TabProps): JSX.Element {
    return null;
}

let tabId = 1;
function createTabsFromChildren(children: React.ReactNode) {
    let tabs: TabObject[] = [];
    React.Children.forEach(children, (element) => {
        if (React.isValidElement(element) === false) return;
        let elType = (element as any).type;
        if (elType === React.Fragment) return;
        if (elType !== Tab) return;
        invariant(elType === Tab,
            `[${typeof elType === "string" ? elType : elType.name
            }] is not a <Tab> component. All component children of <PageTabs> must be a <Tab>`
        );
        let { props } = element as ReactElement;
        let tab: TabObject = {
            id: tabId++,
            name: props.name,
            tag: props.tag,
            content: <>{props.children}</>,
            mountable: atom(false),
        };
        tabs.push(tab);
    });
    setAtomValue(tabs[0].mountable, true);
    return tabs;
}

export function PageTabs({ children }: { children: React.ReactNode; }) {
    let { current: tabs } = useRef(createTabsFromChildren(children));
    function onTabClick(tabCur: TabObject) {
        for (let tab of tabs) {
            let { element } = tab;
            let cn: string;
            if (tabCur === tab) {
                cn = 'tonwa-pane active';
                setAtomValue(tab.mountable, true);
                setTimeout(() => {
                    let { element } = tabCur;
                    if (element !== undefined) element.className = cn;
                }, 100);
            }
            else {
                cn = 'tonwa-pane';
            }
            if (element !== undefined) {
                element.className = cn;
            }
        }
    }

    function Tags({ cur }: { cur: number; }) {
        const cn = 'nav nav-tabs position-sticky tonwa-band-container justify-content-evenly bg-light';
        return <ul className={cn} style={{ bottom: '0' }}>
            {tabs.map((v, index) => <li key={v.id} className="nav-item flex-fill align-self-stretch">
                <div onClick={() => onTabClick(v)}
                    className={'nav-link h-100 p-0 ' + (index === cur ? 'active' : 'cursor-pointer')}>
                    {v.tag}
                </div>
            </li>)}
        </ul>;
    }

    function TabPane({ tab, active, index }: { tab: TabObject; active: number; index: number; }) {
        //let divRef = useScroll(false);
        let { mountable: atomMoutable, content } = tab;
        let mountable = useAtomValue(atomMoutable);
        if (mountable === false) return null;
        return <Suspense fallback={<PageSpinner />}>
            <div ref={div => tabs[index].element = div} className={'tonwa-pane ' + (active === index ? 'active' : '')}>
                {content}
                <Tags cur={index} />
            </div>
        </Suspense>;
    }

    return <>
        {
            tabs.map((v, index) => <TabPane key={v.id} tab={v} active={0} index={index} />)
        }
    </>;
}

function invariant(condition: boolean, message: string): asserts condition {
    if (!condition) throw new Error(message);
}
