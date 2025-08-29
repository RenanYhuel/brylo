// Brylo Module Language AST and types

export type BmlValue = string | number | boolean | BmlList | BmlObject;

export type BmlList = BmlValue[];
export interface BmlObject {
    [key: string]: BmlValue;
}

export type BmlMetadata = {
    [key: string]: BmlValue;
};

export type BmlInstruction =
    | BmlLog
    | BmlAsk
    | BmlSet
    | BmlIf
    | BmlFunction
    | BmlCall
    | BmlExec
    | BmlFor
    | BmlImport;

export interface BmlLog {
    type: 'log';
    value: string;
}

export interface BmlAsk {
    type: 'ask';
    variable: string;
    question: string;
    valueType?: 'string' | 'number' | 'bool';
    default?: BmlValue;
}

export interface BmlSet {
    type: 'set';
    variable: string;
    value: BmlValue;
}

export interface BmlIf {
    type: 'if';
    condition: string;
    then: BmlInstruction[];
    else?: BmlInstruction[];
}

export interface BmlFunction {
    type: 'function';
    name: string;
    body: BmlInstruction[];
}

export interface BmlCall {
    type: 'call';
    functionName: string;
}

export interface BmlExec {
    type: 'exec';
    command: string;
}

export interface BmlFor {
    type: 'for';
    variable: string;
    iterable: string;
    body: BmlInstruction[];
}

export interface BmlImport {
    type: 'import';
    path: string;
}

export interface BmlRunBlock {
    instructions: BmlInstruction[];
}

export interface BmlModule {
    name: string;
    metadata: BmlMetadata;
    run: BmlRunBlock;
}
