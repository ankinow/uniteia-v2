#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# Orquidia Orchestrator - SOTA 2026 Launcher
# Production-quality desktop & CLI launcher with full error handling
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Configuration
PROJECT_ROOT="/home/lermf/PROJETOS-2026-SOTA/orquidia-uniteia"
APP_DIR="$PROJECT_ROOT/apps/orchestrator"
LOG_FILE="$PROJECT_ROOT/.orquidia-launcher.log"
LOCK_FILE="$PROJECT_ROOT/.orquidia-dev.lock"
PID_FILE="$PROJECT_ROOT/.orquidia-dev.pid"

# Ensure PATH includes bun and common locations
export PATH="/home/lermf/.bun/bin:/home/lermf/.local/bin:/usr/local/bin:/usr/bin:/bin:$HOME/.npm-global/bin:$PATH"

# ═══════════════════════════════════════════════════════════════════════════════
# Helper Functions
# ═══════════════════════════════════════════════════════════════════════════════

log() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ ERRO:${NC} $1" | tee -a "$LOG_FILE" >&2
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${CYAN}ℹ️  $1${NC}" | tee -a "$LOG_FILE"
}

# Check if a command exists
check_command() {
    command -v "$1" &> /dev/null
}

# Show GUI error if zenity is available
show_gui_error() {
    local message="$1"
    if check_command zenity; then
        zenity --error --title="Orquidia Orchestrator" --text="$message" 2>/dev/null || true
    elif check_command kdialog; then
        kdialog --error "$message" 2>/dev/null || true
    fi
}

# Show GUI info
show_gui_info() {
    local message="$1"
    if check_command zenity; then
        zenity --info --title="Orquidia Orchestrator" --text="$message" 2>/dev/null || true
    fi
}

# ═══════════════════════════════════════════════════════════════════════════════
# Prerequisite Checks
# ═══════════════════════════════════════════════════════════════════════════════

check_prerequisites() {
    log "${BOLD}Verificando pré-requisitos...${NC}"
    
    local missing=()
    
    # Check project directory exists
    if [[ ! -d "$PROJECT_ROOT" ]]; then
        error "Diretório do projeto não encontrado: $PROJECT_ROOT"
        show_gui_error "Diretório do projeto não encontrado:\n$PROJECT_ROOT"
        return 1
    fi
    
    # Check app directory exists
    if [[ ! -d "$APP_DIR" ]]; then
        error "Diretório do app não encontrado: $APP_DIR"
        show_gui_error "Diretório do app não encontrado:\n$APP_DIR"
        return 1
    fi
    
    # Check for Bun
    if ! check_command bun; then
        missing+=("bun")
        warn "Bun não encontrado no PATH"
    else
        local bun_version
        bun_version=$(bun --version 2>/dev/null || echo "desconhecida")
        success "Bun encontrado (v$bun_version)"
    fi
    
    # Check for Node.js (fallback)
    if ! check_command node; then
        missing+=("node")
        warn "Node.js não encontrado"
    else
        local node_version
        node_version=$(node --version 2>/dev/null || echo "desconhecida")
        info "Node.js encontrado ($node_version)"
    fi
    
    # Check for wrangler
    if [[ ! -f "$PROJECT_ROOT/node_modules/.bin/wrangler" ]] && ! check_command wrangler; then
        warn "Wrangler não encontrado (será necessário para alguns comandos)"
    else
        success "Wrangler disponível"
    fi
    
    # Check package.json exists
    if [[ ! -f "$APP_DIR/package.json" ]]; then
        error "package.json não encontrado em $APP_DIR"
        show_gui_error "package.json não encontrado!\nO projeto pode estar corrompido."
        return 1
    fi
    
    if [[ ${#missing[@]} -gt 0 ]]; then
        error "Ferramentas necessárias não encontradas: ${missing[*]}"
        show_gui_error "Ferramentas necessárias não encontradas:\n${missing[*]}\n\nPor favor, instale-as primeiro."
        return 1
    fi
    
    success "Todos os pré-requisitos verificados!"
    return 0
}

# ═══════════════════════════════════════════════════════════════════════════════
# Process Management
# ═══════════════════════════════════════════════════════════════════════════════

check_existing_process() {
    if [[ -f "$PID_FILE" ]]; then
        local old_pid
        old_pid=$(cat "$PID_FILE" 2>/dev/null || echo "")
        if [[ -n "$old_pid" ]] && kill -0 "$old_pid" 2>/dev/null; then
            warn "Já existe uma instância rodando (PID: $old_pid)"
            info "Acesse: http://localhost:5173"
            
            # Try to open browser
            if check_command xdg-open; then
                xdg-open "http://localhost:5173" 2>/dev/null || true
            fi
            
            return 1
        else
            # Stale PID file
            rm -f "$PID_FILE"
        fi
    fi
    return 0
}

cleanup() {
    log "Limpando recursos..."
    rm -f "$LOCK_FILE" "$PID_FILE"
}

# Set trap for cleanup
trap cleanup EXIT INT TERM

# ═══════════════════════════════════════════════════════════════════════════════
# Main Execution
# ═══════════════════════════════════════════════════════════════════════════════

main() {
    # Clear log file
    echo "=== Orquidia Orchestrator Launcher - $(date) ===" > "$LOG_FILE"
    
    # Print banner
    echo -e "${CYAN}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║           🌸 Orquidia Orchestrator - SOTA 2026 🌸            ║"
    echo "║                    Modo Desenvolvimento                      ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    
    log "Iniciando verificações..."
    
    # Check prerequisites
    if ! check_prerequisites; then
        error "Falha na verificação de pré-requisitos"
        echo ""
        echo -e "${YELLOW}Pressione ENTER para sair...${NC}"
        read -r
        exit 1
    fi
    
    # Check for existing process
    if ! check_existing_process; then
        echo ""
        echo -e "${GREEN}O servidor já está rodando!${NC}"
        echo -e "${YELLOW}Pressione ENTER para sair...${NC}"
        read -r
        exit 0
    fi
    
    # Create lock file
    touch "$LOCK_FILE"
    
    # Change to app directory
    log "Entrando no diretório: $APP_DIR"
    cd "$APP_DIR" || {
        error "Falha ao acessar $APP_DIR"
        exit 1
    }
    
    # Check if dependencies are installed
    if [[ ! -d "node_modules" ]]; then
        warn "Dependências não instaladas. Instalando..."
        if check_command bun; then
            bun install || {
                error "Falha ao instalar dependências com bun"
                exit 1
            }
        else
            npm install || {
                error "Falha ao instalar dependências com npm"
                exit 1
            }
        fi
        success "Dependências instaladas!"
    fi
    
    # Determine best dev command
    # BLEEDING-EDGE: Using Vite with Cloudflare remote bindings
    # This gives us fast HMR + remote D1/KV/AI access without wrangler dev --remote
    local dev_cmd=""
    
    if check_command bun; then
        dev_cmd="bun run dev"
        success "Usando: bun run dev (Vite + Cloudflare remote bindings)"
        info "BLEEDING-EDGE: Fast HMR com acesso remoto ao D1/KV/AI"
    else
        dev_cmd="npm run dev"
        warn "Usando fallback: npm run dev"
    fi
    
    # Start the dev server
    echo ""
    log "${BOLD}🚀 Iniciando servidor de desenvolvimento...${NC}"
    log "${CYAN}O servidor estará disponível em: http://localhost:5173${NC}"
    log "${YELLOW}Pressione Ctrl+C para parar${NC}"
    echo ""
    
    # Save PID
    echo $$ > "$PID_FILE"
    
    # Open browser after a delay (in background)
    (
        sleep 5
        if check_command xdg-open; then
            xdg-open "http://localhost:5173" 2>/dev/null || true
        fi
    ) &
    
    # Run the dev server
    if $dev_cmd; then
        echo ""
        success "Servidor encerrado normalmente"
    else
        local exit_code=$?
        echo ""
        error "Servidor encerrado com código: $exit_code"
        
        if [[ $exit_code -eq 130 ]]; then
            info "Interrompido pelo usuário (Ctrl+C)"
        else
            show_gui_error "O servidor encerrou com erro (código: $exit_code)\n\nVerifique o log:\n$LOG_FILE"
        fi
    fi
    
    echo ""
    echo -e "${YELLOW}Pressione ENTER para fechar...${NC}"
    read -r
}

# Run main
main "$@"
