export function parseAttribute(key: any, value: any, ctx: any): PlotAttributeNode;
export class PlotAttributeNode extends ASTNode {
    name: any;
    value: any;
    instantiate(ctx: any): any;
    codegen(ctx: any): string;
    toJSON(): {
        [x: number]: any;
    };
}
export class PlotFixedNode extends ASTNode {
    constructor();
    value: string;
    instantiate(ctx: any): any;
    codegen(ctx: any): string;
    toJSON(): string;
}
import { ASTNode } from './ASTNode.js';
