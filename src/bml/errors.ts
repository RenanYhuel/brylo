// BML Parser Error Classes

export type BmlErrorType =
    | 'ModuleDeclaration'
    | 'Metadata'
    | 'RunBlock'
    | 'Instruction'
    | 'Syntax'
    | 'Tokenization';

export interface BmlErrorContext {
    line: number;
    column?: number;
    code?: string;
    details?: string;
}

export class BmlParseError extends Error {
    readonly type: BmlErrorType;
    readonly context: BmlErrorContext;

    constructor(type: BmlErrorType, message: string, context: BmlErrorContext) {
        super(
            `[${type}] ${message} (line ${context.line}` +
                (context.column !== undefined ? `, col ${context.column}` : '') +
                (context.code ? `: ${context.code}` : '') +
                (context.details ? ` - ${context.details}` : '') +
                `)`,
        );
        this.type = type;
        this.context = context;
        Object.setPrototypeOf(this, BmlParseError.prototype);
    }
}
