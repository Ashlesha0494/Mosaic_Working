export function parseInteractor(spec: any, ctx: any): PlotInteractorNode;
export class PlotInteractorNode extends ASTNode {
    name: any;
    options: any;
    instantiate(ctx: any): any;
    codegen(ctx: any): string;
}
import { ASTNode } from './ASTNode.js';
