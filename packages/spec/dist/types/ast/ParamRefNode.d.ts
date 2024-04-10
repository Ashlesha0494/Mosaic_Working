export class ParamRefNode extends ASTNode {
    constructor(name: any);
    name: any;
    instantiate(ctx: any): any;
    codegen(): string;
    toJSON(): string;
}
import { ASTNode } from './ASTNode.js';
