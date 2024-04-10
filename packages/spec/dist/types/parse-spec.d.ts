/**
 * @typedef {{
 *   attributes: Set<string>;
 *   interactors: Set<string>;
 *   legends: Set<string>;
 *   marks: Set<string>;
 * }} PlotNames names for supported plot elements
 */
/**
 * Parse a Mosaic specification to an AST (abstract syntax tree).
 * @param {import('./spec/Spec.js').Spec} spec The input specification.
 * @param {object} [options] Optional parse options object.
 * @param {Map<string, Function>} [options.components] Map of component names to parse functions.
 * @param {Set<string>} [options.transforms] The names of allowed transform functions.
 * @param {Set<string>} [options.inputs] The names of supported input widgets.
 * @param {PlotNames} [options.plot] The names of supported plot elements.
 * @param {any[]} [options.params] An array of [name, node] pairs of pre-parsed
 *  Param or Selection AST nodes.
 * @param {any[]} [options.datasets] An array of [name, node] pairs of pre-parsed
 *  dataset definition AST nodes.
 * @returns {SpecNode} The top-level AST spec node.
 */
export function parseSpec(spec: import('./spec/Spec.js').Spec, options?: {
    components?: Map<string, Function>;
    transforms?: Set<string>;
    inputs?: Set<string>;
    plot?: PlotNames;
    params?: any[];
    datasets?: any[];
}): SpecNode;
export class ParseContext {
    /**
     * Create a new parser context.
     * @param {object} [options]
     * @param {Map<string, Function>} [options.components] Map of component names to parse functions.
     * @param {Set<string>} [options.transforms] The names of allowed transform functions.
     * @param {Set<string>} [options.inputs] The names of supported input widgets.
     * @param {PlotNames} [options.plot] The names of supported plot elements.
     * @param {any[]} [options.params] An array of [name, node] pairs of pre-parsed
     *  Param or Selection AST nodes.
     * @param {any[]} [options.datasets] An array of [name, node] pairs of pre-parsed
     *  dataset definition AST nodes.
     */
    constructor({ components, transforms, inputs, plot, params, datasets }?: {
        components?: Map<string, Function>;
        transforms?: Set<string>;
        inputs?: Set<string>;
        plot?: PlotNames;
        params?: any[];
        datasets?: any[];
    });
    components: Map<string, Function>;
    transforms: Set<string>;
    inputs: Set<string>;
    plot: PlotNames;
    params: Map<any, any>;
    datasets: Map<any, any>;
    parse(spec: any): SpecNode;
    plotDefaults: import("./ast/PlotAttributeNode.js").PlotAttributeNode[];
    parseComponent(spec: any): any;
    /**
     * Test if a value is param reference, if so, generate a paramter definition
     * as needed and return a new ParamRefNode. Otherwise, return a LiteralNode.
     * @param {*} value The value to test.
     * @param {() => ParamNode | SelectionNode} [makeNode] A Param of Selection AST
     *  node constructor.
     * @returns {ParamRefNode|LiteralNode} An AST node for the input value.
     */
    maybeParam(value: any, makeNode?: () => ParamNode | SelectionNode): ParamRefNode | LiteralNode;
    maybeSelection(value: any): LiteralNode | ParamRefNode;
    error(message: any, data: any): void;
}
/**
 * names for supported plot elements
 */
export type PlotNames = {
    attributes: Set<string>;
    interactors: Set<string>;
    legends: Set<string>;
    marks: Set<string>;
};
import { SpecNode } from './ast/SpecNode.js';
import { ParamNode } from './ast/ParamNode.js';
import { SelectionNode } from './ast/SelectionNode.js';
import { ParamRefNode } from './ast/ParamRefNode.js';
import { LiteralNode } from './ast/LiteralNode.js';
