import React, { useRef } from "react";
import { FA } from "tonwa-com";
import { Form, Submit } from "tonwa-com";
import { Page } from "../page";
import { Band, BandContainerContext, BandContainerProps, BandContentType, BandFieldErrors, BandMemos, BandTemplateProps, useBand, useBandContainer, VBandContainerContext } from "tonwa-com";
import { useModal } from "../../UqAppBase";
// import { Link, Route, Routes, useNavigate } from "react-router-dom";

interface DetailProps extends BandContainerProps {
}

class DetailContext extends BandContainerContext<DetailProps> {
    get isDetail(): boolean {
        return true;
    }
    label: string | JSX.Element;
    content: React.ReactNode;
}

// const pathEditDetail = 'edit';
export function PropEdit(props: DetailProps) {
    let { children, BandTemplate } = props;
    BandTemplate = BandTemplate ?? DefaultBandTemplate;
    let { current: detailContext } = useRef(new DetailContext({ ...props, BandTemplate }));
    return <VBandContainerContext.Provider value={detailContext}>
        {children}
    </VBandContainerContext.Provider>;
    /*
    function Main() {
        return <VBandContainerContext.Provider value={detailContext}>
            {children}
        </VBandContainerContext.Provider>;
    }
    return <>
        <Routes>
            <Route index element={<Main />} />
            <Route path={pathEditDetail} element={<ValueEditPage detail={detailContext} />} />
        </Routes>
    </>;
    */
}

function DefaultBandTemplate(props: BandTemplateProps) {
    // let detailContext = useOutletContext<DetailContext>();
    const { openModal } = useModal();
    let detailContext = useBandContainer() as DetailContext;
    let band = useBand();
    let { label, labelSize, children, errors, memos, pageEdit, toEdit, content, sep, contentType, rightIcon } = props;
    labelSize = labelSize ?? 2;
    let labelContent = contentType === BandContentType.check ? null : <b>{label}</b>;
    let vLabel = <label className={`col-sm-${labelSize} col-form-label text-sm-end tonwa-bg-gray-1 border-end align-self-center py-3`}>
        {labelContent}
    </label>;
    let cnContent = `col-sm-${12 - labelSize} d-flex pe-0 align-items-center`;
    function RightIcon({ icon, pageEdit }: { icon: JSX.Element; pageEdit: JSX.Element; }) {
        function onClick() {
            if (toEdit) {
                alert(toEdit);
            }
            else {
                openModal(pageEdit);
            }
        }
        return <div onClick={onClick}
            className="px-3 align-self-stretch d-flex align-items-center cursor-pointer"
        >
            {icon ?? <FA name="pencil" className="text-info" />}
        </div>;
    }

    if (band.readOnly === true) {
        rightIcon = null;
    }
    else if (contentType === BandContentType.com) {
        if (pageEdit) {
            rightIcon = <RightIcon pageEdit={pageEdit} icon={rightIcon} />;
        }
    }
    else {
        detailContext.label = label;
        detailContext.content = content;
        rightIcon = <RightIcon pageEdit={<ValueEditPage detail={detailContext} />} icon={rightIcon} />;
    }
    return <>
        <div className="row bg-white mx-0">
            {vLabel}
            <div className={cnContent}>
                <div className="flex-grow-1">
                    <div>{children}</div>
                    <BandFieldErrors errors={errors} />
                    <BandMemos memos={memos} />
                </div>
                {rightIcon}
            </div>
        </div>
    </>;
}

function ValueEditPage({ detail }: { detail: DetailContext; }) {
    const { closeModal } = useModal();
    const { content, label, onValuesChanged } = detail; // useOutletContext<DetailContext>();
    async function onSubmit(data: any) {
        await onValuesChanged(data);
        closeModal();
    }
    let values = detail.getValues();
    return <Page header={label} back="close">
        <Form className="container px-3 py-3" values={values} BandTemplate={ValueEditBandTemplate}>
            <Band>
                {content}
            </Band>
            <Submit onSubmit={onSubmit} />
        </Form>
    </Page>;
}

function ValueEditBandTemplate(props: BandTemplateProps) {
    let { children, errors, memos } = props;
    return <div className="bg-white mb-3">
        {children}
        <BandFieldErrors errors={errors} />
        <BandMemos memos={memos} />
    </div>;
}
