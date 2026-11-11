# Workflow — settings

Display, validate, and safely modify `~/.claude/settings.json`.

## Prerequisites
- `~/.claude/settings.json` exists (or we report its absence).

## Steps

1. **Read current settings**  
   Parse `~/.claude/settings.json`. Handle malformed JSON gracefully.

2. **Display (default action)**  
   Pretty-print the settings with:
   - Secret masking: any value matching API key / token patterns → `****<last4>`.
   - Section headers for readability.
   - Current model profile highlighted.
   ```
   ## Current settings
   
   ### Environment
   | Key | Value |
   |-----|-------|
   | CLAUDE_MODEL | claude-sonnet-4-20250514 |
   | SHINE_PROFILE | balanced |
   
   ### Hooks
   | Hook | File | Exists |
   |------|------|--------|
   | PreToolUse | shine-prompt-guard.js | ✅ |
   | … | | |
   
   ### Plugins
   <list with enabled/disabled status>
   ```

3. **Modify (if user requests a change)**  
   - Validate the key exists in the allowed set (don't allow arbitrary keys).
   - Show the before/after diff.
   - Require explicit confirmation.
   - Write atomically: write to tmp file, then rename.

4. **Validate after write**  
   - Parse the written file to confirm valid JSON.
   - Check all hook file references still point to existing files.
   - Run `node shine/bin/shine-tools.cjs help` as a smoke test.

## Guardrails
- Never echo API keys or tokens in full — always mask.
- Never enable telemetry without explicit user opt-in.
- Never modify settings without showing the diff first.
- Preserve unknown keys untouched (forward compatibility).
