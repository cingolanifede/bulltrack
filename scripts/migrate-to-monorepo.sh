#!/bin/bash

# Monorepo Migration Script
# This script migrates separate backend and frontend repositories into a monorepo

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_REPO="git@github.com:cingolanifede/spirit-api.git"
FRONTEND_REPO="git@github.com:cingolanifede/spiritual-tarot-app.git"
BACKEND_PATH="apps/spirit-api"
FRONTEND_PATH="apps/spiritual-tarot-app"

echo -e "${BLUE}=== Monorepo Migration Script ===${NC}\n"

# Check if we're in the right directory
if [ ! -d "$BACKEND_PATH" ] || [ ! -d "$FRONTEND_PATH" ]; then
    echo -e "${RED}Error: Backend or frontend directories not found${NC}"
    echo "Expected: $BACKEND_PATH and $FRONTEND_PATH"
    exit 1
fi

# Check if root is already a git repo
if [ -d "$ROOT_DIR/.git" ]; then
    echo -e "${YELLOW}Warning: Root directory is already a git repository${NC}"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}Initializing git repository at root...${NC}"
    cd "$ROOT_DIR"
    git init
    git add .
    git commit -m "Initial monorepo structure" || echo "No changes to commit"
fi

# Step 1: Add backend as subtree
echo -e "\n${BLUE}Step 1: Merging backend repository...${NC}"
cd "$ROOT_DIR"

# Check if backend remote already exists
if git remote | grep -q "^backend-origin$"; then
    echo -e "${YELLOW}Backend remote already exists, updating...${NC}"
    git remote set-url backend-origin "$BACKEND_REPO"
else
    git remote add backend-origin "$BACKEND_REPO"
fi

# Fetch backend
echo "Fetching backend repository..."
git fetch backend-origin || {
    echo -e "${RED}Error: Could not fetch backend repository${NC}"
    echo "Make sure you have access to: $BACKEND_REPO"
    exit 1
}

# Check if backend path already has content
if [ -d "$BACKEND_PATH/.git" ]; then
    echo -e "${YELLOW}Backend directory has its own .git, removing it...${NC}"
    rm -rf "$BACKEND_PATH/.git"
fi

# Merge backend using read-tree to preserve full history
echo "Merging backend history..."
if git log --oneline --grep="Merge backend" | head -1 > /dev/null 2>&1; then
    echo -e "${YELLOW}Backend already merged, skipping...${NC}"
else
    BACKEND_BRANCH=$(git ls-remote --heads backend-origin | grep -E 'main|master' | head -1 | cut -f2 | sed 's/refs\/heads\///')
    if [ -z "$BACKEND_BRANCH" ]; then
        BACKEND_BRANCH="main"
    fi
    
    git read-tree --prefix="$BACKEND_PATH" -u "backend-origin/$BACKEND_BRANCH" || {
        echo -e "${YELLOW}Trying alternative merge method...${NC}"
        git merge -s ours --no-commit --allow-unrelated-histories "backend-origin/$BACKEND_BRANCH" || true
        git read-tree --prefix="$BACKEND_PATH" -u "backend-origin/$BACKEND_BRANCH"
    }
    
    git commit -m "Merge backend repository (spirit-api) into monorepo" || echo "No changes to commit"
fi

# Step 2: Add frontend as subtree
echo -e "\n${BLUE}Step 2: Merging frontend repository...${NC}"

# Check if frontend remote already exists
if git remote | grep -q "^frontend-origin$"; then
    echo -e "${YELLOW}Frontend remote already exists, updating...${NC}"
    git remote set-url frontend-origin "$FRONTEND_REPO"
else
    git remote add frontend-origin "$FRONTEND_REPO"
fi

# Fetch frontend
echo "Fetching frontend repository..."
git fetch frontend-origin || {
    echo -e "${RED}Error: Could not fetch frontend repository${NC}"
    echo "Make sure you have access to: $FRONTEND_REPO"
    exit 1
}

# Check if frontend path already has content
if [ -d "$FRONTEND_PATH/.git" ]; then
    echo -e "${YELLOW}Frontend directory has its own .git, removing it...${NC}"
    rm -rf "$FRONTEND_PATH/.git"
fi

# Merge frontend using read-tree to preserve full history
echo "Merging frontend history..."
if git log --oneline --grep="Merge frontend" | head -1 > /dev/null 2>&1; then
    echo -e "${YELLOW}Frontend already merged, skipping...${NC}"
else
    FRONTEND_BRANCH=$(git ls-remote --heads frontend-origin | grep -E 'main|master' | head -1 | cut -f2 | sed 's/refs\/heads\///')
    if [ -z "$FRONTEND_BRANCH" ]; then
        FRONTEND_BRANCH="main"
    fi
    
    git read-tree --prefix="$FRONTEND_PATH" -u "frontend-origin/$FRONTEND_BRANCH" || {
        echo -e "${YELLOW}Trying alternative merge method...${NC}"
        git merge -s ours --no-commit --allow-unrelated-histories "frontend-origin/$FRONTEND_BRANCH" || true
        git read-tree --prefix="$FRONTEND_PATH" -u "frontend-origin/$FRONTEND_BRANCH"
    }
    
    git commit -m "Merge frontend repository (spiritual-tarot-app) into monorepo" || echo "No changes to commit"
fi

# Step 3: Clean up nested .git directories
echo -e "\n${BLUE}Step 3: Cleaning up nested git repositories...${NC}"
if [ -d "$BACKEND_PATH/.git" ]; then
    echo "Removing $BACKEND_PATH/.git"
    rm -rf "$BACKEND_PATH/.git"
    git add "$BACKEND_PATH"
fi

if [ -d "$FRONTEND_PATH/.git" ]; then
    echo "Removing $FRONTEND_PATH/.git"
    rm -rf "$FRONTEND_PATH/.git"
    git add "$FRONTEND_PATH"
fi

if [ -n "$(git status --porcelain)" ]; then
    git commit -m "Remove nested git repositories" || echo "No changes to commit"
fi

# Step 4: Set up main branch
echo -e "\n${BLUE}Step 4: Setting up main branch...${NC}"
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
if [ -z "$CURRENT_BRANCH" ]; then
    git checkout -b main 2>/dev/null || git branch -M main 2>/dev/null || true
fi

# Step 5: Summary
echo -e "\n${GREEN}=== Migration Complete! ===${NC}\n"
echo -e "Repository structure:"
echo -e "  ${GREEN}✓${NC} Backend merged into: $BACKEND_PATH"
echo -e "  ${GREEN}✓${NC} Frontend merged into: $FRONTEND_PATH"
echo -e "  ${GREEN}✓${NC} Nested .git directories removed"
echo -e "  ${GREEN}✓${NC} Remotes configured:"
git remote -v | sed 's/^/    /'

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Create a new repository on GitHub (or use existing)"
echo "2. Add it as origin:"
echo "   ${BLUE}git remote add origin git@github.com:cingolanifede/spirit-monorepo.git${NC}"
echo "3. Push to the new repository:"
echo "   ${BLUE}git push -u origin main${NC}"
echo ""
echo "Or if you want to keep the current name:"
echo "   ${BLUE}git remote add origin git@github.com:cingolanifede/Spirit.git${NC}"
echo "   ${BLUE}git push -u origin main${NC}"

echo -e "\n${YELLOW}To verify the migration:${NC}"
echo "  ${BLUE}git log --oneline --all --graph${NC}"
echo "  ${BLUE}git log --oneline --follow -- $BACKEND_PATH${NC}"
echo "  ${BLUE}git log --oneline --follow -- $FRONTEND_PATH${NC}"

