/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Editor } from '@tldraw/tldraw'
import { createShapesAndBindings } from './utils'

export function loadTemplate_03(editor: Editor, _locale = 'en') {
  const shapes: any[] = [
    // Central question
    {
      id: 'shape_1',
      type: 'step-card',
      x: 400,
      y: 100,
      props: {
        step: 1,
        titleKey: 'template_03.panels.panel_1.title',
        bodyKey: 'template_03.panels.panel_1.subtitle',
        w: 320,
        h: 180,
      },
    },
    // Option 1
    {
      id: 'shape_2',
      type: 'sticky-note',
      x: 100,
      y: 350,
      props: {
        w: 220,
        h: 160,
        textKey: 'template_03.panels.panel_2.options.0.name',
        color: 'yellow',
      },
    },
    // Option 2
    {
      id: 'shape_3',
      type: 'sticky-note',
      x: 350,
      y: 350,
      props: {
        w: 220,
        h: 160,
        textKey: 'template_03.panels.panel_2.options.1.name',
        color: 'blue',
      },
    },
    // Option 3
    {
      id: 'shape_4',
      type: 'sticky-note',
      x: 600,
      y: 350,
      props: {
        w: 220,
        h: 160,
        textKey: 'template_03.panels.panel_2.options.2.name',
        color: 'pink',
      },
    },
    // Option 4
    {
      id: 'shape_5',
      type: 'sticky-note',
      x: 850,
      y: 350,
      props: {
        w: 220,
        h: 160,
        textKey: 'template_03.panels.panel_2.options.3.name',
        color: 'yellow',
      },
    },
    // Arrows: question → options
    {
      id: 'arrow_1_2',
      type: 'arrow',
      x: 200,
      y: 280,
      props: {
        start: { type: 'binding', boundShapeId: 'shape_1', handleId: 'bottom' },
        end: { type: 'binding', boundShapeId: 'shape_2', handleId: 'top' },
      },
    },
    {
      id: 'arrow_1_3',
      type: 'arrow',
      x: 400,
      y: 280,
      props: {
        start: { type: 'binding', boundShapeId: 'shape_1', handleId: 'bottom' },
        end: { type: 'binding', boundShapeId: 'shape_3', handleId: 'top' },
      },
    },
    {
      id: 'arrow_1_4',
      type: 'arrow',
      x: 600,
      y: 280,
      props: {
        start: { type: 'binding', boundShapeId: 'shape_1', handleId: 'bottom' },
        end: { type: 'binding', boundShapeId: 'shape_4', handleId: 'top' },
      },
    },
    {
      id: 'arrow_1_5',
      type: 'arrow',
      x: 800,
      y: 280,
      props: {
        start: { type: 'binding', boundShapeId: 'shape_1', handleId: 'bottom' },
        end: { type: 'binding', boundShapeId: 'shape_5', handleId: 'top' },
      },
    },
    // Decision panel
    {
      id: 'shape_6',
      type: 'step-card',
      x: 100,
      y: 580,
      props: {
        step: 2,
        titleKey: 'template_03.panels.panel_3.title',
        bodyKey: 'template_03.panels.panel_3.subtitle',
        w: 500,
        h: 250,
      },
    },
    // Arrow: options → decision
    {
      id: 'arrow_2_6',
      type: 'arrow',
      x: 300,
      y: 510,
      props: {
        start: { type: 'binding', boundShapeId: 'shape_2', handleId: 'bottom' },
        end: { type: 'binding', boundShapeId: 'shape_6', handleId: 'top' },
      },
    },
    // Summary panel
    {
      id: 'shape_7',
      type: 'step-card',
      x: 650,
      y: 580,
      props: {
        step: 3,
        titleKey: 'template_03.panels.panel_4.title',
        bodyKey: 'template_03.panels.panel_4.body',
        w: 420,
        h: 250,
      },
    },
    // Arrow: decision → summary
    {
      id: 'arrow_6_7',
      type: 'arrow',
      x: 600,
      y: 830,
      props: {
        start: { type: 'binding', boundShapeId: 'shape_6', handleId: 'right' },
        end: { type: 'binding', boundShapeId: 'shape_7', handleId: 'left' },
      },
    },
    // Robot mascot
    {
      id: 'icon_robot',
      type: 'svg-icon',
      x: 1050,
      y: 50,
      props: { w: 100, h: 100, iconId: 'robot', scale: 1 },
    },
  ]

  createShapesAndBindings(editor, shapes)

  editor.zoomToFit()
}
