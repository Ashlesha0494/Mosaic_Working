export class SelectionNode extends ASTNode {
    constructor(select: string, cross: any);
    select: string;
    cross: any;
    instantiate(ctx: any): any;
    codegen(ctx: any): string;
    toJSON(): {
        select: string;
        cross: any;
    };
}
import { ASTNode } from './ASTNode.js';
