import React from "react";
import { Pick, Int, Decimal, String, Band, TextArea } from "tonwa-com";
import { Field } from "tonwa-uq";

export interface FieldsBandsProps {
    fields: Field[];
    replacer?: { [fieldName: string]: JSX.Element; }
}
export function createBandsFromFields(
    props: FieldsBandsProps,
    sep?: number | JSX.Element,
) {
    let count = 0;
    let { fields, replacer } = props;
    return fields.map((v, index) => {
        let { name } = v;
        if (name === 'id') return null;
        ++count;
        let replace = replacer?.[name];
        if (replace) {
            return (<React.Fragment key={index}>{replace}</React.Fragment>);
        }
        if (replace === null) return null;

        return (<Band key={index} label={name} sep={count > 1 ? sep : null}>
            {createInputFromField(v)}
        </Band>);
    });
}

function createInputFromField(field: Field) {
    let { type, name } = field;
    if (name === 'no') {
        return <String name={name} readOnly={true} />;
    }
    switch (type) {
        default: return <div>unknown type: {type}</div>;
        case 'id': return <Pick name={name} onPick={async () => alert('pick id')} />;
        case 'bigint':
        case 'int':
        case 'tinyint':
        case 'smallint':
            return <Int name={name} />;
        case 'dec':
            return <Decimal name={name} />;
        case 'char':
            return <String name={name} maxLength={field.size} />;
        case 'text':
            return <TextArea name={name} maxLength={60000} />
    }
}
