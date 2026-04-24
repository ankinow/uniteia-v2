# 🌸 Orquidia Orchestrator - SOTA 2026 Launcher

## ✅ Instalação Completa (CLI-Only)

Todos os componentes do launcher foram instalados e validados com sucesso.

## 🚀 Como Usar

```bash
~/start-orquidia.sh
```

## 🔬 BLEEDING-EDGE: Vite + Cloudflare Remote Bindings

Esta é a abordagem mais moderna (2025/2026) para desenvolvimento com Cloudflare Workers:

### O que é?
- **Vite dev server** com Hot Module Replacement (HMR) ultra-rápido
- **Cloudflare remote bindings** para acesso a recursos remotos (D1, KV, AI)
- **Sem** `wrangler dev --remote` (que tem problemas com TanStack Start)

### Configuração

#### wrangler.jsonc
```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "uniteia-db",
      "database_id": "...",
      "remote": true  // ← Acesso remoto ao D1
    }
  ],
  "kv_namespaces": [
    {
      "binding": "KV_STATIC_HTML",
      "id": "...",
      "remote": true  // ← Acesso remoto ao KV
    }
  ],
  "ai": {
    "binding": "AI",
    "remote": true  // ← Workers AI (sempre remoto)
  }
}
```

#### vite.config.ts
```typescript
cloudflare({
  viteEnvironment: { name: 'ssr' },
  // Remote bindings são configurados no wrangler.jsonc
})
```

### Vantagens
1. 🚀 **Fast HMR** - Vite é significativamente mais rápido que wrangler dev
2. 🗄️ **D1 Database** - Acesso completo ao banco de dados remoto
3. 🤖 **AI Bindings** - Workers AI funciona em dev mode
4. 📦 **KV Storage** - Acesso ao KV namespaces
5. 🔄 **Live Reload** - Mudanças refletidas instantaneamente

## 📁 Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `~/start-orquidia.sh` | Atalho CLI (symlink) |
| `start-orchestrator.sh` | Script principal com validações |
| `validate-launcher.sh` | Script de validação |
| `.orquidia-launcher.log` | Logs de execução |

## 🌐 URL de Acesso

- **Dev Server**: http://localhost:5173
- **Tecnologia**: Vite + Cloudflare remote bindings

## 🔧 Funcionalidades

### Script Principal
- ✅ Verificação automática de pré-requisitos
- ✅ Detecção de instância já rodando
- ✅ BLEEDING-EDGE: `bun run dev` com remote bindings
- ✅ Abertura automática do navegador
- ✅ Logs coloridos em português
- ✅ Mensagens de erro claras
- ✅ Limpeza automática de recursos

### Validação
```bash
bash ~/PROJETOS-2026-SOTA/orquidia-uniteia/validate-launcher.sh
```

## ⚠️ Notas Importantes

1. **Requer autenticação Cloudflare**: O remote bindings precisa de `npx wrangler whoami` válido
2. **Portas**: Se a porta 5173 estiver em uso, o Vite tenta 5174, 5175, etc.
3. **Logs**: Todos os logs são salvos em `.orquidia-launcher.log`

## 🛠️ Troubleshooting

### Erro de autenticação
```bash
npx wrangler login
```

### Verificar instalação
```bash
bash ~/PROJETOS-2026-SOTA/orquidia-uniteia/validate-launcher.sh
```

### Limpar e reinstalar
```bash
cd ~/PROJETOS-2026-SOTA/orquidia-uniteia
rm -rf node_modules apps/orchestrator/node_modules
bun install
```

---

**Orquidia Orchestrator - SOTA 2026**  
*BLEEDING-EDGE: Vite + Cloudflare Remote Bindings*
