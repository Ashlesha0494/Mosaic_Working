export function parseTopLevelMark(spec: any, ctx: any): PlotNode;
export function parsePlot(spec: any, ctx: any): PlotNode;
export class PlotNode extends ASTNode {
    attributes: any;
    instantiate(ctx: any): any;
    codegen(ctx: any): string;
    toJSON(): {
        [x: string]: any[];
    };
}
import { ASTNode } from './ASTNode.js';
