---
description: "Investigate failed or stuck workflow runs"
argument-hint: [phase-number]
context: fork
---

# /yaah:forensics — Workflow Failure Investigation

## When to use
When the user runs `/yaah:forensics` or `/yaah:forensics <phase>` to diagnose a failed, incomplete, or stuck workflow run.

## Steps

### 1. Load current state
- Read `.planning/STATE.md` for the current phase, status, and last_updated timestamp
- If a phase argument was provided, scope the investigation to that phase; otherwise inspect all phases

### 2. Check for common failure patterns

**Plans without matching SUMMARYs**
- For each `.planning/phases/{NN}-{slug}/{plan-slug}/PLAN.md`, check whether a corresponding SUMMARY.md exists
- Missing SUMMARY = execution started but did not complete

**VERIFICATION.md with gaps found**
- Read every `.planning/phases/*/VERIFICATION.md`
- Look for `gaps_found` status or any unchecked verify criteria
- Extract the specific gaps that remain unresolved

**Stale HANDOFF.md**
- Glob `.planning/phases/*/HANDOFF.md`
- Flag any HANDOFF.md whose last-modified date is older than 7 days (paused and forgotten)

**Git conflicts or uncommitted changes**
- Run `git status` and check for merge conflicts (`<<<<<<` markers) or untracked planning files
- Run `git log --oneline -10` to identify partial commit sequences

**Broken depends_on references**
- Parse the `depends_on` frontmatter field in each PLAN.md
- Verify that every referenced plan slug exists as a directory under the same phase
- Flag any reference pointing to a non-existent plan

**Missing CONTEXT.md for discussed phases**
- Read `.planning/ROADMAP.md` for phase list
- For phases whose status in ROADMAP.md is "discussed" or beyond, verify CONTEXT.md exists
- Flag phases where CONTEXT.md is absent despite the status indicating it should be present

### 3. Diagnose root causes
For each issue found:
- Read the relevant files in full to gather clues
- Check `git log --follow -- <file>` for the file's commit history
- Identify exactly where in the workflow the process broke

### 4. Write forensics report
Write to `.planning/FORENSICS-{timestamp}.md` (timestamp format: `YYYYMMDD-HHmmss`):

```markdown
# Forensics Report

Generated: {timestamp}
Scope: {all phases | phase N}

## Issues Found
1. {description} — {severity: CRITICAL / HIGH / MEDIUM / LOW}
   Root cause: {explanation based on file evidence}
   Fix: {recommended action — be specific, include exact commands}

2. ...

(If no issues found, write "No issues detected.")

## Recommended Recovery
{Exact commands to run to get the workflow back on track, in order.}
Example:
  /yaah:execute 2        # resume execution of phase 2
  /yaah:verify 2         # re-run verification after fix
```

### 5. Print summary
After writing the report, print:
- Number of issues found and their severities
- Path of the written report file
- The single most important next step

## Rules
- Read files before drawing conclusions — never assume cause from filename alone
- Tag every finding with the specific file and line that provides evidence
- If `.planning/` does not exist, print "No .planning/ directory found." and stop
- Do not modify any source or planning files — only write the FORENSICS report
- If no issues are found, say so explicitly; do not invent problems
