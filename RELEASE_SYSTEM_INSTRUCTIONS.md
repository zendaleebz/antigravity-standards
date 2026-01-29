---
description: Automatically generate incremental release notes with screenshots after pushing to GitHub
---

# Auto-Generate Release Notes on Push

This workflow automatically generates release notes with screenshots whenever you push code to GitHub. It creates or updates a daily markdown file in the `.releases/` directory.

## Pre-requisites

### 1. Set up Release Directory Structure

// turbo
```bash
mkdir -p .releases/scripts .releases/screenshots
```

### 2. Create Release Template (if not exists)

// turbo
```bash
cat > .releases/TEMPLATE.md << 'EOF'
# Release Notes - {{DATE}}

## Focus Areas
- 

## New Features
- 

## UI/UX Changes
- 

## Bug Fixes
- 

## Technical Improvements
- 

## Files Modified
- 

## Screenshots
<!-- Add screenshot references here -->

## Commits
<!-- Auto-populated -->

---
*Generated on {{TIMESTAMP}}*
EOF
```

### 3. Create Auto-Release Script

```bash
cat > .releases/scripts/auto-generate.sh << 'EOF'
#!/bin/bash

# Auto-generate release notes after git push
# Usage: Called automatically via git hook or manually

set -e

DATE=$(date +%Y-%m-%d)
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
RELEASE_FILE=".releases/${DATE}.md"
SCREENSHOT_DIR=".releases/${DATE}/screenshots"

echo "🚀 Generating release notes for ${DATE}..."

# Create screenshot directory if it doesn't exist
mkdir -p "$SCREENSHOT_DIR"

# Function to get today's commits
get_commits() {
    echo "## Commits"
    echo ""
    git log --oneline --since="${DATE} 00:00:00" --until="${DATE} 23:59:59" --pretty=format:"- %h %s (%an)" || echo "- No commits found for today"
    echo ""
}

# Function to get changed files
get_changed_files() {
    echo "## Files Modified"
    echo ""
    git diff --name-only HEAD@{1} HEAD 2>/dev/null | sed 's/^/- /' || echo "- No changes detected"
    echo ""
}

# Function to detect UI changes (files in app/, components/)
detect_ui_changes() {
    git diff --name-only HEAD@{1} HEAD 2>/dev/null | grep -E '\.(tsx|jsx|css)$' || echo ""
}

# Check if release file already exists
if [ -f "$RELEASE_FILE" ]; then
    echo "📝 Updating existing release notes: $RELEASE_FILE"
    
    # Create a temporary file with new commits
    TEMP_FILE=$(mktemp)
    
    # Extract existing content before commits section
    sed -n '1,/^## Commits$/p' "$RELEASE_FILE" | head -n -1 > "$TEMP_FILE"
    
    # Append new commits
    echo "" >> "$TEMP_FILE"
    get_commits >> "$TEMP_FILE"
    
    # Append files modified if not already there
    if ! grep -q "## Files Modified" "$RELEASE_FILE"; then
        echo "" >> "$TEMP_FILE"
        get_changed_files >> "$TEMP_FILE"
    fi
    
    # Replace original file
    mv "$TEMP_FILE" "$RELEASE_FILE"
    
else
    echo "📄 Creating new release notes: $RELEASE_FILE"
    
    # Create from template
    sed "s/{{DATE}}/${DATE}/g; s/{{TIMESTAMP}}/${TIMESTAMP}/g" .releases/TEMPLATE.md > "$RELEASE_FILE"
    
    # Append commits
    echo "" >> "$RELEASE_FILE"
    get_commits >> "$RELEASE_FILE"
    
    # Append changed files
    echo "" >> "$RELEASE_FILE"
    get_changed_files >> "$RELEASE_FILE"
fi

# Detect UI changes and suggest screenshots
UI_CHANGED=$(detect_ui_changes)
if [ -n "$UI_CHANGED" ]; then
    echo ""
    echo "🎨 UI files changed detected:"
    echo "$UI_CHANGED" | sed 's/^/  - /'
    echo ""
    echo "💡 Suggestion: Capture screenshots of affected components and save to:"
    echo "   $SCREENSHOT_DIR"
fi

echo ""
echo "✅ Release notes updated: $RELEASE_FILE"
echo ""
echo "📸 To capture screenshots, run:"
echo "   /capture-screenshots"

EOF

chmod +x .releases/scripts/auto-generate.sh
```

### 4. Create Screenshot Capture Script

```bash
cat > .releases/scripts/capture-screenshots.sh << 'EOF'
#!/bin/bash

# Capture screenshots of main pages
# Usage: ./capture-screenshots.sh [date]

DATE=${1:-$(date +%Y-%m-%d)}
SCREENSHOT_DIR=".releases/${DATE}/screenshots"
BASE_URL="${BASE_URL:-http://localhost:3000}"

echo "📸 Capturing screenshots for ${DATE}..."
mkdir -p "$SCREENSHOT_DIR"

# Check if server is running
if ! curl -s "$BASE_URL" > /dev/null 2>&1; then
    echo "❌ Dev server not running at $BASE_URL"
    echo "   Start it with: npm run dev"
    exit 1
fi

# Array of pages to capture
declare -a pages=(
    "/:homepage"
    "/credits:credits-page"
    "/doctors:doctors-page"
    "/dashboard:dashboard"
    "/signup:signup-page"
    "/login:login-page"
)

# Capture each page
for page_info in "${pages[@]}"; do
    IFS=':' read -r path name <<< "$page_info"
    output="${SCREENSHOT_DIR}/${name}-${DATE}.png"
    
    echo "  Capturing ${name}..."
    npx playwright screenshot "${BASE_URL}${path}" "$output" --timeout 5000 2>/dev/null || {
        echo "    ⚠️  Skipped ${name} (may require auth)"
    }
done

echo ""
echo "✅ Screenshots saved to: $SCREENSHOT_DIR"
echo ""
echo "📝 Update release notes with:"
echo "   ![Component Name](./${DATE}/screenshots/filename.png)"

EOF

chmod +x .releases/scripts/capture-screenshots.sh
```

## Usage

### After Every Git Push

// turbo-all

#### 1. Generate Release Notes Automatically

```bash
./.releases/scripts/auto-generate.sh
```

This will:
- Create or update today's release note file
- Append new commits since last update
- List changed files
- Detect UI changes and suggest screenshots

#### 2. Capture Screenshots (if UI changed)

```bash
# Make sure dev server is running first
npm run dev &

# Wait a few seconds, then capture
sleep 5
./.releases/scripts/capture-screenshots.sh
```

#### 3. Review and Enhance Release Notes

```bash
DATE=$(date +%Y-%m-%d)
code .releases/${DATE}.md
```

Manually add:
- Focus areas (what you worked on)
- Feature descriptions
- Screenshot references
- Bug fix details

#### 4. Commit Release Notes

```bash
DATE=$(date +%Y-%m-%d)
git add .releases/${DATE}.md .releases/${DATE}/screenshots/
git commit -m "docs: update release notes for ${DATE}"
git push origin main
```

## Setting Up Git Hook (Optional)

To automatically run the release notes script after every push:

```bash
cat > .git/hooks/post-commit << 'EOF'
#!/bin/bash
# Auto-generate release notes after commit
./.releases/scripts/auto-generate.sh
EOF

chmod +x .git/hooks/post-commit
```

Now, every time you commit, the release notes will be updated automatically.

## Setting Up GitHub Action (Advanced)

Create `.github/workflows/release-notes.yml`:

```yaml
name: Auto Generate Release Notes

on:
  push:
    branches:
      - main

jobs:
  generate-release-notes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0  # Get full history
      
      - name: Generate Release Notes
        run: |
          chmod +x .releases/scripts/auto-generate.sh
          ./.releases/scripts/auto-generate.sh
      
      - name: Commit Release Notes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          DATE=$(date +%Y-%m-%d)
          git add .releases/${DATE}.md || true
          git diff --staged --quiet || git commit -m "docs: auto-update release notes for ${DATE}"
          git push || true
```

## Quick Commands

Create these as workflows:

### `/generate-release`
```bash
./.releases/scripts/auto-generate.sh
```

### `/capture-screenshots`
```bash
npm run dev &
sleep 5
./.releases/scripts/capture-screenshots.sh
DATE=$(date +%Y-%m-%d)
code .releases/${DATE}.md
```

### `/finalize-release`
```bash
DATE=$(date +%Y-%m-%d)
git add .releases/${DATE}.md .releases/${DATE}/screenshots/
git commit -m "docs: release notes for ${DATE}"
git push origin main
```

## Daily Workflow Summary

1. **Work on features** → Commit → Push
2. **Auto-generate** runs and creates/updates daily release note
3. **Capture screenshots** manually or with script
4. **Review & enhance** release notes with context
5. **Commit & push** release notes

---

**Estimated time**: 5-10 minutes per day
**Frequency**: After each push to main
**Automation level**: 80% (commits + files auto-populated)
