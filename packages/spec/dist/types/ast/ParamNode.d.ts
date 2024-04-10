export function parseParam(spec: any, ctx: any): SelectionNode | ParamNode;
export class ParamNode extends ASTNode {
    value: any;
    date: any;
    instantiate(ctx: any): any;
    codegen(ctx: any): string;
}
import { SelectionNode } from './SelectionNode.js';
import { ASTNode } from './ASTNode.js';
