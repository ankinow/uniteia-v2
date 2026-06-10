1|---
2|slug: magica-quickstart
3|lang: es
4|title: Primeros Pasos con Magica
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
62|# Primeros pasos con Magica
63|
64|## Crea tu cuenta
65|

> 💡 **Aviso de transparencia:** UniTeia puede recibir una comisión por registros a través de enlaces en esta página. Esto no afecta nuestra evaluación. Consulta nuestra [política de ética](/ethics).

66|Visita [try.magica.com/clique-serio](https://try.magica.com/clique-serio) y regístrate en el plan gratuito; no se requiere tarjeta de crédito. Usa el código promocional **GXZMYCP** en la [página de recompensas](https://try.magica.com/redeem) para obtener **10M de créditos extra** (perfecto para videos, podcasts y voz). El plan gratuito te da acceso limitado a todos los modelos principales, suficiente para evaluar la plataforma a fondo antes de comprometerte.
67|
68|Una vez registrado, llegas al espacio de trabajo de Magica. La interfaz tiene tres zonas principales: el selector de modelos (arriba), el espacio de conversación (centro) y el cajón de herramientas (barra lateral derecha con más de 5900 herramientas preconstruidas).
69|
70|## Tu primera consulta multimodelo
71|
72|Haz clic en el selector de modelos en la parte superior y habilita 2 o 3 modelos. Empieza con [GPT-4o](https://openai.com), [Claude Opus 4](https://anthropic.com) y Gemini 2.5 Pro. Escribe una pregunta en el campo de entrada y presiona enviar. Magica envía tu consulta a todos los modelos seleccionados simultáneamente y muestra las respuestas una al lado de la otra.
73|
74|Esta comparación de múltiples modelos es la función estrella de Magica. Inmediatamente ves cómo cada modelo aborda el mismo prompt: Claude tiende a un análisis exhaustivo, GPT a la acción práctica, Gemini a una síntesis equilibrada. Con el tiempo, aprendes en qué modelo confiar para cada tipo de tarea.
75|
76|## Genera tu primera imagen
77|
78|Abre el cajón de herramientas y cambia a la pestaña Imagen. Selecciona FLUX 2 Max en el menú desplegable de modelos. Escribe un prompt: sé descriptivo pero no demasiado elaborado. Haz clic en generar. En cuestión de segundos tendrás cuatro variaciones para elegir.
79|
80|Usa el panel de edición para refinar: mejora la resolución de la variante elegida, elimina el fondo o regenera regiones específicas con inpainting. Magica integra estas herramientas de edición en la misma interfaz; no es necesario abrir Photoshop ni un editor de IA aparte.
81|
82|## Crea un flujo de trabajo simple
83|
84|Los flujos de trabajo son donde Magica trasciende un simple chatbot. Haz clic en la pestaña Flujos de trabajo y selecciona Nuevo flujo de trabajo. Verás un editor visual de nodos: arrastra un nodo de Entrada de texto, conéctalo a un nodo Generar imagen (FLUX 2 Max), luego a un nodo de Mejora de resolución y, finalmente, a un nodo de Exportación.
85|
86|Configura la entrada de texto para que acepte una descripción de producto. El flujo de trabajo hará lo siguiente: generar una imagen del producto a partir de la descripción → mejorar su resolución 2x → exportar el PNG final. Todo este proceso se ejecuta con un solo clic. Puedes guardarlo como una aplicación de flujo de trabajo reutilizable y compartirla con tu equipo.
87|
88|## Exportar e integrar
89|
90|Cada flujo de trabajo se puede publicar como una aplicación accesible a través de la API. Ve a tu flujo de trabajo, haz clic en Publicar, y Magica genera un endpoint de API con entradas dinámicas para los parámetros de tu flujo de trabajo. Ahora puedes llamarlo desde tu propia aplicación:
91|
92|```bash
93|curl -X POST "https://api.magica.com/v1/workflows/run" \
94|  -H "Authorization: Bearer YOUR_API_KEY" \
95|  -H "Content-Type: application/json" \
96|  -d '{"inputs": {"description": "A minimalist desk lamp"}, "webhook": "https://your-server.com/webhook"}'
97|```
98|
99|## Próximos pasos
100|
101|Una vez que te sientas cómodo con lo básico, explora:
102|
103|- **Configuración del servidor MCP**: conecta Magica con tus propias herramientas y fuentes de datos.
104|- **Memoria del agente**: proporciona a tus flujos de trabajo un contexto persistente entre sesiones.
105|- **Espacios de trabajo en equipo**: colabora en flujos de trabajo con recursos compartidos e historial de versiones.
106|- **Herramientas personalizadas**: escribe tus propias herramientas MCP que los agentes de Magica puedan descubrir y utilizar.
107|