---
slug: tencent-cloud-deal-stack-builders
lang: es
title: "Tencent Cloud Deal Stack para Creadores"
verdict: trusted
quality_score: 95
subjects:
  - cloud
  - builders
  - infrastructure
  - tencent-cloud
referral_links:
  - url: https://www.tencentcloud.com/act/pro/promo
    title: Tencent Cloud Promotions
  - url: https://www.tencentcloud.com/products/lighthouse
    title: Lighthouse Overview
  - url: https://www.tencentcloud.com/products/cvm
    title: CVM Overview
  - url: https://www.tencentcloud.com/products/teo
    title: EdgeOne Overview
  - url: https://www.tencentcloud.com/act/pro/promo
    title: Tencent Cloud Free Tier
metadata:
  created_at: "2026-05-15T15:41:13.224Z"
  updated_at: "2026-05-15T15:41:13.224Z"
  author: UniTeia System
  version: 1
  sourceCount: 8
  trustLevel: low
  importedFrom: uniteia-mega-factory
  contentPackage: uniteia-content-package/v1
canvas:
  tone: obsidian
  layout: constellation
  nodes:
    - id: intro
      section: 0
      type: hero
    - id: free-products
      section: 1
      type: card
    - id: lighthouse
      section: 2
      type: card
    - id: cvm
      section: 3
      type: card
    - id: edgeone
      section: 4
      type: card
    - id: stack-comparison
      section: 5
      type: table
    - id: checklist
      section: 6
      type: list
    - id: recommended-setup
      section: 7
      type: grid
  connectors:
    - from: intro
      to: free-products
    - from: intro
      to: lighthouse
    - from: intro
      to: cvm
    - from: intro
      to: edgeone
    - from: lighthouse
      to: stack-comparison
    - from: cvm
      to: stack-comparison
    - from: edgeone
      to: stack-comparison
    - from: stack-comparison
      to: checklist
    - from: checklist
      to: recommended-setup
---
# Tencent Cloud Deal Stack: Cloud Barata para Creadores

## ¿Qué es Tencent Cloud Deal Stack?

[Tencent Cloud](https://tencentcloud.com) ofrece un conjunto de productos y promociones ideales para creadores independientes. Con Lighthouse, CVM y EdgeOne, puedes alojar sitios web, APIs, bots, dashboards y aplicaciones pequeñas gastando muy poco — en algunos casos, nada.

## Productos Gratuitos

Tencent Cloud dispone de un nivel gratuito con productos seleccionados. Los recursos gratuitos incluyen:

- **EdgeOne:** Hasta 1M de solicitudes/mes en el plan gratuito
- **Lighthouse:** Período de prueba en configuraciones básicas
- **CVM:** Ofertas promocionales para nuevos usuarios

> ⚠️ **Nota:** Los productos gratuitos pueden requerir registro con tarjeta de crédito. Consulta los términos oficiales.

## Lighthouse — Simplicidad que Funciona

Lighthouse es un VPS simplificado, ideal para quienes no quieren gestionar infraestructura compleja.

**Cuándo usarlo:**
- Sitios estáticos o blogs
- APIs ligeras
- Bots y automatización
- Entornos de desarrollo
- Dashboards personales

**Ventajas:**
- Especificaciones fijas, sin sorpresas
- Dashboard simplificado
- Firewall y monitoreo incluidos
- Más barato que un CVM equivalente
- Facturación mensual o por hora

## CVM — Potencia Total

CVM (Cloud Virtual Machine) es la solución completa para quienes necesitan control total.

**Cuándo usarlo:**
- Aplicaciones con uso intensivo de CPU/RAM
- Kubernetes o Docker avanzado
- Kernel personalizado o ajustes de red
- Bases de datos grandes
- Entornos que necesitan VPC y grupos de seguridad

**Ventajas:**
- Configuración totalmente personalizable
- Instancias dedicadas, spot y reservadas
- Almacenamiento en bloque adicional
- Facturación por segundo (mínimo 1 hora)
- Soporte BYOL

## EdgeOne — CDN + Seguridad

EdgeOne combina CDN con WAF, protección DDoS y gestión de bots en una sola plataforma.

**Cuándo usarlo:**
- Acelerar la entrega global de contenido
- Proteger sitios contra ataques
- Reemplazar CDN + WAF separados
- Reducir latencia para usuarios internacionales

**Ventajas:**
- Nivel gratuito generoso (1M solicitudes/mes)
- Pago por uso
- Red perimetral global
- Integración nativa con Lighthouse y CVM
- Sin licencias complejas

## Cómo Combinar Productos

| Stack | Lighthouse + EdgeOne | CVM + EdgeOne |
|-------|---------------------|---------------|
| Ideal para | Sitios, blogs, landing pages | Apps dinámicas, APIs, e-commerce |
| Rendimiento | Excelente para contenido estático | Máxima flexibilidad |
| Costo | Mínimo | Moderado |
| Configuración | Minutos | Horas |

## Antes de Pagar — Lista de Verificación

1. **Verifica la región:** No todas las promociones están disponibles en todas las regiones
2. **Elegibilidad:** Algunas ofertas son solo para nuevos usuarios
3. **Vigencia:** Las promociones caducan — verifica la fecha
4. **Renovación:** El precio promocional puede no aplicarse en la renovación
5. **Cupones:** Lee los términos antes de activarlos — algunos requieren un gasto mínimo
6. **Nivel gratuito:** Confirma si se requiere tarjeta de crédito

## Configuración Recomendada para Creadores

### Sitio/Blog
Lighthouse (básico) + EdgeOne (nivel gratuito)

### API Ligera
Lighthouse (plan medio) + EdgeOne (nivel gratuito)

### Bot / Bot de Discord
Lighthouse (básico) + EdgeOne (nivel gratuito)

### Dashboard / Analíticas
Lighthouse (plan medio) + EdgeOne (pago por uso)

### Aplicación Completa
CVM (instancia spot) + EdgeOne (pago por uso)

> **Aviso:** Los precios y promociones están sujetos a cambios. Verifica siempre el sitio web oficial de Tencent Cloud para obtener información actualizada. Esta guía es educativa y no sustituye los términos oficiales.
