export function parseHConcat(spec: any, ctx: any): HConcatNode;
export class HConcatNode extends ASTNode {
    constructor(children: any);
    instantiate(ctx: any): any;
    codegen(ctx: any): string;
    toJSON(): {
        [x: string]: any[];
    };
}
import { ASTNode } from './ASTNode.js';
