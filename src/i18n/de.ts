import type { TranslationStrings } from './types'

// Using English as a placeholder for the stub
export const de: TranslationStrings = {
  nav: {
    home: 'Startseite',
    about: 'Über',
    blog: 'Blog',
    projects: 'Projekte',
    contact: 'Kontakt',
    topics: 'Themen',
    search: 'Suche',
    niches: 'Nischen',
    breadcrumb: {
      label: 'Sie sind hier:',
      signals: 'Insights',
    },
  },
  sidebar: {
    interfaceLabel: 'Kompakte Oberfläche',
  },
  footer: {
    copyright: '© {year} UniTeia. Alle Rechte vorbehalten.',
    madeWith: 'Mit ♥ für dezentrale KI gemacht',
    builtWith: 'Erstellt mit PA∞ SOTA',
    tagline: 'Autonome Technik',
    links: {
      privacy: 'Datenschutzerklärung',
      terms: 'Nutzungsbedingungen',
      source: 'Quellcode',
    },
  },
  langSwitcher: {
    label: 'Sprache',
    current: 'Aktuelle Sprache: {lang}',
    available: 'Verfügbare Sprachen',
  },
  errorPages: {
    '404': {
      title: 'Seite nicht gefunden',
      message: 'Die gesuchte Seite existiert nicht oder wurde verschoben.',
      backHome: 'Zurück zum Apex',
    },
    '500': {
      title: 'Serverfehler',
      message: 'Auf unserer Seite ist etwas schiefgelaufen. Bitte versuchen Sie es später erneut.',
      retry: 'Erneut versuchen',
    },
  },
  fallbackBanner: {
    message: 'Dieser Inhalt ist in Ihrer Sprache nicht verfügbar. Wir zeigen ihn auf Englisch.',
    dismiss: 'Schließen',
  },
  article: {
    subjectsLabel: 'Themen',
    sourcesLabel: 'Quellen',
    published: 'Veröffentlicht',
    updated: 'Aktualisiert',
    byAuthor: 'von {author}',
    version: 'v{version}',
    readInLang: 'Auf {lang} lesen',
    magica: {
      insight: {
        title: 'Magica: Das KI-Kommandozentrum',
        body: 'Magica vereint Prompt-Engineering, Modell-Routing und Evaluierung in einer einzigen Oberfläche.',
      },
      evidence: {
        title: 'Workflow-Visualisierung',
        alt: 'Screenshot des Magica-Workflow-Builders',
      },
      architecture: {
        title: 'Architektur',
        point1: 'Knotenbasiertes Prompt-Chaining',
        point2: 'Multi-Modell-Fallback-Routing',
        point3: 'Echtzeit-Latenz-Telemetrie',
      },
      cta: {
        title: 'Loslegen',
        body: 'Testen Sie Magica kostenlos — keine Kreditkarte erforderlich.',
        button: 'Magica besuchen',
      },
    },
    canvaMagicaProduction: {
      magicaWorkflowBuilder: 'Magica-Workflow-Builder',
      unifiedPromptEngineering:
        'Vereinheitlichtes Prompt-Engineering, Modell-Routing und Evaluierung in einer Oberfläche',
      magicaCommandCenter: 'Magica: Das KI-Befehlszentrum',
      magicaDescription:
        'Magica vereinheitlicht Prompt-Engineering, Modell-Routing und Evaluierung in einer Oberfläche',
      aiProcessing: 'KI-Verarbeitung',
      nodeBasedPromptChaining: 'Knotenbasiertes Prompt-Chaining',
      architecture: 'Architektur',
      multiModelFallback: 'Multi-Modell-Fallback-Routing',
      startBuilding: 'Mit dem Bauen beginnen',
      tryMagicaFree: 'Magica kostenlos testen — ohne Kreditkarte',
      visitMagica: 'Magica besuchen',
      qualityScore: 'Qualitätsbewertung',
      languages: 'Sprachen',
      workflowVisualization: 'Workflow-Visualisierung',
      keyMetrics: 'Kernmetriken',
      workflowSteps: 'Workflow-Schritte',
      poweredBy: 'Bereitgestellt von',
      pillBudgetGate: 'Budget-Schranke',
      pillSloRouter: 'SLO-Router',
      pillToolInjection: 'Werkzeuginjektion',
      pillGlobalEdge: 'Globaler Edge',
      pillZeroLatency: 'Null-Latenz',
      pillEdgeOne: 'EdgeOne WAF',
      pillLighthouse: 'Lighthouse CVM',
      validationCompliance: 'PA∞ SOTA Konformität',
      flowSources: 'QUELLEN',
      flowFrontend: 'FRONTEND',
    },
    canvaMagica: {
      workflowTitle: 'Magica-Workflow-Builder',
      inputLabel: 'EINGABE',
      aiProcessing: {
        title: 'KI-VERARBEITUNG',
        subtitle: 'Knotenbasiertes Prompt-Chaining',
      },
      qualityScore: '',
      languages: '8 Sprachen',
      outputLabel: 'Prompt → Modell-Router → Ausgabe',
    },
  },
  niche: {
    topicsLabel: 'Themen',
    exploreNiche: '{niche} erkunden',
    articleCount: '{count} Artikel',
    allNiches: 'Alle Themen',
  },
  editorial: {
    verdictLabel: 'Verdict',
    trusted: 'Vertrauenswürdig',
    caution: 'Vorsicht',
    flagged: 'Markiert',
    qualityScore: '',
    editorialQuality: 'Redaktionelle Qualität',
  },
  dopamineCard: {
    readMore: 'Weiterlesen',
  },
  signal: {
    qualityLabel: '',
    sourceCount: '{count} Quellen',
    sources: 'Quellen',
    freshnessLabel: '',
  },
  search: {
    placeholder: 'Themen, Artikel suchen...',
    label: 'Themen, Artikel durchsuchen',
    resultsFor: 'Ergebnisse für "{query}"',
    noResults: 'Keine Ergebnisse',
    noResultsHint: 'Versuchen Sie andere Suchbegriffe oder durchstöbern Sie unsere Themen',
    resultCount: '{count} Ergebnisse',
    searchTitle: 'Suche',
    searchDescription: 'Artikel und Themen auf UniTeia durchsuchen',
  },
  seo: {
    siteName: 'UniTeia OS',
    articleTitleTemplate: '{title} | UniTeia OS',
    topicsTitle: 'KI-Themen',
    topicsDescription: 'Erkunden Sie unsere kuratierte Liste von KI-Themen und Nischen.',
  },
  homepage: {
    featuredSignals: 'Ausgewählte Insights',
    knowledgeClusters: 'Cluster',
    frontierStreams: 'Frontier',
    frontierStreamsOne: 'Grenzgebiet',
    signalCount: '{count} insights',
    signalCountOne: '1 insight',
    curatedAcross: 'kuratiert in {count} Nischen',
    curatedAcrossOne: 'kuratiert in 1 Nische',
    noSignals: 'Keine Insights',
    browseTopics: 'Themen durchsuchen',
    networkState: 'UniTeia Netzwerkstatus',
    signalIntake: 'Insight-Aufnahme',
    deliveryLayer: 'Zustellungsebene',
    bentoTagline: 'Qwik islands + P3 wide-gamut',
    footerMadeWith:
      'Mit ❤️ für dezentrale KI vom UniTeia & LERMF-Team erstellt. Stärkung von Vibe-Codern und Entwicklern weltweit.',
  },
  onboarding: {
    step1: {
      title: 'Mit Leidenschaft für die Community entwickelt.',
      subtitle: 'Wir filtern das Rauschen, damit Sie Vibe-Coden können.',
      desc: 'Unser UniTeia & LERMF-Team taucht täglich in Tausende von Quellen ein und kuratiert die besten Insights mit Liebe und Hingabe. Damit Sie sich aufs Bauen konzentrieren können.',
    },
    step2: {
      title: 'Von Menschen kuratiert, durch Technologie gestärkt.',
      cards: [
        {
          label: 'Forschung',
          desc: 'Wir wählen Rohquellen sorgfältig aus und bewerten sie für absolutes Vertrauen.',
        },
        {
          label: 'Verifizierung',
          desc: 'Jede Behauptung wird mit Hingabe nach unseren Community-Standards überprüft.',
        },
        {
          label: 'Bereitstellung',
          desc: 'Wunderschön formatierte und lokalisierte Inhalte, speziell für Sie.',
        },
      ],
    },
    step3: {
      title: 'Verfügbar in 8 Sprachen.',
      desc: 'Nur das, was wichtig ist. Geliefert in Ihrer Sprache, zu Ihren Bedingungen.',
      badge: '8 Stimmen',
    },
  },
  agent: {
    status: {
      idle: 'Aether OS · Leerlauf',
      thinking: 'Aether OS · Denken',
      processing: 'Aether OS · Verarbeitung',
      complete: 'Aether OS · Abgeschlossen',
      error: 'Aether OS · Fehler',
    },
    mcpTooltip: 'MCP-Server verbunden · 7 aktive Werkzeuge',
  },
  generativeHero: {
    curating: '{niche} Insights heute',
    topNiches: 'Top-Nischen',
    apexBadge: 'APEX · Live',
    headline: 'Frontier-Signale aus {count} Kanälen',
    headlineOne: 'Frontier-Signal aus 1 Kanal',
    tracksLabel: 'aktive Kanäle',
    tracksLabelOne: 'aktiver Kanal',
  },
  legal: {
    privacy: {
      title: 'Datenschutzerklärung',
      body: '<h2>1. Datenerhebung</h2><p>UniTeia erhebt ausschließlich die Daten, die für die Bereitstellung unseres KI-gestützten Kurationsdienstes technisch erforderlich sind. Dazu gehören: (a) technische Zugriffsdaten wie IP-Adresse, Browsertyp, Betriebssystem, Referrer-URL sowie Datum und Uhrzeit des Zugriffs, die beim Besuch unserer Website automatisch durch unseren Server erfasst werden; (b) Inhaltsinteraktionen wie aufgerufene Artikel, Themenpräferenzen und Suchanfragen, sofern Sie die Suchfunktion nutzen; (c) sprachbezogene Einstellungen wie Ihre bevorzugte Sprachversion der Website. Eine Registrierung oder Anlage eines Nutzerkontos ist für die Nutzung von UniTeia nicht erforderlich. Wir erheben keine personenbezogenen Daten wie Name, E-Mail-Adresse oder Telefonnummer, es sei denn, Sie kontaktieren uns freiwillig über die angegebenen Kontaktwege.</p><h2>2. Datennutzung</h2><p>Die von uns erhobenen Daten dienen ausschließlich folgenden Zwecken: (a) Sicherstellung des technischen Betriebs und der Stabilität unserer Plattform; (b) Verbesserung und Personalisierung des Nutzererlebnisses, einschließlich der Anpassung von Inhaltsempfehlungen auf Basis Ihrer Interessen; (c) Analyse aggregierter Nutzungsstatistiken zur Optimierung unseres redaktionellen Angebots; (d) Erfüllung rechtlicher Verpflichtungen, insbesondere im Hinblick auf Datensicherheit und Auskunftsersuchen. Eine automatisierte Entscheidungsfindung oder ein Profiling im Sinne von Art. 22 DSGVO findet nicht statt. Ihre Daten werden nicht für Werbezwecke genutzt.</p><h2>3. Cookies und ähnliche Technologien</h2><p>UniTeia verwendet ausschließlich technisch notwendige Cookies, die für den Betrieb der Website unerlässlich sind. Dazu gehören: (a) Session-Cookies zur Aufrechterhaltung Ihrer Browsersitzung und Spracheinstellung; (b) CSRF-Schutz-Cookies zur Absicherung gegen Cross-Site-Request-Forgery-Angriffe. Wir setzen keine Tracking-Cookies, Analyse-Cookies oder Marketing-Cookies ein. Es werden keine Drittanbieter-Cookies gesetzt. Sie können Ihren Browser so konfigurieren, dass er Cookies ablehnt; dies kann jedoch die Funktionalität der Website beeinträchtigen.</p><h2>4. Weitergabe an Dritte</h2><p>UniTeia verkauft, vermietet oder verleast Ihre Daten zu keinem Zeitpunkt an Dritte. Eine Weitergabe erfolgt nur in folgenden eng begrenzten Ausnahmefällen: (a) an technische Dienstleister und Auftragsverarbeiter (z. B. Hosting-Provider, Content-Delivery-Netzwerke), die vertraglich zur Einhaltung der DSGVO verpflichtet sind und Daten ausschließlich nach unseren Weisungen verarbeiten; (b) aufgrund gesetzlicher Verpflichtungen, etwa bei behördlichen Auskunftsersuchen oder gerichtlichen Anordnungen; (c) zur Durchsetzung oder Verteidigung unserer rechtlichen Ansprüche. Alle Auftragsverarbeiter wurden sorgfältig ausgewählt, überprüft und vertraglich nach Art. 28 DSGVO gebunden. Eine Übermittlung in Drittländer erfolgt nur, sofern ein Angemessenheitsbeschluss der EU-Kommission besteht oder geeignete Garantien gemäß Art. 46 DSGVO vorliegen.</p><h2>5. Datenspeicherung und Sicherheit</h2><p>Wir speichern Ihre Daten nur so lange, wie es für die genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen dies vorschreiben. Server-Logfiles werden nach 30 Tagen automatisch gelöscht. Aggregierte, anonymisierte Nutzungsstatistiken können länger aufbewahrt werden. UniTeia setzt umfassende technische und organisatorische Sicherheitsmaßnahmen (TOM) ein, darunter: TLS-Verschlüsselung der gesamten Datenübertragung, Firewalls und Zugriffskontrollsysteme, regelmäßige Sicherheitsaudits, Beschränkung des Datenzugriffs auf autorisiertes Personal nach dem Need-to-Know-Prinzip sowie regelmäßige Schulungen unserer Mitarbeiter im Datenschutzrecht. Trotz dieser Maßnahmen können wir keine absolute Sicherheit garantieren. Im Falle einer Datenschutzverletzung benachrichtigen wir die zuständige Aufsichtsbehörde innerhalb von 72 Stunden sowie betroffene Nutzer, sofern ein hohes Risiko für ihre Rechte und Freiheiten besteht.</p><h2>6. Ihre Rechte</h2><p>Als betroffene Person stehen Ihnen nach der DSGVO folgende Rechte zu: (a) Recht auf Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten (Art. 15 DSGVO); (b) Recht auf Berichtigung unrichtiger Daten (Art. 16 DSGVO); (c) Recht auf Löschung Ihrer Daten, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen (Art. 17 DSGVO); (d) Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO); (e) Recht auf Datenübertragbarkeit in einem strukturierten, maschinenlesbaren Format (Art. 20 DSGVO); (f) Recht auf Widerspruch gegen die Verarbeitung Ihrer Daten (Art. 21 DSGVO). Sie haben zudem das Recht, eine Beschwerde bei der zuständigen Datenschutzaufsichtsbehörde einzureichen. Zur Ausübung Ihrer Rechte kontaktieren Sie uns bitte über die im Abschnitt Kontakt angegebenen Wege. Wir bearbeiten Ihre Anfrage unverzüglich, spätestens jedoch innerhalb eines Monats.</p><h2>7. Kontakt</h2><p>Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) und anderer nationaler Datenschutzgesetze: UniTeia / Nous Research. Für Anfragen zum Datenschutz, zur Ausübung Ihrer Betroffenenrechte oder bei allgemeinen Fragen erreichen Sie uns unter: E-Mail: privacy@uniteia.com. Wir bemühen uns, alle Anfragen innerhalb von 14 Werktagen zu beantworten. Diese Datenschutzerklärung wird regelmäßig überprüft und bei Bedarf aktualisiert. Die aktuelle Version finden Sie stets auf dieser Seite. Stand: Juni 2026.</p>',
    },
    terms: {
      title: 'Nutzungsbedingungen',
      body: `<h2>1. Annahme der Bedingungen</h2><p>Durch den Zugriff auf die Website UniTeia und die Nutzung unserer Dienste erklären Sie sich mit diesen Nutzungsbedingungen einverstanden. Wenn Sie mit einem Teil dieser Bedingungen nicht einverstanden sind, stellen Sie die Nutzung der Website bitte unverzüglich ein. Diese Bedingungen gelten für alle Besucher, Nutzer und sonstige Personen, die auf UniTeia zugreifen oder den Dienst nutzen. Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu ändern oder zu aktualisieren. Änderungen werden mit ihrer Veröffentlichung auf dieser Seite wirksam. Ihre fortgesetzte Nutzung der Website nach solchen Änderungen gilt als Annahme der neuen Bedingungen. Wir empfehlen Ihnen, diese Seite regelmäßig auf Aktualisierungen zu überprüfen.</p><h2>2. Leistungsbeschreibung</h2><p>UniTeia ist ein KI-gestützter Kurationsdienst, der Nachrichten, Analysen und redaktionelle Inhalte aus einer Vielzahl öffentlich zugänglicher Quellen aggregiert, filtert und in acht Sprachen bereitstellt. Unser Dienst umfasst: (a) die Sammlung und Aufbereitung von Inhalten aus externen Quellen mittels automatisierter KI-Prozesse; (b) die redaktionelle Einordnung und Qualitätsbewertung ausgewählter Inhalte; (c) die mehrsprachige Lokalisierung von Inhalten. UniTeia erhebt keinen Anspruch auf Vollständigkeit, Richtigkeit oder Aktualität der dargestellten Informationen. Der Dienst wird kontinuierlich weiterentwickelt; wir behalten uns vor, Funktionen jederzeit zu ändern, zu erweitern oder einzustellen.</p><h2>3. Inhaltshaftung und Haftungsausschluss</h2><p>Die auf UniTeia bereitgestellten Inhalte dienen ausschließlich allgemeinen Informationszwecken. Sie stellen keine professionelle Beratung dar — weder rechtlicher, finanzieller, medizinischer, technischer noch sonstiger Art. Handeln Sie nicht allein auf Grundlage der hier präsentierten Informationen, ohne unabhängige fachliche Beratung einzuholen. UniTeia übernimmt keine Gewähr für die inhaltliche Richtigkeit, Genauigkeit, Zuverlässigkeit, Aktualität oder Vollständigkeit der veröffentlichten Informationen. Jegliche Haftung für Schäden, die direkt oder indirekt aus der Nutzung, dem Vertrauen auf oder der Unmöglichkeit der Nutzung dieser Informationen entstehen, wird — soweit gesetzlich zulässig — ausgeschlossen. Dies gilt insbesondere für KI-generierte Zusammenfassungen, Übersetzungen und redaktionelle Bewertungen, die trotz mehrstufiger Qualitätskontrollen Fehler oder Verzerrungen enthalten können.</p><h2>4. Geistiges Eigentum</h2><p>Sämtliche von UniTeia selbst erstellten Inhalte — einschließlich, aber nicht beschränkt auf Texte, Grafiken, Logos, redaktionelle Bewertungen, Qualitätsscores, Strukturierungen, Übersetzungen und das Website-Design — sind urheberrechtlich geschützt und Eigentum von UniTeia bzw. Nous Research, sofern nicht anders angegeben. Die Vervielfältigung, Verbreitung, öffentliche Wiedergabe, Bearbeitung oder sonstige Nutzung dieser Inhalte bedarf unserer vorherigen schriftlichen Zustimmung, soweit nicht gesetzliche Ausnahmen greifen. Inhalte Dritter, die wir aggregieren oder referenzieren — insbesondere verlinkte Artikel, zitierte Textpassagen und eingebettete Medien — bleiben geistiges Eigentum ihrer jeweiligen Rechteinhaber. Ihre Darstellung auf UniTeia erfolgt im Rahmen der gesetzlichen Zitierfreiheit und stellt keine Lizenzierung oder Übertragung von Rechten dar. Das Kopieren und Weiterverbreiten externer Inhalte unterliegt den jeweiligen Nutzungsbedingungen der ursprünglichen Quelle.</p><h2>5. Nutzerverhalten</h2><p>Bei der Nutzung von UniTeia verpflichten Sie sich, keine Handlungen vorzunehmen, die gegen geltendes Recht oder diese Bedingungen verstoßen. Insbesondere ist es untersagt: (a) die Website oder zugehörige Systeme durch automatisierte Mittel wie Bots, Scraper oder Crawler über das übliche Maß hinaus zu belasten oder zu beeinträchtigen; (b) Sicherheitsmechanismen der Website zu umgehen, zu deaktivieren oder zu manipulieren; (c) die Website für rechtswidrige, betrügerische oder schädliche Zwecke zu nutzen; (d) Urheberrechte, Markenrechte oder sonstige Schutzrechte von UniTeia oder Dritten zu verletzen; (e) Inhalte von UniTeia in einer Weise zu reproduzieren oder zu verbreiten, die den Dienst oder seine Reputation schädigt. Wir behalten uns vor, bei Verstößen den Zugang zu unseren Diensten ohne Vorankündigung zu sperren und rechtliche Schritte einzuleiten.</p><h2>6. Haftungsbeschränkung</h2><p>UniTeia und seine Betreiber haften — soweit gesetzlich zulässig — nicht für direkte, indirekte, zufällige, besondere, Folge- oder exemplarische Schäden, die aus der Nutzung oder der Unmöglichkeit der Nutzung des Dienstes entstehen. Dies umfasst insbesondere, jedoch nicht abschließend: Schäden durch fehlerhafte oder verspätete Informationen, Datenverluste, Betriebsunterbrechungen, Reputationsschäden sowie entgangenen Gewinn. Die vorstehenden Haftungsausschlüsse gelten auch dann, wenn UniTeia auf die Möglichkeit solcher Schäden hingewiesen wurde. Sie gelten nicht für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, für Schäden aus grob fahrlässiger oder vorsätzlicher Pflichtverletzung sowie für Schäden aus der Verletzung wesentlicher Vertragspflichten (Kardinalpflichten). In letzterem Fall ist die Haftung auf den bei Vertragsschluss vorhersehbaren, vertragstypischen Schaden begrenzt. Einige Rechtsordnungen lassen den Ausschluss oder die Beschränkung bestimmter Haftungsarten nicht zu; in diesem Umfang gelten die vorstehenden Einschränkungen für Sie möglicherweise nicht.</p><h2>7. Links zu Dritten</h2><p>UniTeia enthält Verweise und Links zu externen Websites und Ressourcen Dritter. Diese Links werden ausschließlich zu Informationszwecken und als Quellenangabe bereitgestellt. Wir haben keinen Einfluss auf den Inhalt, die Verfügbarkeit, die Datenschutzpraktiken oder die rechtlichen Bedingungen dieser externen Seiten. Die Aufnahme eines Links stellt keine Billigung oder Empfehlung der verlinkten Inhalte durch UniTeia dar. Wir übernehmen keine Verantwortung oder Haftung für externe Inhalte, Produkte oder Dienstleistungen. Das Folgen eines externen Links erfolgt auf Ihr eigenes Risiko. Wir empfehlen Ihnen, die Datenschutzerklärungen und Nutzungsbedingungen jeder von Ihnen besuchten externen Website zu lesen. Sollten Sie auf einen problematischen Link aufmerksam werden, informieren Sie uns bitte über die angegebenen Kontaktwege.</p><h2>8. Anwendbares Recht und Gerichtsstand</h2><p>Diese Nutzungsbedingungen und alle Streitigkeiten, die sich aus oder im Zusammenhang mit der Nutzung von UniTeia ergeben, unterliegen dem Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG). Für alle Streitigkeiten aus oder im Zusammenhang mit diesen Bedingungen ist — soweit gesetzlich zulässig — der Gerichtsstand am Sitz des Betreibers vereinbart. Für Verbraucher gilt der gesetzliche Gerichtsstand ihres Wohnsitzes oder Aufenthaltsortes, soweit dieser in der Europäischen Union liegt. Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter http://ec.europa.eu/consumers/odr/ erreichen können. UniTeia ist zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder verpflichtet noch bereit.</p><h2>9. Kündigung und Beendigung</h2><p>Diese Bedingungen bleiben in Kraft, bis sie durch Sie oder UniTeia gekündigt werden. Sie können die Bedingungen jederzeit dadurch beenden, dass Sie die Nutzung unserer Website und Dienste einstellen. UniTeia kann diesen Vertrag — auch ohne Vorankündigung und ohne Angabe von Gründen — kündigen und Ihren Zugang zur Website sperren, insbesondere bei Verstößen gegen diese Nutzungsbedingungen oder geltendes Recht. Mit Beendigung dieses Vertragsverhältnisses erlöschen Ihre Nutzungsrechte an den Diensten von UniTeia. Die Bestimmungen dieser Bedingungen, die ihrer Natur nach über die Beendigung hinaus fortbestehen sollen — insbesondere Haftungsbeschränkung, geistiges Eigentum, anwendbares Recht und Gerichtsstand — bleiben von einer Kündigung unberührt und gelten fort.</p><h2>10. Kontakt</h2><p>Für Fragen, Anmerkungen oder Mitteilungen zu diesen Nutzungsbedingungen kontaktieren Sie uns bitte unter: E-Mail: legal@uniteia.com. Wir bemühen uns, alle Anfragen innerhalb von 14 Werktagen zu beantworten. Möchten Sie eine Rechtsverletzung melden oder eine inhaltliche Beanstandung einreichen, nutzen Sie bitte dieselbe E-Mail-Adresse mit dem Betreff „Content Concern". Wir nehmen alle Meldungen ernst und prüfen sie sorgfältig. Diese Nutzungsbedingungen wurden zuletzt im Juni 2026 aktualisiert.</p>`,
    },
  },
  sketchnote: {
    template01: {
      title: 'Template 01 — Praktischer Visual-Explainer',
      subtitle: 'Erkläre Konzepte schnell mit visueller Logik',
      postIt: 'Sketchnotes + Code + Klarheit = Schneller lernen',
      mascotBubble: 'Machen wir es visuell.',
      steps: {
        hook: {
          kind: 'Hook',
          title: 'MCP für Devs',
          body: 'Verbinde KI-Agenten mit jedem Tool. Sicher. Zuverlässig. Erweiterbar.',
        },
        mistake: {
          kind: 'Häufiger Fehler',
          title: 'Zu glauben, MCP ist einfach eine weitere API.',
          body: 'APIs stellen Funktionen bereit. MCP geht weiter.',
          postIt: 'APIs stellen Funktionen bereit. MCP orchestriert Fähigkeiten für Agenten.',
        },
        analogy: {
          kind: 'Visuelle Analogie',
          title: 'MCP ist der Hub, der Agenten mit Tools verbindet.',
          body: 'Ein Protokoll. Viele Tools. Der Agent bleibt fokussiert.',
          items: ['Suche', 'Datenbank', 'Dateien', 'APIs'],
          agentLabel: 'KI-Agent',
        },
        diagram: {
          kind: 'Arbeitsdiagramm',
          title: 'So funktioniert MCP Ende zu Ende',
          body: 'Findet Q1-Umsatz\nVersteht und plant\nRouting, Auth, Kontext, Sicherheit\nFührt echte Arbeit aus\nStrukturierte Antwort',
          flow: ['Nutzer', 'KI-Agent', 'MCP-Server', 'Tools', 'Antwort'],
        },
        example: {
          kind: 'Praktisches Beispiel',
          title: 'Beispiel: Tool-Aufruf via MCP',
          body: 'Der Agent fragt via MCP. Der Server findet das passende Tool und führt aus.',
          caption: 'JSON-RPC-Anfrage',
        },
        use: {
          kind: 'Wann nutzen',
          title: 'Nutze MCP, wenn…',
          useHeader: 'Nutze MCP, wenn',
          useItems: [
            'Du mehrere Tools oder Datenquellen hast',
            'Du sicheren, kontrollierten Zugriff brauchst',
            'Du Agenten mit Kontext & Sicherheit handeln lassen willst',
            'Du Tools oder Teams skalieren willst',
          ],
          dontHeader: 'Nutze MCP nicht, wenn',
          dontItems: [
            'Du nur eine einfache API aufrufst',
            'Du keine Agent-Orchestrierung brauchst',
            'Du eine leichte Frontend-Integration willst',
            'Du nur einen öffentlichen Endpunkt freigibst',
          ],
        },
        pitfalls: {
          kind: 'Häufige Fallstricke',
          title: 'Vermeide diese Fallstricke:',
          items: [
            'Tools ohne Auth & Guardrails freigeben',
            'Den Agenten mit zu vielen Tools überladen.',
            'Kontext, Logging und Observability ignorieren.',
          ],
          tipHeader: 'Design für Sicherheit, Klarheit und Observability.',
          tip: 'Plane die Tool-Oberfläche, bevor du irgendetwas verdrahtest.',
        },
        nextStep: {
          kind: 'Nächster Schritt',
          title: 'Dein nächster Schritt:',
          items: [
            'Wähle ein echtes Tool zum Verbinden',
            'Designe das Tool-Schema',
            'Implementiere den MCP-Endpoint',
            'Füge Auth & Berechtigungen hinzu',
            'Teste mit deinem Agenten',
            'Füge Logging & Monitoring hinzu',
            'Dokumentiere für dein Team',
          ],
          closingNote: 'Starte klein. Liefere eine Fähigkeit. Iteriere.',
        },
      },
      tags: {
        visualLogic: 'Visuelle Logik',
        devFriendly: 'Dev-freundlich',
        practicalByDesign: 'Praktisch by Design',
      },
      level: 'Für Einsteiger → Fortgeschrittene',
      footer: 'Mit ❤️ für Lernende, Vibe-Coder und Builder gemacht. Vom UniTeia & LERMF-Team.',
    },
    template02: {
      title: 'Template 02 — Code-Rezept / Mini Build',
      subtitle: 'Lehre praktische Implementation, schnell.',
      postIt: 'Sketchnotes + Code + Klarheit + Schneller lernen',
      mascotBubble: 'Los, bauen wir.',
      steps: {
        result: {
          kind: 'Ergebnis',
          title: 'Endergebnis',
          body: 'Live-Zeichnen mit Canvas',
          caption: 'Sanfte Echtzeit-Tinte',
        },
        install: {
          kind: 'Installation',
          title: 'Füge die magische Freehand-Engine hinzu.',
          body: 'Ein Paket, null Konfig.',
          command: '$ npm install perfect-freehand',
          output: 'added 1 package, audited 1 package\nfound 0 vulnerabilities',
        },
        code: {
          kind: 'Code',
          title: 'Minimaler Code',
          body: 'Erfasse Punkte, erhalte einen sanften Strich.',
          caption: 'JavaScript ESM',
        },
        howItWorks: {
          kind: 'Wie es funktioniert',
          title: 'Vom Input zur schönen Tinte.',
          body: 'Jedes Pointer-Event wird ein Strich.',
          flow: ['Mouse/Touch', 'Punkte', 'Spline (Glatt)', 'Canvas (Zeichnen)'],
          caption: 'Jedes Pointer-Event wird ein Strich.',
        },
        upgrade: {
          kind: 'Upgrade-Ideen',
          title: 'Mach es nützlich. Mach es deins.',
          body: 'Drei schnelle Wins, um weiterzukommen.',
          items: [
            {
              name: 'Speichern & Wiederöffnen',
              desc: 'Zeichnung als JSON speichern. Jederzeit wieder laden.',
            },
            { name: 'Undo / Redo', desc: 'Stack aus Strichen für reibungslose History halten.' },
            { name: 'Bild exportieren', desc: 'Canvas als PNG exportieren.' },
          ],
          caption: 'Drei schnelle Wins.',
        },
      },
      cta: 'Von der Idee zur Implementation',
      tags: {
        visualLogic: 'Visuelle Logik',
        devFriendly: 'Dev-freundlich',
        practicalByDesign: 'Praktisch by Design',
      },
      footer: 'Mit ❤️ für Lernende, Vibe-Coder und Builder gemacht. Vom UniTeia & LERMF-Team.',
    },
    template03: {
      title: 'Template 03 — Entscheidungs-Map / Visueller Vergleich',
      subtitle: 'Optionen vergleichen und schnell entscheiden',
      postIt: 'Sketchnotes + Code + Klarheit + Schneller lernen',
      mascotBubble: 'Wähle das beste Tool mit Logik.',
      panels: {
        question: {
          kind: 'Frage',
          title: 'Welches Whiteboard solltest du nutzen?',
          subtitle: '4 starke Optionen. Unterschiedliche Stärken.',
          tipTitle: 'Pro-Tipp',
          tip: 'Es gibt kein „Bestes“ — nur das Beste für deinen Use Case.',
        },
        options: {
          kind: 'Optionen',
          title: 'Options-Map',
          options: [
            { name: 'tldraw desktop', desc: 'App-ready. Volle Erfahrung. Integriert.' },
            { name: 'tldraw SDK', desc: 'In deiner App einbetten. Volle Kontrolle. Deine UI.' },
            {
              name: 'perfect-freehand + canvas',
              desc: 'Ultra-leicht. Top-Performance. Unendlicher Canvas.',
            },
            { name: 'Excalidraw', desc: 'Einfache Optik. Open Source. Schnell zu shippen.' },
          ],
        },
        decision: {
          kind: 'Entscheidung',
          title: 'Entscheidungslogik',
          subtitle: 'Ja/Nein beantworten, erstes Match nehmen.',
          rules: [
            { question: 'Willst du eine direkt nutzbare App?', yesTo: 'tldraw desktop' },
            { question: 'Willst du das Whiteboard in deiner App einbetten?', yesTo: 'tldraw SDK' },
            {
              question: 'Brauchst du ultraleicht + beste Performance?',
              yesTo: 'perfect-freehand + canvas',
            },
            { question: 'Willst du schlichten Look und Open Source?', yesTo: 'Excalidraw' },
          ],
          bottomNote: 'Von oben nach unten antworten. Nimm das erste „Ja“.',
        },
        summary: {
          kind: 'Zusammenfassung',
          title: 'Empfehlungen im Überblick',
          options: [
            {
              name: 'tldraw desktop',
              verdict: 'Am besten, wenn du eine komplette Whiteboard-App sofort nutzen willst.',
            },
            {
              name: 'tldraw SDK',
              verdict:
                'Am besten, wenn du das Whiteboard in deinem Produkt einbetten und anpassen willst.',
            },
            {
              name: 'perfect-freehand + canvas',
              verdict: 'Am besten, wenn du maximale Performance und minimales Bundle brauchst.',
            },
            {
              name: 'Excalidraw',
              verdict:
                'Am besten, wenn du Einfachheit, Open Source und eine saubere Zeichen-Experience willst.',
            },
          ],
          closingNote: 'Wähle das Tool, das zu deinen Constraints, Team und UX-Zielen passt.',
        },
      },
      cta: 'Schneller Vergleich für Builder',
      tags: {
        visualLogic: 'Visuelle Logik',
        devFriendly: 'Dev-freundlich',
        practicalByDesign: 'Praktisch by Design',
      },
      footer: 'Mit ❤️ für Lernende, Vibe-Coder und Builder gemacht. Vom UniTeia & LERMF-Team.',
    },
  },
  canva: {
    hero: {
      title: 'Das Signal, auf dem du bauen kannst',
      subtitle: 'Sechs Szenen, eine Entscheidung',
      cta: 'Canvas öffnen',
    },
    concept: {
      central: 'Warum das jetzt zählt',
      satellite: { '1': 'Schnellere Entscheidungen', '2': 'Klareres Signal' },
    },
    code: {
      step: {
        '1': {
          title: 'Verdrahte das Wesentliche',
          body: 'Zwanzig Zeilen, drei Dateien, ein lauffähiger Flow.',
        },
        '2': { title: 'Füge die nächste Schicht hinzu' },
      },
    },
    compare: {
      option: { a: 'Selbst bauen', b: 'Plattform nutzen' },
      decision: { yes: 'Ja, wenn es sich selbst trägt', no: 'Nein, die Plattform ist schon da' },
    },
    timeline: {
      milestone: { '1': 'Heute: eine Shape', '2': 'Sechs Monate: ein vollständiger Canvas' },
    },
    summary: {
      takeaway: {
        '1': 'Starte kleiner als sich richtig anfühlt',
        '2': 'Wiederverwendung schlägt Neuerfindung',
      },
      nextstep: 'Baue das Kleinste, das funktioniert',
    },
  },
  curation: {
    trendingHeader: 'KI & Robotik Trends',
    topReposHeader: 'Top Repos der Woche',
    newsHeader: 'Nachrichten des Tages',
    randomArticleHeader: 'Zufälliger Artikel',
    randomArticleAria: 'Zufälliger Artikel: {title}',
    emptyMessage: 'Trends nicht verfügbar — später erneut versuchen',
    errorMessage: 'Fehler beim Laden der Trenddaten',
    retryAria: 'Erneut laden',
    relativeNow: 'jetzt',
    relativeUpdated: 'aktualisiert',
    noDescription: 'Keine Beschreibung',
    bauhaus: {
      pulseCheck: 'Pulsprüfung',
      trendingHeader: 'Trend\nIntelligenz',
      liveStream: 'Live-Stream',
      globalSignals: 'Globale Signale',
      signalLost: 'Signal verloren',
      noSignals: 'Keine Signale',
      recommendedInsight: 'Empfohlener Einblick',
      goCTA: 'LOS →',
      status: {
        connecting: 'Verbinden...',
        error: 'Fehler',
        staticCache: 'Statischer Cache',
        noData: 'Keine Daten',
        synchronized: 'Synchronisiert',
      },
      fallback: {
        message1: 'Live-Feed nicht verfügbar ({err}). Zeige kuratierten Inhalt.',
        message2: 'Live-Feed ratenbegrenzt. Zeige kuratierten Inhalt.',
      },
      card: {
        repo: 'REPO',
        stars: 'Sterne',
        by: 'Von',
        comments: 'Kommentare',
      },
    },
  },
}
