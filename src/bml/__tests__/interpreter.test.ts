import { parseBml } from '../parser';
import { executeModule } from '../interpreter';
import * as fs from 'fs';
import * as path from 'path';

describe('BML Interpreter', () => {
    it('should throw an error for missing type in set', () => {
        const source = fs.readFileSync(path.join(__dirname, 'bml', 'missing-type.bml'), 'utf8');
        expect(() => parseBml(source)).toThrow(/Missing type for variable/);
    });

    it('should throw an error for incorrect type in set', () => {
        const source = fs.readFileSync(path.join(__dirname, 'bml', 'incorrect-type.bml'), 'utf8');
        expect(() => parseBml(source)).toThrow();
    });
    // Test supprimé car l’interpreter est maintenant implémenté
    it('should execute log and set instructions', () => {
        const source = fs.readFileSync(path.join(__dirname, 'bml', 'valid-module.bml'), 'utf8');
        const ast = parseBml(source);
        const ctx = executeModule(ast);
        expect(ctx.variables.name).toBe('Brylo');
        expect(ctx.logs).toContain('Hello, Brylo!');
    });

    it('should execute if/else instructions', () => {
        const source = fs.readFileSync(path.join(__dirname, 'bml', 'if-else-demo.bml'), 'utf8');
        const ast = parseBml(source);
        const ctx = executeModule(ast);
        expect(ctx.logs).toContain('Flag is true');
        expect(ctx.logs).not.toContain('Flag is false');
    });

    it('should execute for loop', () => {
        const source = fs.readFileSync(path.join(__dirname, 'bml', 'for-loop-demo.bml'), 'utf8');
        const ast = parseBml(source);
        const ctx = executeModule(ast);
        expect(ctx.logs).toContain('Item: 1');
        expect(ctx.logs).toContain('Item: 2');
        expect(ctx.logs).toContain('Item: 3');
    });

    it('should collect errors for invalid instructions', () => {
        const source = fs.readFileSync(
            path.join(__dirname, 'bml', 'invalid-instructions.bml'),
            'utf8',
        );
        const ast = parseBml(source);
        const ctx = executeModule(ast);
        expect(ctx.errors.length).toBeGreaterThan(0);
    });

    it('should execute if with expression', () => {
        const source = fs.readFileSync(path.join(__dirname, 'bml', 'expr-demo.bml'), 'utf8');
        const ast = parseBml(source);
        const ctx = executeModule(ast);
        expect(ctx.logs).toContain('x is big');
        expect(ctx.logs).not.toContain('x is small');
    });

    it('should handle set with object value', () => {
        const source = fs.readFileSync(path.join(__dirname, 'bml', 'object-demo.bml'), 'utf8');
        const ast = parseBml(source);
        const ctx = executeModule(ast);
        expect(typeof ctx.variables.obj).toBe('object');
        const obj = ctx.variables.obj as import('../types').BmlObject;
        expect(obj.a).toBe(1);
        expect(obj.b).toBe(true);
    });
    it('should execute if with == expression', () => {
        const source = fs.readFileSync(path.join(__dirname, 'bml', 'if-eq-demo.bml'), 'utf8');
        const ast = parseBml(source);
        const ctx = executeModule(ast);
        expect(ctx.logs).toContain('x is five');
        expect(ctx.logs).not.toContain('x is not five');
    });
    it('should execute if with != expression', () => {
        const source = fs.readFileSync(path.join(__dirname, 'bml', 'if-neq-demo.bml'), 'utf8');
        const ast = parseBml(source);
        const ctx = executeModule(ast);
        expect(ctx.logs).toContain('x is not three');
        expect(ctx.logs).not.toContain('x is three');
    });
    it('should execute if with < expression', () => {
        const source = fs.readFileSync(path.join(__dirname, 'bml', 'if-lt-demo.bml'), 'utf8');
        const ast = parseBml(source);
        const ctx = executeModule(ast);
        expect(ctx.logs).toContain('x is less than three');
        expect(ctx.logs).not.toContain('x is not less than three');
    });
    it('should execute if with > expression', () => {
        const source = fs.readFileSync(path.join(__dirname, 'bml', 'if-gt-demo.bml'), 'utf8');
        const ast = parseBml(source);
        const ctx = executeModule(ast);
        expect(ctx.logs).toContain('x is greater than three');
        expect(ctx.logs).not.toContain('x is not greater than three');
    });
    it('should execute if with >= expression', () => {
        const source = fs.readFileSync(path.join(__dirname, 'bml', 'if-gte-demo.bml'), 'utf8');
        const ast = parseBml(source);
        const ctx = executeModule(ast);
        expect(ctx.logs).toContain('x is greater or equal to three');
        expect(ctx.logs).not.toContain('x is less than three');
    });
    it('should execute if with <= expression', () => {
        const source = fs.readFileSync(path.join(__dirname, 'bml', 'if-lte-demo.bml'), 'utf8');
        const ast = parseBml(source);
        const ctx = executeModule(ast);
        expect(ctx.logs).toContain('x is less or equal to three');
        expect(ctx.logs).not.toContain('x is greater than three');
    });
});
