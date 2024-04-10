export function parseExpression(spec: any, ctx: any): ExpressionNode;
export class ExpressionNode extends ASTNode {
    constructor(value: any, spans: any, params: any, label: any, aggregate: any);
    value: any;
    spans: any;
    params: any;
    label: any;
    aggregate: any;
    instantiate(ctx: any): any;
    codegen(ctx: any): string;
    toJSON(): {
        [x: string]: any;
    };
}
import { ASTNode } from './ASTNode.js';
