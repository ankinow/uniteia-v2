/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Editor } from '@tldraw/tldraw'

export function loadTemplate_02(editor: Editor, _locale = 'en') {
  const shapes: any[] = [
    // Step 1 - Result
    {
      id: 'shape_1',
      type: 'step-card',
      x: 100,
      y: 100,
      props: {
        step: 1,
        titleKey: 'template_02.steps.step_1.title',
        bodyKey: 'template_02.steps.step_1.body',
        w: 320,
        h: 200,
      },
    },
    // Step 2 - Install
    {
      id: 'shape_2',
      type: 'step-card',
      x: 100,
      y: 350,
      props: {
        step: 2,
        titleKey: 'template_02.steps.step_2.title',
        bodyKey: 'template_02.steps.step_2.body',
        w: 400,
        h: 240,
      },
    },
    // Arrow: 1 → 2
    {
      id: 'arrow_1_2',
      type: 'arrow',
      x: 100,
      y: 300,
      props: {
        start: { type: 'binding', boundShapeId: 'shape_1', handleId: 'bottom' },
        end: { type: 'binding', boundShapeId: 'shape_2', handleId: 'top' },
      },
    },
    // Step 3 - Code
    {
      id: 'shape_3',
      type: 'step-card',
      x: 100,
      y: 650,
      props: {
        step: 3,
        titleKey: 'template_02.steps.step_3.title',
        bodyKey: 'template_02.steps.step_3.body',
        w: 400,
        h: 280,
      },
    },
    // Arrow: 2 → 3
    {
      id: 'arrow_2_3',
      type: 'arrow',
      x: 100,
      y: 590,
      props: {
        start: { type: 'binding', boundShapeId: 'shape_2', handleId: 'bottom' },
        end: { type: 'binding', boundShapeId: 'shape_3', handleId: 'top' },
      },
    },
    // Step 4 - How it works
    {
      id: 'shape_4',
      type: 'step-card',
      x: 100,
      y: 980,
      props: {
        step: 4,
        titleKey: 'template_02.steps.step_4.title',
        bodyKey: 'template_02.steps.step_4.body',
        w: 320,
        h: 220,
      },
    },
    // Arrow: 3 → 4
    {
      id: 'arrow_3_4',
      type: 'arrow',
      x: 100,
      y: 930,
      props: {
        start: { type: 'binding', boundShapeId: 'shape_3', handleId: 'bottom' },
        end: { type: 'binding', boundShapeId: 'shape_4', handleId: 'top' },
      },
    },
    // Step 5 - Upgrade
    {
      id: 'shape_5',
      type: 'step-card',
      x: 100,
      y: 1250,
      props: {
        step: 5,
        titleKey: 'template_02.steps.step_5.title',
        bodyKey: 'template_02.steps.step_5.body',
        w: 320,
        h: 220,
      },
    },
    // Arrow: 4 → 5
    {
      id: 'arrow_4_5',
      type: 'arrow',
      x: 100,
      y: 1200,
      props: {
        start: { type: 'binding', boundShapeId: 'shape_4', handleId: 'bottom' },
        end: { type: 'binding', boundShapeId: 'shape_5', handleId: 'top' },
      },
    },
    // Sticky notes on the right side
    {
      id: 'sticky_1',
      type: 'sticky-note',
      x: 550,
      y: 100,
      props: { w: 200, h: 150, textKey: 'template_02.steps.step_1.caption', color: 'yellow' },
    },
    {
      id: 'sticky_2',
      type: 'sticky-note',
      x: 550,
      y: 400,
      props: { w: 200, h: 150, textKey: 'template_02.steps.step_3.caption', color: 'blue' },
    },
    {
      id: 'sticky_3',
      type: 'sticky-note',
      x: 550,
      y: 1050,
      props: { w: 200, h: 150, textKey: 'template_02.steps.step_4.caption', color: 'pink' },
    },
    {
      id: 'sticky_4',
      type: 'sticky-note',
      x: 550,
      y: 1300,
      props: { w: 200, h: 150, textKey: 'template_02.steps.step_5.caption', color: 'yellow' },
    },
    // Robot mascot top right
    {
      id: 'icon_robot',
      type: 'svg-icon',
      x: 550,
      y: 50,
      props: { w: 100, h: 100, iconId: 'robot', scale: 1 },
    },
  ]

  shapes.forEach(s => {
    editor.createShape(s)
  })

  editor.zoomToFit()
}
