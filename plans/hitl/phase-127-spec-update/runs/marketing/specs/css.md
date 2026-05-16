```json
{
  "palette": {
    "light": {
      "bgPrimary": "#FFFFFF",
      "bgSecondary": "#EAEFF7",
      "textPrimary": "#0A1128",
      "textSecondary": "#384050",
      "accentPrimary": "#007BFF",
      "accentSecondary": "#3399FF"
    },
    "dark": {
      "bgPrimary": "#0A1128",
      "bgSecondary": "#151D38",
      "textPrimary": "#FFFFFF",
      "textSecondary": "#A0A7B4",
      "accentPrimary": "#007BFF",
      "accentSecondary": "#3399FF"
    }
  },
  "typography": {
    "fontFamily": "Inter",
    "headingFamily": "Inter",
    "baseSize": "16px",
    "lineHeight": 1.5,
    "scale": 1.25
  },
  "breakpoints": {
    "sm": "480px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px",
    "2xl": "1536px"
  },
  "responsive": {
    "sectionPadding": {
      "sm": "32px",
      "md": "64px",
      "lg": "96px"
    },
    "baseSize": {
      "sm": "14px",
      "md": "16px",
      "lg": "18px"
    }
  },
  "radii": {
    "sm": "4px",
    "md": "8px",
    "lg": "14px",
    "pill": "9999px"
  },
  "motion": {
    "default": {
      "transitionMs": 150,
      "easing": "ease-in-out"
    },
    "reduced": {
      "transitionMs": 0,
      "easing": "linear"
    }
  },
  "_warnings": [
    "Source theme.mode is 'light', but the provided palette has dark background and light text. Inverting for a consistent 'light' theme and providing a 'dark' variant derived from the original palette."
  ]
}
```
