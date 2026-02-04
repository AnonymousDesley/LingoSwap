
import fs from 'fs';
import path from 'path';

export function generateLingoConfig(cwd: string) {
    const lingoDir = path.join(cwd, '.lingo');
    if (!fs.existsSync(lingoDir)) {
        fs.mkdirSync(lingoDir, { recursive: true });
    }

    // Detect locales from public/locales or src/locales
    const possibleLocaleDirs = [
        path.join(cwd, 'public', 'locales'),
        path.join(cwd, 'src', 'locales'),
        path.join(cwd, 'locales')
    ];

    let detectedLocales: string[] = ['en']; // Default to en
    let defaultLocale = 'en';

    for (const dir of possibleLocaleDirs) {
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir);
            const locales = files
                .filter(f => fs.statSync(path.join(dir, f)).isDirectory() || (f.endsWith('.json') && !f.startsWith('.')))
                .map(f => f.replace('.json', '')); // simplified logic

            if (locales.length > 0) {
                detectedLocales = Array.from(new Set([...detectedLocales, ...locales]));
                break; // Stop at first valid dir found
            }
        }
    }

    const config = {
        locales: detectedLocales,
        defaultLocale: defaultLocale,
        sourceLocale: defaultLocale, // Assuming source is default
        // Add other lingo config defaults
        pseudoLocale: "pseudo",
        fallbackLocales: {
            "default": defaultLocale
        }
    };

    const configPath = path.join(lingoDir, 'i18n.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    return config;
}
