# 🌸 Orquidia Init - Server Initialization Wizard

> Mini-App para inicialização do Orquidia Ops Center

## 📋 Sobre

O **Orquidia Init** é um wizard de inicialização standalone que configura automaticamente o Orquidia Ops Center em sua máquina local. Ele verifica pré-requisitos, coleta credenciais e prepara o ambiente para execução.

## 🚀 Uso Rápido

### Opção 1: Clone do Repositório

```bash
git clone https://github.com/LERMF/orquidia-init.git
cd orquidia-init
npm install
npm start
```

### Opção 2: Download Direto

```bash
# Download e extração
curl -L https://github.com/LERMF/orquidia-init/archive/main.tar.gz | tar xz
cd orquidia-init-main
npm install
npm start
```

### Opção 3: npx (Sem Instalação)

```bash
npx @orquestra/orquidia-init
```

## 📦 Pré-requisitos

- **Node.js** >= 18.0.0
- **Bun** >= 1.3.0 (opcional, mas recomendado)
- **Git**
- **Acesso à Internet** (para APIs)

## 🔧 O que o Wizard Faz

1. **Verificação de Sistema**
   - Node.js/Bun version
   - Memória disponível (mínimo 500MB livre)
   - Espaço em disco
   - Conectividade de rede

2. **Coleta de Credenciais**
   - Hyperbrowser API Key
   - Gemini API Key
   - Cloudflare API Token
   - Cloudflare Account ID

3. **Configuração do Ambiente**
   - Cria arquivo `.env`
   - Configura D1 Database
   - Define limites de memória

4. **Testes de Conexão**
   - Valida APIs
   - Testa D1 Database
   - Verifica scraping

5. **Instalação do Orquidia**
   - Clone do repositório
   - Instalação de dependências
   - Build do projeto

## 🏗️ Estrutura

```
orquidia-init/
├── src/
│   ├── index.js          # Entry point
│   ├── wizard.js         # Wizard logic
│   ├── checks.js         # System checks
│   ├── api-tests.js      # API validation
│   └── setup.js          # Installation
├── templates/
│   └── env.template      # .env template
├── package.json
└── README.md
```

## 📝 Configuração Manual (Alternativa)

Se preferir configurar manualmente, crie um arquivo `.env`:

```env
# API Keys
HYPERBROWSER_API_KEY=hb_xxx
GEMINI_API_KEY=AIzaSyxxx
CF_API_TOKEN=xxx
CF_ACCOUNT_ID=52024f99754ec4d76806e59dbd295098

# Database
D1_DATABASE_ID=8396cb37-422a-4ea4-ad16-16372cbc6224
D1_DATABASE_NAME=uniteia-db

# System
MEMORY_LIMIT_MB=500
MAX_CONCURRENT_OPS=2
CONTENT_TONE=professional
AUTO_PUBLISH=false
```

## 🔐 Segurança

- Credenciais são armazenadas apenas localmente em `.env`
- Nunca compartilhe seu arquivo `.env`
- Use tokens com escopo limitado (D1 apenas)

## 🆘 Troubleshooting

### Erro: "Memória insuficiente"
```bash
# Feche aplicativos desnecessários
# Ou reduza MEMORY_LIMIT_MB para 300
```

### Erro: "API Key inválida"
```bash
# Verifique se as chaves estão ativas:
# - Hyperbrowser: https://hyperbrowser.com
# - Gemini: https://makersuite.google.com
# - Cloudflare: https://dash.cloudflare.com
```

### Erro: "D1 Database não encontrado"
```bash
# Crie o banco via wrangler:
wrangler d1 create uniteia-db
```

## 📊 Requisitos de Hardware

| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| RAM Livre | 500MB | 1GB |
| Disco | 1GB | 5GB |
| CPU | 2 cores | 4 cores |
| Rede | 1Mbps | 10Mbps |

## 🤝 Contribuição

Issues e PRs são bem-vindos no [GitHub](https://github.com/LERMF/orquidia-init).

## 📄 Licença

MIT © NeoTriad

---

**Orquidia** - Inteligência Artificial para Operações de Conteúdo
