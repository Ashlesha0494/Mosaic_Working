/**
 * Parse a data definition spec.
 * @param {string} name The name of the dataset
 * @param {import('../spec/Data.js').DataDefinition} spec The data definition spec.
 * @param {import('../parse-spec.js').ParseContext} ctx The parser context.
 * @returns {DataNode} a parsed data definition AST node
 */
export function parseData(name: string, spec: import('../spec/Data.js').DataDefinition, ctx: import('../parse-spec.js').ParseContext): DataNode;
export const TABLE_DATA: "table";
export const PARQUET_DATA: "parquet";
export const CSV_DATA: "csv";
export const JSON_DATA: "json";
export const SPATIAL_DATA: "spatial";
export class DataNode extends ASTNode {
    name: any;
    format: any;
}
export class QueryDataNode extends DataNode {
    /**
     * Instantiate a table creation query.
     * @param {import('../ast-to-dom.js').InstantiateContext} ctx The instantiation context.
     * @returns {string|void} The instantiated query.
     */
    instantiateQuery(ctx: import('../ast-to-dom.js').InstantiateContext): string | void;
    /**
     * Code generate a table creation query.
     * @param {import('../ast-to-esm.js').CodegenContext} ctx The code generator context.
     * @returns {string|void} The generated query code.
     */
    codegenQuery(ctx: import('../ast-to-esm.js').CodegenContext): string | void;
}
export class TableDataNode extends QueryDataNode {
    constructor(name: any, query: any, options: any);
    query: any;
    options: any;
}
export class FileDataNode extends QueryDataNode {
    constructor(name: any, format: any, method: any, file: any, options: any);
    file: any;
    method: any;
    options: any;
}
export class SpatialDataNode extends FileDataNode {
    constructor(name: any, file: any, options: any);
}
export class ParquetDataNode extends FileDataNode {
    constructor(name: any, file: any, options: any);
}
export class CSVDataNode extends FileDataNode {
    constructor(name: any, file: any, options: any);
}
export class JSONDataNode extends FileDataNode {
    constructor(name: any, file: any, options: any);
}
export class LiteralJSONDataNode extends QueryDataNode {
    constructor(name: any, data: any, options: any);
    data: any;
    options: any;
}
import { ASTNode } from './ASTNode.js';
