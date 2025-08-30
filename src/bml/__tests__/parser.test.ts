import { parseBml } from '../parser';
import { BmlParseError } from '../errors';
import * as fs from 'fs';
import * as path from 'path';

describe('BML Parser', () => {
    it('should parse a valid BML module', () => {
        const source = fs.readFileSync(path.join(__dirname, 'bml', 'valid-module.bml'), 'utf8');
        const ast = parseBml(source);
        expect(ast.name).toBe('demo');
        expect(ast.metadata.version).toBe(1.0);
        expect(ast.metadata.author).toBe('Renan');
        expect(Array.isArray(ast.metadata.tags)).toBe(true);
        expect(ast.run.instructions[0].type).toBe('set');
        expect(ast.run.instructions[1].type).toBe('log');
    });

    it('should throw on missing module declaration', () => {
        const source = fs.readFileSync(path.join(__dirname, 'bml', 'missing-module.bml'), 'utf8');
        expect(() => parseBml(source)).toThrow(BmlParseError);
    });

    it('should throw on invalid metadata', () => {
        const source = fs.readFileSync(path.join(__dirname, 'bml', 'invalid-metadata.bml'), 'utf8');
        expect(() => parseBml(source)).toThrow(BmlParseError);
    });

    it('should throw on missing run block', () => {
        const source = fs.readFileSync(
            path.join(__dirname, 'bml', 'missing-run-block.bml'),
            'utf8',
        );
        expect(() => parseBml(source)).toThrow(BmlParseError);
    });

    it('should throw on invalid module structure', () => {
        const source = fs.readFileSync(
            path.join(__dirname, 'bml', 'invalid-structure.bml'),
            'utf8',
        );
        expect(() => parseBml(source)).toThrow(BmlParseError);
    });

    it('should parse a condition with expression', () => {
        const source = fs.readFileSync(path.join(__dirname, 'bml', 'expr-demo.bml'), 'utf8');
        const ast = parseBml(source);
        expect(ast.run.instructions.some((i) => i.type === 'if')).toBe(true);
        const ifInstr = ast.run.instructions.find(
            (i) => i.type === 'if',
        ) as import('../types').BmlIf;
        expect(ifInstr).toBeDefined();
        expect(ifInstr.condition).toBe('x > 3');
    });

    it('should parse set with object value', () => {
        const source = fs.readFileSync(path.join(__dirname, 'bml', 'object-demo.bml'), 'utf8');
        const ast = parseBml(source);
        const setInstr = ast.run.instructions.find(
            (i) => i.type === 'set',
        ) as import('../types').BmlSet;
        expect(setInstr).toBeDefined();
        expect(typeof setInstr.value).toBe('object');
        const obj = setInstr.value as import('../types').BmlObject;
        expect(obj.a).toBe(1);
        expect(obj.b).toBe(true);
    });
});
