/* eslint-disable @typescript-eslint/no-unused-vars */
// Utility functions for BML

/**
 * Interpolates variables in a string (e.g., "Hello, ${name}!")
 */
export function interpolate(
    str: string,
    variables: Record<string, string | number | boolean>,
): string {
    return str.replace(/\$\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g, (_, v) => String(variables[v] ?? ''));
}

/**
 * Validates BML AST structure
 */
export function validateModule(module: object): boolean {
    // TODO: Implement validation logic
    return true;
}
