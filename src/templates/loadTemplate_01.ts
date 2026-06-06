/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Editor } from '@tldraw/tldraw'
import { createShapesAndBindings } from './utils'

// Template definitions are pure data; cast through any to avoid
// fighting tldraw's strict discriminated-union prop typing at scale.
// All shape types (step-card, sticky-note, code-block, svg-icon, arrow)
// are validated at runtime by tldraw's editor when mounted.

export function loadTemplate_01(editor: Editor, _locale = 'en') {
  const shapes: any[] = [
    // Step 1 - Hook
    {
      id: 'shape_1',
      type: 'step-card',
      x: 100,
      y: 100,
      props: {
        step: 1,
        titleKey: 'template_01.steps.step_1.title',
        bodyKey: 'template_01.steps.step_1.body',
        w: 280,
        h: 180,
      },
    },
    // Step 2 - Mistake
    {
      id: 'shape_2',
      type: 'step-card',
      x: 450,
      y: 100,
      props: {
        step: 2,
        titleKey: 'template_01.steps.step_2.title',
        bodyKey: 'template_01.steps.step_2.body',
        w: 280,
        h: 180,
      },
    },
    // Arrow: step 1 → step 2
    {
      id: 'arrow_1_2',
      type: 'arrow',
      x: 380,
      y: 190,
      props: {
        start: { type: 'binding', boundShapeId: 'shape_1', handleId: 'right' },
        end: { type: 'binding', boundShapeId: 'shape_2', handleId: 'left' },
      },
    },
    // Step 3 - Analogy
    {
      id: 'shape_3',
      type: 'step-card',
      x: 800,
      y: 100,
      props: {
        step: 3,
        titleKey: 'template_01.steps.step_3.title',
        bodyKey: 'template_01.steps.step_3.body',
        w: 320,
        h: 220,
      },
    },
    // Arrow: step 2 → step 3
    {
      id: 'arrow_2_3',
      type: 'arrow',
      x: 730,
      y: 190,
      props: {
        start: { type: 'binding', boundShapeId: 'shape_2', handleId: 'right' },
        end: { type: 'binding', boundShapeId: 'shape_3', handleId: 'left' },
      },
    },
    // Step 4 - Diagram
    {
      id: 'shape_4',
      type: 'step-card',
      x: 100,
      y: 350,
      props: {
        step: 4,
        titleKey: 'template_01.steps.step_4.title',
        bodyKey: 'template_01.steps.step_4.body',
        w: 320,
        h: 220,
      },
    },
    // Arrow: step 3 → step 4 (down-left)
    {
      id: 'arrow_3_4',
      type: 'arrow',
      x: 800,
      y: 320,
      props: {
        start: { type: 'binding', boundShapeId: 'shape_3', handleId: 'bottom' },
        end: { type: 'binding', boundShapeId: 'shape_4', handleId: 'top' },
      },
    },
    // Step 5 - Example
    {
      id: 'shape_5',
      type: 'step-card',
      x: 450,
      y: 350,
      props: {
        step: 5,
        titleKey: 'template_01.steps.step_5.title',
        bodyKey: 'template_01.steps.step_5.body',
        w: 320,
        h: 220,
      },
    },
    // Arrow: step 4 → step 5
    {
      id: 'arrow_4_5',
      type: 'arrow',
      x: 420,
      y: 570,
      props: {
        start: { type: 'binding', boundShapeId: 'shape_4', handleId: 'right' },
        end: { type: 'binding', boundShapeId: 'shape_5', handleId: 'left' },
      },
    },
    // Step 6 - Use/Don't
    {
      id: 'shape_6',
      type: 'step-card',
      x: 800,
      y: 350,
      props: {
        step: 6,
        titleKey: 'template_01.steps.step_6.title',
        bodyKey: 'template_01.steps.step_6.body',
        w: 320,
        h: 220,
      },
    },
    // Arrow: step 5 → step 6
    {
      id: 'arrow_5_6',
      type: 'arrow',
      x: 770,
      y: 570,
      props: {
        start: { type: 'binding', boundShapeId: 'shape_5', handleId: 'right' },
        end: { type: 'binding', boundShapeId: 'shape_6', handleId: 'left' },
      },
    },
    // Step 7 - Pitfalls
    {
      id: 'shape_7',
      type: 'step-card',
      x: 100,
      y: 600,
      props: {
        step: 7,
        titleKey: 'template_01.steps.step_7.title',
        bodyKey: 'template_01.steps.step_7.body',
        w: 320,
        h: 220,
      },
    },
    // Arrow: step 6 → step 7 (down-left)
    {
      id: 'arrow_6_7',
      type: 'arrow',
      x: 800,
      y: 570,
      props: {
        start: { type: 'binding', boundShapeId: 'shape_6', handleId: 'bottom' },
        end: { type: 'binding', boundShapeId: 'shape_7', handleId: 'top' },
      },
    },
    // Step 8 - Next Steps
    {
      id: 'shape_8',
      type: 'step-card',
      x: 450,
      y: 600,
      props: {
        step: 8,
        titleKey: 'template_01.steps.step_8.title',
        bodyKey: 'template_01.steps.step_8.body',
        w: 320,
        h: 220,
      },
    },
    // Arrow: step 7 → step 8
    {
      id: 'arrow_7_8',
      type: 'arrow',
      x: 420,
      y: 820,
      props: {
        start: { type: 'binding', boundShapeId: 'shape_7', handleId: 'right' },
        end: { type: 'binding', boundShapeId: 'shape_8', handleId: 'left' },
      },
    },
    // Sticky note: common mistake
    {
      id: 'sticky_1',
      type: 'sticky-note',
      x: 750,
      y: 50,
      props: { w: 180, h: 120, textKey: 'template_01.steps.step_2.postIt', color: 'yellow' },
    },
    // Sticky note: example caption
    {
      id: 'sticky_2',
      type: 'sticky-note',
      x: 750,
      y: 500,
      props: { w: 180, h: 120, textKey: 'template_01.steps.step_5.caption', color: 'blue' },
    },
    // Sticky note: use/don't
    {
      id: 'sticky_3',
      type: 'sticky-note',
      x: 1150,
      y: 500,
      props: { w: 200, h: 120, textKey: 'template_01.ui.cta', color: 'pink' },
    },
    // Robot mascot
    {
      id: 'icon_robot',
      type: 'svg-icon',
      x: 1150,
      y: 50,
      props: { w: 100, h: 100, iconId: 'robot', scale: 1 },
    },
  ]

  createShapesAndBindings(editor, shapes)

  // Zoom to fit all shapes
  editor.zoomToFit()
}
