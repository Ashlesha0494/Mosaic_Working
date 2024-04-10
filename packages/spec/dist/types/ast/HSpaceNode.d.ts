export function parseHSpace(spec: any): HSpaceNode;
export class HSpaceNode extends ASTNode {
    constructor(value: any);
    value: any;
    instantiate(ctx: any): any;
    codegen(ctx: any): string;
    toJSON(): {
        [x: string]: any;
    };
}
import { ASTNode } from './ASTNode.js';
