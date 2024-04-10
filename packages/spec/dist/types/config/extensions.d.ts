/**
 * Construct a set of database extensions to load.
 * Automatically adds the spatial extension if a
 * dataset with format "spatial" is loaded.
 * @param {SpecNode} ast Mosaic AST root node.
 * @returns {Set<string>} A set of extension names.
 */
export function resolveExtensions(ast: SpecNode): Set<string>;
import { SpecNode } from '../ast/SpecNode.js';
