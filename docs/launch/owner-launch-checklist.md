# Owner Launch Checklist — v1.0.0-RC1

> Generated at P84 seal. These tasks are owner-only; not part of any code sprint.
> Cross-ref: ADR-109 § 4 (post-RC owner-only tasks).

## Immediate (release day)

- [ ] `git tag v1.0.0-RC1 && git push --tags`
- [ ] BYOK smoke test — 5 prompts × 3 providers (Claude / Gemini / OpenRouter); budget ~$0.01
- [ ] GitHub release (paste from `docs/launch/release-notes-v1.0.0-rc1.md`)

## Distribution (week 1)

- [ ] Record demo video (script: `docs/launch/demo-video-script.md`)
- [ ] Post Show HN (draft: `docs/launch/show-hn-post.md`)
- [ ] Submit to Product Hunt (copy: `docs/launch/product-hunt-tagline.md`)
- [ ] Share in Agentics Foundation beta channel (20-50 users)

## Community engagement (weeks 1-2)

- [ ] Twitter/X thread on the 55% problem + AISP solution
- [ ] LinkedIn long-form post (Don Miller voice; founder authority)
- [ ] Reddit r/programming + r/SideProject
- [ ] AISP open-spec repo announcement (link to https://github.com/bar181/aisp-open-core)

## Follow-up (post-launch)

- [ ] Collect feedback issues / PRs
- [ ] Triage Tier-2 commercial inquiries
- [ ] Schedule first AISP RFC review (post-RC; if breaking changes proposed per ADR-109 § 3)
