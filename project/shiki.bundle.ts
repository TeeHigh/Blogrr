/* Generate by @shikijs/codegen */
import type {
  DynamicImportLanguageRegistration,
  DynamicImportThemeRegistration,
  HighlighterGeneric,
} from '@shikijs/types'
import {
  createSingletonShorthands,
  createdBundledHighlighter,
} from '@shikijs/core'
import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript'

type BundledLanguage =
  | 'javascript'
  | 'js'
  | 'typescript'
  | 'ts'
  | 'python'
  | 'py'
  | 'shellscript'
  | 'bash'
  | 'sh'
  | 'shell'
  | 'zsh'
  | 'json'
  | 'html'
  | 'css'
type BundledTheme = 'github-dark' | 'github-light'
type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>

const bundledLanguages = {
  javascript: () => import('@shikijs/langs-precompiled/javascript'),
  js: () => import('@shikijs/langs-precompiled/javascript'),
  typescript: () => import('@shikijs/langs-precompiled/typescript'),
  ts: () => import('@shikijs/langs-precompiled/typescript'),
  python: () => import('@shikijs/langs-precompiled/python'),
  py: () => import('@shikijs/langs-precompiled/python'),
  shellscript: () => import('@shikijs/langs-precompiled/shellscript'),
  bash: () => import('@shikijs/langs-precompiled/shellscript'),
  sh: () => import('@shikijs/langs-precompiled/shellscript'),
  shell: () => import('@shikijs/langs-precompiled/shellscript'),
  zsh: () => import('@shikijs/langs-precompiled/shellscript'),
  json: () => import('@shikijs/langs-precompiled/json'),
  html: () => import('@shikijs/langs-precompiled/html'),
  css: () => import('@shikijs/langs-precompiled/css'),
} as Record<BundledLanguage, DynamicImportLanguageRegistration>

const bundledThemes = {
  'github-dark': () => import('@shikijs/themes/github-dark'),
  'github-light': () => import('@shikijs/themes/github-light'),
} as Record<BundledTheme, DynamicImportThemeRegistration>

const createHighlighter = /* @__PURE__ */ createdBundledHighlighter<
  BundledLanguage,
  BundledTheme
>({
  langs: bundledLanguages,
  themes: bundledThemes,
  engine: () => createJavaScriptRegexEngine(),
})

const {
  codeToHtml,
  codeToHast,
  codeToTokensBase,
  codeToTokens,
  codeToTokensWithThemes,
  getSingletonHighlighter,
  getLastGrammarState,
} = /* @__PURE__ */ createSingletonShorthands<BundledLanguage, BundledTheme>(
  createHighlighter,
)

export {
  bundledLanguages,
  bundledThemes,
  codeToHast,
  codeToHtml,
  codeToTokens,
  codeToTokensBase,
  codeToTokensWithThemes,
  createHighlighter,
  getLastGrammarState,
  getSingletonHighlighter,
}
export type { BundledLanguage, BundledTheme, Highlighter }
