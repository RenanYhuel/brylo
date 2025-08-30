import { BmlModule, BmlMetadata, BmlRunBlock, BmlInstruction, BmlValue } from './types';
import { validateModule } from './utils';
import { BmlParseError } from './errors';

/**
 * Tokenizes the BML source into lines, removing comments and trimming whitespace.
 */
function tokenize(source: string): string[] {
    const lines = source.split(/\r?\n/);
    return lines
        .map((line, idx) => {
            const clean = line.replace(/#.*|\/\/.*$/, '').trim();
            if (clean.length === 0) return '';
            // Detect invalid characters (non-ASCII, control chars)
            const invalidCharIdx = clean.search(/[^\x20-\x7E]/);
            if (invalidCharIdx !== -1) {
                throw new BmlParseError('Tokenization', 'Invalid character detected', {
                    line: idx + 1,
                    column: invalidCharIdx + 1,
                    code: clean,
                });
            }
            return clean;
        })
        .filter((line) => line.length > 0);
}

/**
 * Parses the metadata block (description, version, author, tags, ...)
 */
function parseMetadata(lines: string[]): BmlMetadata {
    const metadata: BmlMetadata = {};
    lines.forEach((line, idx) => {
        const match = line.match(/^([a-zA-Z_][a-zA-Z0-9_-]*):\s*(.+)$/);
        if (!match) {
            const column = line.indexOf(':') !== -1 ? line.indexOf(':') + 1 : undefined;
            throw new BmlParseError('Metadata', 'Invalid metadata line', {
                line: idx + 1,
                column,
                code: line,
            });
        }
        const key = match[1];
        let value: BmlValue = match[2];
        try {
            if (/^\[.*\]$/.test(value)) {
                value = JSON.parse(value.replace(/'/g, '"'));
            } else if (/^\{.*\}$/.test(value)) {
                value = JSON.parse(value.replace(/'/g, '"'));
            } else if (/^(true|false)$/.test(value)) {
                value = value === 'true';
            } else if (!isNaN(Number(value))) {
                value = Number(value);
            } else {
                value = value.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
            }
        } catch (e) {
            const column = line.indexOf(match[2]);
            throw new BmlParseError('Metadata', 'Failed to parse metadata value', {
                line: idx + 1,
                column,
                code: line,
                details: String(e),
            });
        }
        metadata[key] = value;
    });
    return metadata;
}

/**
 * Parses the run block and its instructions
 */
function parseRunBlock(lines: string[]): BmlRunBlock {
    const instructions: BmlInstruction[] = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        // log
        if (line.startsWith('log:')) {
            instructions.push({ type: 'log', value: line.slice(4).trim().replace(/^"|"$/g, '') });
            i++;
            continue;
        }
        // ask
        if (line.startsWith('ask:')) {
            const askMatch = line.match(/^ask:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\{/);
            if (askMatch) {
                const variable = askMatch[1];
                let question = '';
                let valueType: 'string' | 'number' | 'bool' | undefined = undefined;
                let defaultValue: BmlValue | undefined = undefined;
                i++;
                while (i < lines.length && !lines[i].includes('}')) {
                    const qMatch = lines[i].match(/^question:\s*"(.+)"$/);
                    if (qMatch) question = qMatch[1];
                    const tMatch = lines[i].match(/^type:\s*(string|number|bool)$/);
                    if (tMatch) valueType = tMatch[1] as 'string' | 'number' | 'bool';
                    const dMatch = lines[i].match(/^default:\s*(.+)$/);
                    if (dMatch) {
                        if (valueType === 'bool') defaultValue = dMatch[1] === 'true';
                        else if (valueType === 'number') defaultValue = Number(dMatch[1]);
                        else defaultValue = dMatch[1].replace(/^"|"$/g, '');
                    }
                    i++;
                }
                if (!valueType) {
                    throw new BmlParseError(
                        'Syntax',
                        `Missing type for variable '${variable}' in ask`,
                        { line: i + 1 },
                    );
                }
                instructions.push({
                    type: 'ask',
                    variable,
                    question,
                    valueType,
                    default: defaultValue,
                });
                i++; // skip closing }
                continue;
            }
        }
        // set
        if (line.startsWith('set:')) {
            // Syntaxe stricte : set: variable:type = value
            const setMatch = line.match(
                /^set:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:(string|number|bool|object|list)\s*=\s*(.+)$/,
            );
            if (!setMatch) {
                throw new BmlParseError(
                    'Syntax',
                    `Missing type for variable in set (expected set: variable:type = value)`,
                    { line: i + 1 },
                );
            }
            const variable = setMatch[1];
            const valueType = setMatch[2];
            const valueRaw: string = setMatch[3];
            let value: BmlValue = '';
            let valid = true;
            switch (valueType) {
                case 'string':
                    // Accept only quoted strings
                    if (/^".*"$/.test(valueRaw) || /^'.*'$/.test(valueRaw)) {
                        value = valueRaw.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
                    } else {
                        valid = false;
                    }
                    break;
                case 'number':
                    if (!isNaN(Number(valueRaw))) {
                        value = Number(valueRaw);
                    } else {
                        valid = false;
                    }
                    break;
                case 'bool':
                    if (valueRaw === 'true' || valueRaw === 'false') {
                        value = valueRaw === 'true';
                    } else {
                        valid = false;
                    }
                    break;
                case 'list':
                    try {
                        value = JSON.parse(valueRaw.replace(/'/g, '"'));
                        if (!Array.isArray(value)) valid = false;
                    } catch {
                        valid = false;
                    }
                    break;
                case 'object':
                    try {
                        value = JSON.parse(valueRaw.replace(/'/g, '"'));
                        if (typeof value !== 'object' || Array.isArray(value) || value === null)
                            valid = false;
                    } catch {
                        valid = false;
                    }
                    break;
                default:
                    valid = false;
            }
            if (!valid) {
                throw new BmlParseError(
                    'TypeError',
                    `Value '${valueRaw}' does not match type '${valueType}' in set (line ${i + 1})`,
                    { line: i + 1 },
                );
            }
            instructions.push({
                type: 'set',
                variable,
                value,
                valueType: valueType as 'string' | 'number' | 'object' | 'bool' | 'list',
            });
            i++;
            continue;
        }
        // exec
        if (line.startsWith('exec:')) {
            instructions.push({
                type: 'exec',
                command: line.slice(5).trim().replace(/^"|"$/g, ''),
            });
            i++;
            continue;
        }
        // if/else
        if (line.startsWith('if:')) {
            const ifMatch = line.match(/^if:\s*(.+?)\s*\{/);
            if (ifMatch) {
                const condition = ifMatch[1].trim();
                i++; // Move past the if line
                // Collect all remaining lines for this if/else block
                const blockLines: string[] = [];
                let braceCount = 1;
                let elseStartIndex = -1;
                // Collect all lines until we close the if block
                while (i < lines.length && braceCount > 0) {
                    const currentLine = lines[i];
                    if (currentLine.includes('{')) braceCount++;
                    if (currentLine.includes('}')) braceCount--;
                    // Track where else starts (at top level only)
                    if (
                        braceCount === 1 &&
                        (currentLine.trim() === '} else {' || currentLine.trim() === 'else {')
                    ) {
                        elseStartIndex = blockLines.length;
                    }
                    if (braceCount > 0) blockLines.push(currentLine);
                    i++;
                }
                // Split into then and else parts
                let thenLines: string[];
                let elseLines: string[] = [];
                if (elseStartIndex >= 0) {
                    thenLines = blockLines.slice(0, elseStartIndex);
                    elseLines = blockLines.slice(elseStartIndex + 1); // Skip the '} else {' or 'else {' line
                } else {
                    thenLines = blockLines;
                }
                const then = parseRunBlock(thenLines).instructions;
                const elseBlock =
                    elseLines.length > 0 ? parseRunBlock(elseLines).instructions : undefined;
                instructions.push({ type: 'if', condition, then, else: elseBlock });
                continue;
            }
        }
        // function
        const funcMatch = line.match(/^function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\{/);
        if (funcMatch) {
            const name = funcMatch[1];
            const body: BmlInstruction[] = [];
            i++;
            while (i < lines.length && !lines[i].includes('}')) {
                // Recursively parse inner instructions
                const inner = parseRunBlock([lines[i]]);
                body.push(...inner.instructions);
                i++;
            }
            instructions.push({ type: 'function', name, body });
            i++; // skip closing }
            continue;
        }
        // for
        if (line.startsWith('for:')) {
            const forMatch = line.match(
                /^for:\s*([a-zA-Z_][a-zA-Z0-9_]*)\s+in\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\{/,
            );
            if (forMatch) {
                const variable = forMatch[1];
                const iterable = forMatch[2];
                // Collect all lines inside the block, handling nested braces
                const bodyLines: string[] = [];
                i++;
                let braceCount = 1;
                while (i < lines.length && braceCount > 0) {
                    if (lines[i].includes('{')) braceCount++;
                    if (lines[i].includes('}')) braceCount--;
                    if (braceCount > 0) bodyLines.push(lines[i]);
                    i++;
                }
                const body = parseRunBlock(bodyLines).instructions;
                instructions.push({ type: 'for', variable, iterable, body });
                continue;
            }
        }
        // import
        if (line.startsWith('import:')) {
            instructions.push({ type: 'import', path: line.slice(7).trim().replace(/^"|"$/g, '') });
            i++;
            continue;
        }
        // Unknown line: skip
        i++;
    }
    return { instructions };
    // ...existing code...
    return { instructions };
}

/**
 * Main BML parser entry point
 */
export function parseBml(source: string): BmlModule {
    const lines = tokenize(source);
    // Find module declaration
    if (!lines[0].startsWith('module')) {
        throw new BmlParseError('ModuleDeclaration', 'BML must start with a module declaration', {
            line: 1,
            column: 1,
            code: lines[0],
        });
    }
    const moduleMatch = lines[0].match(/^module\s+"([^"]+)"\s*\{/);
    if (!moduleMatch) {
        const column = lines[0].indexOf('module');
        throw new BmlParseError('ModuleDeclaration', 'Invalid module declaration', {
            line: 1,
            column,
            code: lines[0],
        });
    }
    const name = moduleMatch[1];
    // Find closing '}' for module
    let moduleEnd = lines.length - 1;
    for (let i = 1; i < lines.length; i++) {
        if (lines[i] === '}') {
            moduleEnd = i;
            break;
        }
    }
    // Split metadata and run block
    let runStart = -1;
    for (let i = 1; i < moduleEnd; i++) {
        if (lines[i].startsWith('run {')) {
            runStart = i;
            break;
        }
    }
    if (runStart === -1) {
        throw new BmlParseError('RunBlock', 'No run block found', {
            line: moduleEnd,
            column: 1,
            code: lines[moduleEnd] ?? '',
        });
    }
    const metadataLines = lines.slice(1, runStart);
    const runLines: string[] = [];
    // Find closing '}' for run block
    for (let i = runStart + 1; i < moduleEnd; i++) {
        if (lines[i] === '}') {
            break;
        }
        runLines.push(lines[i]);
    }
    let metadata: BmlMetadata;
    let run: BmlRunBlock;
    try {
        metadata = parseMetadata(metadataLines);
    } catch (err) {
        if (err instanceof BmlParseError) throw err;
        throw new BmlParseError('Metadata', 'Unexpected error in metadata parsing', {
            line: 1,
            code: metadataLines.join('\n').slice(0, 100),
            details: String(err),
        });
    }
    try {
        run = parseRunBlock(runLines);
    } catch (err) {
        if (err instanceof BmlParseError) throw err;
        throw new BmlParseError('RunBlock', 'Unexpected error in run block parsing', {
            line: runStart + 1,
            code: runLines.join('\n').slice(0, 100),
            details: String(err),
        });
    }
    const module: BmlModule = { name, metadata, run };
    if (!validateModule(module)) {
        throw new BmlParseError('Syntax', 'Invalid BML module structure', {
            line: 1,
            column: 1,
            code: lines.join('\n').slice(0, 100),
        });
    }
    return module;
}
