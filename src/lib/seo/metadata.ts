/**
 * SEO Metadata Generation Utilities
 * Provides functions for generating meta tags, Open Graph, and Twitter Card data
 * 
 * @module lib/seo/metadata
 */

import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { type Locale, localeConfig } from '@/lib/i18n/config';
import type { Tool, ToolContent } from '@/types/tool';

/**
 * Base metadata configuration
 */
export interface BaseMetadataOptions {
  locale: Locale;
  path?: string;
}

/**
 * Page-specific metadata options
 */
export interface PageMetadataOptions extends BaseMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
}

/**
 * Tool page metadata options
 */
export interface ToolMetadataOptions extends BaseMetadataOptions {
  tool: Tool;
  content: ToolContent;
}

/**
 * Generate the canonical URL for a page
 */
export function getCanonicalUrl(locale: Locale, path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}/${locale}${cleanPath}`;
}

/**
 * Generate alternate language URLs for hreflang tags
 */
export function getAlternateUrls(path: string = ''): Record<string, string> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const alternates: Record<string, string> = {};

  const locales: Locale[] = ['en', 'ja', 'ko', 'es', 'fr', 'de', 'zh', 'zh-TW', 'pt'];
  for (const locale of locales) {
    alternates[locale] = `${siteConfig.url}/${locale}${cleanPath}`;
  }

  // Add x-default pointing to English
  alternates['x-default'] = `${siteConfig.url}/en${cleanPath}`;

  return alternates;
}

/**
 * Generate base metadata for any page
 */
export function generateBaseMetadata(options: PageMetadataOptions): Metadata {
  const { locale, path = '', title, description, keywords = [], image, noIndex = false } = options;

  const fullTitle = title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`;

  const canonicalUrl = getCanonicalUrl(locale, path);
  const ogImage = image || siteConfig.ogImage;
  const ogLocale = getOpenGraphLocale(locale);

  // Ensure description is optimal length (150-160 characters)
  const optimizedDescription = description.length > 160
    ? description.substring(0, 157) + '...'
    : description;

  return {
    title: fullTitle,
    description: optimizedDescription,
    keywords: [...new Set([...keywords, 'PDF', 'PDF tools', 'free', 'online', siteConfig.name])],
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    publisher: siteConfig.name,
    robots: noIndex
      ? { index: false, follow: false }
      : {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    icons: {
      icon: '/favicon.svg',
      shortcut: '/favicon.svg',
      apple: '/favicon.svg',
    },
    alternates: {
      canonical: canonicalUrl,
      languages: getAlternateUrls(path),
    },
    openGraph: {
      type: 'website',
      locale: ogLocale,
      url: canonicalUrl,
      title: fullTitle,
      description: optimizedDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${siteConfig.url}${ogImage}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: optimizedDescription,
      images: [ogImage.startsWith('http') ? ogImage : `${siteConfig.url}${ogImage}`],
      creator: siteConfig.creator,
    },
    verification: {
      // Add verification tags if needed
      // google: 'google-site-verification-code',
      // yandex: 'yandex-verification-code',
    },
    category: 'technology',
  };
}

/**
 * Generate metadata for tool pages
 */
export function generateToolMetadata(options: ToolMetadataOptions): Metadata {
  const { locale, tool, content } = options;
  const path = `/tools/${tool.slug}`;

  // Enhance keywords with common PDF-related terms
  const enhancedKeywords = [
    ...content.keywords,
    'free',
    'online',
    'no registration',
    'browser-based',
    'secure',
    'private',
  ];

  return generateBaseMetadata({
    locale,
    path,
    title: content.title,
    description: content.metaDescription,
    keywords: enhancedKeywords,
  });
}

/**
 * Homepage metadata translations
 */
const homeMetadataTranslations: Record<Locale, { title: string; description: string }> = {
  en: {
    title: `${siteConfig.name} - Free Online PDF Tools`,
    description: 'Free Online PDF Tools - Merge, split, compress, convert, and edit PDF files online without uploading to servers.',
  },
  ja: {
    title: `${siteConfig.name} - 無料オンラインPDFツール`,
    description: '無料オンラインPDFツール - マージ、分割、圧縮、変換、PDFファイルをオンラインで編集してサーバーにアップロードしない',
  },
  ko: {
    title: `${siteConfig.name} - 무료 온라인 PDF 도구`,
    description: '무료 온라인 PDF 도구 - 파일을 서버에 업로드하지 않고 온라인으로 PDF 파일을 병합, 분할, 압축, 변환 및 편집할 수 있습니다.',
  },
  es: {
    title: `${siteConfig.name} - Herramientas PDF en línea`,
    description: 'Herramientas PDF en línea - Gratis y Privadas',
  },
  fr: {
    title: `${siteConfig.name} - Outils PDF en ligne`,
    description: 'Outils PDF en ligne - Gratuits et Privés',
  },
  de: {
    title: `${siteConfig.name} - Kostenlose Online-PDF-Tools`,
    description: 'Kostenlose Online-PDF-Tools - Zusammenführen, teilen, komprimieren, konvertieren und bearbeiten PDF-Dateien online ohne hochladen zu Servern',
  },
  zh: {
    title: `${siteConfig.name} - 免费在线 PDF 工具`,
    description: '免费在线 PDF 工具 - 合并、分割、压缩、转换和编辑 PDF',
  },
  'zh-TW': {
    title: `${siteConfig.name} - 免費線上 PDF 工具`,
    description: '免費線上 PDF 工具 - 合併、分割、壓縮、轉換和編輯 PDF 文件，無需上傳到伺服器',
  },
  pt: {
    title: `${siteConfig.name} - Ferramentas PDF Online`,
    description: 'Ferramentas PDF em línea - Grátis e Privadas',
  },
};

/**
 * Generate metadata for the homepage
 */
export function generateHomeMetadata(locale: Locale): Metadata {
  const translations = homeMetadataTranslations[locale] || homeMetadataTranslations.en;
  
  return generateBaseMetadata({
    locale,
    path: '',
    title: translations.title,
    description: translations.description,
    keywords: ['PDF tools', 'merge PDF', 'split PDF', 'compress PDF', 'convert PDF', 'free PDF tools', 'online PDF editor'],
  });
}

/**
 * Generate metadata for the tools listing page
 */
export function generateToolsListMetadata(locale: Locale): Metadata {
  return generateBaseMetadata({
    locale,
    path: '/tools',
    title: 'All PDF Tools',
    description: 'Browse all 67+ professional PDF tools. Merge, split, compress, convert, edit, and secure your PDF files for free.',
    keywords: ['PDF tools', 'all PDF tools', 'PDF editor', 'PDF converter', 'PDF merger', 'PDF splitter'],
  });
}

/**
 * Generate metadata for the about page
 */
export function generateAboutMetadata(locale: Locale): Metadata {
  return generateBaseMetadata({
    locale,
    path: '/about',
    title: 'About',
    description: `Learn about ${siteConfig.name} - your free, private, and powerful PDF toolkit. All processing happens in your browser.`,
    keywords: ['about', 'PDF tools', 'privacy', 'browser-based'],
  });
}

/**
 * Generate metadata for the FAQ page
 */
export function generateFaqMetadata(locale: Locale): Metadata {
  return generateBaseMetadata({
    locale,
    path: '/faq',
    title: 'Frequently Asked Questions',
    description: `Find answers to common questions about ${siteConfig.name}. Learn how to use our PDF tools effectively.`,
    keywords: ['FAQ', 'help', 'questions', 'PDF tools help'],
  });
}

/**
 * Generate metadata for the privacy page
 */
export function generatePrivacyMetadata(locale: Locale): Metadata {
  return generateBaseMetadata({
    locale,
    path: '/privacy',
    title: 'Privacy Policy',
    description: `${siteConfig.name} privacy policy. Your files never leave your device - all processing happens locally in your browser.`,
    keywords: ['privacy', 'security', 'data protection', 'local processing'],
  });
}

/**
 * Convert locale to Open Graph locale format
 */
export function getOpenGraphLocale(locale: Locale): string {
  const ogLocaleMap: Record<Locale, string> = {
    en: 'en_US',
    ja: 'ja_JP',
    ko: 'ko_KR',
    es: 'es_ES',
    fr: 'fr_FR',
    de: 'de_DE',
    zh: 'zh_CN',
    'zh-TW': 'zh_TW',
    pt: 'pt_BR',
  };
  return ogLocaleMap[locale] || 'en_US';
}

/**
 * Check if metadata contains all required fields
 */
export function validateMetadata(metadata: Metadata): {
  valid: boolean;
  missingFields: string[];
} {
  const requiredFields = ['title', 'description'];
  const requiredOgFields = ['title', 'description'];
  const requiredTwitterFields = ['card', 'title', 'description'];

  const missingFields: string[] = [];

  // Check base fields
  for (const field of requiredFields) {
    if (!metadata[field as keyof Metadata]) {
      missingFields.push(field);
    }
  }

  // Check Open Graph fields
  if (metadata.openGraph) {
    for (const field of requiredOgFields) {
      if (!metadata.openGraph[field as keyof typeof metadata.openGraph]) {
        missingFields.push(`og:${field}`);
      }
    }
  } else {
    missingFields.push('openGraph');
  }

  // Check Twitter Card fields
  if (metadata.twitter) {
    for (const field of requiredTwitterFields) {
      if (!metadata.twitter[field as keyof typeof metadata.twitter]) {
        missingFields.push(`twitter:${field}`);
      }
    }
  } else {
    missingFields.push('twitter');
  }

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}
