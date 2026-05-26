---
slug: magica-quickstart
lang: es
title: "Primeros Pasos con Magica"
verdict: trusted
quality_score: 95
subjects:
  - magica
  - tutorial
  - quickstart
  - ai-workflows
referral_links:
  - url: https://magica.com
    title: Magica Official Site
  - url: https://try.magica.com
    title: Magica Free Trial
  - url: https://docs.magica.com
    title: Magica Documentation
metadata:
  created_at: "2026-05-25T10:00:00.000Z"
  updated_at: "2026-05-25T10:00:00.000Z"
  author: UniTeia System
  version: 1
canvas:
  tone: obsidian
  layout: timeline-spiral
  nodes:
    - id: hero
      section: 0
      type: hero
    - id: signup
      section: 1
      type: card
    - id: first-query
      section: 2
      type: card
    - id: multi-model
      section: 3
      type: card
    - id: image-gen
      section: 4
      type: card
    - id: workflow
      section: 5
      type: card
    - id: export
      section: 6
      type: card
    - id: next-steps
      section: 7
      type: card
  connectors:
    - from: hero
      to: signup
    - from: signup
      to: first-query
    - from: first-query
      to: multi-model
    - from: multi-model
      to: image-gen
    - from: image-gen
      to: workflow
    - from: workflow
      to: export
    - from: export
      to: next-steps
---

# Primeros pasos con Magica

## Crea tu cuenta

Visita try.magica.com y regístrate en el plan gratuito; no se requiere tarjeta de crédito. El plan gratuito te da acceso limitado a todos los modelos principales, suficiente para evaluar la plataforma a fondo antes de comprometerte.

Una vez registrado, llegas al espacio de trabajo de Magica. La interfaz tiene tres zonas principales: el selector de modelos (arriba), el espacio de conversación (centro) y el cajón de herramientas (barra lateral derecha con más de 5900 herramientas preconstruidas).

## Tu primera consulta multimodelo

Haz clic en el selector de modelos en la parte superior y habilita 2 o 3 modelos. Empieza con GPT-4o, Claude Opus 4 y Gemini 2.5 Pro. Escribe una pregunta en el campo de entrada y presiona enviar. Magica envía tu consulta a todos los modelos seleccionados simultáneamente y muestra las respuestas una al lado de la otra.

Esta comparación de múltiples modelos es la función estrella de Magica. Inmediatamente ves cómo cada modelo aborda el mismo prompt: Claude tiende a un análisis exhaustivo, GPT a la acción práctica, Gemini a una síntesis equilibrada. Con el tiempo, aprendes en qué modelo confiar para cada tipo de tarea.

## Genera tu primera imagen

Abre el cajón de herramientas y cambia a la pestaña Imagen. Selecciona FLUX 2 Max en el menú desplegable de modelos. Escribe un prompt: sé descriptivo pero no demasiado elaborado. Haz clic en generar. En cuestión de segundos tendrás cuatro variaciones para elegir.

Usa el panel de edición para refinar: mejora la resolución de la variante elegida, elimina el fondo o regenera regiones específicas con inpainting. Magica integra estas herramientas de edición en la misma interfaz; no es necesario abrir Photoshop ni un editor de IA aparte.

## Crea un flujo de trabajo simple

Los flujos de trabajo son donde Magica trasciende un simple chatbot. Haz clic en la pestaña Flujos de trabajo y selecciona Nuevo flujo de trabajo. Verás un editor visual de nodos: arrastra un nodo de Entrada de texto, conéctalo a un nodo Generar imagen (FLUX 2 Max), luego a un nodo de Mejora de resolución y, finalmente, a un nodo de Exportación.

Configura la entrada de texto para que acepte una descripción de producto. El flujo de trabajo hará lo siguiente: generar una imagen del producto a partir de la descripción → mejorar su resolución 2x → exportar el PNG final. Todo este proceso se ejecuta con un solo clic. Puedes guardarlo como una aplicación de flujo de trabajo reutilizable y compartirla con tu equipo.

## Exportar e integrar

Cada flujo de trabajo se puede publicar como una aplicación accesible a través de la API. Ve a tu flujo de trabajo, haz clic en Publicar, y Magica genera un endpoint de API con entradas dinámicas para los parámetros de tu flujo de trabajo. Ahora puedes llamarlo desde tu propia aplicación:

```bash
curl -X POST "https://api.magica.com/v1/workflows/run" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"inputs": {"description": "A minimalist desk lamp"}, "webhook": "https://your-server.com/webhook"}'
```

## Próximos pasos

Una vez que te sientas cómodo con lo básico, explora:

- **Configuración del servidor MCP**: conecta Magica con tus propias herramientas y fuentes de datos.
- **Memoria del agente**: proporciona a tus flujos de trabajo un contexto persistente entre sesiones.
- **Espacios de trabajo en equipo**: colabora en flujos de trabajo con recursos compartidos e historial de versiones.
- **Herramientas personalizadas**: escribe tus propias herramientas MCP que los agentes de Magica puedan descubrir y utilizar.
