/**
 * Generate a running web application (DOM content) for a Mosaic spec AST.
 * @param {SpecNode} ast Mosaic AST root node.
 * @param {object} [options] Instantiation options.
 * @param {string} [options.baseURL] The base URL for loading data files.
 * @param {any[]} [options.plotDefaults] Array of default plot attributes.
 * @param {Map<string, Param>} [options.params] A map of predefined Params/Selections.
 * @returns {Promise<{
 *   element: HTMLElement | SVGSVGElement;
*    params: Map<string, Param | Selection>;
*  }>} A Promise to an object with the resulting
 *  DOM element, and a map of named parameters (Param and Selection instances).
 */
export function astToDOM(ast: SpecNode, options?: {
    baseURL?: string;
    plotDefaults?: any[];
    params?: Map<string, Param>;
}): Promise<{
    element: HTMLElement | SVGSVGElement;
    params: Map<string, Param | Selection>;
}>;
export class InstantiateContext {
    constructor({ api, plotDefaults, params, baseURL }?: {
        api?: any;
        plotDefaults?: any[];
        params?: Map<any, any>;
        baseURL?: any;
    });
    api: any;
    plotDefaults: any[];
    activeParams: Map<any, any>;
    baseURL: any;
    coordinator: any;
    error(message: any, data: any): void;
}
import { SpecNode } from './ast/SpecNode.js';
import { Param } from '@uwdata/mosaic-core';
import { Selection } from '@uwdata/mosaic-core';
