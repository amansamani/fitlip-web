/**
 * Next.js compiles CSS imports at build time; TypeScript never needs to
 * resolve them as modules. This shorthand ambient declaration silences
 * TS2882 ("Cannot find module or type declarations for side-effect
 * import") on lines like `import './globals.css'`.
 */
declare module '*.css';