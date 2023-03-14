import React from "react";
import { Link } from "react-router-dom";

export interface DropdownAction {
    icon?: string;
    caption?: string;
    action?: Action | string;
    iconClass?: string;
    captionClass?: string;
}
type Action = (item: DropdownAction) => void;

export interface DropdownActionsProps {
    icon?: string;
    content?: string | JSX.Element;
    actions: DropdownAction[];
    isRight?: boolean;
    className?: string;
    containerClass?: string;
    itemIconClass?: string;
    itemCaptionClass?: string;
}

export interface DropdownActionsState {
    dropdownOpen: boolean;
}

export class DropdownActions extends React.Component<DropdownActionsProps, DropdownActionsState> {
    private menu: HTMLDivElement;
    private button: HTMLElement;
    constructor(props: DropdownActionsProps) {
        super(props);
        this.state = {
            dropdownOpen: false
        };
    }

    /*
    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick);
        document.addEventListener('touchstart', this.handleDocumentClick);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
        document.removeEventListener('touchstart', this.handleDocumentClick);
    }
    */

    private handleDocumentClick = (evt: any) => {
        document.removeEventListener('click', this.handleDocumentClick);
        document.removeEventListener('touchstart', this.handleDocumentClick);
        if (this.state.dropdownOpen === false) return;
        //if (this.button && this.button.contains(evt.target)) return;
        if (!this.menu) return;
        //if (!this.menu.contains(evt.target)) 
        this.toggle();
    }

    private toggle = () => {
        let { dropdownOpen } = this.state;
        dropdownOpen = !dropdownOpen;
        this.setState({ dropdownOpen });
        if (dropdownOpen === true) {
            setTimeout(() => {
                document.addEventListener('click', this.handleDocumentClick);
                document.addEventListener('touchstart', this.handleDocumentClick);
            }, 10)
        }
    }

    render() {
        let { icon, content, actions, isRight, className, containerClass, itemIconClass, itemCaptionClass } = this.props;
        containerClass = containerClass ?? '';
        if (isRight === undefined) isRight = true;
        let hasIcon = actions.some(v => {
            if (!v) return false;
            return v.icon !== undefined
        });
        let { dropdownOpen } = this.state;
        //isOpen={this.state.dropdownOpen} toggle={this.toggle}
        let cn = className ?? 'cursor-pointer dropdown-toggle btn btn-sm';
        //if (className) cn += className;
        let cnMenu = 'dropdown-menu';
        if (isRight === true) cnMenu += ' dropdown-menu-right';
        if (dropdownOpen === true) cnMenu += ' show';
        return <div className={'dropdown ' + containerClass}>
            <button ref={v => this.button = v}
                className={cn}
                data-toggle="dropdown"
                aria-expanded={dropdownOpen}
                onClick={this.toggle}>
                {icon !== null && <i className={'fa fa-fw fa-' + (icon ?? 'ellipsis-v')} />}
                {content && <span className="ms-1">{content}</span>}
            </button>
            <div ref={v => this.menu = v} className={cnMenu}>
                {
                    actions.map((v, index) => {
                        if (!v) {
                            return <div className="dropdown-divider" key={index} />;
                        }
                        let { icon, caption, action, iconClass, captionClass } = v;
                        if (icon === undefined && caption === undefined)
                            return <div className="dropdown-divider" />;
                        let i: any;
                        if (hasIcon === true) {
                            if (icon !== undefined) icon = 'fa-' + icon;
                            if (!iconClass) iconClass = 'text-info';
                            i = <i className={'me-2  fa-fw fa ' + icon + ' ' + iconClass}
                                aria-hidden={true}></i>;
                        }
                        if (action === undefined) {
                            return <h6 className="dropdown-header">{i} {caption}</h6>;
                        }
                        let content = <>{i} <span className={captionClass || itemCaptionClass}>{caption}</span></>;
                        if (typeof action === 'function') {
                            let onMenuItemClick = (evt: React.MouseEvent<HTMLAnchorElement>) => {
                                evt.preventDefault();
                                (action as Action)(v);
                            }
                            let onTouchStart = (evt: React.TouchEvent<HTMLAnchorElement>) => {
                                (action as Action)(v);
                            }
                            return <a className="dropdown-item" key={index} href="#/"
                                onClick={onMenuItemClick} onTouchStart={onTouchStart}
                            >{content}</a>
                        }
                        else {
                            let to = action as string;
                            return <Link className="dropdown-item" key={index} to={to}>{content}</Link>
                        }
                    })
                }
            </div>
        </div>
    }
}
