import { BizBud, BudOptions, Entity, EntityAtom, EntityOptions, EnumBudType } from "app/Biz";
import { AtomData, AtomRow, Col, EnumError, ErrorCol, ErrorRow, ImportAtom, PropValue } from "./ImportAtom";
import { getDays } from "app/tool";
import { BizPhraseType } from "uqs/UqDefault";

enum Sep {
    eof = 0,
    eol = 1,
    eow = 2,
}
const chars = ':;"\n\r,';
const chColon = chars.charCodeAt(0);
const chSemiColon = chars.charCodeAt(1);
const chQuote = chars.charCodeAt(2);
const chN = chars.charCodeAt(3);
const chR = chars.charCodeAt(4);
const chComma = chars.charCodeAt(5);
const ch0 = 0;
export class Parser {
    private readonly data: string;
    private readonly rootEntity: EntityAtom;
    private p: number;
    private word: string;
    private lowered: string;
    private sep: Sep;
    private delimiter: number = chComma;
    private ln: number = 0;
    private c: number;
    private length: number;
    readEntityLeaf: EntityAtom;
    readEntity: Entity;
    readEntityName: string;

    constructor(data: string, entity: EntityAtom) {
        this.data = data;
        this.length = data.length;
        this.rootEntity = entity;
    }

    private advance() {
        if (this.p >= this.length) {
            this.c = 0;
            return;
        }
        this.c = this.data.charCodeAt(this.p);
        ++this.p;
    }
    private readWord(chEnd: number) {
        if (this.c === ch0) {
            this.sep = Sep.eof;
            this.word = '';
            this.lowered = '';
            return;
        }
        if (this.c === chQuote) {
            this.advance();
            this.word = '';
            for (; ;) {
                if (this.c === ch0) {
                    this.sep = Sep.eof;
                    break;
                }
                if (this.c === chQuote) {
                    this.advance();
                    let c = this.c;
                    if (c === ch0) {
                        this.sep = Sep.eof;
                        break;
                    }
                    if (c === chEnd) {
                        this.sep = Sep.eow;
                        this.advance();
                        break;
                    }
                    if (c === chR || c === chN) {
                        this.sep = Sep.eol;
                        this.advance();
                        ++this.ln;
                        break;
                    }
                    if (c === chQuote) {
                        this.advance();
                        this.word += String.fromCharCode(chQuote);
                    }
                    else {
                        this.advance();
                        this.word += String.fromCharCode(c);
                    }
                    continue;
                }
                if (this.c === chEnd) {
                    this.advance();
                    this.sep = Sep.eow;
                    break;
                }
                if (this.c === chR || this.c === chN) {
                    this.advance();
                    this.sep = Sep.eol;
                    ++this.ln;
                    break;
                }
                this.word += String.fromCharCode(this.c);
                this.advance();
            }
            this.lowered = this.word.toLowerCase();
            return;
        }

        let start = this.p - 1;
        let end: number;
        for (; ;) {
            let c = this.c;
            if (c === ch0) {
                this.sep = Sep.eof;
                end = this.p;
                break;
            }
            if (c === chR || c === chN) {
                this.sep = Sep.eol;
                end = this.p - 1;
                this.advance();
                ++this.ln;
                break;
            }
            if (c === chEnd) {
                this.sep = Sep.eow;
                end = this.p - 1;
                this.advance();
                break;
            }
            this.advance();
        }
        this.word = this.data.substring(start, end).trim();
        this.lowered = this.word.toLowerCase();
    }
    parse(): ImportAtom {
        this.p = 0;
        let importAtom = new ImportAtom(this.rootEntity);
        const { arrAtomData } = importAtom;
        for (; ;) {
            let ln = this.ln;
            this.parseHead();
            if (this.sep as any === Sep.eof) break;
            let cols = this.parseCols();
            let rows: AtomRow[] = [];
            let errorRows: ErrorRow[] = [];
            for (; ;) {
                this.readWord(this.delimiter);
                let no = this.word;
                if (no === '' && this.sep === Sep.eol) break;
                this.readWord(this.delimiter);
                let ex = this.word;
                let props: PropValue[] = [];
                let errs: ErrorCol[] = [];
                for (let colIndex = 2; ; colIndex++) {
                    this.readWord(this.delimiter);
                    let col = cols[colIndex];
                    if (col === undefined) break;
                    const { bud } = col;
                    if (this.word.length === 0) {
                        props.push(undefined);
                    }
                    else if (this.readEntityLeaf !== undefined) {
                        if (bud !== undefined) {
                            let v = this.budValue(bud, this.word);
                            if (v === null) {
                                errs.push([colIndex, EnumError.invalidValue]);
                            }
                            props.push(v);
                        }
                        else {
                            errs.push([colIndex, EnumError.nonexists]);
                        }
                    }
                    if (this.sep as any === Sep.eof || this.sep as any === Sep.eol) break;
                }
                rows.push({
                    no, ex, ln: this.ln, props,
                });
                if (errs.length > 0) {
                    errorRows.push([this.ln, errs]);
                }
                if (this.sep === Sep.eof) break;
            }
            let atomData = new AtomData(importAtom);
            atomData.entityLeaf = this.readEntityLeaf;
            atomData.entityName = this.readEntityName;
            atomData.entityAny = this.readEntity;
            atomData.cols = cols;
            atomData.rows = rows;
            atomData.errorRows = errorRows;
            atomData.ln = ln;
            arrAtomData.push(atomData);
            if (this.sep === Sep.eof) break;
        }
        return importAtom;
    }

    private budValue(bud: BizBud, v: string): PropValue {
        switch (bud.budDataType.type) {
            default: return this.budNumberValue(v);
            case EnumBudType.dec: return this.budNumberValue(v);
            case EnumBudType.char:
            case EnumBudType.str: return v;
            case EnumBudType.radio: return this.budRadioValue(bud, v);
            case EnumBudType.check: return this.budCheckValue(bud, v);
            case EnumBudType.date: return this.budDateValue(v);
            case EnumBudType.datetime: return this.budDateTimeValue(v);
            case EnumBudType.ID:
            case EnumBudType.atom: return v;
        }
    }

    private budNumberValue(v: string) {
        let dec = Number(v);
        if (Number.isNaN(dec) === true) return;
        return dec;
    }

    private budDateValue(v: string) {
        let date = getDays(v);
        return date;
    }

    private budDateTimeValue(v: string) {
        let date = getDays(v);
        return date;
    }

    private budRadioValue(bud: BizBud, v: string) {
        const { budDataType } = bud;
        const { options } = budDataType as BudOptions;
        let optionItem = options.items.find(item => item.name === v);
        if (optionItem === undefined) return;
        return optionItem.id;
    }

    private budCheckValue(bud: BizBud, v: string) {
        const { budDataType } = bud;
        const { options } = budDataType as BudOptions;
        let parts = v.split('+');
        let ret: number[] = [];
        for (let p of parts) {
            p = p.trim();
            let optionItem = options.items.find(item => item.name === p);
            if (optionItem === undefined) return;
            ret.push(optionItem.id);
        }
        return ret;
    }

    private parseHead(): EntityAtom {
        this.readEntityLeaf = undefined;
        this.readEntityName = undefined;
        let length: number;
        for (; ;) {
            this.readWord(chN);
            length = this.word.length;
            if (length > 0) break;
            if (this.sep === Sep.eof) return;
        }
        length--;
        let c = this.lowered.charCodeAt(length);
        if (!(c >= 0x30 && c <= 0x39 || c >= 0x41 && c <= 0x5A || c >= 0x61 && c <= 0x7A || c > 0x7F)) {
            this.delimiter = c;
            this.readEntityName = this.lowered.substring(0, length);
        }
        else {
            this.readEntityName = this.lowered;
        }
        this.readEntityLeaf = this.rootEntity.getLeaf(this.readEntityName);
        this.readEntity = this.rootEntity.biz.entities[this.readEntityName];
    }

    private parseCols(): Col[] {
        let cols: Col[] = [];
        for (; ;) {
            this.readWord(this.delimiter);
            this.word.length;
            cols.push({
                header: this.word,
                bud: this.readEntityLeaf?.budFromName(this.lowered),
            });
            if (this.sep === Sep.eol) break;
            if (this.sep === Sep.eof) break;
        }
        return cols;
    }
}
