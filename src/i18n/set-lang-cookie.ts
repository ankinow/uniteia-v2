import { server$ } from '@builder.io/qwik-city'
import { LANGUAGE_COOKIE_NAME, type SupportedLanguage } from './types'

/**
 * Server action that sets the uniteia_lang cookie with secure attributes.
 * This is the single authority for writing the language preference cookie.
 */
export const updateLangCookie = server$(function (newLang: SupportedLanguage) {
  this.cookie.set(LANGUAGE_COOKIE_NAME, newLang, {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
    secure: true,
    httpOnly: true,
  })
})
