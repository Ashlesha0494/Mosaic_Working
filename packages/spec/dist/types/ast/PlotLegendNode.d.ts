export function parseLegend(spec: any, ctx: any): PlotLegendNode;
export class PlotLegendNode extends ASTNode {
    constructor(key: any, name: any, options: any);
    key: any;
    name: any;
    options: any;
    instantiate(ctx: any): any;
    codegen(ctx: any): string;
}
import { ASTNode } from './ASTNode.js';
