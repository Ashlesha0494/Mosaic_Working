export function parseInput(spec: any, ctx: any): InputNode;
export class InputNode extends ASTNode {
    name: any;
    options: any;
    instantiate(ctx: any): any;
    codegen(ctx: any): string;
}
import { ASTNode } from './ASTNode.js';
