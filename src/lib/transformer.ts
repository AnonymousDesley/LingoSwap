
import j from 'jscodeshift';
import fs from 'fs';
import path from 'path';

// Mock en.json loader
function loadTranslations(cwd: string): Record<string, string> {
    const enPath = path.join(cwd, 'en.json');
    if (fs.existsSync(enPath)) {
        return JSON.parse(fs.readFileSync(enPath, 'utf8'));
    }
    return {};
}

// Analysis result type
export interface AnalysisResult {
    hasLegacy: boolean;
    legacyCount: number;
    conflicts: string[];
}

// Helper to analyze before transform
export function analyze(source: string): AnalysisResult {
    const hasUseTranslation = source.includes('useTranslation');
    const hasTrans = source.includes('<Trans');
    const hasTCall = /t\(['"]/.test(source);

    const conflicts = [];
    if (source.includes('i18next.t(')) conflicts.push('Direct i18next usage detected');

    return {
        hasLegacy: hasUseTranslation || hasTrans || hasTCall,
        legacyCount: (source.match(/t\(/g) || []).length + (source.match(/<Trans/g) || []).length,
        conflicts
    };
}

export default function transformer(file: any, api: any, options: any) {
    const j = api.jscodeshift;
    const root = j(file.source);
    const translations = loadTranslations(process.cwd());

    // 1. Remove useTranslation hooks and imports
    root.find(j.ImportDeclaration, {
        source: { value: 'react-i18next' }
    }).forEach((path: any) => {
        j(path).remove();
    });

    root.find(j.VariableDeclaration).filter((path: any) => {
        return path.node.declarations.some((decl: any) =>
            decl.init &&
            decl.init.type === 'CallExpression' &&
            decl.init.callee.name === 'useTranslation'
        );
    }).remove();

    // 2. Transform t('key') -> "value"
    root.find(j.CallExpression, {
        callee: { name: 't' }
    }).replaceWith((path: any) => {
        const args = path.node.arguments;
        if (args.length > 0 && args[0].type === 'StringLiteral') {
            const key = args[0].value;
            const value = translations[key] || key;
            return j.stringLiteral(value);
        }
        return path.node;
    });

    // 3. Transform <Trans i18nKey="key" /> -> "value"
    root.find(j.JSXElement, {
        openingElement: {
            name: { name: 'Trans' }
        }
    }).replaceWith((path: any) => {
        const attributes = path.node.openingElement.attributes;
        if (!attributes) return path.node;

        const i18nKeyAttr: any = attributes.find((attr: any) => attr.name && attr.name.name === 'i18nKey');

        if (i18nKeyAttr && i18nKeyAttr.value && i18nKeyAttr.value.type === 'StringLiteral') {
            const key = i18nKeyAttr.value.value;
            const value = translations[key] || key;
            return j.stringLiteral(value);
        }
        return path.node;
    });

    return root.toSource();
}
