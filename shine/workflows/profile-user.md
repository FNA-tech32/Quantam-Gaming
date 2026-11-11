# Workflow — profile-user

Detect, persist, and honor user preferences for working style, output format, and tool preferences.

## Prerequisites
- None — this can run at any time.

## Steps

1. **Check existing profile**  
   Read `~/.claude/memory/preference-user.md`.  
   If exists: display current preferences and ask what to change.  
   If not: run full setup.

2. **Preference questionnaire**  
   Ask each preference (skip any the user doesn't care about):
   
   | Preference | Options | Default |
   |-----------|---------|---------|
   | Output language | it / en / fr / auto-detect | it |
   | Verbosity | concise / standard / detailed | standard |
   | Commit style | conventional / shine / custom | shine |
   | Code comments | minimal / moderate / verbose | moderate |
   | Approval gates | strict (confirm everything) / balanced / fast (minimal confirms) | balanced |
   | Default model profile | quality / balanced / budget | balanced |
   | Timezone | auto-detect or manual | auto |
   | Preferred test framework | jest / vitest / pytest / auto-detect | auto-detect |

3. **Write preference file**  
   Write to `~/.claude/memory/preference-user.md`:
   ```
   ---
   type: preference
   updated: <date>
   ---
   
   # User preferences
   
   - **Language**: italiano
   - **Verbosity**: standard
   - **Commit style**: shine (shine(<scope>): <message>)
   - **Code comments**: moderate
   - **Approval gates**: balanced
   - **Model profile**: balanced
   - **Timezone**: Europe/Rome
   - **Test framework**: vitest
   ```

4. **Apply immediately**  
   If model profile changed:
   `node shine/bin/shine-tools.cjs config-set-model-profile <profile> --raw`

5. **Confirm**  
   Show the saved preferences and note: _"These will be loaded at the start of every session."_

## Guardrails
- Never change preferences without explicit user input.
- On subsequent sessions, load `preference-user.md` first and honor all settings.
- Never override a user preference with a "smarter" default — respect the choice.
