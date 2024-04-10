export function parseOptions(spec: any, ctx: any): OptionsNode;
export class OptionsNode extends ASTNode {
    constructor(options: any);
    options: any;
    filter(predicate: any): OptionsNode;
    instantiate(ctx: any): {};
    codegen(ctx: any): string;
    toJSON(): {};
}
import { ASTNode } from './ASTNode.js';
