import React, { useState, useMemo, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Copy, Check, Code2, RotateCcw, Wand2 } from 'lucide-react';
import { LineNumberedTextarea } from './LineNumberedTextarea';

/* ── Language definitions ── */
interface LangDef {
    id: string;
    label: string;
    ext: string;
    color: string;
    placeholder: string;
}

const LANGUAGES: LangDef[] = [
    { id: 'javascript', label: 'JavaScript', ext: '.js', color: 'bg-yellow-100 text-yellow-800 border-yellow-300', placeholder: 'function greet(name) {\n  console.log("Hello, " + name);\n}\n\ngreet("World");' },
    { id: 'typescript', label: 'TypeScript', ext: '.ts', color: 'bg-blue-100 text-blue-800 border-blue-300', placeholder: 'interface User {\n  name: string;\n  age: number;\n}\n\nfunction greet(user: User): string {\n  return `Hello ${user.name}`;\n}' },
    { id: 'json', label: 'JSON', ext: '.json', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', placeholder: '{\n  "name": "John",\n  "age": 30,\n  "items": [1, 2, 3]\n}' },
    { id: 'html', label: 'HTML', ext: '.html', color: 'bg-orange-100 text-orange-800 border-orange-300', placeholder: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>' },
    { id: 'css', label: 'CSS', ext: '.css', color: 'bg-purple-100 text-purple-800 border-purple-300', placeholder: '.container {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  background: #f0f0f0;\n}' },
    { id: 'xml', label: 'XML', ext: '.xml', color: 'bg-teal-100 text-teal-800 border-teal-300', placeholder: '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <item id="1">\n    <name>Example</name>\n  </item>\n</root>' },
    { id: 'python', label: 'Python', ext: '.py', color: 'bg-sky-100 text-sky-800 border-sky-300', placeholder: 'def greet(name):\n    print(f"Hello, {name}")\n\nclass User:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age' },
    { id: 'java', label: 'Java', ext: '.java', color: 'bg-red-100 text-red-800 border-red-300', placeholder: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World");\n    }\n}' },
    { id: 'c', label: 'C / C++', ext: '.c', color: 'bg-indigo-100 text-indigo-800 border-indigo-300', placeholder: '#include <stdio.h>\n\nint main() {\n    printf("Hello World\\n");\n    return 0;\n}' },
    { id: 'sql', label: 'SQL', ext: '.sql', color: 'bg-amber-100 text-amber-800 border-amber-300', placeholder: 'SELECT u.name, u.email\nFROM users u\nJOIN orders o ON o.user_id = u.id\nWHERE u.active = 1\nORDER BY u.name;' },
    { id: 'yaml', label: 'YAML', ext: '.yml', color: 'bg-pink-100 text-pink-800 border-pink-300', placeholder: 'server:\n  host: localhost\n  port: 8080\ndatabase:\n  name: myapp\n  user: admin' },
    { id: 'markdown', label: 'Markdown', ext: '.md', color: 'bg-slate-100 text-slate-800 border-slate-300', placeholder: '# Heading\n\n## Sub-heading\n\n- Item 1\n- Item 2\n\n```js\nconsole.log("hi");\n```' },
];

/* ── Diagnostic types ── */
interface Diagnostic {
    line: number;
    col?: number;
    severity: 'error' | 'warning' | 'info';
    message: string;
    rule?: string;
}

/* ── Smart Bracket Matcher ── */
function checkBrackets(code: string, pairs: [string, string, string][]): Diagnostic[] {
    const issues: Diagnostic[] = [];
    const stack: { char: string; matchClose: string; label: string; line: number; col: number }[] = [];
    let lineNum = 1, colNum = 1;
    let inString = false, stringChar = '', escaped = false;
    let inLineComment = false, inBlockComment = false;

    const openChars = new Set(pairs.map(p => p[0]));
    const closeChars = new Set(pairs.map(p => p[1]));
    const pairMap: Record<string, { close: string; label: string }> = {};
    const reversePairMap: Record<string, { open: string; label: string }> = {};
    for (const [o, c, l] of pairs) {
        pairMap[o] = { close: c, label: l };
        reversePairMap[c] = { open: o, label: l };
    }

    for (let i = 0; i < code.length; i++) {
        const ch = code[i];
        const next = code[i + 1] || '';

        if (ch === '\n') { lineNum++; colNum = 1; inLineComment = false; continue; }
        colNum++;

        if (escaped) { escaped = false; continue; }
        if (ch === '\\' && inString) { escaped = true; continue; }
        if (inLineComment) continue;
        if (inBlockComment) {
            if (ch === '*' && next === '/') { inBlockComment = false; i++; colNum++; }
            continue;
        }
        if (!inString && ch === '/' && next === '/') { inLineComment = true; continue; }
        if (!inString && ch === '/' && next === '*') { inBlockComment = true; i++; colNum++; continue; }

        if (!inString && (ch === '"' || ch === '\'' || ch === '`')) { inString = true; stringChar = ch; continue; }
        if (inString && ch === stringChar) { inString = false; continue; }
        if (inString) continue;

        if (openChars.has(ch)) {
            const p = pairMap[ch];
            stack.push({ char: ch, matchClose: p.close, label: p.label, line: lineNum, col: colNum - 1 });
        }
        if (closeChars.has(ch)) {
            const p = reversePairMap[ch];
            if (stack.length === 0 || stack[stack.length - 1].matchClose !== ch) {
                // Look for a matching open in the stack
                let found = false;
                for (let k = stack.length - 1; k >= 0; k--) {
                    if (stack[k].matchClose === ch) {
                        // Everything between k+1 and top is mismatched
                        for (let m = stack.length - 1; m > k; m--) {
                            const bad = stack[m];
                            issues.push({ line: bad.line, col: bad.col, severity: 'error', message: `Unclosed '${bad.char}' opened on line ${bad.line} — expected '${bad.matchClose}' before line ${lineNum}`, rule: 'bracket-match' });
                        }
                        stack.splice(k); // remove from k onwards
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    issues.push({ line: lineNum, col: colNum - 1, severity: 'error', message: `Unexpected closing '${ch}' on line ${lineNum} — no matching opening '${p.open}'`, rule: 'bracket-match' });
                }
            } else {
                stack.pop();
            }
        }
    }

    // Report any remaining unclosed brackets — point to the END of file
    const totalLines = code.split('\n').length;
    for (const s of stack) {
        issues.push({ line: s.line, col: s.col, severity: 'error', message: `Unclosed '${s.char}' opened on line ${s.line} — no matching '${s.matchClose}' found by end of file (line ${totalLines})`, rule: 'bracket-match' });
    }
    return issues;
}

const STANDARD_PAIRS: [string, string, string][] = [['(', ')', 'parenthesis'], ['{', '}', 'brace'], ['[', ']', 'bracket']];

/* ── JSON Validator ── */
function validateJSON(code: string): Diagnostic[] {
    try { JSON.parse(code); return []; }
    catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Invalid JSON';
        // Try to extract position and find the correct line
        const posMatch = msg.match(/position\s+(\d+)/i);
        const colMatch = msg.match(/column\s+(\d+)/i);
        const lineMatch = msg.match(/line\s+(\d+)/i);
        let line = 1, col: number | undefined;

        if (lineMatch) {
            line = parseInt(lineMatch[1]);
        } else if (posMatch) {
            const pos = parseInt(posMatch[1]);
            const before = code.substring(0, pos);
            line = before.split('\n').length;
            const lastNewline = before.lastIndexOf('\n');
            col = pos - lastNewline;
        }
        if (colMatch) col = parseInt(colMatch[1]);

        // Clean up the message
        let cleanMsg = msg.replace(/^(Unexpected token|Expected)/, (m) => m);
        cleanMsg = cleanMsg.replace(/in JSON at position \d+.*$/, '').trim();
        if (!cleanMsg) cleanMsg = msg;

        return [{ line, col, severity: 'error', message: `JSON Syntax Error: ${cleanMsg}`, rule: 'json-parse' }];
    }
}

/* ── XML Validator ── */
function validateXML(code: string): Diagnostic[] {
    const issues: Diagnostic[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(code, 'application/xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
        const text = parseError.textContent || 'XML parse error';
        const lineMatch = text.match(/line\s+(\d+)/i);
        const colMatch = text.match(/column\s+(\d+)/i);
        const line = lineMatch ? parseInt(lineMatch[1]) : 1;
        const col = colMatch ? parseInt(colMatch[1]) : undefined;
        // Simplify the error message
        let cleanMsg = text.split('\n')[0].replace(/^.*error[:\s]*/i, '').trim();
        if (!cleanMsg) cleanMsg = text.split('\n')[0];
        issues.push({ line, col, severity: 'error', message: cleanMsg, rule: 'xml-parse' });
    }
    issues.push(...checkBrackets(code, STANDARD_PAIRS));
    return issues;
}

/* ── HTML Validator ── */
function validateHTML(code: string): Diagnostic[] {
    const issues: Diagnostic[] = [];
    const voidElements = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
    const deprecatedTags = new Set(['font', 'center', 'marquee', 'blink', 'big', 'strike', 'tt', 'frame', 'frameset', 'noframes', 'applet']);
    const tagStack: { tag: string; line: number }[] = [];
    const lines = code.split('\n');
    const seenIds = new Map<string, number>();

    // Missing DOCTYPE
    if (code.trim().length > 0 && !/<!DOCTYPE/i.test(code) && /<html/i.test(code)) {
        issues.push({ line: 1, severity: 'warning', message: 'Missing <!DOCTYPE html> declaration at top of document', rule: 'html-doctype' });
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Opening tags
        const openMatches = [...line.matchAll(/<([a-zA-Z][\w-]*)\b[^>]*>/g)];
        for (const m of openMatches) {
            const tag = m[1].toLowerCase();

            // Deprecated tag
            if (deprecatedTags.has(tag)) {
                issues.push({ line: i + 1, severity: 'warning', message: `<${tag}> is deprecated — use CSS instead`, rule: 'html-deprecated' });
            }

            if (!voidElements.has(tag) && !m[0].includes('/>') && !m[0].startsWith('<!') && !m[0].startsWith('<?')) {
                tagStack.push({ tag, line: i + 1 });
            }
        }

        // Unquoted attributes  (e.g. <div class=foo>)
        const unquotedAttrs = [...line.matchAll(/<[a-zA-Z][\w-]*\s+([^>]*?)>/g)];
        for (const m of unquotedAttrs) {
            const attrStr = m[1];
            if (/\w+=(?!["'])\S+/.test(attrStr) && !/\w+=\{/.test(attrStr)) {
                issues.push({ line: i + 1, severity: 'warning', message: 'Unquoted attribute value — use quotes around attribute values', rule: 'html-unquoted-attr' });
            }
        }

        // Duplicate IDs
        const idMatches = [...line.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)];
        for (const m of idMatches) {
            const id = m[1];
            if (seenIds.has(id)) {
                issues.push({ line: i + 1, severity: 'error', message: `Duplicate id="${id}" — first used on line ${seenIds.get(id)}`, rule: 'html-dup-id' });
            } else {
                seenIds.set(id, i + 1);
            }
        }

        // Closing tags
        const closeMatches = [...line.matchAll(/<\/([a-zA-Z][\w-]*)>/g)];
        for (const m of closeMatches) {
            const tag = m[1].toLowerCase();
            if (tagStack.length > 0 && tagStack[tagStack.length - 1].tag === tag) {
                tagStack.pop();
            } else {
                let found = false;
                for (let k = tagStack.length - 1; k >= 0; k--) {
                    if (tagStack[k].tag === tag) {
                        for (let j = tagStack.length - 1; j > k; j--) {
                            issues.push({ line: tagStack[j].line, severity: 'error', message: `Unclosed <${tagStack[j].tag}> tag opened on line ${tagStack[j].line}`, rule: 'html-unclosed-tag' });
                        }
                        tagStack.splice(k);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    issues.push({ line: i + 1, severity: 'error', message: `Unexpected closing </${tag}> on line ${i + 1} — no matching opening tag`, rule: 'html-no-open' });
                }
            }
        }

        // Accessibility checks
        if (/<img\b/i.test(line) && !/alt\s*=/i.test(line)) {
            issues.push({ line: i + 1, severity: 'warning', message: '<img> missing alt attribute (accessibility)', rule: 'html-img-alt' });
        }
        if (/<a\b/i.test(line) && /href\s*=\s*["']#["']/i.test(line)) {
            issues.push({ line: i + 1, severity: 'info', message: '<a href="#"> — consider using a button or meaningful href', rule: 'html-empty-href' });
        }
        // Inline style warning
        if (/\bstyle\s*=\s*["']/i.test(line) && /<[a-zA-Z]/.test(line)) {
            issues.push({ line: i + 1, severity: 'info', message: 'Inline style detected — consider using CSS classes', rule: 'html-inline-style' });
        }
    }
    for (const u of tagStack) {
        issues.push({ line: u.line, severity: 'error', message: `Unclosed <${u.tag}> tag opened on line ${u.line} — never closed`, rule: 'html-unclosed-tag' });
    }
    return issues;
}

/* ── CSS Validator ── */
function validateCSS(code: string): Diagnostic[] {
    const issues: Diagnostic[] = [];
    issues.push(...checkBrackets(code, [['{', '}', 'brace']]));
    const lines = code.split('\n');
    let inBlock = false;
    let inBlockComment = false;
    let blockStartLine = 0;
    let blockProps: { name: string; line: number }[] = [];
    let blockContentFound = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Track block comments
        if (inBlockComment) {
            if (line.includes('*/')) inBlockComment = false;
            continue;
        }
        if (line.startsWith('/*')) {
            if (!line.includes('*/')) inBlockComment = true;
            continue;
        }
        if (!line || line.startsWith('//')) continue;

        if (line.includes('{')) {
            inBlock = true;
            blockStartLine = i + 1;
            blockProps = [];
            blockContentFound = false;
        }
        if (line.includes('}')) {
            // Empty rule check
            if (inBlock && !blockContentFound) {
                issues.push({ line: blockStartLine, severity: 'warning', message: 'Empty CSS rule — no declarations inside braces', rule: 'css-empty-rule' });
            }
            inBlock = false;
            continue;
        }

        if (inBlock && line.includes(':')) {
            blockContentFound = true;
            // Missing semicolon
            if (!line.endsWith(';') && !line.endsWith('{') && !line.endsWith(',') && !line.endsWith('*/')) {
                issues.push({ line: i + 1, severity: 'error', message: `Missing semicolon — property declaration must end with ';'`, rule: 'css-semicolon' });
            }

            // Extract property name for duplicate check
            const propMatch = line.match(/^\s*([\w-]+)\s*:/);
            if (propMatch) {
                const prop = propMatch[1].toLowerCase();
                const existing = blockProps.find(p => p.name === prop);
                if (existing) {
                    issues.push({ line: i + 1, severity: 'warning', message: `Duplicate property "${prop}" — already declared on line ${existing.line}`, rule: 'css-dup-prop' });
                }
                blockProps.push({ name: prop, line: i + 1 });
            }

            // !important warning
            if (/!important/i.test(line)) {
                issues.push({ line: i + 1, severity: 'info', message: '!important overrides specificity — use sparingly', rule: 'css-important' });
            }

            // Invalid hex color
            const hexMatch = line.match(/#([a-fA-F0-9]+)/);
            if (hexMatch && ![3, 4, 6, 8].includes(hexMatch[1].length)) {
                issues.push({ line: i + 1, severity: 'error', message: `Invalid hex color "#${hexMatch[1]}" — must be 3, 4, 6, or 8 hex digits`, rule: 'css-invalid-hex' });
            }
        }

        // Property without colon in block
        if (inBlock && !line.includes(':') && !line.includes('{') && !line.includes('}') && !line.startsWith('@') && !line.startsWith('.') && !line.startsWith('#') && !line.startsWith('&') && line.length > 1) {
            issues.push({ line: i + 1, severity: 'warning', message: `Invalid CSS — property declaration should contain ':'`, rule: 'css-invalid-prop' });
        }

        // Unclosed string
        const dq = (line.match(/"/g) || []).length;
        const sq = (line.match(/'/g) || []).length;
        if (dq % 2 !== 0) {
            issues.push({ line: i + 1, severity: 'error', message: 'Unclosed string in CSS — mismatched double quotes', rule: 'css-unclosed-string' });
        }
        if (sq % 2 !== 0) {
            issues.push({ line: i + 1, severity: 'error', message: 'Unclosed string in CSS — mismatched single quotes', rule: 'css-unclosed-string' });
        }
    }
    return issues;
}

/* ── Python Validator ── */
function validatePython(code: string): Diagnostic[] {
    const issues: Diagnostic[] = [];
    const lines = code.split('\n');
    let inMultilineStr = false;
    let prevNonEmptyIndent = 0;
    let expectIndentIncrease = false;

    for (let i = 0; i < lines.length; i++) {
        const raw = lines[i];
        const trimmed = raw.trimEnd();

        // Track triple-quote strings
        const tripleCount = (trimmed.match(/"""|'''/g) || []).length;
        if (tripleCount % 2 !== 0) inMultilineStr = !inMultilineStr;
        if (inMultilineStr) continue;
        if (!trimmed || trimmed.trimStart().startsWith('#')) continue;

        const indent = raw.length - raw.trimStart().length;

        // Check indentation consistency
        if (raw.includes('\t') && raw.match(/^ +/)) {
            issues.push({ line: i + 1, severity: 'error', message: 'Mixed tabs and spaces in indentation', rule: 'py-mixed-indent' });
        }

        // Check if indent increased when expected
        if (expectIndentIncrease && indent <= prevNonEmptyIndent) {
            issues.push({ line: i + 1, severity: 'error', message: `Expected indented block after line ${i} (block statement ending with ':')`, rule: 'py-expected-indent' });
        }

        // Block starters missing colon
        const blockPatterns = [
            /^(def\s+\w+\s*\([^)]*\)\s*(?:->.*)?)\s*$/,
            /^(class\s+\w+[^:]*)\s*$/,
            /^(if\s+.+)\s*$/,
            /^(elif\s+.+)\s*$/,
            /^(else)\s*$/,
            /^(for\s+.+)\s*$/,
            /^(while\s+.+)\s*$/,
            /^(try)\s*$/,
            /^(except[^:]*)\s*$/,
            /^(finally)\s*$/,
            /^(with\s+.+)\s*$/,
        ];

        const trimmedLine = trimmed.trimStart();
        for (const pattern of blockPatterns) {
            if (pattern.test(trimmedLine) && !trimmedLine.endsWith(':') && !trimmedLine.endsWith(':\\')) {
                issues.push({ line: i + 1, severity: 'error', message: `Missing colon ':' at end of block statement`, rule: 'py-missing-colon' });
                break;
            }
        }

        expectIndentIncrease = trimmedLine.endsWith(':');
        if (trimmedLine) prevNonEmptyIndent = indent;

        // Python 3: print must be function
        if (/\bprint\s+[^(=]/.test(trimmedLine) && !/\bprint\s*\(/.test(trimmedLine)) {
            issues.push({ line: i + 1, severity: 'error', message: "print is a function in Python 3 — use print(...)", rule: 'py-print-func' });
        }

        // Comparison to None/True/False using == instead of is
        if (/==\s*None\b/.test(trimmedLine) || /None\s*==/.test(trimmedLine)) {
            issues.push({ line: i + 1, severity: 'warning', message: 'Use "is None" instead of "== None" for identity comparison', rule: 'py-is-none' });
        }
        if (/!=\s*None\b/.test(trimmedLine) || /None\s*!=/.test(trimmedLine)) {
            issues.push({ line: i + 1, severity: 'warning', message: 'Use "is not None" instead of "!= None" for identity comparison', rule: 'py-is-none' });
        }
        if (/==\s*(True|False)\b/.test(trimmedLine)) {
            issues.push({ line: i + 1, severity: 'warning', message: 'Avoid "== True/False" — use the value directly in conditions', rule: 'py-bool-compare' });
        }

        // Bare except
        if (/^\s*except\s*:\s*$/.test(trimmedLine) || /^\s*except\s*:\s*#/.test(trimmedLine)) {
            issues.push({ line: i + 1, severity: 'warning', message: 'Bare "except:" catches all exceptions including SystemExit — use "except Exception:"', rule: 'py-bare-except' });
        }

        // Semicolon-separated statements
        if (/;\s*\w/.test(trimmedLine) && !/'.*?;.*?'/.test(trimmedLine) && !/".*?;.*?"/.test(trimmedLine)) {
            issues.push({ line: i + 1, severity: 'info', message: 'Multiple statements on one line (semicolon) — consider separate lines', rule: 'py-semicolon' });
        }

        // Unclosed string literal (single line, non-triple)
        const stripped = trimmedLine.replace(/\\['"]/g, '').replace(/""".*?"""/g, '').replace(/'''.*?'''/g, '');
        const dq = (stripped.match(/"/g) || []).length;
        const sq = (stripped.match(/'/g) || []).length;
        if (dq % 2 !== 0) {
            issues.push({ line: i + 1, severity: 'error', message: 'Unclosed string literal — mismatched double quotes', rule: 'py-unclosed-string' });
        }
        if (sq % 2 !== 0 && !/\w'\w/.test(stripped)) {
            issues.push({ line: i + 1, severity: 'error', message: 'Unclosed string literal — mismatched single quotes', rule: 'py-unclosed-string' });
        }

        // Dangling operator
        if (/[=<>!+\-*/]{1,2}\s*$/.test(trimmedLine) && !trimmedLine.endsWith(':') && !trimmedLine.endsWith(',') && !trimmedLine.endsWith('\\')) {
            issues.push({ line: i + 1, severity: 'error', message: 'Incomplete expression — dangling operator at end of line', rule: 'py-dangling-op' });
        }

        // Common typos
        const pythonKeywordTypos: [RegExp, string][] = [
            [/\bimprot\b/, 'Typo: "improt" → should be "import"'],
            [/\bfrom\s+\w+\s+improt\b/, 'Typo: "improt" → should be "import"'],
            [/\bretrun\b/, 'Typo: "retrun" → should be "return"'],
            [/\bflase\b/i, 'Typo: should be "False" (capital F)'],
            [/\btrue\b(?!,)/, 'Python uses "True" (capital T), not "true"'],
            [/\bfalse\b(?!,)/, 'Python uses "False" (capital F), not "false"'],
            [/\bnull\b/, 'Python uses "None", not "null"'],
            [/\bself\.\s/, '"self." should not have a space after the dot'],
            [/\bpritn\b/, 'Typo: "pritn" → should be "print"'],
            [/\bdefin\b/, 'Typo: "defin" → should be "def"'],
            [/\bwhlie\b/, 'Typo: "whlie" → should be "while"'],
            [/\beliif\b/, 'Typo: "eliif" → should be "elif"'],
        ];
        for (const [regex, msg] of pythonKeywordTypos) {
            if (regex.test(trimmedLine)) {
                issues.push({ line: i + 1, severity: 'error', message: msg, rule: 'py-typo' });
            }
        }
    }

    issues.push(...checkBrackets(code, [['(', ')', 'parenthesis'], ['[', ']', 'bracket'], ['{', '}', 'brace']]));
    return issues;
}

/* ── Java / C / C++ Validator ── */
function validateJavaOrC(code: string, lang: string): Diagnostic[] {
    const issues: Diagnostic[] = [];
    const lines = code.split('\n');
    let inBlockComment = false;

    issues.push(...checkBrackets(code, STANDARD_PAIRS));

    // Common Java typos
    const javaTypos: [RegExp, string][] = [
        [/\bSytsem\b/, 'Typo: "Sytsem" → should be "System"'],
        [/\bSystesm\b/, 'Typo: "Systesm" → should be "System"'],
        [/\bSysetm\b/, 'Typo: "Sysetm" → should be "System"'],
        [/\bSystme\b/, 'Typo: "Systme" → should be "System"'],
        [/\bSystem\.Out\b/, '"System.Out" → should be "System.out" (lowercase "out")'],
        [/\bSystem\.out\.Println\b/, '"Println" → should be "println" (lowercase)'],
        [/\bpublic\s+static\s+void\s+Main\b/, '"Main" → should be "main" (lowercase) for the entry point'],
        [/\bstring\b(?!\s*[.\[])/, lang === 'java' ? '"string" → Java uses "String" (capital S)' : ''],
        [/\bsytem\b/i, 'Typo: should be "System"'],
        [/\bprintlm\b/, 'Typo: "printlm" → should be "println"'],
        [/\bprintLn\b/, 'Typo: "printLn" → should be "println" (lowercase L)'],
        [/\bprinf\b/, 'Typo: "prinf" → should be "printf"'],
        [/\bretrun\b/, 'Typo: "retrun" → should be "return"'],
        [/\bvodi\b/, 'Typo: "vodi" → should be "void"'],
        [/\bViod\b/, 'Typo: "Viod" → should be "void"'],
        [/\bintegr\b/i, 'Typo: should be "int" or "Integer"'],
    ].filter(([, msg]) => msg !== '') as [RegExp, string][];

    const cTypos: [RegExp, string][] = [
        [/\bprinf\b/, 'Typo: "prinf" → should be "printf"'],
        [/\bpritf\b/, 'Typo: "pritf" → should be "printf"'],
        [/\bretrun\b/, 'Typo: "retrun" → should be "return"'],
        [/\binclude\s*<[^>]+>\s*;/, '#include should not end with semicolon'],
        [/\bvodi\b/, 'Typo: "vodi" → should be "void"'],
        [/\bmaloc\b/, 'Typo: "maloc" → should be "malloc"'],
    ];

    const typoList = lang === 'java' ? javaTypos : cTypos;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Track block comments
        if (inBlockComment) {
            if (trimmed.includes('*/')) inBlockComment = false;
            continue;
        }
        if (trimmed.startsWith('/*')) {
            if (!trimmed.includes('*/')) inBlockComment = true;
            continue;
        }
        if (trimmed.startsWith('//') || !trimmed || trimmed === '{' || trimmed === '}') continue;

        // Detect typos
        for (const [regex, msg] of typoList) {
            if (regex.test(trimmed)) {
                issues.push({ line: i + 1, severity: 'error', message: msg, rule: `${lang}-typo` });
            }
        }

        // Missing semicolons — smart detection
        // Lines that SHOULD end with semicolons: method calls, variable declarations, return statements, assignments, throw
        if (!trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}') && !trimmed.endsWith(':')
            && !trimmed.endsWith(',') && !trimmed.endsWith('(') && !trimmed.endsWith(')')
            && !trimmed.startsWith('#') && !trimmed.startsWith('@') && !trimmed.startsWith('/*') && !trimmed.endsWith('*/')
            && !trimmed.startsWith('if') && !trimmed.startsWith('} else') && !trimmed.startsWith('else')
            && !trimmed.startsWith('for') && !trimmed.startsWith('while') && !trimmed.startsWith('do')
            && !trimmed.startsWith('switch') && !trimmed.startsWith('case') && !trimmed.startsWith('default')
            && !trimmed.startsWith('try') && !trimmed.startsWith('catch') && !trimmed.startsWith('finally')
        ) {
            // Check if line looks like an executable statement
            const isMethodCall = /\.\w+\s*\([^)]*\)\s*$/.test(trimmed);
            const isAssignment = /[a-zA-Z_]\w*\s*[+\-*/]?=\s*.+$/.test(trimmed);
            const isVarDecl = /^(int|long|float|double|char|boolean|byte|short|String|var|auto|const)\s+\w+/.test(trimmed);
            const isReturn = /^\s*return\b/.test(trimmed);
            const isThrow = /^\s*throw\b/.test(trimmed);
            const isBreakContinue = /^\s*(break|continue)\s*$/.test(trimmed);

            if (isMethodCall || isAssignment || isVarDecl || isReturn || isThrow || isBreakContinue) {
                issues.push({ line: i + 1, severity: 'error', message: `Missing semicolon ';' at end of statement`, rule: `${lang}-semicolon` });
            }
        }
    }
    return issues;
}

/* ── SQL Validator ── */
function validateSQL(code: string): Diagnostic[] {
    const issues: Diagnostic[] = [];
    issues.push(...checkBrackets(code, [['(', ')', 'parenthesis']]));
    const upper = code.toUpperCase().replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    const lines = code.split('\n');

    // Check SELECT without FROM
    const selectCount = (upper.match(/\bSELECT\b/g) || []).length;
    const fromCount = (upper.match(/\bFROM\b/g) || []).length;
    if (selectCount > 0 && fromCount === 0) {
        issues.push({ line: 1, severity: 'error', message: 'SELECT statement without FROM clause', rule: 'sql-no-from' });
    }

    // Check FROM without SELECT (columns listed without SELECT keyword)
    if (fromCount > 0 && selectCount === 0) {
        issues.push({ line: 1, severity: 'error', message: 'FROM clause found without SELECT — missing SELECT keyword', rule: 'sql-no-select' });
    }

    // SQL keyword typos
    const sqlTypos: [RegExp, string, string][] = [
        [/\bSELECT\b/i, '', ''], // no-op anchor
        [/\bSELCT\b/i, 'Typo: "SELCT" → should be "SELECT"', 'sql-typo'],
        [/\bSELEET\b/i, 'Typo: "SELEET" → should be "SELECT"', 'sql-typo'],
        [/\bSELETC\b/i, 'Typo: "SELETC" → should be "SELECT"', 'sql-typo'],
        [/\bFORM\b(?!\s*\()/i, 'Typo: "FORM" → should be "FROM"', 'sql-typo'],
        [/\bFROM\b/i, '', ''], // no-op
        [/\bWHRE\b/i, 'Typo: "WHRE" → should be "WHERE"', 'sql-typo'],
        [/\bWEHRE\b/i, 'Typo: "WEHRE" → should be "WHERE"', 'sql-typo'],
        [/\bWHERE\b/i, '', ''],
        [/\bGROUP\s+BT\b/i, 'Typo: "GROUP BT" → should be "GROUP BY"', 'sql-typo'],
        [/\bORDER\s+BT\b/i, 'Typo: "ORDER BT" → should be "ORDER BY"', 'sql-typo'],
        [/\bINNER\s+JION\b/i, 'Typo: "JION" → should be "JOIN"', 'sql-typo'],
        [/\bLEFT\s+JION\b/i, 'Typo: "JION" → should be "JOIN"', 'sql-typo'],
        [/\bINSERT\s+ITNO\b/i, 'Typo: "ITNO" → should be "INTO"', 'sql-typo'],
        [/\bUPDATR\b/i, 'Typo: "UPDATR" → should be "UPDATE"', 'sql-typo'],
        [/\bDELETE\s+FORM\b/i, 'Typo: "FORM" → should be "FROM"', 'sql-typo'],
        [/\bVALUES\b/i, '', ''],
        [/\bVALUES\b/i, '', ''],
        [/\bADN\b/i, 'Typo: "ADN" → should be "AND"', 'sql-typo'],
        [/\bNULl\b/, 'Typo: "NULl" → should be "NULL"', 'sql-typo'],
    ];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('--')) continue;

        // SQL keyword typos
        for (const [regex, msg, rule] of sqlTypos) {
            if (msg && regex.test(trimmed)) {
                issues.push({ line: i + 1, severity: 'error', message: msg, rule });
            }
        }

        // SELECT * warning
        if (/\bSELECT\s+\*/i.test(trimmed)) {
            issues.push({ line: i + 1, severity: 'info', message: 'SELECT * — consider specifying column names for better performance', rule: 'sql-select-star' });
        }

        // WHERE 1=1
        if (/\bWHERE\s+1\s*=\s*1\b/i.test(trimmed)) {
            issues.push({ line: i + 1, severity: 'info', message: 'WHERE 1=1 is always true — may be a debugging leftover', rule: 'sql-where-true' });
        }

        // Dangling operator at end of line (=, >, <, AND, OR without value)
        if (/[=<>!]+\s*$/i.test(trimmed) && !trimmed.endsWith('*/')) {
            issues.push({ line: i + 1, severity: 'error', message: 'Incomplete expression — dangling operator at end of line', rule: 'sql-dangling-op' });
        }
        if (/\b(AND|OR)\s*$/i.test(trimmed)) {
            issues.push({ line: i + 1, severity: 'error', message: `Incomplete expression — "${trimmed.match(/\b(AND|OR)\s*$/i)?.[1]}" without right-hand condition`, rule: 'sql-dangling-op' });
        }

        // Unclosed string literal
        const singleQuotes = (trimmed.match(/'/g) || []).length;
        if (singleQuotes % 2 !== 0) {
            issues.push({ line: i + 1, severity: 'error', message: 'Unclosed string literal — mismatched single quotes', rule: 'sql-unclosed-string' });
        }

        // Missing comma between column names (e.g. "name email" without comma)
        if (/\bSELECT\b/i.test(trimmed)) {
            // Check if SELECT line has multiple words without commas
            const afterSelect = trimmed.replace(/^\s*SELECT\s+(DISTINCT\s+)?/i, '');
            if (afterSelect && !afterSelect.includes(',') && afterSelect.split(/\s+/).length > 2 && !afterSelect.includes('*') && !/\bFROM\b/i.test(afterSelect)) {
                issues.push({ line: i + 1, severity: 'warning', message: 'Multiple column names without commas — may be missing commas between columns', rule: 'sql-missing-comma' });
            }
        }

        // Subquery may be missing an alias
        if (/\)\s+(?:WHERE|GROUP|ORDER|HAVING|LIMIT)\b/i.test(trimmed)) {
            issues.push({ line: i + 1, severity: 'warning', message: 'Subquery may be missing an alias', rule: 'sql-subquery-alias' });
        }

        // JOIN without ON
        if (/\bJOIN\b/i.test(trimmed) && !/\bON\b/i.test(trimmed)) {
            // Check next line too
            const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
            if (!/\bON\b/i.test(nextLine)) {
                issues.push({ line: i + 1, severity: 'warning', message: 'JOIN without ON clause — missing join condition', rule: 'sql-join-no-on' });
            }
        }
    }

    // Check if the entire statement is missing a semicolon at the end
    const lastNonEmpty = lines.map(l => l.trim()).filter(l => l && !l.startsWith('--')).pop();
    if (lastNonEmpty && !lastNonEmpty.endsWith(';') && lines.length > 1) {
        issues.push({ line: lines.length, severity: 'warning', message: 'SQL statement missing trailing semicolon', rule: 'sql-semicolon' });
    }

    return issues;
}

/* ── YAML Validator ── */
function validateYAML(code: string): Diagnostic[] {
    const issues: Diagnostic[] = [];
    const lines = code.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        if (line.includes('\t')) {
            issues.push({ line: i + 1, severity: 'error', message: 'YAML does not allow tabs — use spaces for indentation', rule: 'yaml-no-tabs' });
        }

        // Inconsistent indentation
        const indent = line.length - line.trimStart().length;
        if (indent > 0 && indent % 2 !== 0) {
            issues.push({ line: i + 1, severity: 'warning', message: `Odd indentation (${indent} spaces) — YAML typically uses 2-space indentation`, rule: 'yaml-indent' });
        }

        // Missing value after colon
        if (/^[^#]*:\s*$/.test(line) && i + 1 < lines.length) {
            const nextLine = lines[i + 1];
            const nextIndent = nextLine.length - nextLine.trimStart().length;
            if (nextLine.trim() && nextIndent <= indent && !nextLine.trim().startsWith('-') && !nextLine.trim().startsWith('#')) {
                issues.push({ line: i + 1, severity: 'warning', message: 'Empty value after colon — expected indented block or value', rule: 'yaml-empty-value' });
            }
        }

        // Unclosed quotes
        const dq = (trimmed.match(/"/g) || []).length;
        const sq = (trimmed.replace(/\w'\w/g, '').match(/'/g) || []).length;
        if (dq % 2 !== 0) {
            issues.push({ line: i + 1, severity: 'error', message: 'Unclosed double quote in YAML value', rule: 'yaml-unclosed-quote' });
        }
        if (sq % 2 !== 0) {
            issues.push({ line: i + 1, severity: 'error', message: 'Unclosed single quote in YAML value', rule: 'yaml-unclosed-quote' });
        }

        // Boolean value warnings (yes/no/on/off are booleans in YAML 1.1)
        if (/:\s+(yes|no|on|off)\s*$/i.test(line)) {
            const val = line.match(/:\s+(yes|no|on|off)\s*$/i)?.[1];
            issues.push({ line: i + 1, severity: 'info', message: `"${val}" is treated as a boolean in YAML 1.1 — quote it if you mean a string`, rule: 'yaml-bool-value' });
        }

        // Key with no colon (likely invalid YAML line)
        if (!trimmed.startsWith('-') && !trimmed.includes(':') && !trimmed.startsWith('[') && !trimmed.startsWith('{') && indent === 0 && trimmed.length > 0) {
            issues.push({ line: i + 1, severity: 'error', message: 'Invalid YAML — top-level entry should be a key: value pair', rule: 'yaml-invalid-entry' });
        }

        // Duplicate keys at same level
        if (!trimmed.startsWith('-')) {
            const colonIdx = line.indexOf(':');
            if (colonIdx > 0) {
                const key = line.substring(0, colonIdx).trim();
                for (let j = i + 1; j < lines.length; j++) {
                    const other = lines[j];
                    const otherIndent = other.length - other.trimStart().length;
                    if (otherIndent < indent && other.trim()) break;
                    if (otherIndent === indent && other.trim().startsWith(key + ':')) {
                        issues.push({ line: j + 1, severity: 'error', message: `Duplicate key "${key}" — first defined on line ${i + 1}`, rule: 'yaml-dup-key' });
                        break;
                    }
                }
            }
        }
    }
    return issues;
}

/* ── JavaScript / TypeScript Validator ── */
function validateJS(code: string, isTS = false): Diagnostic[] {
    const issues: Diagnostic[] = [];
    issues.push(...checkBrackets(code, STANDARD_PAIRS));

    const lines = code.split('\n');
    let inBlockComment = false;
    let inTemplateLiteral = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        if (inBlockComment) {
            if (trimmed.includes('*/')) inBlockComment = false;
            continue;
        }
        if (trimmed.startsWith('/*')) {
            if (!trimmed.includes('*/')) inBlockComment = true;
            continue;
        }
        if (trimmed.startsWith('//') || !trimmed) continue;

        // Track template literals (basic)
        const backtickCount = (trimmed.match(/`/g) || []).length;
        if (backtickCount % 2 !== 0) inTemplateLiteral = !inTemplateLiteral;
        if (inTemplateLiteral) continue;

        // Unclosed string literal
        const dblQuotes = (trimmed.replace(/\\"/g, '').match(/"/g) || []).length;
        const sglQuotes = (trimmed.replace(/\\'/g, '').match(/'/g) || []).length;
        if (dblQuotes % 2 !== 0) {
            issues.push({ line: i + 1, severity: 'error', message: 'Unclosed string literal — mismatched double quotes', rule: 'js-unclosed-string' });
        }
        if (sglQuotes % 2 !== 0 && !/\w'\w/.test(trimmed)) {
            issues.push({ line: i + 1, severity: 'error', message: 'Unclosed string literal — mismatched single quotes', rule: 'js-unclosed-string' });
        }

        // var usage
        if (/\bvar\s+\w/.test(trimmed)) {
            issues.push({ line: i + 1, severity: 'warning', message: 'Use "let" or "const" instead of "var" (block scoping)', rule: 'js-no-var' });
        }
        // Loose equality
        if (/[^=!]==[^=]/.test(trimmed)) {
            issues.push({ line: i + 1, severity: 'warning', message: 'Use "===" instead of "==" for strict equality comparison', rule: 'js-eqeqeq' });
        }
        if (/!=[^=]/.test(trimmed) && !/!=={1}/.test(trimmed)) {
            issues.push({ line: i + 1, severity: 'warning', message: 'Use "!==" instead of "!=" for strict inequality comparison', rule: 'js-eqeqeq' });
        }
        // console.log
        if (/\bconsole\.(log|warn|error|info|debug)\b/.test(trimmed)) {
            issues.push({ line: i + 1, severity: 'info', message: 'console statement detected — remove before production deployment', rule: 'js-no-console' });
        }
        // alert
        if (/\balert\s*\(/.test(trimmed)) {
            issues.push({ line: i + 1, severity: 'warning', message: 'alert() blocks UI thread — avoid in production code', rule: 'js-no-alert' });
        }

        // Missing semicolons for statements
        if (!trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}')
            && !trimmed.endsWith(',') && !trimmed.endsWith('(') && !trimmed.endsWith(':')
            && !trimmed.startsWith('if') && !trimmed.startsWith('} else') && !trimmed.startsWith('else')
            && !trimmed.startsWith('for') && !trimmed.startsWith('while') && !trimmed.startsWith('do')
            && !trimmed.startsWith('switch') && !trimmed.startsWith('case') && !trimmed.startsWith('default')
            && !trimmed.startsWith('try') && !trimmed.startsWith('catch') && !trimmed.startsWith('finally')
            && !trimmed.startsWith('class ') && !trimmed.startsWith('function ')
            && !trimmed.startsWith('import ') && !trimmed.startsWith('export ')
            && !trimmed.endsWith('=>')
        ) {
            const isMethodCall = /\.\w+\s*\([^)]*\)\s*$/.test(trimmed);
            const isAssignment = /[a-zA-Z_]\w*\s*[+\-*/]?=\s*.+$/.test(trimmed);
            const isVarDecl = /^(let|const|var)\s+\w+/.test(trimmed);
            const isReturn = /^\s*return\b/.test(trimmed);
            const isThrow = /^\s*throw\b/.test(trimmed);
            const isBreakContinue = /^\s*(break|continue)\s*$/.test(trimmed);
            if (isMethodCall || isAssignment || isVarDecl || isReturn || isThrow || isBreakContinue) {
                issues.push({ line: i + 1, severity: 'warning', message: 'Missing semicolon at end of statement', rule: 'js-semicolon' });
            }
        }

        // Dangling operator at end of line
        if (/[+\-*/=<>!&|]{1,3}\s*$/.test(trimmed) && !trimmed.endsWith('=>') && !trimmed.endsWith('*/') && !trimmed.endsWith('{') && !/\bcase\b/.test(trimmed)) {
            const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
            if (nextLine && !nextLine.startsWith('//') && !nextLine.startsWith('/*') && !nextLine.startsWith('.') && !nextLine.startsWith('?')) {
                // Allow chaining and ternary, but flag dangling = or == or ===
                if (/[=<>!]+\s*$/.test(trimmed)) {
                    issues.push({ line: i + 1, severity: 'error', message: 'Incomplete expression — dangling operator at end of line', rule: 'js-dangling-op' });
                }
            }
        }

        // Common typos
        const jsTypos: [RegExp, string][] = [
            [/\bfunciton\b/, 'Typo: "funciton" → "function"'],
            [/\bfuntion\b/, 'Typo: "funtion" → "function"'],
            [/\bretrun\b/, 'Typo: "retrun" → "return"'],
            [/\bundifined\b/, 'Typo: "undifined" → "undefined"'],
            [/\blenght\b/, 'Typo: "lenght" → "length"'],
            [/\bdocument\.getElementByid\b/, 'Typo: "getElementByid" → "getElementById"'],
            [/\bdocument\.getElementByID\b/, 'Typo: "getElementByID" → "getElementById"'],
            [/\.addEventListner\b/, 'Typo: "addEventListner" → "addEventListener"'],
            [/\.toLowercase\b/, 'Typo: "toLowercase" → "toLowerCase"'],
            [/\.toUppercase\b/, 'Typo: "toUppercase" → "toUpperCase"'],
            [/\bparseint\b(?!.*=)/, 'Typo: "parseint" → "parseInt" (capital I)'],
            [/\bparsefloat\b(?!.*=)/, 'Typo: "parsefloat" → "parseFloat" (capital F)'],
            [/\bSetTimeout\b/, 'Typo: "SetTimeout" → "setTimeout" (lowercase s)'],
            [/\bSetInterval\b/, 'Typo: "SetInterval" → "setInterval" (lowercase s)'],
            [/\bJSOn\b/, 'Typo: "JSOn" → "JSON"'],
            [/\bconts\b/, 'Typo: "conts" → "const"'],
            [/\bNaN\b\s*===?\s*\bNaN\b/, 'NaN === NaN is always false — use Number.isNaN()'],
            [/\btypeof\s+\w+\s*===?\s*"null"/, 'typeof does not return "null" — use x === null'],
        ];
        for (const [regex, msg] of jsTypos) {
            if (regex.test(trimmed)) {
                issues.push({ line: i + 1, severity: 'error', message: msg, rule: 'js-typo' });
            }
        }

        // TypeScript-specific
        if (isTS) {
            if (/:\s*any\b/.test(trimmed)) {
                issues.push({ line: i + 1, severity: 'info', message: 'Type "any" avoids type checking — consider using a specific type', rule: 'ts-no-any' });
            }
            if (/\bas\s+any\b/.test(trimmed)) {
                issues.push({ line: i + 1, severity: 'warning', message: '"as any" bypasses type safety — use proper type assertions', rule: 'ts-no-any' });
            }
            if (/\b@ts-ignore\b/.test(trimmed)) {
                issues.push({ line: i + 1, severity: 'warning', message: '@ts-ignore suppresses errors — use @ts-expect-error instead', rule: 'ts-no-ignore' });
            }
        }
    }
    return issues;
}

/* ── Markdown Validator ── */
function validateMarkdown(code: string): Diagnostic[] {
    const issues: Diagnostic[] = [];
    const lines = code.split('\n');
    let h1Count = 0;
    let inCodeBlock = false;
    let codeBlockStart = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Track code blocks
        if (/^```/.test(trimmed)) {
            if (inCodeBlock) {
                inCodeBlock = false;
            } else {
                inCodeBlock = true;
                codeBlockStart = i + 1;
            }
            continue;
        }
        if (inCodeBlock) continue;

        // H1 count
        if (/^# /.test(line)) {
            h1Count++;
            if (h1Count > 1) {
                issues.push({ line: i + 1, severity: 'warning', message: 'Multiple h1 headings — document should have a single top-level heading', rule: 'md-single-h1' });
            }
        }

        // Invalid heading level
        if (/^#{7,}/.test(line)) {
            issues.push({ line: i + 1, severity: 'error', message: 'Invalid heading — maximum heading depth is h6 (######)', rule: 'md-max-heading' });
        }

        // No space after # in heading
        if (/^#{1,6}[^ #\n]/.test(line)) {
            issues.push({ line: i + 1, severity: 'warning', message: 'Missing space after heading marker "#"', rule: 'md-heading-space' });
        }

        // Empty heading
        if (/^#{1,6}\s*$/.test(line)) {
            issues.push({ line: i + 1, severity: 'warning', message: 'Empty heading — heading has no content', rule: 'md-empty-heading' });
        }

        // Broken link syntax
        if (/\[.*\]\s+\(/.test(line)) {
            issues.push({ line: i + 1, severity: 'warning', message: 'Broken link — no space allowed between [text] and (url)', rule: 'md-broken-link' });
        }
        // Missing link URL
        if (/\[.+\]\(\s*\)/.test(line)) {
            issues.push({ line: i + 1, severity: 'warning', message: 'Link has empty URL — [text]()', rule: 'md-empty-link' });
        }

        // Unclosed emphasis (basic: odd number of * or _ not in code)
        const stars = (trimmed.match(/(?<![*\\])\*(?![*])/g) || []).length;
        if (stars % 2 !== 0 && !/^[*-]\s/.test(trimmed)) {
            issues.push({ line: i + 1, severity: 'warning', message: 'Possible unclosed emphasis (*) — mismatched asterisks', rule: 'md-unclosed-emphasis' });
        }

        // Trailing spaces (more than 2 is suspicious)
        if (/\s{3,}$/.test(line) && line.trim().length > 0) {
            issues.push({ line: i + 1, severity: 'info', message: 'Excessive trailing whitespace', rule: 'md-trailing-space' });
        }
    }

    // Unclosed code block
    if (inCodeBlock) {
        issues.push({ line: codeBlockStart, severity: 'error', message: `Unclosed code block — opened on line ${codeBlockStart} but never closed with \`\`\``, rule: 'md-unclosed-code' });
    }

    return issues;
}

/* ── Main validator ── */
function validate(code: string, lang: string): Diagnostic[] {
    if (!code.trim()) return [];
    switch (lang) {
        case 'json': return validateJSON(code);
        case 'xml': return validateXML(code);
        case 'html': return validateHTML(code);
        case 'css': return validateCSS(code);
        case 'python': return validatePython(code);
        case 'java': return validateJavaOrC(code, 'java');
        case 'c': return validateJavaOrC(code, 'c');
        case 'sql': return validateSQL(code);
        case 'yaml': return validateYAML(code);
        case 'javascript': return validateJS(code, false);
        case 'typescript': return validateJS(code, true);
        case 'markdown': return validateMarkdown(code);
        default: return checkBrackets(code, STANDARD_PAIRS);
    }
}

interface FixResult {
    code: string;
    fixCount: number;
    fixes: string[];
}

/* ══════════════════════════════════════════════════════════════
   DIAGNOSTIC-DRIVEN AUTO-CORRECT ENGINE
   Runs the validator → for each issue, applies a fix
   ══════════════════════════════════════════════════════════════ */

/** All known typo replacements across all languages */
const TYPO_FIXES: Record<string, [RegExp, string][]> = {
    java: [
        [/\bSytsem\b/g, 'System'], [/\bSystesm\b/g, 'System'], [/\bSysetm\b/g, 'System'],
        [/\bSystme\b/g, 'System'], [/\bsytem\b/gi, 'System'],
        [/\bSystem\.Out\b/g, 'System.out'], [/\bSystem\.out\.Println\b/g, 'System.out.println'],
        [/\bprintlm\b/g, 'println'], [/\bprintLn\b/g, 'println'],
        [/\bretrun\b/g, 'return'], [/\bvodi\b/g, 'void'], [/\bViod\b/g, 'void'],
        [/\bprinf\b/g, 'printf'], [/\bintegr\b/gi, 'int'],
        [/\bpublic\s+static\s+void\s+Main\b/g, 'public static void main'],
    ],
    c: [
        [/\bprinf\b/g, 'printf'], [/\bpritf\b/g, 'printf'],
        [/\bretrun\b/g, 'return'], [/\bvodi\b/g, 'void'],
        [/\bmaloc\b/g, 'malloc'],
    ],
    javascript: [
        [/\bfunciton\b/g, 'function'], [/\bfuntion\b/g, 'function'],
        [/\bretrun\b/g, 'return'], [/\bundifined\b/g, 'undefined'],
        [/\blenght\b/g, 'length'], [/\bconts\b/g, 'const'],
        [/\bparseint\b/g, 'parseInt'], [/\bparsefloat\b/g, 'parseFloat'],
        [/\bSetTimeout\b/g, 'setTimeout'], [/\bSetInterval\b/g, 'setInterval'],
        [/\bJSOn\b/g, 'JSON'],
        [/\.addEventListner\b/g, '.addEventListener'],
        [/\.toLowercase\b/g, '.toLowerCase'], [/\.toUppercase\b/g, '.toUpperCase'],
        [/\bdocument\.getElementByid\b/g, 'document.getElementById'],
        [/\bdocument\.getElementByID\b/g, 'document.getElementById'],
    ],
    python: [
        [/\bimprot\b/g, 'import'], [/\bretrun\b/g, 'return'],
        [/\btrue\b/g, 'True'], [/\bfalse\b/g, 'False'], [/\bnull\b/g, 'None'],
        [/\bpritn\b/g, 'print'], [/\bdefin\b/g, 'def'], [/\bwhlie\b/g, 'while'],
    ],
    sql: [
        [/\bSELCT\b/gi, 'SELECT'], [/\bSELEET\b/gi, 'SELECT'], [/\bSELETC\b/gi, 'SELECT'],
        [/\bFORM\b(?!\s*\()/gi, 'FROM'],
        [/\bWHRE\b/gi, 'WHERE'], [/\bWEHRE\b/gi, 'WHERE'],
        [/\bGROUP\s+BT\b/gi, 'GROUP BY'], [/\bORDER\s+BT\b/gi, 'ORDER BY'],
        [/\bINNER\s+JION\b/gi, 'INNER JOIN'], [/\bLEFT\s+JION\b/gi, 'LEFT JOIN'],
        [/\bINSERT\s+ITNO\b/gi, 'INSERT INTO'],
        [/\bUPDATR\b/gi, 'UPDATE'], [/\bADN\b/gi, 'AND'],
    ],
};
TYPO_FIXES['typescript'] = TYPO_FIXES['javascript'];

/** Fix unclosed brackets — compute what's missing and append */
function fixBrackets(code: string): { code: string; count: number; details: string[] } {
    const stack: string[] = [];
    let inString = false, stringChar = '', escaped = false;
    let inLineComment = false, inBlockComment = false;

    for (let i = 0; i < code.length; i++) {
        const ch = code[i];
        const next = code[i + 1] || '';
        if (ch === '\n') { inLineComment = false; continue; }
        if (escaped) { escaped = false; continue; }
        if (ch === '\\' && inString) { escaped = true; continue; }
        if (inLineComment) continue;
        if (inBlockComment) { if (ch === '*' && next === '/') { inBlockComment = false; i++; } continue; }
        if (!inString && ch === '/' && next === '/') { inLineComment = true; continue; }
        if (!inString && ch === '/' && next === '*') { inBlockComment = true; i++; continue; }
        if (!inString && ch === '#') { inLineComment = true; continue; }
        if (!inString && (ch === '"' || ch === '\'' || ch === '`')) { inString = true; stringChar = ch; continue; }
        if (inString && ch === stringChar) { inString = false; continue; }
        if (inString) continue;

        if (ch === '(') stack.push(')');
        else if (ch === '{') stack.push('}');
        else if (ch === '[') stack.push(']');
        else if (ch === ')' || ch === '}' || ch === ']') {
            if (stack.length > 0 && stack[stack.length - 1] === ch) stack.pop();
        }
    }

    if (stack.length > 0) {
        const closing = stack.reverse().join('');
        return { code: code.trimEnd() + '\n' + closing, count: stack.length, details: [`Added ${stack.length} missing closing bracket(s): ${closing}`] };
    }
    return { code, count: 0, details: [] };
}

/** JSON-specific auto-repair using JSON.parse error feedback loop */
function repairJSON(code: string): FixResult {
    let fixed = code;
    let fixCount = 0;
    const fixes: string[] = [];

    // 1. Single quotes → double quotes
    if (/'/.test(fixed)) {
        const replaced = fixed.replace(/'([^']*?)'/g, '"$1"');
        if (replaced !== fixed) { fixed = replaced; fixCount++; fixes.push('Replaced single quotes with double quotes'); }
    }

    // 2. Unquoted keys
    const uqBefore = fixed;
    fixed = fixed.replace(/([\{,]\s*)([a-zA-Z_]\w*)\s*:/g, '$1"$2":');
    if (fixed !== uqBefore) { fixCount++; fixes.push('Quoted unquoted keys'); }

    // 3. Missing commas — scan line by line
    const lines = fixed.split('\n');
    for (let i = 0; i < lines.length - 1; i++) {
        const cur = lines[i].trimEnd();
        const nxt = lines[i + 1].trim();
        if (!cur || !nxt) continue;
        const endsValue = /["'\d\w\]}\)]\s*$/.test(cur);
        const hasComma = /,\s*$/.test(cur);
        const endsOpen = /[\{\[,:]\s*$/.test(cur);
        const nxtKey = /^"/.test(nxt);
        const nxtClose = /^[\]}]/.test(nxt);
        if (endsValue && !hasComma && !endsOpen && (nxtKey || (!nxtClose && /^[\d\[{tfn"]/.test(nxt)))) {
            lines[i] = cur + ',';
            fixCount++; fixes.push(`Line ${i + 1}: Added missing comma`);
        }
    }
    fixed = lines.join('\n');

    // 4. Trailing commas
    const tcBefore = fixed;
    fixed = fixed.replace(/,(\s*[\]}])/g, '$1');
    if (fixed !== tcBefore) { fixCount++; fixes.push('Removed trailing commas'); }

    // 4.5 Bracket balancing — insert missing ] and } BEFORE error loop
    const balanceBrackets = (s: string): { result: string; count: number; details: string[] } => {
        const bracketStack: { ch: string; pos: number }[] = [];
        let inStr2 = false;
        const details: string[] = [];
        let count = 0;

        for (let i = 0; i < s.length; i++) {
            const ch = s[i];
            if (inStr2) { if (ch === '"' && s[i-1] !== '\\') inStr2 = false; continue; }
            if (ch === '"') { inStr2 = true; continue; }
            if (ch === '{' || ch === '[') bracketStack.push({ ch, pos: i });
            else if (ch === '}') {
                if (bracketStack.length > 0 && bracketStack[bracketStack.length - 1].ch === '{') {
                    bracketStack.pop();
                } else if (bracketStack.length > 0 && bracketStack[bracketStack.length - 1].ch === '[') {
                    // Found } but expected ] — insert ] before this }
                    s = s.substring(0, i) + ']' + s.substring(i);
                    bracketStack.pop();
                    count++; details.push(`Inserted missing ']' before '}' at position ${i}`);
                    i++; // skip the inserted char
                    // Now recheck — the } might match an outer {
                    if (bracketStack.length > 0 && bracketStack[bracketStack.length - 1].ch === '{') {
                        bracketStack.pop();
                    }
                }
            } else if (ch === ']') {
                if (bracketStack.length > 0 && bracketStack[bracketStack.length - 1].ch === '[') {
                    bracketStack.pop();
                } else if (bracketStack.length > 0 && bracketStack[bracketStack.length - 1].ch === '{') {
                    // Found ] but expected } — insert } before this ]
                    s = s.substring(0, i) + '}' + s.substring(i);
                    bracketStack.pop();
                    count++; details.push(`Inserted missing '}' before ']' at position ${i}`);
                    i++;
                    if (bracketStack.length > 0 && bracketStack[bracketStack.length - 1].ch === '[') {
                        bracketStack.pop();
                    }
                }
            }
        }
        // Any remaining unclosed brackets — append closing chars
        let appendChars = '';
        while (bracketStack.length > 0) {
            const top = bracketStack.pop()!;
            appendChars += top.ch === '[' ? ']' : '}';
        }
        if (appendChars) {
            const trimmed2 = s.trimEnd();
            const trailing2 = s.substring(trimmed2.length);
            s = trimmed2 + appendChars + trailing2;
            count += appendChars.length;
            details.push(`Appended missing closing bracket(s): ${appendChars}`);
        }
        return { result: s, count, details };
    };

    const balance = balanceBrackets(fixed);
    if (balance.count > 0) {
        fixed = balance.result;
        fixCount += balance.count;
        fixes.push(...balance.details);
    }

    // 5. Remove trailing commas AGAIN (bracket insertion may have created new ones)
    const tcBefore2 = fixed;
    fixed = fixed.replace(/,(\s*[\]}])/g, '$1');
    if (fixed !== tcBefore2) { fixCount++; fixes.push('Cleaned up trailing commas'); }

    // 6. Error-position repair loop (up to 8 iterations)
    for (let attempt = 0; attempt < 8; attempt++) {
        try { JSON.parse(fixed); fixes.push('✓ JSON is now valid'); return { code: fixed, fixCount, fixes }; }
        catch (e: unknown) {
            const msg = e instanceof Error ? e.message : '';
            const posMatch = msg.match(/position\s+(\d+)/i);
            if (!posMatch) break;
            const pos = parseInt(posMatch[1]);
            const charAtPos = pos < fixed.length ? fixed[pos] : '';

            // Smart fix based on what's at the error position
            if (msg.includes("']'") && charAtPos === '}') {
                // Expected ] but got } — insert ] before }
                fixed = fixed.substring(0, pos) + ']' + fixed.substring(pos);
                fixCount++; fixes.push(`Inserted ']' before '}' at position ${pos}`);
            } else if (msg.includes("'}'") && charAtPos === ']') {
                // Expected } but got ] — insert } before ]
                fixed = fixed.substring(0, pos) + '}' + fixed.substring(pos);
                fixCount++; fixes.push(`Inserted '}' before ']' at position ${pos}`);
            } else if (msg.includes("Expected ','") && !msg.includes("']'") && !msg.includes("'}'")) {
                // Truly missing comma
                let insertAt = pos;
                for (let j = pos - 1; j >= 0; j--) {
                    if (fixed[j] === '\n' || fixed[j] === '\r') { insertAt = j; break; }
                    if (fixed[j] !== ' ' && fixed[j] !== '\t') { insertAt = j + 1; break; }
                }
                fixed = fixed.substring(0, insertAt) + ',' + fixed.substring(insertAt);
                fixCount++; fixes.push(`Inserted missing comma at position ${insertAt}`);
            } else if (msg.includes("Expected ':'")) {
                fixed = fixed.substring(0, pos) + ':' + fixed.substring(pos);
                fixCount++; fixes.push(`Inserted missing ':' at position ${pos}`);
            } else if (msg.includes("Unexpected token")) {
                fixed = fixed.substring(0, pos) + fixed.substring(pos + 1);
                fixCount++; fixes.push(`Removed unexpected character at position ${pos}`);
            } else if (msg.includes("Unterminated string")) {
                // Find the unclosed quote and close it
                let quotePos = pos;
                for (let j = pos; j >= 0; j--) {
                    if (fixed[j] === '"') { quotePos = j; break; }
                }
                // Find end of line and insert closing quote
                let eol = fixed.indexOf('\n', quotePos);
                if (eol === -1) eol = fixed.length;
                fixed = fixed.substring(0, eol) + '"' + fixed.substring(eol);
                fixCount++; fixes.push(`Closed unterminated string at position ${eol}`);
            } else {
                break;
            }
        }
    }

    // Final check
    try { JSON.parse(fixed); fixes.push('✓ JSON is now valid'); } catch { /* still broken but we tried */ }
    return { code: fixed, fixCount, fixes };
}

/** Main auto-correct: run validator → fix each issue → repeat */
function autoCorrect(code: string, lang: string): FixResult {
    if (!code.trim()) return { code, fixCount: 0, fixes: [] };

    // JSON has its own specialized repair engine
    if (lang === 'json') return repairJSON(code);

    let fixed = code;
    let totalFixes = 0;
    const allFixes: string[] = [];

    // Run up to 3 correction passes (fixes may reveal new fixable issues)
    for (let pass = 0; pass < 3; pass++) {
        const diagnostics = validate(fixed, lang);
        if (diagnostics.length === 0) break;

        const lines = fixed.split('\n');
        let fixedThisPass = 0;

        // Apply typo fixes for this language
        const typos = TYPO_FIXES[lang] || [];
        if (typos.length > 0) {
            for (let i = 0; i < lines.length; i++) {
                for (const [regex, replacement] of typos) {
                    const before = lines[i];
                    lines[i] = lines[i].replace(regex, replacement);
                    if (lines[i] !== before) {
                        fixedThisPass++; allFixes.push(`Line ${i + 1}: Fixed typo → "${replacement}"`);
                    }
                }
            }
        }

        // Process each diagnostic and apply the appropriate fix
        // Process in reverse line order so line numbers stay valid
        const sortedDiags = [...diagnostics].sort((a, b) => b.line - a.line);

        for (const diag of sortedDiags) {
            const lineIdx = diag.line - 1;
            if (lineIdx < 0 || lineIdx >= lines.length) continue;
            const line = lines[lineIdx];
            const trimmed = line.trim();

            switch (diag.rule) {
                // ── Semicolons (Java, C, CSS, JS) ──
                case 'java-semicolon':
                case 'c-semicolon':
                case 'css-semicolon':
                case 'js-semicolon':
                case 'sql-semicolon': {
                    if (!trimmed.endsWith(';')) {
                        lines[lineIdx] = line.trimEnd() + ';';
                        fixedThisPass++; allFixes.push(`Line ${diag.line}: Added semicolon ';'`);
                    }
                    break;
                }

                // ── Python missing colon ──
                case 'py-missing-colon': {
                    if (!trimmed.endsWith(':')) {
                        lines[lineIdx] = line.trimEnd() + ':';
                        fixedThisPass++; allFixes.push(`Line ${diag.line}: Added colon ':'`);
                    }
                    break;
                }

                // ── Python print as function ──
                case 'py-print-func': {
                    lines[lineIdx] = line.replace(/\bprint\s+(.+)$/, 'print($1)');
                    fixedThisPass++; allFixes.push(`Line ${diag.line}: Converted print to function`);
                    break;
                }

                // ── Python typos ──
                case 'py-typo': {
                    // Already handled by typoFixes above
                    break;
                }

                // ── JavaScript: var → let ──
                case 'js-no-var': {
                    lines[lineIdx] = line.replace(/\bvar\s/, 'let ');
                    fixedThisPass++; allFixes.push(`Line ${diag.line}: "var" → "let"`);
                    break;
                }

                // ── JavaScript: == → === ──
                case 'js-eqeqeq': {
                    if (/[^=!]==[^=]/.test(lines[lineIdx])) {
                        lines[lineIdx] = lines[lineIdx].replace(/([^=!])={2}([^=])/g, '$1===$2');
                        fixedThisPass++; allFixes.push(`Line ${diag.line}: "==" → "==="`);
                    }
                    if (/!=[^=]/.test(lines[lineIdx]) && !/!=={1}/.test(lines[lineIdx])) {
                        lines[lineIdx] = lines[lineIdx].replace(/!=([^=])/g, '!==$1');
                        fixedThisPass++; allFixes.push(`Line ${diag.line}: "!=" → "!=="`);
                    }
                    break;
                }

                // ── YAML tabs ──
                case 'yaml-no-tabs': {
                    lines[lineIdx] = line.replace(/\t/g, '  ');
                    fixedThisPass++; allFixes.push(`Line ${diag.line}: Tabs → spaces`);
                    break;
                }

                // ── HTML img alt ──
                case 'html-img-alt': {
                    lines[lineIdx] = line.replace(/(<img\b[^>]*)(\/?>)/i, '$1 alt=""$2');
                    fixedThisPass++; allFixes.push(`Line ${diag.line}: Added alt="" to <img>`);
                    break;
                }

                // ── HTML unclosed tags ──
                case 'html-unclosed-tag': {
                    const tagMatch = diag.message.match(/<(\w+)>/);
                    if (tagMatch) {
                        const tag = tagMatch[1];
                        // Append closing tag at end of the line or after content
                        lines[lineIdx] = line.trimEnd() + `</${tag}>`;
                        fixedThisPass++; allFixes.push(`Line ${diag.line}: Added </${tag}>`);
                    }
                    break;
                }

                // ── Markdown heading space ──
                case 'md-heading-space': {
                    lines[lineIdx] = line.replace(/^(#{1,6})([^ #])/, '$1 $2');
                    fixedThisPass++; allFixes.push(`Line ${diag.line}: Added space after #`);
                    break;
                }

                // ── Java/C typos ──
                case 'java-typo':
                case 'c-typo':
                case 'js-typo': {
                    // Already handled above
                    break;
                }

                default:
                    // Skip non-fixable rules (info, advisory)
                    break;
            }
        }

        fixed = lines.join('\n');

        // Fix brackets (works for all languages)
        const bracketFix = fixBrackets(fixed);
        if (bracketFix.count > 0) {
            fixed = bracketFix.code;
            fixedThisPass += bracketFix.count;
            allFixes.push(...bracketFix.details);
        }

        totalFixes += fixedThisPass;
        if (fixedThisPass === 0) break; // No more fixes possible
    }

    return { code: fixed, fixCount: totalFixes, fixes: allFixes };
}

/* ── Component ── */
export const CodeSyntaxChecker: React.FC = () => {
    const [lang, setLang] = useState('javascript');
    const [code, setCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [lastFix, setLastFix] = useState<FixResult | null>(null);
    const [showFixDetails, setShowFixDetails] = useState(false);

    const activeLang = LANGUAGES.find(l => l.id === lang)!;

    const diagnostics = useMemo(() => validate(code, lang), [code, lang]);

    const errors = diagnostics.filter(d => d.severity === 'error');
    const warnings = diagnostics.filter(d => d.severity === 'warning');
    const infos = diagnostics.filter(d => d.severity === 'info');

    const stats = useMemo(() => {
        if (!code.trim()) return null;
        const lines = code.split('\n');
        const nonEmpty = lines.filter(l => l.trim().length > 0).length;
        return { lines: lines.length, nonEmpty, chars: code.length, bytes: new Blob([code]).size };
    }, [code]);

    const handleCopy = useCallback(async () => {
        if (!code) return;
        await navigator.clipboard.writeText(code);
        setCopied(true); setTimeout(() => setCopied(false), 1500);
    }, [code]);

    const loadSample = useCallback(() => {
        setCode(activeLang.placeholder);
        setLastFix(null);
    }, [activeLang]);

    const handleAutoCorrect = useCallback(() => {
        const result = autoCorrect(code, lang);
        if (result.fixCount > 0) {
            setCode(result.code);
            setLastFix(result);
            setShowFixDetails(true);
            setTimeout(() => setLastFix(null), 8000);
        } else {
            setLastFix({ code: code, fixCount: 0, fixes: ['No auto-fixable issues found'] });
            setTimeout(() => setLastFix(null), 3000);
        }
    }, [code, lang]);

    const sevIcon = (s: string) => {
        if (s === 'error') return <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />;
        if (s === 'warning') return <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
        return <AlertTriangle className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
    };

    const sevBg = (s: string) => {
        if (s === 'error') return 'bg-red-50 border-red-200 text-red-800';
        if (s === 'warning') return 'bg-amber-50 border-amber-200 text-amber-800';
        return 'bg-blue-50 border-blue-200 text-blue-700';
    };

    return (
        <div className="p-4 max-w-5xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center text-cyan-600 border border-cyan-200">
                    <Code2 size={22} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-800">Code Syntax Checker</h2>
                    <p className="text-xs text-slate-500">Validate syntax, detect typos, check best practices — 12 languages supported</p>
                </div>
            </div>

            {/* Language Selector */}
            <div className="flex flex-wrap gap-1.5">
                {LANGUAGES.map(l => (
                    <button key={l.id} onClick={() => { setLang(l.id); setCode(''); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${lang === l.id
                            ? l.color + ' shadow-sm ring-1 ring-offset-1 ring-slate-300'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}>
                        {l.label}
                    </button>
                ))}
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
                <button onClick={loadSample}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200 transition-colors">
                    🧪 Load Sample
                </button>
                <button onClick={() => { setCode(''); setLastFix(null); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center gap-1 transition-colors">
                    <RotateCcw className="w-3 h-3" /> Clear
                </button>
                {diagnostics.length > 0 && (
                    <button onClick={handleAutoCorrect}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1.5 transition-all hover:shadow-sm">
                        <Wand2 className="w-3.5 h-3.5" /> Auto Correct
                    </button>
                )}
                <button onClick={handleCopy} disabled={!code}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-40 flex items-center gap-1 transition-colors ml-auto">
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>

            {/* Auto-Correct Result Banner */}
            {lastFix && (
                <div className={`rounded-xl border p-3 transition-all ${lastFix.fixCount > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Wand2 className={`w-4 h-4 ${lastFix.fixCount > 0 ? 'text-emerald-500' : 'text-slate-400'}`} />
                            <span className={`text-xs font-bold ${lastFix.fixCount > 0 ? 'text-emerald-700' : 'text-slate-600'}`}>
                                {lastFix.fixCount > 0
                                    ? `✨ Auto-corrected ${lastFix.fixCount} issue${lastFix.fixCount > 1 ? 's' : ''}!`
                                    : 'No auto-fixable issues found'
                                }
                            </span>
                        </div>
                        {lastFix.fixCount > 0 && (
                            <button onClick={() => setShowFixDetails(!showFixDetails)}
                                className="text-[10px] font-bold text-emerald-600 hover:text-emerald-800 transition-colors">
                                {showFixDetails ? 'Hide details' : 'Show details'}
                            </button>
                        )}
                    </div>
                    {showFixDetails && lastFix.fixCount > 0 && (
                        <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                            {lastFix.fixes.map((f, i) => (
                                <div key={i} className="text-[10px] text-emerald-700 flex items-center gap-1.5">
                                    <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Code Input */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700">
                        Code <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ml-2 border ${activeLang.color}`}>{activeLang.label} {activeLang.ext}</span>
                    </label>
                    {stats && (
                        <span className="text-[10px] text-slate-400">
                            {stats.lines} lines · {stats.nonEmpty} non-empty · {stats.bytes.toLocaleString()} bytes
                        </span>
                    )}
                </div>
                <LineNumberedTextarea
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder={`Paste or type your ${activeLang.label} code here...`}
                    className="w-full h-56 border-none rounded-none focus:ring-0 resize-y font-mono text-xs"
                    containerClassName="focus-within:ring-cyan-500/20"
                    spellCheck={false}
                />
            </div>

            {/* Status Badge */}
            {code.trim() && (
                <div className={`rounded-xl border p-3.5 flex items-center justify-between ${
                    errors.length > 0
                        ? 'bg-red-50 border-red-200'
                        : warnings.length > 0
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-green-50 border-green-200'
                }`}>
                    <div className="flex items-center gap-3">
                        {errors.length > 0 ? (
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                <XCircle className="w-5 h-5 text-red-500" />
                            </div>
                        ) : warnings.length > 0 ? (
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </div>
                        )}
                        <div>
                            <span className={`text-sm font-bold ${
                                errors.length > 0 ? 'text-red-700' : warnings.length > 0 ? 'text-amber-700' : 'text-green-700'
                            }`}>
                                {errors.length > 0
                                    ? `${errors.length} error${errors.length > 1 ? 's' : ''} found`
                                    : warnings.length > 0
                                        ? `No errors — ${warnings.length} warning${warnings.length > 1 ? 's' : ''}`
                                        : 'No issues found ✨'
                                }
                            </span>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                                {diagnostics.length === 0 ? 'Code looks clean!' : `${errors.length} errors · ${warnings.length} warnings · ${infos.length} suggestions`}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Diagnostics List */}
            {diagnostics.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-700 mb-3">Diagnostics ({diagnostics.length})</h3>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                        {diagnostics.map((d, i) => (
                            <div key={i} className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border text-xs ${sevBg(d.severity)}`}>
                                {sevIcon(d.severity)}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className="font-bold font-mono bg-white/60 px-1.5 py-0.5 rounded text-[10px]">
                                            Line {d.line}{d.col ? `:${d.col}` : ''}
                                        </span>
                                        {d.rule && (
                                            <span className="text-[10px] font-mono opacity-50">{d.rule}</span>
                                        )}
                                    </div>
                                    <span className="font-semibold">{d.message}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!code.trim() && (
                <div className="text-center py-10">
                    <Code2 className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm text-slate-400 font-semibold">Select a language and paste your code</p>
                    <p className="text-xs text-slate-300 mt-1">Checks brackets, syntax errors, typos, and best practices</p>
                    <button onClick={loadSample} className="mt-3 px-4 py-2 rounded-lg text-xs font-bold bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-colors">
                        Try with sample code
                    </button>
                </div>
            )}
        </div>
    );
};
