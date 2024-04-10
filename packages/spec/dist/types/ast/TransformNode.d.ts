export function parseTransform(spec: any, ctx: any): TransformNode;
export class TransformNode extends ASTNode {
    constructor(name: any, args: any, options: any);
    name: any;
    args: any;
    options: any;
    instantiate(ctx: any): any;
    codegen(ctx: any): string;
    toJSON(): {
        [x: number]: any;
    };
}
import { ASTNode } from './ASTNode.js';
