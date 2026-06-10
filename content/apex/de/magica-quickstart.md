1|---
2|slug: magica-quickstart
3|lang: de
4|title: Erste Schritte mit Magica
5|verdict: trusted
6|quality_score: 95
7|subjects:
8|  - magica
9|  - tutorial
10|  - quickstart
11|  - ai-workflows
12|referral_links: []
13|metadata:
14|  created_at: "2026-06-09T04:00:22.795Z"
15|  updated_at: "2026-06-09T04:00:22.795Z"
16|  author: UniTeia System
17|  version: 1
18|canvas:
19|  tone: coral
20|  layout: timeline-spiral
21|  nodes:
22|    - id: hero
23|      section: 0
24|      type: hero
25|    - id: signup
26|      section: 1
27|      type: card
28|    - id: first-query
29|      section: 2
30|      type: card
31|    - id: multi-model
32|      section: 3
33|      type: card
34|    - id: image-gen
35|      section: 4
36|      type: card
37|    - id: workflow
38|      section: 5
39|      type: card
40|    - id: export
41|      section: 6
42|      type: card
43|    - id: next-steps
44|      section: 7
45|      type: card
46|  connectors:
47|    - from: hero
48|      to: signup
49|    - from: signup
50|      to: first-query
51|    - from: first-query
52|      to: multi-model
53|    - from: multi-model
54|      to: image-gen
55|    - from: image-gen
56|      to: workflow
57|    - from: workflow
58|      to: export
59|    - from: export
60|      to: next-steps
61|---
62|# Erste Schritte mit Magica
63|
64|## Ihr Konto erstellen
65|

> 💡 **Transparenzhinweis:** UniTeia erhält ggf. eine Provision für Anmeldungen über Links auf dieser Seite. Dies beeinflusst unsere Bewertung nicht. Siehe unsere [Ethikrichtlinie](/ethics).

66|Besuchen Sie [try.magica.com/clique-serio](https://try.magica.com/clique-serio) und melden Sie sich für die kostenlose Stufe an – keine Kreditkarte erforderlich. Verwenden Sie den Aktionscode **GXZMYCP** auf der [Belohnungsseite](https://try.magica.com/redeem), um **10M Bonus-Credits** zu erhalten (perfekt für Videos, Podcasts und Sprachinhalte). Die kostenlose Stufe gewährt Ihnen eingeschränkten Zugang zu allen wichtigen Modellen, was ausreicht, um die Plattform gründlich zu testen, bevor Sie sich festlegen.
67|
68|Nach der Registrierung landen Sie im Magica-Workspace. Die Benutzeroberfläche besteht aus drei Hauptbereichen: der Modellauswahl (oben), dem Konversationsarbeitsbereich (Mitte) und der Tool-Schublade (rechte Seitenleiste mit über 5,900+ vorgefertigten Tools).
69|
70|## Ihre erste Multi-Modell-Abfrage
71|
72|Klicken Sie oben auf die Modellauswahl und aktivieren Sie 2-3 Modelle – beginnen Sie mit [GPT-4o](https://openai.com), [Claude Opus 4](https://anthropic.com) und Gemini 2.5 Pro. Geben Sie eine Frage in das Eingabefeld ein und drücken Sie Senden. Magica sendet Ihre Abfrage gleichzeitig an alle ausgewählten Modelle und zeigt die Antworten nebeneinander an.
73|
74|Dieser Multi-Modell-Vergleich ist Magicas Killer-Feature. Sie sehen sofort, wie jedes Modell an denselben Prompt herangeht – Claude tendiert zu gründlicher Analyse, GPT zu praktischem Handeln, Gemini zu ausgewogener Synthese. Mit der Zeit lernen Sie, welchem Modell Sie für welche Aufgabenart vertrauen können.
75|
76|## Ihr erstes Bild generieren
77|
78|Öffnen Sie die Tool-Schublade und wechseln Sie zum Tab „Bild“. Wählen Sie FLUX 2 Max aus dem Modell-Dropdown. Schreiben Sie einen Prompt – seien Sie beschreibend, aber nicht übermäßig ausgefeilt. Klicken Sie auf „Generieren“. Innerhalb weniger Sekunden haben Sie vier Variationen zur Auswahl.
79|
80|Nutzen Sie das Bearbeitungsfeld zur Verfeinerung: Skalieren Sie Ihre ausgewählte Variante hoch, entfernen Sie den Hintergrund oder generieren Sie bestimmte Bereiche mit Inpainting neu. Magica bündelt diese Bearbeitungswerkzeuge in derselben Oberfläche – kein Öffnen von Photoshop oder einem separaten KI-Editor erforderlich.
81|
82|## Einen einfachen Workflow erstellen
83|
84|Workflows sind der Bereich, in dem Magica über einen einfachen Chatbot hinausgeht. Klicken Sie auf den Tab „Workflows“ und wählen Sie „Neuer Workflow“. Sie sehen einen visuellen Knoteneditor – ziehen Sie einen Text-Eingabe-Knoten hinein, verbinden Sie ihn mit einem Bild-generieren-Knoten (FLUX 2 Max), dann mit einem Hochskalierungs-Knoten und schließlich mit einem Export-Knoten.
85|
86|Legen Sie die Texteingabe so fest, dass sie eine Produktbeschreibung akzeptiert. Der Workflow wird: ein Produktbild aus der Beschreibung generieren → es 2x hochskalieren → das endgültige PNG exportieren. Diese gesamte Pipeline läuft mit einem Klick. Sie können sie als wiederverwendbare Workflow-App speichern und mit Ihrem Team teilen.
87|
88|## Exportieren und integrieren
89|
90|Jeder Workflow kann als App veröffentlicht werden, die über die API zugänglich ist. Gehen Sie zu Ihrem Workflow, klicken Sie auf „Veröffentlichen“, und Magica generiert einen API-Endpunkt mit dynamischen Eingaben für Ihre Workflow-Parameter. Sie können ihn nun aus Ihrer eigenen Anwendung aufrufen:
91|
92|```bash
93|curl -X POST "https://api.magica.com/v1/workflows/run" \
94|  -H "Authorization: Bearer YOUR_API_KEY" \
95|  -H "Content-Type: application/json" \
96|  -d '{"inputs": {"description": "A minimalist desk lamp"}, "webhook": "https://your-server.com/webhook"}'
97|```
98|
99|## Nächste Schritte
100|
101|Wenn Sie mit den Grundlagen vertraut sind, erkunden Sie:
102|- **MCP Server einrichten** – Verbinden Sie Magica mit Ihren eigenen Tools und Datenquellen
103|- **Agentenspeicher** – Geben Sie Ihren Workflows persistenten Kontext über Sitzungen hinweg
104|- **Team-Arbeitsbereiche** – Arbeiten Sie mit Workflows mit gemeinsamen Assets und Versionsverlauf zusammen
105|- **Benutzerdefinierte Tools** – Schreiben Sie Ihre eigenen MCP-Tools, die Magica-Agenten entdecken und nutzen können
106|