# ORQUIDIA-UNITEIA ON-DEMAND ARCHITECTURE

**Data:** 2026-03-31  
**Status:** REDESIGN COMPLETO  
**Filosofia:** Zero autonomia, máximo controle on-demand

---

## 🎯 VISÃO GERAL

### Arquitetura Antiga (❌ REMOVIDO)
- Agents autônomos rodando 24/7
- Orchestrator complexo com UI
- A2A server para comunicação entre agents
- Consumo contínuo de recursos
- Geração automática de conteúdo (indesejado)

### Nova Arquitetura (✅ ON-DEMAND)
- CLI tools para geração sob demanda
- API endpoints REST para triggers manuais
- Zero processes rodando sem necessidade
- Recursos liberados quando não em uso
- Controle total do quando e o que gerar

---

## 🛠️ FERRAMENTAS ON-DEMAND

### 1. Alibaba Image Generator
**Arquivo:** `tools/alibaba-image-gen.ts`

**Uso:**
```bash
# Gerar imagem com preset
bun run tools/alibaba-image-gen.ts \
  --preset mobile-banner \
  --output mobile-banner.png

# Gerar com prompt customizado
bun run tools/alibaba-image-gen.ts \
  --prompt "Professional editorial photography..." \
  --output custom.png \
  --model wanx2.1-t2i-pro
```

**Modelos Disponíveis:**
- `wanx2.1-t2i-turbo` — Rápido, qualidade alta
- `wanx2.1-t2i-pro` — Máxima qualidade (recomendado)
- `wanx-v2` — Mais avançado (experimental)

**Presets:**
- `mobile-banner` — Banner vertical para mobile
- `tv-banner` — Banner horizontal para TV
- `streaming-hero` — Hero shot multi-dispositivos
- `content-library` — Biblioteca de conteúdo abstrata
- `quality-4k` — Close-up de display 4K

### 2. Content Generator CLI (EM DESENVOLVIMENTO)
**Arquivo:** `tools/content-generator.ts`

**Uso Futuro:**
```bash
# Gerar artigo de blog
bun run tools/content-generator.ts \
  --type blog-post \
  --topic "Como configurar UniTV na Smart TV" \
  --output apps/web/src/pages/br/unitv/blog/novo-post.mdx

# Gerar página de FAQ
bun run tools/content-generator.ts \
  --type faq \
  --questions 10 \
  --output apps/web/src/pages/br/unitv/faq.astro
```

### 3. SEO Auditor CLI (EM DESENVOLVIMENTO)
**Arquivo:** `tools/seo-auditor.ts`

**Uso Futuro:**
```bash
# Auditar todas as páginas
bun run tools/seo-auditor.ts \
  --scope all \
  --output seo-report.md

# Auditar página específica
bun run tools/seo-auditor.ts \
  --url /br/unitv/faq \
  --fix \
  --output faq-seo-fix.md
```

---

## 📡 API ENDPOINTS (ON-DEMAND)

### Endpoint: POST /api/generate/image
**Descrição:** Gera imagem usando Alibaba DashScope

**Request:**
```json
{
  "preset": "mobile-banner",
  "output": "mobile-banner.png",
  "model": "wanx2.1-t2i-pro"
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://...",
  "localPath": "/path/to/mobile-banner.png",
  "metadata": {
    "model": "wanx2.1-t2i-pro",
    "resolution": "2560x1440",
    "generatedAt": "2026-03-31T18:30:00Z"
  }
}
```

### Endpoint: POST /api/generate/content
**Descrição:** Gera conteúdo textual (blog, FAQ, etc)

**Request:**
```json
{
  "type": "blog-post",
  "topic": "Setup UniTV em 5 minutos",
  "tone": "educational",
  "length": "long"
}
```

### Endpoint: POST /api/audit/seo
**Descrição:** Audita SEO de páginas

**Request:**
```json
{
  "pages": ["/br/unitv/", "/br/unitv/faq"],
  "fixIssues": true
}
```

---

## 🚀 WORKFLOW ON-DEMAND

### Cenário 1: Novo Conteúdo de Blog
```bash
# 1. Gerar imagem de capa
bun run tools/alibaba-image-gen.ts \
  --preset streaming-hero \
  --output blog-cover.png

# 2. Mover para pasta correta
mv blog-cover.png apps/web/src/content/images/

# 3. Gerar rascunho do artigo (futuro)
bun run tools/content-generator.ts \
  --type blog-post \
  --topic "Novo recurso UniTV" \
  --output apps/web/src/pages/br/unitv/blog/novo.mdx

# 4. Auditar SEO (futuro)
bun run tools/seo-auditor.ts \
  --url /br/unitv/blog/novo \
  --fix
```

### Cenário 2: Atualizar Banners
```bash
# 1. Gerar novo banner mobile
bun run tools/alibaba-image-gen.ts \
  --preset mobile-banner \
  --output new-mobile-banner.png

# 2. Gerar novo banner TV
bun run tools/alibaba-image-gen.ts \
  --preset tv-banner \
  --output new-tv-banner.png

# 3. Substituir no código
# (Atualizar imports nos componentes)
```

### Cenário 3: Auditoria Geral
```bash
# 1. Rodar auditoria completa
bun run tools/seo-auditor.ts \
  --scope all \
  --output audit-2026-03.md

# 2. Revisar relatório
cat audit-2026-03.md

# 3. Aplicar fixes manualmente
# (Review humano necessário)
```

---

## 📦 INSTALAÇÃO

### Pré-requisitos
- Bun 1.3+ instalado
- API key do Alibaba DashScope
- Node.js 20+ (fallback)

### Setup
```bash
# Instalar dependências
cd /root/orquidia-uniteia
bun install

# Configurar API key (opcional, já está no código)
echo "DASHSCOPE_API_KEY=sk-..." >> .env

# Testar geração
bun run tools/alibaba-image-gen.ts \
  --preset mobile-banner \
  --output test.png
```

---

## 🔧 CUSTOMIZAÇÃO

### Adicionar Novo Preset
Editar `tools/alibaba-image-gen.ts`:

```typescript
const PRESETS = {
  // ... presets existentes
  
  'novo-preset': `Seu prompt bleeding-edge aqui, 
  professional photography, ultra-detailed 8k, 
  cinematic lighting, masterpiece quality`,
}
```

### Adicionar Novo Modelo
Editar constante `MODEL`:

```typescript
const MODELS = {
  'novo-modelo': {
    endpoint: 'https://...',
    maxResolution: '4096x2160',
    style: 'photorealistic',
  },
}
```

---

## 📊 METRICAS DE QUALIDADE

### Imagens (Checklist)
- [ ] Resolução 2K ou 4K
- [ ] Sem texto na imagem
- [ ] Sem watermark
- [ ] Iluminação profissional
- [ ] Composição equilibrada
- [ ] Cores vibrantes mas naturais
- [ ] Foco nítido
- [ ] Style consistente com marca

### Conteúdo (Checklist)
- [ ] Português correto (acentos)
- [ ] SEO otimizado (meta tags)
- [ ] A11y (ARIA labels)
- [ ] Links internos
- [ ] Call-to-action claro
- [ ] Schema.org markup
- [ ] Mobile-friendly

---

## 🎯 PRÓXIMOS PASSOS

### Fase 1 (✅ COMPLETO)
- [x] Image generator CLI
- [x] Presets para UniTV
- [x] Config Alibaba DashScope
- [x] Documentação on-demand

### Fase 2 (EM ANDAMENTO)
- [ ] Content generator CLI
- [ ] SEO auditor CLI
- [ ] API endpoints REST
- [ ] Integração com Uniteia

### Fase 3 (FUTURO)
- [ ] UI dashboard opcional
- [ ] Batch processing
- [ ] Queue system
- [ ] Analytics de uso

---

## 📝 NOTAS IMPORTANTES

1. **Zero Autonomia:** Nada roda sem comando explícito
2. **Recursos Liberados:** CLI fecha após uso
3. **Controle Total:** Você decide quando gerar
4. **Qualidade Máxima:** Prompts bleeding-edge
5. **Documentação:** Tudo registrado para reprodução

---

**Autor:** Hermes Agent  
**License:** MIT  
**Version:** 1.0.0 (On-Demand Edition)
