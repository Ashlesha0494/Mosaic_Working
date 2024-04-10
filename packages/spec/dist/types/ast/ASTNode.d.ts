/**
 * Abstract base class for Mosaic spec AST nodes.
 */
export class ASTNode {
    constructor(type: any, children?: any);
    /** @type {string} */
    type: string;
    /** @type {ASTNode[] | null} */
    children: ASTNode[] | null;
    /**
     * Instantiate this AST node to use in a live web application.
     * @param {import('../ast-to-dom.js').InstantiateContext} ctx The instantiation context.
     * @returns {*} The instantiated value of this node.
     */
    instantiate(ctx: import('../ast-to-dom.js').InstantiateContext): any;
    /**
     * Generate ESM code for this AST node.
     * @param {import('../ast-to-esm.js').CodegenContext} ctx The code generator context.
     * @returns {string|void} The generated ESM code for the node.
     */
    codegen(ctx: import('../ast-to-esm.js').CodegenContext): string | void;
    /**
     * @returns {*} This AST node in JSON specification format.
     */
    toJSON(): any;
}
