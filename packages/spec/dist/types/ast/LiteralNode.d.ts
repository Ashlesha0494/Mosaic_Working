export class LiteralNode extends ASTNode {
    constructor(value: any);
    value: any;
    instantiate(): any;
    codegen(ctx: any): any;
}
import { ASTNode } from './ASTNode.js';
