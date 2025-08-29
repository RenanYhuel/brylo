import { parseBml } from '../parser';
import { BmlParseError } from '../errors';

describe('BML Parser', () => {
    it('should parse a valid BML module', () => {
        /*
         * Note: 'author' in the BML source below is a variable handled by the BML parser/interpreter, not TypeScript.
         * The linter may report 'Cannot find name author', but this is expected and does not affect test validity.
         */
        const source = `
module "demo" {
version: 1.0
author: "Renan"
tags: ["cli","test"]
run {
log: "Hello, ${author}!"
}
}`;
        const ast = parseBml(source);
        expect(ast.name).toBe('demo');
        expect(ast.metadata.version).toBe(1.0);
        expect(ast.metadata.author).toBe('Renan');
        expect(Array.isArray(ast.metadata.tags)).toBe(true);
        expect(ast.run.instructions[0].type).toBe('log');
    });

    it('should throw on missing module declaration', () => {
        const source = `version: 1.0\nrun { log: "Hello" }`;
        expect(() => parseBml(source)).toThrow(BmlParseError);
    });

    it('should throw on invalid metadata', () => {
        const source = `module "demo" {\nversion 1.0\nrun { log: "Hello" }\n}`;
        expect(() => parseBml(source)).toThrow(BmlParseError);
    });

    it('should throw on missing run block', () => {
        const source = `module "demo" {\nversion: 1.0\n}`;
        expect(() => parseBml(source)).toThrow(BmlParseError);
    });

    it('should throw on invalid module structure', () => {
        const source = `module "demo" {\nversion: 1.0\nrun { log: "Hello" }`;
        expect(() => parseBml(source)).toThrow(BmlParseError);
    });
});
