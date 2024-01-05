import { BandFieldErrors, BandMemos, BandTemplateProps } from "tonwa-com";

export function AuthFormBandTemplate(props: BandTemplateProps) {
    let { label, children, errors, memos, contentContainerClassName } = props;
    let vLabel: any;
    let cnContent = ' col-9 col-sm-10 ' + (contentContainerClassName ?? '');
    if (label) {
        vLabel = <label className="col-3 col-sm-2 col-form-label text-sm-end"><b>{label}</b></label>;
    }
    else {
        cnContent += ' offset-3 offset-sm-2';
    }
    return <div className="mb-3 row bg-white">
        {vLabel}
        <div className={cnContent}>
            {children}
            <BandFieldErrors errors={errors} />
            <BandMemos memos={memos} />
        </div>
    </div>;
}
