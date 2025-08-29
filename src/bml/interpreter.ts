/* eslint-disable @typescript-eslint/no-unused-vars */
// Brylo Module Language interpreter skeleton

import { BmlModule } from './types';

export interface InterpreterContext {
    variables: Record<string, unknown>;
    logs: string[];
}

/**
 * Executes a BmlModule AST.
 */
export function executeModule(module: BmlModule, context?: InterpreterContext): InterpreterContext {
    // TODO: Implement full interpreter (handle instructions, variables, functions, etc.)
    throw new Error('BML interpreter not implemented yet');
}
