/**
 * Generate ESM code for a Mosaic spec AST.
 * @param {SpecNode} ast Mosaic AST root node.
 * @param {object} [options] Code generation options.
 * @param {string} [options.baseURL] The base URL for loading data files.
 * @param {string} [options.connector] A database connector to initialize.
 *  Valid values are 'wasm', 'socket', and 'rest'.
 *  If undefined, no connector code is generated.
 * @param {string} [options.namespace='vg'] The vgplot API namespace object.
 * @param {number} [options.depth=0] The starting indentation depth.
 * @param {Map<string,string|string[]>} [options.imports] A Map of ESM
 *  imports to include in generated code. Keys are packages (e.g.,
 *  '@uwdata/vgplot') and values indicate what to import (e.g., '* as vg').
 * @param {string|string[]} [options.preamble] Code to include after imports.
 * @returns {string} Generated ESM code using the vgplot API.
 */
export function astToESM(ast: SpecNode, options?: {
    baseURL?: string;
    connector?: string;
    namespace?: string;
    depth?: number;
    imports?: Map<string, string | string[]>;
    preamble?: string | string[];
}): string;
export class CodegenContext {
    /**
     * Create a new code generator context.
     * @param {object} [options] Code generation options.
     * @param {*} [options.plotDefaults] Default attributes to apply to all plots.
     * @param {string} [options.baseURL] The base URL for loading data files.
     * @param {string} [options.connector] A database connector to initialize.
     *  Valid values are 'wasm', 'socket', and 'rest'.
     *  If undefined, no connector code is generated.
     * @param {string} [options.namespace='vg'] The vgplot API namespace object.
     * @param {number} [options.depth=0] The starting indentation depth.
     * @param {Map<string,string|string[]>} [options.imports] A Map of ESM
     *  imports to include in generated code. Keys are packages (e.g.,
     *  '@uwdata/vgplot') and values indicate what to import (e.g., '* as vg').
     */
    constructor({ plotDefaults, namespace, connector, imports, baseURL, depth }?: {
        plotDefaults?: any;
        baseURL?: string;
        connector?: string;
        namespace?: string;
        depth?: number;
        imports?: Map<string, string | string[]>;
    });
    plotDefaults: any;
    namespace: string;
    connector: string;
    imports: Map<string, string | string[]>;
    baseURL: string;
    depth: number;
    addImport(pkg: any, method: any): void;
    setImports(pkg: any, all: any): void;
    ns(): string;
    indent(): void;
    undent(): void;
    tab(): string;
    stringify(value: any): any;
    maybeLineWrap(spans: any): any;
    error(message: any, data: any): void;
}
import { SpecNode } from './ast/SpecNode.js';
