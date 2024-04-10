/**
 * Generate an object of lookup maps for vgplot components.
 */
export function plotNames({ attributes, interactors, legends, marks }?: {
    attributes?: Set<string>;
    interactors?: Set<string>;
    legends?: Set<string>;
    marks?: Set<string>;
}): {
    attributes: Set<string>;
    interactors: Set<string>;
    legends: Set<string>;
    marks: Set<string>;
};
/**
 * Names of attribute directive functions.
 * @returns {Set<string>}
 */
export function plotAttributeNames(overrides?: any[]): Set<string>;
/**
 * Names interactor directive functions.
 * @returns {Set<string>}
 */
export function plotInteractorNames(overrides?: any[]): Set<string>;
/**
 * Names of legend directive functions.
 * @returns {Set<string>}
 */
export function plotLegendNames(overrides?: any[]): Set<string>;
/**
 * Names of mark directive functions.
 * @returns {Set<string>}
 */
export function plotMarkNames(overrides?: any[]): Set<string>;
