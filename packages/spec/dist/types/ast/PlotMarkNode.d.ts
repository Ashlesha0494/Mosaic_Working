export function parseMark(spec: any, ctx: any): PlotMarkNode;
export class PlotMarkNode extends ASTNode {
    constructor(name: any, data: any, options: any);
    name: any;
    data: any;
    options: any;
    instantiate(ctx: any): any;
    codegen(ctx: any): string;
}
import { ASTNode } from './ASTNode.js';
