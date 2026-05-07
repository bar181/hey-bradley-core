---
name: "Example Greeting"
description: "Generate personalized greeting messages from templates. Use when demonstrating skill creation, learning skill anatomy, or scaffolding a new skill from a working example."
---

# Example Greeting

## What This Skill Does

A minimal, fully-functional Claude Code skill that demonstrates every structural element: YAML frontmatter, progressive disclosure, scripts, resources, and troubleshooting. Use it as a copy-paste starting point for your own skills.

## Prerequisites

- Bash shell (macOS, Linux, or WSL)
- Claude Code with skills support

## Quick Start

```bash
# Generate a greeting
bash .claude/skills/example-greeting/scripts/greet.sh "World"
# Output: Hello, World! Welcome to Claude Code Skills.

# Generate with a custom template
bash .claude/skills/example-greeting/scripts/greet.sh "Bradley" --template formal
# Output: Dear Bradley, Welcome. We are delighted to have you.
```

---

## Step-by-Step Guide

### Step 1: Understand the Structure

```
.claude/skills/example-greeting/
├── SKILL.md                          # You are here (main instructions)
├── scripts/
│   └── greet.sh                      # Executable greeting generator
└── resources/
    └── templates/
        └── greeting.txt              # Template file with placeholders
```

### Step 2: Run the Script

```bash
# Basic usage (uses default template)
bash .claude/skills/example-greeting/scripts/greet.sh "YourName"

# Formal template
bash .claude/skills/example-greeting/scripts/greet.sh "YourName" --template formal

# Casual template
bash .claude/skills/example-greeting/scripts/greet.sh "YourName" --template casual
```

### Step 3: Customize the Template

Edit `resources/templates/greeting.txt` to change the default greeting:

```
Hello, {{NAME}}! {{MESSAGE}}
```

Replace `{{MESSAGE}}` with your own text. The script substitutes `{{NAME}}` at runtime.

### Step 4: Create Your Own Skill from This Example

```bash
# Copy this skill as a starting point
cp -r .claude/skills/example-greeting .claude/skills/my-new-skill

# Edit the SKILL.md frontmatter
# Change: name, description
# Replace: instructions with your own

# Edit or replace scripts/ and resources/
```

---

## Advanced Options

### Custom Templates

Create new template files in `resources/templates/`:

```bash
echo "Howdy, {{NAME}}! {{MESSAGE}}" > .claude/skills/example-greeting/resources/templates/custom.txt
bash .claude/skills/example-greeting/scripts/greet.sh "Partner" --template custom
```

### Environment Variables

```bash
# Override the default message
GREETING_MESSAGE="Have a great day!" bash .claude/skills/example-greeting/scripts/greet.sh "Team"
```

---

## Skill Anatomy Reference

| Element | Required | Purpose |
|---------|----------|---------|
| `SKILL.md` | Yes | Main instructions with YAML frontmatter |
| `name` field | Yes | Display name (max 64 chars) |
| `description` field | Yes | What + when trigger (max 1024 chars) |
| `scripts/` | No | Executable scripts Claude can run |
| `resources/` | No | Templates, examples, schemas |
| `docs/` | No | Additional documentation files |

### YAML Frontmatter Template

```yaml
---
name: "Your Skill Name"
description: "What this skill does. Use when [trigger 1], [trigger 2], or [trigger 3]."
---
```

---

## Troubleshooting

### Issue: "Permission denied" when running greet.sh
**Cause**: Script not executable
**Solution**:
```bash
chmod +x .claude/skills/example-greeting/scripts/greet.sh
```

### Issue: Skill not appearing in Claude's skill list
**Cause**: SKILL.md missing or malformed YAML frontmatter
**Solution**: Verify frontmatter starts and ends with `---`, and both `name` and `description` fields are present.

### Issue: Template substitution not working
**Cause**: Missing `{{NAME}}` placeholder in template file
**Solution**: Ensure your template contains the literal text `{{NAME}}`.
