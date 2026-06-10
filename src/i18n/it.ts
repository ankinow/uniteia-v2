import type { TranslationStrings } from './types'

// Using English as a placeholder for the stub
export const it: TranslationStrings = {
  nav: {
    home: 'Home',
    about: 'Chi siamo',
    blog: 'Blog',
    projects: 'Progetti',
    contact: 'Contatto',
    topics: 'Argomenti',
    search: 'Cerca',
    niches: 'Nicchie',
    breadcrumb: {
      label: 'Sei qui:',
      signals: 'Insights',
    },
  },
  sidebar: {
    interfaceLabel: 'Interfaccia Compatta',
  },
  footer: {
    copyright: '© {year} UniTeia. Tutti i diritti riservati.',
    madeWith: "Fatto con ♥ per l'IA decentralizzata",
    links: {
      privacy: 'Informativa sulla Privacy',
      terms: 'Termini di Servizio',
      source: 'Codice Sorgente',
    },
  },
  langSwitcher: {
    label: 'Lingua',
    current: 'Lingua attuale: {lang}',
    available: 'Lingue disponibili',
  },
  errorPages: {
    '404': {
      title: 'Pagina non trovata',
      message: 'La pagina che stai cercando non esiste o è stata spostata.',
      backHome: "Torna all'Apex",
    },
    '500': {
      title: 'Errore del server',
      message: 'Qualcosa è andato storto dalla nostra parte. Riprova più tardi.',
      retry: 'Riprova',
    },
  },
  fallbackBanner: {
    message: 'Questo contenuto non è disponibile nella tua lingua. Viene mostrato in inglese.',
    dismiss: 'Chiudi',
  },
  article: {
    subjectsLabel: 'Argomenti',
    sourcesLabel: 'Fonti',
    published: 'Pubblicato',
    updated: 'Aggiornato',
    byAuthor: 'di {author}',
    version: 'v{version}',
    readInLang: 'Leggi in {lang}',
    magica: {
      insight: {
        title: 'Magica: Il Centro di Comando AI',
        body: "Magica unifica ingegneria dei prompt, routing dei modelli e valutazione in un'unica interfaccia.",
      },
      evidence: {
        title: 'Visualizzazione del Flusso di Lavoro',
        alt: 'Schermata del costruttore di flussi di lavoro Magica',
      },
      architecture: {
        title: 'Architettura',
        point1: 'Concatenamento di prompt basato su nodi',
        point2: 'Routing di fallback multi-modello',
        point3: 'Telemetria di latenza in tempo reale',
      },
      cta: {
        title: 'Inizia a Costruire',
        body: 'Prova Magica gratuitamente — senza carta di credito.',
        button: 'Visita Magica',
      },
    },
    canvaMagicaProduction: {
      magicaWorkflowBuilder: 'Costruttore di Flusso di Lavoro Magica',
      unifiedPromptEngineering:
        "Ingegneria dei prompt, routing dei modelli e valutazione unificati in un'interfaccia",
      magicaCommandCenter: 'Magica: Il Centro di Comando AI',
      magicaDescription:
        "Magica unifica l'ingegneria dei prompt, il routing dei modelli e la valutazione in un'interfaccia",
      aiProcessing: 'Elaborazione AI',
      nodeBasedPromptChaining: 'Concatenamento di prompt basato su nodi',
      architecture: 'Architettura',
      multiModelFallback: 'Routing fallback multi-modello',
      startBuilding: 'Inizia a Costruire',
      tryMagicaFree: 'Prova Magica gratuitamente — senza carta di credito',
      visitMagica: 'Visita Magica',
      qualityScore: 'Punteggio di Qualità',
      languages: 'Lingue',
      workflowVisualization: 'Visualizzazione del Flusso di Lavoro',
      keyMetrics: 'Metriche Chiave',
      workflowSteps: 'Passaggi del Flusso',
      poweredBy: 'Offerto da',
    },
    canvaMagica: {
      workflowTitle: 'Costruttore di Flussi di Lavoro Magica',
      inputLabel: 'INPUT',
      aiProcessing: {
        title: 'ELABORAZIONE AI',
        subtitle: 'Concatenamento di prompt basato su nodi',
      },
      qualityScore: '',
      languages: '8 lingue',
      outputLabel: 'Prompt → Router di Modelli → Output',
    },
  },
  niche: {
    topicsLabel: 'Argomenti',
    exploreNiche: 'Esplora {niche}',
    articleCount: '{count} articoli',
    allNiches: 'Tutti gli argomenti',
  },
  editorial: {
    verdictLabel: 'Verdict',
    trusted: 'Affidabile',
    caution: 'Attenzione',
    flagged: 'Segnalato',
    qualityScore: '',
    editorialQuality: 'Qualità Editoriale',
  },
  dopamineCard: {
    readMore: 'Leggi di più',
  },
  signal: {
    qualityLabel: '',
    sourceCount: '{count} fonti',
    sources: 'fonti',
    freshnessLabel: '',
  },
  search: {
    placeholder: 'Cerca argomenti, articoli...',
    resultsFor: 'Risultati per "{query}"',
    noResults: 'Nessun risultato',
    noResultsHint: 'Prova con parole chiave diverse o sfoglia i nostri argomenti',
    resultCount: '{count} risultati',
    searchTitle: 'Cerca',
    searchDescription: 'Cerca articoli e argomenti su UniTeia',
  },
  seo: {
    siteName: 'UniTeia OS',
    articleTitleTemplate: '{title} | UniTeia OS',
    topicsTitle: 'Argomenti IA',
    topicsDescription:
      'Esplora la nostra lista curata di argomenti e nicchie di Intelligenza Artificiale.',
  },
  homepage: {
    featuredSignals: 'Insights in Evidenza',
    knowledgeClusters: 'Cluster',
    frontierStreams: 'Frontiera',
    frontierStreamsOne: 'Frontiera',
    signalCount: '{count} insights',
    signalCountOne: '1 insight',
    curatedAcross: 'curati in {count} nicchie',
    curatedAcrossOne: 'curato in 1 nicchia',
    noSignals: 'Nessun insight pubblicato',
    browseTopics: 'Sfoglia argomenti',
    networkState: 'Stato della Rete UniTeia',
    signalIntake: 'Assunzione Insights',
    deliveryLayer: 'Livello di Consegna',
    bentoTagline: 'Qwik islands + P3 wide-gamut',
    footerMadeWith:
      "Realizzato con ❤️ per l'IA decentralizzata dal team UniTeia & LERMF. Dando potere a vibe-coder e costruttori in tutto il mondo.",
  },
  onboarding: {
    step1: {
      title: 'Costruito con passione per la community.',
      subtitle: 'Filtriamo il rumore così puoi fare vibe-coding.',
      desc: 'Il nostro team UniTeia & LERMF si immerge ogni giorno in migliaia di fonti, curando le migliori intuizioni con amore e dedizione. Così puoi concentrarti sulla costruzione.',
    },
    step2: {
      title: 'Curato da umani, potenziato dalla tecnologia.',
      cards: [
        {
          label: 'Ricerca',
          desc: 'Selezioniamo e valutiamo attentamente le fonti grezze per una fiducia assoluta.',
        },
        {
          label: 'Verifica',
          desc: 'Ogni affermazione è controllata con dedizione secondo gli standard della nostra community.',
        },
        {
          label: 'Consegna',
          desc: 'Contenuti splendidamente formattati e localizzati appositamente per te.',
        },
      ],
    },
    step3: {
      title: 'Disponibile in 8 lingue.',
      desc: 'Solo ciò che conta. Consegnato nella tua lingua, alle tue condizioni.',
      badge: '8 voci',
    },
  },
  agent: {
    status: {
      idle: 'Aether OS · Inattivo',
      thinking: 'Aether OS · Pensando',
      processing: 'Aether OS · Elaborazione',
      complete: 'Aether OS · Completato',
      error: 'Aether OS · Errore',
    },
    mcpTooltip: 'Server MCP Connesso · 7 strumenti attivi',
  },
  generativeHero: {
    curating: '{niche} insights oggi',
    topNiches: 'Principali Nicchie',
    apexBadge: 'APEX · Live',
    headline: 'Segnali di frontiera da {count} canali',
    headlineOne: 'Segnale di frontiera da 1 canale',
    tracksLabel: 'canali attivi',
    tracksLabelOne: 'canale attivo',
  },
  legal: {
    privacy: {
      title: 'Informativa sulla Privacy',
      body: `<h2>1. Raccolta Dati</h2><p>UniTeia raccoglie esclusivamente i dati strettamente necessari per fornire il servizio di curatione di contenuti sull'intelligenza artificiale. I dati raccolti includono: indirizzo IP per la geolocalizzazione approssimativa ai fini della selezione della lingua; tipo di browser e sistema operativo per ottimizzare l'esperienza di navigazione; pagine visitate e tempo di permanenza in forma anonima e aggregata per analisi statistiche; dati forniti volontariamente dall'utente tramite moduli di contatto o iscrizione alla newsletter, quali nome e indirizzo email. Non raccogliamo dati sensibili ai sensi del Regolamento Generale sulla Protezione dei Dati (GDPR) e non effettuiamo profilazione automatizzata degli utenti.</p><h2>2. Utilizzo Dati</h2><p>I dati raccolti sono utilizzati esclusivamente per le seguenti finalità: erogazione e miglioramento del servizio di curatione UniTeia; personalizzazione dell'esperienza di navigazione in base alla lingua e alle preferenze dell'utente; analisi statistiche aggregate per comprendere le tendenze di utilizzo e migliorare i nostri contenuti; comunicazione con l'utente che ne abbia fatto esplicita richiesta tramite i nostri canali di contatto; adempimento di obblighi legali e regolamentari applicabili. In nessun caso i dati raccolti vengono utilizzati per finalità di marketing automatizzato, profilazione comportamentale o cessione a terzi a fini commerciali.</p><h2>3. Cookie</h2><p>UniTeia utilizza esclusivamente cookie tecnici di prima parte, essenziali per il funzionamento del sito e per garantire la sicurezza della navigazione. In particolare, utilizziamo: cookie di sessione per mantenere lo stato di navigazione, inclusa la preferenza linguistica; cookie di preferenza per ricordare le scelte dell'utente (es. lingua selezionata); cookie di sicurezza per prevenire attività fraudolente e proteggere l'integrità del servizio. Non utilizziamo cookie di profilazione, cookie di terze parti per tracciamento pubblicitario, né strumenti di analytics che raccolgano dati personali identificabili. L'utente può in qualsiasi momento gestire le preferenze sui cookie attraverso le impostazioni del proprio browser. La disabilitazione dei cookie tecnici potrebbe tuttavia compromettere la corretta fruizione del servizio.</p><h2>4. Terze Parti</h2><p>UniTeia non vende, cede, affitta o condivide i dati personali degli utenti con terze parti per finalità commerciali o di marketing. I dati possono essere condivisi esclusivamente con: fornitori di servizi infrastrutturali (hosting, CDN) che agiscono in qualità di responsabili del trattamento e sono vincolati da accordi contrattuali che garantiscono livelli adeguati di protezione dei dati; autorità competenti, esclusivamente nei casi previsti dalla legge e previa verifica della legittimità della richiesta. Tutti i fornitori di servizi terzi sono accuratamente selezionati e tenuti a rispettare standard di sicurezza e riservatezza equivalenti a quelli adottati da UniTeia, in conformità con il GDPR e la normativa italiana in materia di protezione dei dati personali.</p><h2>5. Conservazione e Sicurezza</h2><p>I dati personali sono conservati per il tempo strettamente necessario al perseguimento delle finalità per cui sono stati raccolti. In particolare: i dati di navigazione anonimizzati vengono conservati per un periodo massimo di 12 mesi; i dati forniti volontariamente tramite moduli di contatto vengono conservati per 24 mesi dall'ultima interazione; i dati relativi alla lingua preferita vengono conservati fino a quando l'utente non cancella i cookie del browser. UniTeia adotta misure tecniche e organizzative adeguate per proteggere i dati personali da accessi non autorizzati, alterazione, divulgazione o distruzione, incluse: crittografia TLS per tutte le comunicazioni; controlli di accesso rigorosi e autenticazione a più fattori per il personale autorizzato; monitoraggio continuo dei sistemi e procedure di gestione degli incidenti di sicurezza; backup regolari e piani di disaster recovery. In caso di violazione dei dati personali, UniTeia si impegna a notificare l'evento all'autorità di controllo competente e agli interessati nei termini previsti dalla normativa applicabile.</p><h2>6. I Tuoi Diritti</h2><p>Ai sensi del Regolamento Generale sulla Protezione dei Dati (GDPR - Regolamento UE 2016/679) e della normativa italiana, l'utente gode dei seguenti diritti: diritto di accesso ai propri dati personali e alle informazioni relative al loro trattamento; diritto di rettifica dei dati inesatti o incompleti; diritto alla cancellazione dei dati (diritto all'oblio) nei casi previsti dall'art. 17 del GDPR; diritto di limitazione del trattamento nelle ipotesi di cui all'art. 18 del GDPR; diritto alla portabilità dei dati, ovvero a ricevere i propri dati in un formato strutturato e a trasmetterli ad altro titolare; diritto di opposizione al trattamento per motivi connessi alla situazione particolare dell'interessato; diritto di revocare il consenso in qualsiasi momento, senza pregiudicare la liceità del trattamento basato sul consenso prestato prima della revoca; diritto di proporre reclamo all'autorità di controllo (Garante per la Protezione dei Dati Personali). Per esercitare i propri diritti, l'utente può contattare UniTeia utilizzando i recapiti indicati nella sezione Contatto. Le richieste saranno evase entro 30 giorni dalla ricezione, salvo proroga motivata comunicata all'interessato.</p><h2>7. Contatto</h2><p>Per qualsiasi domanda, richiesta o chiarimento relativo alla presente Informativa sulla Privacy o al trattamento dei dati personali, l'utente può contattare UniTeia ai seguenti recapiti: email: privacy@uniteia.com. Il Titolare del Trattamento è UniTeia, con sede operativa raggiungibile tramite i canali sopra indicati. Il Responsabile della Protezione dei Dati (DPO) è contattabile all'indirizzo dpo@uniteia.com per ogni questione relativa al trattamento dei dati personali. La presente informativa può essere soggetta a modifiche nel tempo. Eventuali aggiornamenti sostanziali saranno comunicati agli utenti mediante avviso pubblicato sul sito web con un preavviso di almeno 30 giorni. Si invita l'utente a consultare periodicamente questa pagina per verificare la versione più aggiornata dell'informativa.</p>`,
    },
    terms: {
      title: 'Termini di Servizio',
      body: `<h2>1. Accettazione dei Termini</h2><p>L'accesso e l'utilizzo del servizio UniTeia (di seguito "il Servizio") sono soggetti all'accettazione integrale dei presenti Termini di Servizio. Utilizzando il Servizio in qualsiasi modalità — inclusa la navigazione, la consultazione di contenuti, l'interazione con qualsiasi funzionalità del sito — l'utente dichiara di aver letto, compreso e accettato senza riserve i presenti Termini. Se l'utente non intende accettare i Termini, è tenuto a cessare immediatamente l'utilizzo del Servizio. UniTeia si riserva il diritto di richiedere l'accettazione esplicita dei Termini in qualsiasi momento, anche mediante meccanismi di opt-in, qualora vengano introdotte modifiche sostanziali. I presenti Termini costituiscono un accordo legalmente vincolante tra l'utente e UniTeia.</p><h2>2. Descrizione del Servizio</h2><p>UniTeia è una piattaforma editoriale multilingue di curatione di contenuti relativi all'intelligenza artificiale. Il Servizio aggrega e organizza informazioni provenienti da fonti pubbliche selezionate, applicando filtri di qualità editoriale e fornendo sintesi e analisi. Il Servizio è disponibile in otto lingue (inglese, portoghese, spagnolo, francese, tedesco, italiano, giapponese, cinese) e offre funzionalità di navigazione per argomenti e nicchie tematiche. UniTeia non produce contenuti originali basati su fonti primarie, ma opera come aggregatore curatoriale. Il Servizio è fornito "così com'è" e UniTeia non garantisce la disponibilità ininterrotta, l'assenza di errori o la completezza dei contenuti in ogni momento. UniTeia si riserva il diritto di modificare, sospendere o interrompere, temporaneamente o permanentemente, qualsiasi funzionalità del Servizio senza preavviso, fatto salvo quanto diversamente previsto dalla legge applicabile.</p><h2>3. Esclusione di Responsabilità</h2><p>Tutti i contenuti pubblicati su UniTeia sono forniti esclusivamente a scopo informativo e divulgativo. In nessun caso i contenuti costituiscono o sostituiscono: consulenza professionale di qualsiasi natura, inclusa consulenza legale, finanziaria, fiscale, medica, tecnica o strategica; raccomandazioni di investimento o suggerimenti per decisioni finanziarie; pareri accreditati o certificazioni di veridicità assoluta delle informazioni riportate. L'utente riconosce che l'utilizzo dei contenuti di UniTeia avviene a proprio esclusivo rischio e che è sua responsabilità verificare l'accuratezza, la completezza e l'attualità delle informazioni prima di prendere decisioni basate su di esse. UniTeia non assume alcuna responsabilità per eventuali danni diretti, indiretti, incidentali, consequenziali o di qualsiasi altra natura derivanti dall'utilizzo o dall'impossibilità di utilizzare il Servizio o dall'affidamento fatto sui contenuti in esso pubblicati.</p><h2>4. Proprietà Intellettuale</h2><p>Tutti i contenuti originali prodotti da UniTeia — inclusi testi, sintesi, grafici, loghi, icone, elementi di design, codice sorgente e software — sono protetti dalle leggi sul diritto d'autore e sulla proprietà intellettuale e rimangono di proprietà esclusiva di UniTeia, salvo diversamente indicato. I marchi, i nomi commerciali e i loghi di terzi eventualmente presenti nei contenuti sono di proprietà dei rispettivi titolari e vengono riprodotti a scopo informativo e di identificazione. L'utente non acquisisce alcun diritto di proprietà intellettuale sui contenuti del Servizio. È consentita la condivisione di estratti dei contenuti di UniTeia a condizione che: venga sempre citata la fonte con un collegamento ipertestuale alla pagina originale; la condivisione non avvenga a fini commerciali senza preventiva autorizzazione scritta; l'estratto non venga alterato o decontestualizzato in modo tale da modificare il significato originale. Qualsiasi utilizzo non autorizzato dei contenuti, inclusa la riproduzione integrale, la ridistribuzione sistematica o l'estrazione automatizzata mediante web scraping, è espressamente vietato e potrà essere perseguito nelle sedi legali competenti.</p><h2>5. Condotta dell'Utente</h2><p>L'utente si impegna a utilizzare il Servizio in conformità con le leggi applicabili e con i presenti Termini. È espressamente vietato: utilizzare il Servizio per finalità illecite, fraudolente o non autorizzate; tentare di accedere a porzioni riservate del Servizio, ai server o ai sistemi di UniTeia senza autorizzazione; interferire con il corretto funzionamento del Servizio, inclusi attacchi di denial of service, distribuzione di malware, tentativi di reverse engineering o manomissione dei meccanismi di sicurezza; estrarre contenuti dal Servizio mediante strumenti automatizzati (bot, scraper, crawler) senza esplicita autorizzazione scritta; violare diritti di proprietà intellettuale, privacy o altri diritti di UniTeia o di terzi. UniTeia si riserva il diritto di sospendere o bloccare l'accesso al Servizio per qualsiasi utente che violi i presenti Termini, senza necessità di preavviso e fatto salvo il diritto al risarcimento dei danni.</p><h2>6. Limitazione di Responsabilità</h2><p>Nei limiti massimi consentiti dalla legge applicabile, UniTeia, i suoi dirigenti, dipendenti, collaboratori, partner e fornitori non saranno ritenuti responsabili per: danni diretti, indiretti, incidentali, speciali, consequenziali o punitivi, inclusi a titolo esemplificativo perdita di profitti, di dati, di avviamento, interruzione dell'attività o danni alla reputazione; eventuali inesattezze, omissioni o errori nei contenuti pubblicati; la temporanea indisponibilità del Servizio dovuta a manutenzione, aggiornamenti tecnici, guasti o circostanze al di fuori del ragionevole controllo di UniTeia; condotte di terzi, inclusi i contenuti di siti web collegati tramite link. In ogni caso, la responsabilità complessiva di UniTeia per qualsiasi pretesa derivante dall'utilizzo del Servizio non potrà eccedere l'importo eventualmente pagato dall'utente a UniTeia, se applicabile, nei 12 mesi precedenti l'evento che ha dato origine alla pretesa. Le presenti limitazioni si applicano anche qualora UniTeia sia stata informata della possibilità di tali danni.</p><h2>7. Link di Terze Parti</h2><p>Il Servizio può contenere collegamenti ipertestuali a siti web, servizi o risorse di terze parti. Tali link sono forniti esclusivamente a scopo informativo e per comodità dell'utente. UniTeia: non esercita alcun controllo sui contenuti, sulle politiche sulla privacy o sulle pratiche di tali siti di terze parti; non rilascia alcuna garanzia né assume alcuna responsabilità in merito all'accuratezza, alla completezza o alla liceità dei contenuti presenti su tali siti; non implica alcuna approvazione, raccomandazione o affiliazione con i soggetti che gestiscono i siti collegati. L'utente riconosce e accetta che l'accesso a siti di terze parti avviene a proprio rischio e che è tenuto a prendere visione dei termini di servizio e delle politiche sulla privacy di ciascun sito visitato.</p><h2>8. Legge Applicabile e Foro Competente</h2><p>I presenti Termini di Servizio sono regolati e interpretati in conformità con le leggi della Repubblica Italiana. Per qualsiasi controversia derivante dall'interpretazione, dall'esecuzione o dalla validità dei presenti Termini, sarà competente in via esclusiva il Foro di Roma, fatto salvo il foro inderogabile del consumatore ai sensi del Codice del Consumo (D.Lgs. 206/2005) qualora l'utente rivesta la qualifica di consumatore ai sensi della normativa applicabile. UniTeia si impegna a perseguire la risoluzione bonaria di eventuali controversie attraverso meccanismi di risoluzione alternativa delle dispute (ADR) prima di adire le vie legali. L'utente consumatore può inoltre avvalersi della piattaforma ODR (Online Dispute Resolution) messa a disposizione dalla Commissione Europea.</p><h2>9. Risoluzione e Cessazione</h2><p>I presenti Termini rimangono in vigore fino a quando l'utente utilizza il Servizio o fino a quando non vengano modificati o revocati da UniTeia. UniTeia si riserva il diritto di: sospendere o interrompere l'accesso al Servizio per qualsiasi utente che violi i presenti Termini; modificare, sospendere o cessare il Servizio in tutto o in parte in qualsiasi momento, con o senza preavviso. In caso di risoluzione: le disposizioni dei presenti Termini che per loro natura dovessero sopravvivere alla risoluzione — incluse le sezioni relative a Proprietà Intellettuale, Esclusione di Responsabilità, Limitazione di Responsabilità e Legge Applicabile — continueranno a produrre effetti; l'utente dovrà cessare immediatamente ogni utilizzo del Servizio e distruggere qualsiasi copia dei contenuti in proprio possesso ottenuta in violazione dei presenti Termini. La risoluzione non pregiudica i diritti e gli obblighi maturati da entrambe le parti prima della data di cessazione.</p><h2>10. Contatto</h2><p>Per qualsiasi comunicazione relativa ai presenti Termini di Servizio, l'utente può contattare UniTeia ai seguenti recapiti: email: legal@uniteia.com. UniTeia si impegna a rispondere a tutte le comunicazioni ricevute entro un termine ragionevole, comunque non superiore a 30 giorni lavorativi dalla ricezione. Per le comunicazioni relative alla protezione dei dati personali, si rimanda ai contatti indicati nell'Informativa sulla Privacy. I presenti Termini di Servizio sono stati aggiornati l'ultima volta in data 1° giugno 2026. UniTeia si riserva il diritto di modificare i presenti Termini in qualsiasi momento. Le modifiche sostanziali saranno comunicate agli utenti con un preavviso di almeno 30 giorni mediante avviso pubblicato sul sito web. L'utilizzo continuato del Servizio dopo l'entrata in vigore delle modifiche costituisce accettazione dei nuovi Termini.</p>`,
    },
  },
  sketchnote: {
    template01: {
      title: 'Template 01 — Visual Explainer Pratico',
      subtitle: 'Spiega i concetti in fretta con la logica visuale',
      postIt: 'Sketchnotes + Codice + Chiarezza = Apprendimento più veloce',
      mascotBubble: 'Rendiamolo visuale.',
      steps: {
        hook: {
          kind: 'Hook',
          title: 'MCP per i dev',
          body: 'Collega agenti IA a qualsiasi tool. Sicuro. Affidabile. Estensibile.',
        },
        mistake: {
          kind: 'Errore comune',
          title: 'Pensare che MCP sia solo un’altra API.',
          body: 'Le API espongono funzioni. MCP fa di più.',
          postIt: 'Le API espongono funzioni. MCP orchestra capacità per gli agenti.',
        },
        analogy: {
          kind: 'Analogia visuale',
          title: 'MCP è l’hub che collega gli agenti ai tool.',
          body: 'Un protocollo. Molti tool. L’agente resta focalizzato.',
          items: ['Ricerca', 'Database', 'File', 'API'],
          agentLabel: 'Agente IA',
        },
        diagram: {
          kind: 'Diagramma di funzionamento',
          title: 'Come funziona MCP end-to-end',
          body: 'Trova i ricavi del Q1\nCapisce e pianifica\nInstrada, auth, contesto, sicurezza\nEsegue il lavoro vero\nRisposta strutturata',
          flow: ['Utente', 'Agente IA', 'Server MCP', 'Tool', 'Risposta'],
        },
        example: {
          kind: 'Esempio pratico',
          title: 'Esempio: chiamata a un tool via MCP',
          body: 'L’agente chiede via MCP. Il server trova il tool giusto ed esegue.',
          caption: 'Richiesta JSON-RPC',
        },
        use: {
          kind: 'Quando usarlo',
          title: 'Usa MCP quando…',
          useHeader: 'Usa MCP quando',
          useItems: [
            'Hai più tool o fonti di dati',
            'Ti serve accesso sicuro e governato',
            'Vuoi agenti che agiscono con contesto e sicurezza',
            'Prevedi di scalare tool o team',
          ],
          dontHeader: 'Non usare MCP quando',
          dontItems: [
            'Chiami solo un’API semplice',
            'Non ti serve orchestrazione di agenti',
            'Vuoi un’integrazione frontend leggera',
            'Stai solo esponendo un endpoint pubblico',
          ],
        },
        pitfalls: {
          kind: 'Trappole comuni',
          title: 'Evita queste trappole:',
          items: [
            'Esporre tool senza auth e guardrails adeguati',
            'Sovraccaricare l’agente con troppi tool.',
            'Ignorare contesto, log e osservabilità.',
          ],
          tipHeader: 'Progetta per sicurezza, chiarezza e osservabilità.',
          tip: 'Pianifica la superficie dei tool prima di cablare qualsiasi cosa.',
        },
        nextStep: {
          kind: 'Prossimo passo',
          title: 'Il tuo prossimo passo:',
          items: [
            'Scegli un tool reale da collegare',
            'Disegna lo schema del tool',
            'Implementa l’endpoint MCP',
            'Aggiungi auth e permessi',
            'Testa con il tuo agente',
            'Aggiungi log e monitoraggio',
            'Documenta per il team',
          ],
          closingNote: 'Parti piccolo. Rilascia una capacità. Itera.',
        },
      },
      tags: {
        visualLogic: 'Logica visuale',
        devFriendly: 'Dev friendly',
        practicalByDesign: 'Pratico by design',
      },
      level: 'Da principiante a intermedio',
      footer: 'Realizzato con ❤️ per studenti, vibe-coder e costruttori. Dal team UniTeia & LERMF.',
    },
    template02: {
      title: 'Template 02 — Ricetta di codice / Mini Build',
      subtitle: 'Insegna l’implementazione pratica, in fretta.',
      postIt: 'Sketchnotes + Codice + Chiarezza + Apprendimento più veloce',
      mascotBubble: 'Costruiamolo.',
      steps: {
        result: {
          kind: 'Risultato',
          title: 'Risultato finale',
          body: 'Disegno live con Canvas',
          caption: 'Inchiostro fluido in tempo reale',
        },
        install: {
          kind: 'Installazione',
          title: 'Aggiungi il magico motore freehand.',
          body: 'Un pacchetto, zero config.',
          command: '$ npm install perfect-freehand',
          output: 'added 1 package, audited 1 package\nfound 0 vulnerabilities',
        },
        code: {
          kind: 'Codice',
          title: 'Codice minimo',
          body: 'Cattura i punti, ottieni un tratto fluido.',
          caption: 'JavaScript ESM',
        },
        howItWorks: {
          kind: 'Come funziona',
          title: 'Dall’input all’inchiostro bello.',
          body: 'Ogni evento pointer diventa un tratto.',
          flow: ['Mouse/Touch', 'Punti', 'Spline (Fluida)', 'Canvas (Disegno)'],
          caption: 'Ogni evento pointer diventa un tratto.',
        },
        upgrade: {
          kind: 'Idee di upgrade',
          title: 'Rendilo utile. Rendilo tuo.',
          body: 'Tre quick win per andare oltre.',
          items: [
            { name: 'Salva & Riapri', desc: 'Salva il disegno come JSON. Ricaricalo quando vuoi.' },
            {
              name: 'Annulla / Ripeti',
              desc: 'Tieni uno stack di tratti per uno storico senza frizioni.',
            },
            { name: 'Esporta immagine', desc: 'Esporta il canvas come PNG.' },
          ],
          caption: 'Tre quick win.',
        },
      },
      cta: 'Dall’idea all’implementazione',
      tags: {
        visualLogic: 'Logica visuale',
        devFriendly: 'Dev friendly',
        practicalByDesign: 'Pratico by design',
      },
      footer: 'Realizzato con ❤️ per studenti, vibe-coder e costruttori. Dal team UniTeia & LERMF.',
    },
    template03: {
      title: 'Template 03 — Mappa decisionale / Confronto visuale',
      subtitle: 'Confronta le opzioni e scegli in fretta',
      postIt: 'Sketchnotes + Codice + Chiarezza + Apprendimento più veloce',
      mascotBubble: 'Scegli il tool migliore con logica.',
      panels: {
        question: {
          kind: 'Domanda',
          title: 'Quale lavagna scegliere?',
          subtitle: '4 ottime opzioni. Punti di forza diversi.',
          tipTitle: 'Tip pro',
          tip: 'Non esiste il “migliore” — solo il migliore per il tuo caso.',
        },
        options: {
          kind: 'Opzioni',
          title: 'Mappa delle opzioni',
          options: [
            { name: 'tldraw desktop', desc: 'App pronta. Esperienza completa. Integrata.' },
            { name: 'tldraw SDK', desc: 'Embed nella tua app. Controllo totale. La tua UI.' },
            {
              name: 'perfect-freehand + canvas',
              desc: 'Ultra-leggera. Ottime performance. Canvas infinito.',
            },
            { name: 'Excalidraw', desc: 'Estetica semplice. Open source. Veloce da spedire.' },
          ],
        },
        decision: {
          kind: 'Decisione',
          title: 'Logica decisionale',
          subtitle: 'Rispondi sì/no, segui il primo match.',
          rules: [
            { question: 'Vuoi un’app pronta all’uso?', yesTo: 'tldraw desktop' },
            { question: 'Vuoi embed della lavagna nella tua app?', yesTo: 'tldraw SDK' },
            {
              question: 'Ti serve ultra-leggera con le migliori performance?',
              yesTo: 'perfect-freehand + canvas',
            },
            { question: 'Vuoi un look semplice, pulito e open source?', yesTo: 'Excalidraw' },
          ],
          bottomNote: 'Rispondi dall’alto in basso. Prendi il primo "Sì".',
        },
        summary: {
          kind: 'Riepilogo',
          title: 'Riepilogo delle raccomandazioni',
          options: [
            {
              name: 'tldraw desktop',
              verdict: 'Meglio quando vuoi un’app lavagna completa, pronta all’uso.',
            },
            {
              name: 'tldraw SDK',
              verdict: 'Meglio quando vuoi embed e personalizzare la lavagna nel tuo prodotto.',
            },
            {
              name: 'perfect-freehand + canvas',
              verdict: 'Meglio quando ti servono performance massime e bundle minimo.',
            },
            {
              name: 'Excalidraw',
              verdict:
                'Meglio quando vuoi semplicità, open source e un’esperienza di disegno pulita.',
            },
          ],
          closingNote:
            'Scegli il tool che si adatta ai tuoi vincoli, al team e agli obiettivi di UX.',
        },
      },
      cta: 'Confronto rapido per builder',
      tags: {
        visualLogic: 'Logica visuale',
        devFriendly: 'Dev friendly',
        practicalByDesign: 'Pratico by design',
      },
      footer: 'Realizzato con ❤️ per studenti, vibe-coder e costruttori. Dal team UniTeia & LERMF.',
    },
  },
  canva: {
    hero: {
      title: 'Il segnale su cui puoi costruire',
      subtitle: 'Sei scene, una decisione',
      cta: 'Apri il canvas',
    },
    concept: {
      central: 'Perché questo conta ora',
      satellite: { '1': 'Decisioni più rapide', '2': 'Segnale più nitido' },
    },
    code: {
      step: {
        '1': { title: 'Collega le basi', body: 'Venti righe, tre file, un flusso che funziona.' },
        '2': { title: 'Aggiungi il livello successivo' },
      },
    },
    compare: {
      option: { a: 'Costruirlo da soli', b: 'Usare la piattaforma' },
      decision: { yes: 'Sì, se si ripaga', no: 'No, la piattaforma è già lì' },
    },
    timeline: { milestone: { '1': 'Oggi: uno shape', '2': 'Sei mesi: un canvas completo' } },
    summary: {
      takeaway: {
        '1': 'Inizia più piccolo di quanto sembri giusto',
        '2': 'Riusare vince su reinventare',
      },
      nextstep: 'Costruisci la cosa minima che funziona',
    },
  },
}
