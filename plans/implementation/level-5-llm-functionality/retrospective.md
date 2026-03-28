# Level 5: LLM Functionality — Retrospective & Test Plan

## Playwright Test Plan

> **Note:** All LLM-dependent tests MUST use mock LLM responses in CI to avoid API costs and ensure deterministic results. Tests should intercept Supabase Edge Function calls and return predefined JSON patch responses. Only run against live LLM in manual/staging environments with explicit approval.

### Phase 5.1 — Chat Bot (Hero Only)

#### Test: Chat input sends message and receives response
```
- Navigate to builder with a configured project
- Type "Change the hero headline to Welcome" in chat input
- Press enter or click send
- Verify loading indicator appears
- Verify LLM response appears in chat history within 2 seconds (mocked)
- Verify hero section headline updates to reflect the change
- Verify chat history shows both user message and assistant response
```

#### Test: JSON patch validation
```
- Intercept LLM Edge Function response
- Return a valid JSON patch targeting hero section
- Verify patch is applied and hero updates
- Return an invalid JSON patch (missing required fields)
- Verify error message appears in chat (not a crash)
- Verify configStore remains unchanged after invalid patch
```

#### Test: Chat history persistence
```
- Send 3 chat messages sequentially
- Verify all 3 user messages and 3 responses appear in chat history
- Verify messages are in chronological order
- Verify chat panel is scrollable when history exceeds viewport
```

#### Test: Two-step LLM flow
```
- Intercept both LLM calls (intent classification + patch generation)
- Send a chat message
- Verify Step 1 call is made first (intent classification)
- Verify Step 2 call is made after Step 1 returns (patch generation)
- Verify Workflow tab shows both steps with status indicators
```

#### Test: Error handling and retry
```
- Mock LLM Edge Function to return 500 error
- Send a chat message
- Verify error message appears in chat ("Something went wrong, please try again")
- Verify retry button or automatic retry is available
- Mock successful response on retry
- Verify hero updates after successful retry
```

### Phase 5.2 — Copy Suggestions

#### Test: Copy suggestion trigger
```
- Navigate to builder with sections configured
- Click on a text element in a section
- Begin typing replacement text
- Pause for 1.5 seconds
- Verify copy suggestion popover appears with 3 alternatives
- Verify suggestions are contextually relevant to the section
```

#### Test: Accept and dismiss suggestions
```
- Trigger copy suggestions (edit text, pause 1.5s)
- Verify 3 suggestions appear in popover
- Click the first suggestion
- Verify the text updates to the selected suggestion
- Verify popover closes after selection
- Trigger suggestions again
- Press Escape
- Verify popover closes without changing text
```

#### Test: Debounce prevents excessive calls
```
- Intercept LLM suggestion API calls
- Type rapidly without pausing
- Verify no API calls are made during rapid typing
- Pause for 1.5 seconds
- Verify exactly one API call is made
```

### Phase 5.3 — Section Inference

#### Test: Section inference from natural language
```
- Type "Make the pricing section have a dark background" in chat
- Verify LLM classifies target as "pricing" section
- Verify change type is identified as "style/theme"
- Verify pricing section updates accordingly
- Repeat with: "Add a new testimonial from a customer named Jane"
- Verify LLM classifies target as "testimonials" section
```

#### Test: All 8 section types recognized
```
- For each section type (hero, features, pricing, testimonials, CTA, FAQ, footer, navigation):
  - Send a chat message referencing that section by name
  - Verify correct section is identified
  - Send a message using a synonym (e.g., "banner" for hero, "plans" for pricing)
  - Verify correct section is still identified
```

#### Test: Low confidence triggers clarification
```
- Mock LLM to return confidence score of 0.5
- Send an ambiguous message like "change the background color"
- Verify clarification question appears in chat
- Verify clarification includes section options
- Select a section from clarification options
- Verify patch is generated for selected section
```

#### Test: Workflow tab pipeline visibility
```
- Send a section inference command
- Switch to Workflow tab
- Verify pipeline shows: Intent Classification > Section Identified > Patch Generation > Applied
- Verify each step shows timing information
```

### Phase 5.4 — Onboarding Purpose

#### Test: Description textarea to full site generation
```
- Navigate to onboarding flow
- Enter: "A modern SaaS landing page for a project management tool called TaskFlow"
- Submit description
- Verify vibe is auto-selected (e.g., "modern" or "clean")
- Verify hero section is populated with TaskFlow branding
- Verify features section contains project management features
- Verify pricing section is populated
- Verify all populated sections are editable
```

#### Test: Progressive build animation
```
- Enter a description and submit
- Verify sections appear sequentially (not all at once)
- Verify each section has a fade-in or slide-in animation
- Verify total build time is reasonable (< 15 seconds for full site)
```

#### Test: Editable after generation
```
- Complete onboarding description flow
- Verify all generated sections are editable
- Click on hero headline
- Change the text
- Verify change persists (not overwritten by LLM)
- Verify config tab shows the manually edited value
```

---

## Retrospective

### What Went Well
_(To be filled after Level 5 completion)_

### What Could Be Improved
_(To be filled after Level 5 completion)_

### Key Decisions Made
_(To be filled after Level 5 completion)_

### Lessons Learned
_(To be filled after Level 5 completion)_

### Action Items for Future Levels
_(To be filled after Level 5 completion)_
