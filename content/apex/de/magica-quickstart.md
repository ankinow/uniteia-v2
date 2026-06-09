---
slug: magica-quickstart
lang: de
title: Erste Schritte mit Magica
verdict: trusted
quality_score: 95
subjects:
  - magica
  - tutorial
  - quickstart
  - ai-workflows
referral_links: []
metadata:
  created_at: "2026-06-09T03:22:19.407Z"
  updated_at: "2026-06-09T03:22:30.413Z"
  author: UniTeia System
  version: 2
canvas:
  tone: coral
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
# Erste Schritte mit Magica

## Ihr Konto erstellen

Besuchen Sie [try.magica.com/clique-serio](https://try.magica.com/clique-serio) und melden Sie sich für die kostenlose Stufe an – keine Kreditkarte erforderlich. Verwenden Sie den Aktionscode **GXZMYCP** auf der [Belohnungsseite](https://try.magica.com/redeem), um **10M Bonus-Credits** zu erhalten (perfekt für Videos, Podcasts und Sprachinhalte). Die kostenlose Stufe gewährt Ihnen eingeschränkten Zugang zu allen wichtigen Modellen, was ausreicht, um die Plattform gründlich zu testen, bevor Sie sich festlegen.

Nach der Registrierung landen Sie im Magica-Workspace. Die Benutzeroberfläche besteht aus drei Hauptbereichen: der Modellauswahl (oben), dem Konversationsarbeitsbereich (Mitte) und der Tool-Schublade (rechte Seitenleiste mit über 5,900+ vorgefertigten Tools).

## Ihre erste Multi-Modell-Abfrage

Klicken Sie oben auf die Modellauswahl und aktivieren Sie 2-3 Modelle – beginnen Sie mit [GPT-4o](https://openai.com), [Claude Opus 4](https://anthropic.com) und Gemini 2.5 Pro. Geben Sie eine Frage in das Eingabefeld ein und drücken Sie Senden. Magica sendet Ihre Abfrage gleichzeitig an alle ausgewählten Modelle und zeigt die Antworten nebeneinander an.

Dieser Multi-Modell-Vergleich ist Magicas Killer-Feature. Sie sehen sofort, wie jedes Modell an denselben Prompt herangeht – Claude tendiert zu gründlicher Analyse, GPT zu praktischem Handeln, Gemini zu ausgewogener Synthese. Mit der Zeit lernen Sie, welchem Modell Sie für welche Aufgabenart vertrauen können.

## Ihr erstes Bild generieren

Öffnen Sie die Tool-Schublade und wechseln Sie zum Tab „Bild“. Wählen Sie FLUX 2 Max aus dem Modell-Dropdown. Schreiben Sie einen Prompt – seien Sie beschreibend, aber nicht übermäßig ausgefeilt. Klicken Sie auf „Generieren“. Innerhalb weniger Sekunden haben Sie vier Variationen zur Auswahl.

Nutzen Sie das Bearbeitungsfeld zur Verfeinerung: Skalieren Sie Ihre ausgewählte Variante hoch, entfernen Sie den Hintergrund oder generieren Sie bestimmte Bereiche mit Inpainting neu. Magica bündelt diese Bearbeitungswerkzeuge in derselben Oberfläche – kein Öffnen von Photoshop oder einem separaten KI-Editor erforderlich.

## Einen einfachen Workflow erstellen

Workflows sind der Bereich, in dem Magica über einen einfachen Chatbot hinausgeht. Klicken Sie auf den Tab „Workflows“ und wählen Sie „Neuer Workflow“. Sie sehen einen visuellen Knoteneditor – ziehen Sie einen Text-Eingabe-Knoten hinein, verbinden Sie ihn mit einem Bild-generieren-Knoten (FLUX 2 Max), dann mit einem Hochskalierungs-Knoten und schließlich mit einem Export-Knoten.

Legen Sie die Texteingabe so fest, dass sie eine Produktbeschreibung akzeptiert. Der Workflow wird: ein Produktbild aus der Beschreibung generieren → es 2x hochskalieren → das endgültige PNG exportieren. Diese gesamte Pipeline läuft mit einem Klick. Sie können sie als wiederverwendbare Workflow-App speichern und mit Ihrem Team teilen.

## Exportieren und integrieren

Jeder Workflow kann als App veröffentlicht werden, die über die API zugänglich ist. Gehen Sie zu Ihrem Workflow, klicken Sie auf „Veröffentlichen“, und Magica generiert einen API-Endpunkt mit dynamischen Eingaben für Ihre Workflow-Parameter. Sie können ihn nun aus Ihrer eigenen Anwendung aufrufen:

```bash
curl -X POST "https://api.magica.com/v1/workflows/run" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"inputs": {"description": "A minimalist desk lamp"}, "webhook": "https://your-server.com/webhook"}'
```

## Nächste Schritte

Wenn Sie mit den Grundlagen vertraut sind, erkunden Sie:
- **MCP Server einrichten** – Verbinden Sie Magica mit Ihren eigenen Tools und Datenquellen
- **Agentenspeicher** – Geben Sie Ihren Workflows persistenten Kontext über Sitzungen hinweg
- **Team-Arbeitsbereiche** – Arbeiten Sie mit Workflows mit gemeinsamen Assets und Versionsverlauf zusammen
- **Benutzerdefinierte Tools** – Schreiben Sie Ihre eigenen MCP-Tools, die Magica-Agenten entdecken und nutzen können
