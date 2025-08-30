import {
    BmlModule,
    BmlInstruction,
    BmlLog,
    BmlAsk,
    BmlSet,
    BmlIf,
    BmlFunction,
    BmlCall,
    BmlExec,
    BmlFor,
    BmlImport,
    BmlValue,
} from './types';
import { BmlParseError } from './errors';

/**
 * InterpreterContext holds all runtime state for BML execution
 */
export interface InterpreterContext {
    variables: Record<string, BmlValue>;
    variableTypes: Record<string, string>;
    logs: string[];
    functions: Record<string, BmlFunction>;
    imports: string[];
    metadata?: Record<string, BmlValue>;
    errors: BmlParseError[];
}

function createDefaultContext(metadata?: Record<string, BmlValue>): InterpreterContext {
    return {
        variables: {},
        variableTypes: {},
        logs: [],
        functions: {},
        imports: [],
        metadata,
        errors: [],
    };
}

export function executeModule(module: BmlModule, context?: InterpreterContext): InterpreterContext {
    const ctx = context ?? createDefaultContext(module.metadata);
    // Register functions first
    for (const instr of module.run.instructions) {
        if (instr.type === 'function') {
            ctx.functions[instr.name] = instr;
        }
    }
    // Execute instructions
    for (const instr of module.run.instructions) {
        if (instr.type !== 'function') {
            try {
                executeInstruction(instr, ctx);
            } catch (err) {
                if (err instanceof BmlParseError) {
                    ctx.errors.push(err);
                } else {
                    ctx.errors.push(
                        new BmlParseError('Instruction', 'Runtime error', {
                            line: 0,
                            details: String(err),
                        }),
                    );
                }
            }
        }
    }
    return ctx;
}

function executeInstruction(instr: BmlInstruction, ctx: InterpreterContext): void {
    switch (instr.type) {
        case 'log':
            executeLog(instr, ctx);
            break;
        case 'ask':
            executeAsk(instr, ctx);
            break;
        case 'set':
            executeSet(instr, ctx);
            break;
        case 'exec':
            executeExec(instr, ctx);
            break;
        case 'call':
            executeCall(instr, ctx);
            break;
        case 'function':
            // Functions are registered, not executed directly
            break;
        case 'for':
            executeFor(instr, ctx);
            break;
        case 'if':
            executeIf(instr, ctx);
            break;
        case 'import':
            executeImport(instr, ctx);
            break;
        default: {
            // Ultra typé: on tente d'afficher le type si présent, sinon 'unknown'
            const type =
                typeof (instr as { type?: string }).type === 'string'
                    ? (instr as { type: string }).type
                    : 'unknown';
            throw new BmlParseError('Instruction', `Unknown instruction type: ${type}`, {
                line: 0,
            });
        }
    }
}

import { interpolate } from './utils';
function executeLog(instr: BmlLog, ctx: InterpreterContext): void {
    // Interpolate variables in log message
    const msg = interpolate(
        instr.value,
        ctx.variables as Record<string, string | number | boolean>,
    );
    ctx.logs.push(msg);
}

function executeAsk(instr: BmlAsk, ctx: InterpreterContext): void {
    // Interpolate variables in question
    const question = interpolate(
        instr.question,
        ctx.variables as Record<string, string | number | boolean>,
    );
    let value: BmlValue = instr.default ?? '';
    if (instr.valueType === 'number' && typeof value !== 'number') value = Number(value) || 0;
    if (instr.valueType === 'bool' && typeof value !== 'boolean') value = value === 'true';
    // Typage strict
    const expectedType = instr.valueType ?? typeof value;
    if (typeof value !== expectedType && !(expectedType === 'bool' && typeof value === 'boolean')) {
        ctx.errors.push(
            new BmlParseError(
                'TypeError',
                `Type mismatch for variable ${instr.variable}: expected ${expectedType}, got ${typeof value}`,
                { line: 0 },
            ),
        );
    }
    ctx.variables[instr.variable] = value;
    ctx.variableTypes[instr.variable] = expectedType;
    ctx.logs.push(`Asked: ${question} -> ${value}`);
}

function executeSet(instr: BmlSet, ctx: InterpreterContext): void {
    // Validate variable name
    if (!/^([a-zA-Z_][a-zA-Z0-9_]*)$/.test(instr.variable)) {
        throw new BmlParseError('Instruction', `Invalid variable name: ${instr.variable}`, {
            line: 0,
        });
    }
    // Typage strict
    const expectedType = instr.valueType;
    let actualType: string = typeof instr.value;
    if (Array.isArray(instr.value)) actualType = 'list';
    else if (actualType === 'object') actualType = 'object';
    if (expectedType !== actualType && !(expectedType === 'bool' && actualType === 'boolean')) {
        ctx.errors.push(
            new BmlParseError(
                'TypeError',
                `Type mismatch for variable ${instr.variable}: expected ${expectedType}, got ${actualType}`,
                { line: 0 },
            ),
        );
    }
    ctx.variables[instr.variable] = instr.value;
    ctx.variableTypes[instr.variable] = expectedType;
    ctx.logs.push(`Set: ${instr.variable} = ${JSON.stringify(instr.value)}`);
}

function executeExec(instr: BmlExec, ctx: InterpreterContext): void {
    // Interpolate variables in command
    const cmd = interpolate(
        instr.command,
        ctx.variables as Record<string, string | number | boolean>,
    );
    ctx.logs.push(`Exec: ${cmd}`);
}

function executeCall(instr: BmlCall, ctx: InterpreterContext): void {
    const fn = ctx.functions[instr.functionName];
    if (!fn) {
        throw new BmlParseError('Instruction', `Function not found: ${instr.functionName}`, {
            line: 0,
        });
    }
    try {
        for (const inner of fn.body) {
            executeInstruction(inner, ctx);
        }
        ctx.logs.push(`Called function: ${instr.functionName}`);
    } catch (err) {
        if (err instanceof BmlParseError) {
            ctx.errors.push(err);
        } else {
            ctx.errors.push(
                new BmlParseError('Instruction', 'Runtime error in function', {
                    line: 0,
                    details: String(err),
                }),
            );
        }
    }
}

function executeFor(instr: BmlFor, ctx: InterpreterContext): void {
    const iterable = ctx.variables[instr.iterable];
    if (!Array.isArray(iterable)) {
        throw new BmlParseError(
            'Instruction',
            `For loop iterable is not a list: ${instr.iterable}`,
            {
                line: 0,
            },
        );
    }
    for (const item of iterable) {
        ctx.variables[instr.variable] = item;
        try {
            for (const inner of instr.body) {
                executeInstruction(inner, ctx);
            }
        } catch (err) {
            if (err instanceof BmlParseError) {
                ctx.errors.push(err);
            } else {
                ctx.errors.push(
                    new BmlParseError('Instruction', 'Runtime error in for loop', {
                        line: 0,
                        details: String(err),
                    }),
                );
            }
        }
    }
    // Ne logge plus le for loop ici, les logs sont générés par les instructions internes
}

function executeIf(instr: BmlIf, ctx: InterpreterContext): void {
    // Évalue la condition : supporte les expressions simples (==, !=, >, <, >=, <=)
    let cond = false;
    const condStr = instr.condition.trim();
    // Expression regex: x > 3, x == 2, etc
    const exprMatch = condStr.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
    if (exprMatch) {
        const left = exprMatch[1];
        const op = exprMatch[2];
        let right: string | number | boolean = exprMatch[3];
        const leftVal = ctx.variables[left];
        // Try to parse right as number or boolean
        if (right === 'true') right = true;
        else if (right === 'false') right = false;
        else if (!isNaN(Number(right))) right = Number(right);
        // Compare
        switch (op) {
            case '==':
                cond = leftVal == right;
                break;
            case '!=':
                cond = leftVal != right;
                break;
            case '>':
                cond = leftVal > right;
                break;
            case '<':
                cond = leftVal < right;
                break;
            case '>=':
                cond = leftVal >= right;
                break;
            case '<=':
                cond = leftVal <= right;
                break;
        }
    } else if (condStr in ctx.variables) {
        cond = ctx.variables[condStr] === true || ctx.variables[condStr] === 'true';
    } else if (condStr === 'true') {
        cond = true;
    } else if (condStr === 'false') {
        cond = false;
    }
    try {
        if (cond) {
            for (const inner of instr.then) {
                executeInstruction(inner, ctx);
            }
        } else if (instr.else) {
            for (const inner of instr.else) {
                executeInstruction(inner, ctx);
            }
        }
    } catch (err) {
        if (err instanceof BmlParseError) {
            ctx.errors.push(err);
        } else {
            ctx.errors.push(
                new BmlParseError('Instruction', 'Runtime error in if block', {
                    line: 0,
                    details: String(err),
                }),
            );
        }
    }
}

function executeImport(instr: BmlImport, ctx: InterpreterContext): void {
    // Validate import path
    if (typeof instr.path !== 'string' || !instr.path.trim()) {
        throw new BmlParseError('Instruction', 'Invalid import path', { line: 0 });
    }
    ctx.imports.push(instr.path);
    ctx.logs.push(`Import: ${instr.path}`);
}
