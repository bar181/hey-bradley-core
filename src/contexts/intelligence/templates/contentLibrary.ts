/**
 * Content Library — Layer 3 of the Template Intelligence architecture (ADR-098).
 *
 * Each entry describes a writing-style template: tone, sentence length, emoji
 * usage, headline style, copy density, and a structural pattern. Used by the
 * templateMatcher to rank candidates when the user asks for a tone/voice shift
 * mid-conversation (e.g. "make this more fun", "rewrite as a Don Miller story").
 *
 * Self-contained — no imports from themeLibrary or sectionLibrary. Keyword + tag
 * matching only (HNSW activation deferred to Tier-2 per CLAUDE.md ruvector note).
 */

export type ContentTone =
  | 'casual'
  | 'professional'
  | 'technical'
  | 'emotional'
  | 'minimal'
  | 'bold'
  | 'academic'
  | 'urgent'

export type SentenceLength = 'short' | 'medium' | 'long' | 'mixed'

export type EmojiUsage = 'none' | 'light' | 'moderate' | 'heavy'

export type HeadlineStyle =
  | 'punchy-question'
  | 'declarative'
  | 'narrative'
  | 'spec-first'
  | 'editorial'
  | 'imperative'

export type CopyDensity = 'sparse' | 'balanced' | 'dense'

export interface ContentTemplate {
  id: string
  name: string
  description: string
  searchTags: readonly string[]
  /** 2-3 sample user utterances that should route to this content style.
   *  Used by templateMatcher AND as future HNSW few-shot training (ADR-098). */
  exampleQueries: readonly string[]
  vectorDescription: string
  contentTemplate: {
    tone: ContentTone
    sentenceLength: SentenceLength
    emojiUsage: EmojiUsage
    headlineStyle: HeadlineStyle
    copyDensity: CopyDensity
    /** Structural pattern e.g. 'character → problem → guide → plan → success' */
    pattern: string
  }
}

export const CONTENT_LIBRARY: readonly ContentTemplate[] = [
  {
    id: 'don-miller-story',
    name: 'Don Miller Story',
    description: 'StoryBrand-style narrative arc that casts the customer as the hero and the brand as the guide.',
    searchTags: ['story', 'narrative', 'founder', 'don-miller', 'journey'],
    exampleQueries: ['tell my story', 'narrative founder voice', 'Don Miller framing'],
    vectorDescription:
      'Narrative-driven, emotionally resonant copy that walks a hero from problem through guide, plan, and success; suits founder stories and mission-led brands.',
    contentTemplate: {
      tone: 'emotional',
      sentenceLength: 'medium',
      emojiUsage: 'light',
      headlineStyle: 'narrative',
      copyDensity: 'balanced',
      pattern: 'character → problem → guide → plan → success',
    },
  },
  {
    id: 'elevator-pitch',
    name: 'Elevator Pitch',
    description: 'Ninety-second investor-ready hook that names the problem, the solution, and the ask.',
    searchTags: ['pitch', 'investor', 'short', '90-seconds', 'funding'],
    exampleQueries: ['short investor pitch', '90-second elevator pitch', 'concise sales hook'],
    vectorDescription:
      'Bold, ultra-condensed copy with hook, problem, solution, and explicit ask; suits investor decks and rapid-fire intros.',
    contentTemplate: {
      tone: 'bold',
      sentenceLength: 'short',
      emojiUsage: 'none',
      headlineStyle: 'declarative',
      copyDensity: 'sparse',
      pattern: 'hook → problem → solution → ask',
    },
  },
  {
    id: 'article',
    name: 'Editorial Article',
    description: 'Long-form journalism cadence with a strong lede and a clear takeaway.',
    searchTags: ['article', 'blog', 'read', 'editorial', 'journalism'],
    exampleQueries: ['article voice', 'blog post tone', 'editorial writing'],
    vectorDescription:
      'Professional, mixed-cadence prose with a journalistic lede, supporting body, and concrete takeaway; suits blogs and editorial features.',
    contentTemplate: {
      tone: 'professional',
      sentenceLength: 'mixed',
      emojiUsage: 'none',
      headlineStyle: 'editorial',
      copyDensity: 'balanced',
      pattern: 'headline → lede → body → takeaway',
    },
  },
  {
    id: 'product-description',
    name: 'Product Description',
    description: 'Direct ecommerce copy that leads with the benefit and closes with a CTA.',
    searchTags: ['product', 'describe', 'sell', 'feature', 'benefit'],
    exampleQueries: ['product copy', 'describe the product', 'feature-benefit copy'],
    vectorDescription:
      'Bold, sparse, conversion-oriented copy that names the product, leads with benefit, lists the feature, and asks for the click; suits ecommerce and SaaS pricing pages.',
    contentTemplate: {
      tone: 'bold',
      sentenceLength: 'short',
      emojiUsage: 'none',
      headlineStyle: 'declarative',
      copyDensity: 'sparse',
      pattern: 'name → benefit → feature → CTA',
    },
  },
  {
    id: 'fun-casual',
    name: 'Fun & Casual',
    description: 'Conversational, emoji-friendly tone with short punchy sentences.',
    searchTags: ['fun', 'playful', 'casual', 'informal', 'conversational'],
    exampleQueries: ['make it fun', 'casual conversational', 'playful copy'],
    vectorDescription:
      'Casual, conversational, emoji-friendly tone with short punchy sentences and informal voice; suits consumer brands and friendly products.',
    contentTemplate: {
      tone: 'casual',
      sentenceLength: 'short',
      emojiUsage: 'moderate',
      headlineStyle: 'punchy-question',
      copyDensity: 'sparse',
      pattern: 'hook → benefit → social-proof → CTA',
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Precise, confident, executive-grade voice with no fluff.',
    searchTags: ['corporate', 'formal', 'executive', 'enterprise', 'b2b'],
    exampleQueries: ['more professional', 'corporate tone', 'executive voice'],
    vectorDescription:
      'Professional, balanced-density copy with precise medium-length sentences and zero emoji; suits enterprise B2B and executive communications.',
    contentTemplate: {
      tone: 'professional',
      sentenceLength: 'medium',
      emojiUsage: 'none',
      headlineStyle: 'declarative',
      copyDensity: 'balanced',
      pattern: 'context → claim → evidence → conclusion',
    },
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Spec-first developer copy with examples and precise terminology.',
    searchTags: ['technical', 'developer', 'docs', 'api', 'spec'],
    exampleQueries: ['technical spec voice', 'developer audience', 'engineering precise'],
    vectorDescription:
      'Technical, dense, spec-first copy with precise medium-length sentences and concrete examples; suits API docs, developer tools, and engineering blogs.',
    contentTemplate: {
      tone: 'technical',
      sentenceLength: 'medium',
      emojiUsage: 'none',
      headlineStyle: 'spec-first',
      copyDensity: 'dense',
      pattern: 'spec → examples → edge-cases → reference',
    },
  },
  {
    id: 'emotional',
    name: 'Emotional & Moving',
    description: 'Cause-driven story that builds empathy before asking for action.',
    searchTags: ['moving', 'inspiring', 'cause', 'nonprofit', 'heartfelt'],
    exampleQueries: ['emotional cause-driven', 'moving inspirational', 'heart-led nonprofit'],
    vectorDescription:
      'Emotional, balanced-density copy that opens with story, builds empathy, and closes on a call to action; suits nonprofits, advocacy, and cause-led campaigns.',
    contentTemplate: {
      tone: 'emotional',
      sentenceLength: 'medium',
      emojiUsage: 'light',
      headlineStyle: 'narrative',
      copyDensity: 'balanced',
      pattern: 'story → empathy → call to action',
    },
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Less copy, more whitespace, one idea per section.',
    searchTags: ['clean', 'simple', 'minimal', 'swiss', 'editorial'],
    exampleQueries: ['minimal copy', 'less is more', 'one-idea-per-section'],
    vectorDescription:
      'Minimal, sparse copy with short declarative sentences and a single idea per section; suits Swiss-style design, luxury, and editorial minimalism.',
    contentTemplate: {
      tone: 'minimal',
      sentenceLength: 'short',
      emojiUsage: 'none',
      headlineStyle: 'declarative',
      copyDensity: 'sparse',
      pattern: 'one idea → whitespace → next idea',
    },
  },
  {
    id: 'bold-agency',
    name: 'Bold Agency',
    description: 'Strong opinions, visual-first, creative confidence.',
    searchTags: ['bold', 'agency', 'creative', 'design-forward', 'statement'],
    exampleQueries: ['bold creative voice', 'agency statement', 'design-forward confidence'],
    vectorDescription:
      'Bold, sparse, statement-driven copy with strong opinions and visual-first framing; suits design agencies, creative studios, and confident brands.',
    contentTemplate: {
      tone: 'bold',
      sentenceLength: 'short',
      emojiUsage: 'none',
      headlineStyle: 'declarative',
      copyDensity: 'sparse',
      pattern: 'statement → proof → portfolio → invitation',
    },
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Evidence-first prose with citations and measured claims.',
    searchTags: ['academic', 'research', 'citation', 'peer-review', 'scholarly'],
    exampleQueries: ['academic research voice', 'scholarly', 'peer-reviewed tone'],
    vectorDescription:
      'Academic, dense, evidence-first prose with long careful sentences and measured claims; suits research papers, scholarly publications, and peer-reviewed reports.',
    contentTemplate: {
      tone: 'academic',
      sentenceLength: 'long',
      emojiUsage: 'none',
      headlineStyle: 'spec-first',
      copyDensity: 'dense',
      pattern: 'thesis → evidence → analysis → citation',
    },
  },
  {
    id: 'startup-hustle',
    name: 'Startup Hustle',
    description: 'Urgent, action-verb-led founder voice with FOMO awareness.',
    searchTags: ['startup', 'hustle', 'urgent', 'launch', 'founder', 'momentum'],
    exampleQueries: ['urgent founder voice', 'startup hustle', 'FOMO-driven'],
    vectorDescription:
      'Urgent, balanced-density copy with short imperative sentences and momentum-building founder voice; suits product launches, beta announcements, and growth-stage startups.',
    contentTemplate: {
      tone: 'urgent',
      sentenceLength: 'short',
      emojiUsage: 'light',
      headlineStyle: 'imperative',
      copyDensity: 'balanced',
      pattern: 'momentum → opportunity → action → urgency',
    },
  },
  {
    id: 'instructional',
    name: 'Instructional How-To',
    description: 'Step-by-step tutorial voice with imperative headlines and concrete actions.',
    searchTags: ['instructional', 'how-to', 'tutorial', 'step-by-step', 'guide', 'documentation', 'onboarding'],
    exampleQueries: ['how-to instructional', 'step-by-step tutorial voice', 'onboarding guide tone'],
    vectorDescription:
      'Instructional how-to copy with imperative headlines and step-by-step structure; suits tutorials, onboarding, and documentation.',
    contentTemplate: {
      tone: 'professional',
      sentenceLength: 'medium',
      emojiUsage: 'light',
      headlineStyle: 'imperative',
      copyDensity: 'dense',
      pattern: 'step → context → action → result',
    },
  },
  {
    id: 'punchy-social',
    name: 'Punchy Social',
    description: 'Social-media-native copy with short hooks, heavy emoji, and viral-friendly cadence.',
    searchTags: ['social', 'social-media', 'twitter', 'instagram', 'punchy', 'viral', 'hashtag', 'meme'],
    exampleQueries: ['social media punchy', 'Twitter-friendly tone', 'Instagram captions style'],
    vectorDescription:
      'Punchy social-media-native copy with short sentences, heavy emoji, and viral-friendly tone; suits social-first brands and viral product launches.',
    contentTemplate: {
      tone: 'casual',
      sentenceLength: 'short',
      emojiUsage: 'heavy',
      headlineStyle: 'punchy-question',
      copyDensity: 'sparse',
      pattern: 'hook → reaction → hashtag-style aside',
    },
  },
  {
    id: 'sales-pressure',
    name: 'Sales Pressure',
    description: 'High-conversion direct-response copy with scarcity framing and time-bounded asks.',
    searchTags: ['sales', 'urgency', 'scarcity', 'limited-time', 'conversion', 'funnel', 'high-pressure', 'direct-response'],
    exampleQueries: ['high-conversion sales', 'limited-time pressure', 'urgent direct-response'],
    vectorDescription:
      'Urgent direct-response copy with scarcity framing and time-bounded calls to action; suits funnel pages and limited-time offers.',
    contentTemplate: {
      tone: 'urgent',
      sentenceLength: 'short',
      emojiUsage: 'light',
      headlineStyle: 'imperative',
      copyDensity: 'balanced',
      pattern: 'scarcity → benefit → time-bounded ask',
    },
  },
] as const

/**
 * Rank content templates by relevance to a free-text query.
 *
 * Scoring:
 *  - Tag overlap: each matched tag contributes 2 points (whole-word, case-insensitive).
 *  - Substring match on `vectorDescription`: each matched query token contributes 1 point.
 *  - Substring match on `name` / `description`: each matched query token contributes 1 point.
 *
 * Returns templates sorted by score descending; templates with score 0 are dropped.
 * An empty / whitespace-only query returns the library in declared order.
 */
export function findContentStyle(query: string): ContentTemplate[] {
  const trimmed = query.trim().toLowerCase()
  if (trimmed.length === 0) {
    return [...CONTENT_LIBRARY]
  }

  const tokens = trimmed
    .split(/[\s,;.!?/\\()[\]{}'"`]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)

  if (tokens.length === 0) {
    return [...CONTENT_LIBRARY]
  }

  const scored = CONTENT_LIBRARY.map((template) => {
    let score = 0

    const tagSet = new Set(template.searchTags.map((t) => t.toLowerCase()))
    for (const token of tokens) {
      if (tagSet.has(token)) {
        score += 2
      }
    }

    const vector = template.vectorDescription.toLowerCase()
    const name = template.name.toLowerCase()
    const description = template.description.toLowerCase()
    for (const token of tokens) {
      if (vector.includes(token)) score += 1
      if (name.includes(token)) score += 1
      if (description.includes(token)) score += 1
    }

    return { template, score }
  })

  return scored
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.template)
}
