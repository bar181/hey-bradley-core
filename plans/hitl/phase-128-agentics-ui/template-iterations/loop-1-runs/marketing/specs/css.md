```json
{
  "palette": {
    "light": {
      "bgPrimary": "#FFFFFF",
      "bgSecondary": "#F0F4F8",
      "textPrimary": "#0A1128",
      "textSecondary": "#5B6A82",
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
    "fontFamily": "Inter, sans-serif",
    "headingFamily": "Inter, sans-serif",
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
      "transitionMs": 300,
      "easing": "ease-in-out"
    },
    "reduced": {
      "transitionMs": 0,
      "easing": "linear"
    }
  },
  "_warnings": [
    "Theme mode 'light' contradicts the provided dark primary background color #0A1128. Derived light palette for consistency.",
    "Light theme contrast (bgPrimary: #FFFFFF, textPrimary: #0A1128) is 15.63, which is sufficient (AA >= 4.5).",
    "Dark theme contrast (bgPrimary: #0A1128, textPrimary: #FFFFFF) is 15.63, which is sufficient (AA >= 4.5)."
  ]
}
```
