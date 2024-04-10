export function parseMarkData(spec: any, ctx: any): LiteralNode | PlotFromNode;
export class PlotFromNode extends ASTNode {
    table: any;
    options: any;
    instantiate(ctx: any): any;
    codegen(ctx: any): string;
}
import { LiteralNode } from './LiteralNode.js';
import { ASTNode } from './ASTNode.js';
