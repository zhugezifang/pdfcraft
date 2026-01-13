/**
 * Tool content exports for all languages
 * Requirements: 3.1 - Multi-language support
 */

export { toolContentEn } from './en';
export { toolContentJa } from './ja';
export { toolContentKo } from './ko';
export { toolContentEs } from './es';
export { toolContentFr } from './fr';
export { toolContentDe } from './de';
export { toolContentZh } from './zh';
export { toolContentPt } from './pt';
export { toolContentTw } from './tw';

import { toolContentEn } from './en';
import { toolContentJa } from './ja';
import { toolContentKo } from './ko';
import { toolContentEs } from './es';
import { toolContentFr } from './fr';
import { toolContentDe } from './de';
import { toolContentZh } from './zh';
import { toolContentPt } from './pt';
import { toolContentTw } from './tw';
import { ToolContent } from '@/types/tool';

export type Locale = 'en' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'zh' | 'zh-TW' | 'pt';

/**
 * Get tool content for a specific locale
 * Falls back to English if translation not found
 * zh-TW falls back to zh (Simplified Chinese) if not found, then to English
 */
export function getToolContent(locale: Locale, toolId: string): ToolContent | undefined {
  const contentMap: Record<Locale, Record<string, ToolContent>> = {
    en: toolContentEn,
    ja: toolContentJa,
    ko: toolContentKo,
    es: toolContentEs,
    fr: toolContentFr,
    de: toolContentDe,
    zh: toolContentZh,
    'zh-TW': toolContentTw,
    pt: toolContentPt
  };

  const localeContent = contentMap[locale];
  if (localeContent && localeContent[toolId]) {
    return localeContent[toolId];
  }

  // For zh-TW, fallback to zh (Simplified Chinese) first
  if (locale === 'zh-TW') {
    const zhContent = contentMap.zh[toolId];
    if (zhContent) {
      return zhContent;
    }
  }

  // Fallback to English
  return toolContentEn[toolId];
}

