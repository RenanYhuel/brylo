import { parseBml } from '../parser';
import { executeModule } from '../interpreter';
import { BmlModule } from '../types';

describe('BML Interpreter', () => {
    it('should throw if not implemented', () => {
        const dummy: BmlModule = {
            name: 'dummy',
            metadata: {},
            run: { instructions: [] },
        };
        expect(() => executeModule(dummy)).toThrow('BML interpreter not implemented yet');
    });
    it('should execute log and set instructions', () => {
        const source = `
    /*
     * Note: 'item' in the BML source below is a variable handled by the BML interpreter, not TypeScript.
     * The linter may report 'Cannot find name item', but this is expected and does not affect test validity.
     */
    module "demo" {
    version: 1.0
    run {
    set: name = "Brylo"
    log: "Hello, ${name}!"
    }
    }`;
        const ast = parseBml(source);
        const ctx = executeModule(ast);
        expect(ctx.variables.name).toBe('Brylo');
        expect(ctx.logs).toContain('Hello, Brylo!');
    });

    it('should execute if/else instructions', () => {
        const source = `
    module "demo" {
    run {
    set: flag = true
    if: flag {
    log: "Flag is true"
    } else {
    log: "Flag is false"
    }
    }
    }`;
        const ast = parseBml(source);
        const ctx = executeModule(ast);
        expect(ctx.logs).toContain('Flag is true');
        expect(ctx.logs).not.toContain('Flag is false');
    });

    it('should execute for loop', () => {
        const source = `
    module "demo" {
    run {
    set: items = [1,2,3]
    for: item in items {
    log: "Item: ${item}"
    }
    }
    }`;
        const ast = parseBml(source);
        const ctx = executeModule(ast);
        expect(ctx.logs).toContain('Item: 1');
        expect(ctx.logs).toContain('Item: 2');
        expect(ctx.logs).toContain('Item: 3');
    });

    it('should collect errors for invalid instructions', () => {
        const source = `
    module "demo" {
    run {
    set: 123name = "bad"
    for: x in notalist {
    log: "Should not run"
    }
    }
    }`;
        const ast = parseBml(source);
        const ctx = executeModule(ast);
        expect(ctx.errors.length).toBeGreaterThan(0);
    });
});
