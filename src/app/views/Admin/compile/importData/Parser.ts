import { Biz, BizBud, BudOptions, Entity, EntityAtom, EnumBudType } from "app/Biz";
import { AtomData, AtomRow, Col, EnumError, ErrorCol, ErrorRow, PropValue } from "./AtomData";
import { getDays } from "app/tool";
import { BizPhraseType } from "uqs/UqDefault";

enum Sep {
    eof = 0,
    eol = 1,
    eow = 2,
}
const chars = ':;"\n\r,\t ';
const chColon = chars.charCodeAt(0);
const chSemiColon = chars.charCodeAt(1);
const chQuote = chars.charCodeAt(2);
const chN = chars.charCodeAt(3);
const chR = chars.charCodeAt(4);
const chComma = chars.charCodeAt(5);
const chTab = chars.charCodeAt(6);
const chSpace = chars.charCodeAt(7);
const ch0 = 0;
export class Parser {
    private readonly atomData: AtomData;
    private readonly data: string;
    // private readonly rootEntity: EntityAtom;
    private p: number;
    private word: string;
    // private lowered: string;
    private sep: Sep;
    private delimiter: number = chComma;
    private ln: number = 0;
    private c: number;
    private length: number;
    /*
    readEntityLeaf: EntityAtom;
    readEntity: Entity;
    readEntityName: string;
    */

    constructor(atomData: AtomData, data: string) {
        this.atomData = atomData;
        this.data = data;
        this.length = data.length;
        this.p = 0;
    }

    private advance() {
        if (this.p >= this.length) {
            this.c = 0;
            return;
        }
        this.c = this.data.charCodeAt(this.p);
        ++this.p;
    }
    private skipSpace() {
        for (; ;) {
            if (this.c === chSpace || this.c === chTab) {
                if (this.p >= this.length) break;
                this.c = this.data.charCodeAt(this.p);
                ++this.p;
            }
            else {
                break;
            }
        }
    }
    private skipToEndOfWord(chEnd: number) {
        for (; ;) {
            let c = this.c;
            if (c === chEnd) break;
            if (c === chR || c === chN) break;
            if (this.p >= this.length) break;
            this.c = this.data.charCodeAt(this.p);
            ++this.p;
        }
    }
    private readWord(chEnd: number) {
        this.skipSpace();
        if (this.c === ch0) {
            this.sep = Sep.eof;
            this.word = '';
            // this.lowered = '';
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
                    if (c === chQuote) {
                        this.advance();
                        this.word += String.fromCharCode(chQuote);
                    }
                    else {
                        this.skipToEndOfWord(chEnd);
                        c = this.c;
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
                        this.advance();
                        this.word += String.fromCharCode(c);
                    }
                    continue;
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
            // this.lowered = this.word.toLowerCase();
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
        // this.lowered = this.word.toLowerCase();
    }
    parse() {
        // let rows: AtomRow[] = [];
        // let errorRows: ErrorRow[] = [];
        for (; ;) {
            this.parseRow();
            if (this.sep === Sep.eof) break;
        }
        /*
        // atomData.setEntityLeaf(this.readEntityLeaf);
        atomData.entityName = this.readEntityName;
        atomData.entityAny = this.readEntity;
        atomData.cols = cols;
        atomData.rows = rows;
        atomData.errorRows = errorRows;
        atomData.ln = ln;
        // return atomData;
        */
    }

    private parseRow() {
        const cells: string[] = [];
        for (; ;) {
            this.readWord(this.delimiter);
            cells.push(this.word);
            if (this.sep === Sep.eol) break;
            if (this.sep === Sep.eof) break;
        }
        this.atomData.addRow(cells);
    }

    parseHead() {
        for (; ;) {
            this.readWord(chN);
            if (this.word.length > 0) break;
            if (this.sep === Sep.eof) return;
        }
        this.atomData.setEntity(this.word);
        this.parseCols();
    }

    private parseCols() {
        let cols: string[] = [];
        for (; ;) {
            this.readWord(this.delimiter);
            cols.push(this.word);
            if (this.sep === Sep.eol) break;
            if (this.sep === Sep.eof) break;
        }
        this.atomData.setCols(cols); // = cols;
    }
}
