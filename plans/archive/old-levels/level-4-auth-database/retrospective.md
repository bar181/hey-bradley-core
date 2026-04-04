# Level 4: Auth & Database — Retrospective & Test Plan

## Playwright Test Plan

### Phase 4.1 — Supabase Auth + Database

#### Test: Login flow
```
- Navigate to /login
- Verify login form renders with email and password fields
- Enter valid credentials and submit
- Verify redirect to project dashboard
- Verify user session is active (auth state in header/nav)
- Refresh page — verify session persists
```

#### Test: Signup flow
```
- Navigate to /signup
- Enter new email and password
- Submit form
- Verify confirmation message or email verification prompt
- Complete verification (if applicable in test env)
- Verify redirect to dashboard with empty project list
```

#### Test: Social auth
```
- Navigate to /login
- Verify social auth buttons render (Google, GitHub, etc.)
- Click social auth button
- Verify OAuth redirect initiates
```

#### Test: Project dashboard
```
- Log in as authenticated user
- Verify dashboard page renders
- Create a new project — verify it appears in list
- Open project — verify builder loads with project data
- Return to dashboard — verify project still listed
- Delete project — verify removal from list
```

#### Test: SupabaseAdapter auto-save
```
- Log in and open a project
- Make a config change (edit section content)
- Wait for debounce interval
- Refresh page
- Verify changes persisted (config reflects edits)
```

#### Test: RLS data isolation
```
- Log in as User A, create project with distinct name
- Log out, log in as User B
- Verify User A's project is NOT visible in User B's dashboard
- Attempt direct API access to User A's project — verify 403/empty result
```

#### Test: Analytics and error monitoring
```
- Navigate through key flows (login, create project, edit, save)
- Verify analytics events fire (check PostHog/Mixpanel network requests)
- Trigger an intentional error condition
- Verify Sentry captures the error (check Sentry network request)
```

### Phase 4.2 — Templates from Database

#### Test: Dynamic vibe loading
```
- Navigate to onboarding page
- Verify vibe cards render (loaded from Supabase)
- Verify each vibe card shows preview image and name
- Select a vibe — verify builder loads with correct theme
```

#### Test: Section templates from database
```
- Open builder
- Add a new section
- Verify section type dropdown lists all available types
- Verify variant options load from database
- Select a variant — verify it renders correctly
```

#### Test: Offline fallback
```
- Simulate network disconnection (intercept Supabase requests)
- Navigate to onboarding page
- Verify local fallback vibe presets load
- Verify user can still select a vibe and enter builder
```

### Phase 4.3 — LLM Pillar Doc Generation

#### Test: Requirements input
```
- Navigate to builder or onboarding
- Find requirements input UI
- Paste sample requirements text
- Verify input accepts multiline text
- Verify character count or length indicator (if present)
```

#### Test: LLM generation flow
```
- Paste valid requirements text
- Click generate button
- Verify loading indicator appears
- Wait for generation to complete
- Verify vibe is auto-selected based on requirements
- Verify all sections are populated with generated content
- Verify generated content is relevant to the pasted requirements
```

#### Test: Generated content editability
```
- Generate content from requirements
- Click on a generated section
- Edit the content
- Verify edits persist (auto-save)
- Verify edited content does not revert on page navigation
```

#### Test: Cost tracking
```
- Generate content from requirements
- Verify cost/token usage is logged (check admin or debug panel)
- Generate again — verify cumulative tracking
```

#### Test: Rate limiting
```
- Generate content multiple times in rapid succession
- Verify rate limit message appears after threshold
- Wait for rate limit window to pass
- Verify generation works again
```

---

## Retrospective

### What Went Well
_(To be filled after Level 4 completion)_

### What Could Be Improved
_(To be filled after Level 4 completion)_

### Key Decisions Made
_(To be filled after Level 4 completion)_

### Lessons Learned
_(To be filled after Level 4 completion)_

### Action Items for Future Levels
_(To be filled after Level 4 completion)_
