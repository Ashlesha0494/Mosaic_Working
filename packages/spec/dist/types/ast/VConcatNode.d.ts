export function parseVConcat(spec: any, ctx: any): VConcatNode;
export class VConcatNode extends ASTNode {
    constructor(children: any);
    instantiate(ctx: any): any;
    codegen(ctx: any): string;
    toJSON(): {
        [x: string]: any[];
    };
}
import { ASTNode } from './ASTNode.js';
