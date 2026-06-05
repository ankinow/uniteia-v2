// @ts-nocheck - React-in-Qwik-tsc-context
import { Tldraw } from '@tldraw/tldraw'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CodeBlockShapeUtil,
  StepCardShapeUtil,
  StickyNoteShapeUtil,
  SvgIconShapeUtil,
} from '../shapes'
import { loadTemplate_01, loadTemplate_02, loadTemplate_03 } from '../templates'
import '../i18n/i18n'
import './canvas.css'

const customShapes = [StepCardShapeUtil, StickyNoteShapeUtil, CodeBlockShapeUtil, SvgIconShapeUtil]

const templateLoaders: Record<string, (editor: any, locale: string) => void> = {
  '01': loadTemplate_01,
  '02': loadTemplate_02,
  '03': loadTemplate_03,
}

export default function UniTeiaCanvas() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const lang = params.get('lang') || 'en'
    if (lang !== i18n.language) {
      i18n.changeLanguage(lang)
    }
  }, [i18n])

  return (
    <div className="uniteia-canvas">
      <Tldraw
        shapeUtils={customShapes}
        hideUi={false}
        onMount={editor => {
          const params = new URLSearchParams(window.location.search)
          const templateId = params.get('template') || '01'
          const lang = params.get('lang') || 'en'

          const loader = templateLoaders[templateId]
          if (loader) {
            loader(editor, lang)
          }
        }}
      />
    </div>
  )
}
