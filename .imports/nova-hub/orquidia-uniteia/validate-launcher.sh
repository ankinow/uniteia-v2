#!/bin/bash
# Orquidia Setup Validator - SOTA 2026
# Validates the desktop and CLI launcher installation

set -uo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     🔍 Orquidia Launcher - Validador de Instalação          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

PROJECT_ROOT="/home/lermf/PROJETOS-2026-SOTA/orquidia-uniteia"
APP_DIR="$PROJECT_ROOT/apps/orchestrator"
DESKTOP_FILE="/home/lermf/Área de trabalho/Orquidia.desktop"
CLI_SCRIPT="/home/lermf/start-orquidia.sh"
LAUNCHER_SCRIPT="$PROJECT_ROOT/start-orchestrator.sh"

errors=0
warnings=0

check_file() {
    local file="$1"
    local desc="$2"
    local required="${3:-true}"
    local check_executable="${4:-true}"
    
    if [[ -f "$file" ]]; then
        if [[ "$check_executable" == "true" ]]; then
            if [[ -x "$file" ]]; then
                echo -e "${GREEN}✅${NC} $desc: $file"
            else
                echo -e "${YELLOW}⚠️${NC} $desc: $file (não executável)"
                ((warnings++))
            fi
        else
            echo -e "${GREEN}✅${NC} $desc: $file"
        fi
    else
        if [[ "$required" == "true" ]]; then
            echo -e "${RED}❌${NC} $desc: $file ${RED}(NÃO ENCONTRADO)${NC}"
            ((errors++))
        else
            echo -e "${YELLOW}⚠️${NC} $desc: $file (opcional, não encontrado)"
            ((warnings++))
        fi
    fi
}

check_dir() {
    local dir="$1"
    local desc="$2"
    
    if [[ -d "$dir" ]]; then
        echo -e "${GREEN}✅${NC} $desc: $dir"
    else
        echo -e "${RED}❌${NC} $desc: $dir ${RED}(NÃO ENCONTRADO)${NC}"
        ((errors++))
    fi
}

check_command() {
    local cmd="$1"
    local desc="${2:-$cmd}"
    
    if command -v "$cmd" &> /dev/null; then
        local version
        version=$($cmd --version 2>/dev/null | head -1 || echo "versão desconhecida")
        echo -e "${GREEN}✅${NC} $desc: $version"
    else
        echo -e "${RED}❌${NC} $desc: ${RED}(NÃO ENCONTRADO)${NC}"
        ((errors++))
    fi
}

echo -e "${BOLD}📁 Verificando arquivos...${NC}"
check_file "$LAUNCHER_SCRIPT" "Script principal"
check_file "$CLI_SCRIPT" "Atalho CLI"
check_file "$APP_DIR/package.json" "package.json" "true" "false"

echo ""
echo -e "${BOLD}📂 Verificando diretórios...${NC}"
check_dir "$PROJECT_ROOT" "Raiz do projeto"
check_dir "$APP_DIR" "Diretório do app"

echo ""
echo -e "${BOLD}🔧 Verificando dependências...${NC}"
check_command "bun" "Bun runtime"
check_command "node" "Node.js"
check_command "xdg-open" "xdg-open (para abrir navegador)"

# Note: Desktop file removed - CLI only mode
echo ""
echo -e "${BOLD}🖥️  Modo de operação...${NC}"
echo -e "${CYAN}ℹ️${NC} Modo CLI-only (desktop file removido conforme solicitado)"

echo ""
echo -e "${BLUE}══════════════════════════════════════════════════════════════${NC}"

if [[ $errors -eq 0 && $warnings -eq 0 ]]; then
    echo -e "${GREEN}${BOLD}✅ Todos os checks passaram!${NC}"
    echo ""
    echo -e "${BOLD}🚀 Como usar:${NC}"
    echo "   ~/start-orquidia.sh"
    echo ""
    echo -e "${CYAN}O servidor estará disponível em: http://localhost:5173${NC}"
    echo -e "${CYAN}BLEEDING-EDGE: Vite + Cloudflare remote bindings${NC}"
    exit 0
elif [[ $errors -eq 0 ]]; then
    echo -e "${YELLOW}${BOLD}⚠️  Instalação funcional com $warnings aviso(s)${NC}"
    exit 0
else
    echo -e "${RED}${BOLD}❌ Instalação com problemas: $errors erro(s), $warnings aviso(s)${NC}"
    exit 1
fi
