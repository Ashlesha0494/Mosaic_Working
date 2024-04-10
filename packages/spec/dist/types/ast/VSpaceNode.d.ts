export function parseVSpace(spec: any): VSpaceNode;
export class VSpaceNode extends ASTNode {
    constructor(value: any);
    value: any;
    instantiate(ctx: any): any;
    codegen(ctx: any): string;
    toJSON(): {
        [x: string]: any;
    };
}
import { ASTNode } from './ASTNode.js';
