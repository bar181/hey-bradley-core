# Owner Launch Checklist — v2.0.0-RC1

> Generated at P103 seal. These tasks are owner-only; not part of any code sprint.
> Cross-ref: ADR-131 § CF#4 / CF#5 (post-RC owner-required) + ADR-133 (P103 release artifacts).

## Immediate (release day)

- [ ] `git tag v2.0.0-RC1 && git push --tags`
- [ ] GitHub release (paste from `docs/launch/release-notes-v2.0.0-rc1.md`)
- [ ] BYOK smoke test — 5 prompts × 3 providers (Claude / Gemini / OpenRouter); budget ~$0.05
- [ ] Verify CF#4 — schema rejection / latency / Crystal Atom compliance / cost cap with real Haiku
- [ ] Verify CF#5 — listen STT cleanup quality with real microphone

## Distribution (week 1)

- [ ] Record demo video (script: `docs/launch/demo-video-script.md`)
- [ ] Post Show HN (draft: `docs/launch/show-hn-post.md`)
- [ ] Submit to Product Hunt (copy: `docs/launch/product-hunt-tagline.md`)
- [ ] Share in Agentics Foundation beta channel (20-50 users)

## Community engagement (weeks 1-2)

- [ ] Twitter/X thread on the 55% problem + AISP solution (8-atom suite framing)
- [ ] LinkedIn long-form post (Don Miller voice; founder authority; three-mode workbench)
- [ ] Reddit r/programming + r/SideProject + r/LocalLLaMA
- [ ] AISP open-spec repo announcement (link to https://github.com/bar181/aisp-open-core)

## Follow-up (post-launch)

- [ ] Triage feedback issues / PRs
- [ ] Triage Tier-2 commercial inquiries
- [ ] Schedule first AISP RFC review (post-RC; if breaking changes proposed per ADR-109 § 3)
