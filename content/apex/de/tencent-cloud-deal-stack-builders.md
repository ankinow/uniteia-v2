---
slug: tencent-cloud-deal-stack-builders
lang: de
title: "Tencent Cloud Deal Stack für Entwickler"
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
  created_at: "2026-05-15T15:41:13.225Z"
  updated_at: "2026-05-15T15:41:13.225Z"
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
# Tencent Cloud Deal Stack: Günstige Cloud für Entwickler

## Was ist der Tencent Cloud Deal Stack?

[Tencent Cloud](https://tencentcloud.com) bietet eine Reihe von Produkten und Aktionen, die ideal für unabhängige Entwickler sind. Mit Lighthouse, CVM und EdgeOne können Sie Websites, APIs, Bots, Dashboards und kleine Apps zu sehr geringen Kosten betreiben — in manchen Fällen sogar kostenlos.

## Kostenlose Produkte

Tencent Cloud stellt ein Free-Tier mit ausgewählten Produkten zur Verfügung. Zu den kostenlosen Ressourcen gehören:

- **EdgeOne:** Bis zu 1M Anfragen/Monat im kostenlosen Plan
- **Lighthouse:** Testzeitraum für Basiskonfigurationen
- **CVM:** Aktionsangebote für Neukunden

> ⚠️ **Hinweis:** Kostenlose Produkte erfordern möglicherweise eine Kreditkartenregistrierung. Bitte die offiziellen Bedingungen prüfen.

## Lighthouse — Einfachheit, die funktioniert

Lighthouse ist ein vereinfachter VPS, ideal für alle, die keine komplexe Infrastruktur verwalten möchten.

**Wann verwenden:**
- Statische Seiten oder Blogs
- Leichte APIs
- Bots und Automatisierung
- Entwicklungsumgebungen
- Persönliche Dashboards

**Vorteile:**
- Feste Spezifikationen, keine Überraschungen
- Vereinfachtes Dashboard
- Firewall und Überwachung inklusive
- Günstiger als vergleichbare CVM
- Monatliche oder stündliche Abrechnung

## CVM — Volle Leistung

CVM (Cloud Virtual Machine) ist die Komplettlösung für alle, die vollständige Kontrolle benötigen.

**Wann verwenden:**
- CPU-/RAM-intensive Anwendungen
- Kubernetes oder fortgeschrittenes Docker
- Benutzerdefinierter Kernel oder Netzwerktuning
- Große Datenbanken
- Umgebungen mit VPC- und Sicherheitsgruppen

**Vorteile:**
- Vollständig anpassbare Konfiguration
- Dedizierte, Spot- und reservierte Instanzen
- Zusätzlicher Blockspeicher
- Sekundengenaue Abrechnung (Mindestdauer 1 Stunde)
- BYOL-Unterstützung

## EdgeOne — CDN + Sicherheit

EdgeOne vereint CDN mit WAF, DDoS-Schutz und Bot-Management in einer einzigen Plattform.

**Wann verwenden:**
- Beschleunigung der globalen Content-Auslieferung
- Schutz von Websites vor Angriffen
- Ersatz für separate CDN + WAF
- Reduzierung der Latenz für internationale Nutzer

**Vorteile:**
- Großzügiges Free-Tier (1M Anfragen/Monat)
- Pay-as-you-go
- Globales Edge-Netzwerk
- Native Integration mit Lighthouse und CVM
- Keine komplexen Lizenzen

## Produkte Kombinieren

| Stack | Lighthouse + EdgeOne | CVM + EdgeOne |
|-------|---------------------|---------------|
| Am besten für | Websites, Blogs, Landing Pages | Dynamische Apps, APIs, E-Commerce |
| Leistung | Hervorragend für statische Inhalte | Maximale Flexibilität |
| Kosten | Niedrigste | Mittel |
| Einrichtung | Minuten | Stunden |

## Vor dem Bezahlen — Checkliste

1. **Region prüfen:** Nicht alle Aktionen sind in allen Regionen verfügbar
2. **Berechtigung:** Manche Angebote gelten nur für Neukunden
3. **Gültigkeit:** Aktionen laufen ab — Datum prüfen
4. **Verlängerung:** Der Aktionspreis gilt möglicherweise nicht bei Verlängerung
5. **Gutscheine:** Bedingungen vor Aktivierung lesen — manche erfordern Mindestausgaben
6. **Free-Tier:** Prüfen, ob eine Kreditkarte erforderlich ist

## Empfohlene Einrichtung für Entwickler

### Website/Blog
Lighthouse (Basis) + EdgeOne (Free-Tier)

### Leichte API
Lighthouse (Mittelstufe) + EdgeOne (Free-Tier)

### Bot / Discord-Bot
Lighthouse (Basis) + EdgeOne (Free-Tier)

### Dashboard / Analysen
Lighthouse (Mittelstufe) + EdgeOne (Pay-as-you-go)

### Vollständige Anwendung
CVM (Spot-Instanz) + EdgeOne (Pay-as-you-go)

> **Haftungsausschluss:** Preise und Aktionen können sich ändern. Prüfen Sie immer die offizielle Tencent Cloud-Website für aktuelle Informationen. Dieser Leitfaden dient Bildungszwecken und ersetzt nicht die offiziellen Bedingungen.
