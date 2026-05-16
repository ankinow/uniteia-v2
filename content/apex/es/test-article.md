---
slug: test-article
lang: es
title: Artículo de Prueba para Verificación de Integración
verdict: trusted
quality_score: 95
subjects:
  - pruebas
  - integración
  - verificación
referral_links:
  - url: https://example.com/es/referencia
    title: Referencia de Ejemplo
    description: Un enlace de referencia externa de muestra
  - url: https://example.com/es/docs
    title: Documentación de Ejemplo
metadata:
  created_at: "2025-01-15T10:00:00Z"
  updated_at: "2025-01-20T14:30:00Z"
  author: Sistema UniTeia
  version: 1
---

# Artículo de Prueba para Verificación de Integración

Este es un artículo de prueba creado para verificar el pipeline de renderización de contenido de UniTeia v2. Sirve como fixture para pruebas de integración del routeLoader$, validación de esquema y renderización de componentes.

## Propósito

El propósito principal de este artículo es ejercitar el pipeline completo de contenido:

1. **Análisis de Markdown** — extracción de frontmatter vía gray-matter
2. **Validación de esquema** — verificación de conformidad AJV Draft 2020-12
3. **Validación de slug** — seguridad de URL vía `validateSlug()`
4. **Renderización de componentes** — ArticleFrame, AdaptiveHeader, FrontmatterSlots y SourceLedger

## Requisitos de Contenido

El esquema requiere un mínimo de 100 caracteres de contenido. Este párrafo y el texto circundante garantizan que superamos cómodamente ese umbral mientras proporcionamos cobertura de prueba significativa para el pipeline de renderización.

## Detalles Técnicos

El routeLoader$ lee este archivo del directorio `/llm-wiki/es/`, analiza el frontmatter YAML, valida el objeto resultante contra el esquema JSON e inyecta contenido tipado en la ruta Qwik-City. Cualquier fallo de validación se registra en la consola del servidor con el slug y los detalles del error.
