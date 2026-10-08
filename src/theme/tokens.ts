// Design Tokens & Theme for Cirulla Mobile
// Conforming to UI/UX Pro Max and Anti-Slop Guidelines

export const theme = {
  colors: {
    // Canvas & Surfaces
    background: '#090e17',
    surface: '#0f172a',
    surfaceSubtle: '#141e33',
    card: '#192231',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    cardBorderActive: '#38bdf8',
    cardBorderGold: '#f59e0b',

    // Game Table Felt
    feltGreen: '#15803d',
    feltGreenDark: '#0e3d20',
    feltBorder: '#166534',

    // Accents & Actions
    accentGold: '#d97706',
    accentGoldLight: '#f59e0b',
    primary: '#0284c7',
    primaryLight: '#38bdf8',
    primaryDark: '#0369a1',

    // Semantics & Status
    success: '#10b981',
    successMuted: 'rgba(16, 185, 129, 0.15)',
    danger: '#ef4444',
    dangerMuted: 'rgba(239, 68, 68, 0.15)',
    warning: '#f59e0b',
    warningMuted: 'rgba(245, 158, 11, 0.15)',

    // Neutrals & Text Hierarchy
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    textInverse: '#0f172a',

    // Card Specific
    cardRed: '#dc2626',
    cardBlack: '#1e293b',

    // Overlays
    backdrop: 'rgba(5, 8, 15, 0.85)',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  radii: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 22,
    full: 9999,
  },

  typography: {
    titleLarge: {
      fontSize: 22,
      fontWeight: '800' as const,
      letterSpacing: 0.5,
      color: '#f8fafc',
    },
    titleMedium: {
      fontSize: 18,
      fontWeight: '700' as const,
      letterSpacing: 0.3,
      color: '#f8fafc',
    },
    titleSmall: {
      fontSize: 15,
      fontWeight: '700' as const,
      color: '#f8fafc',
    },
    bodyMedium: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
      color: '#94a3b8',
    },
    bodySmall: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
      color: '#64748b',
    },
    caption: {
      fontSize: 11,
      fontWeight: '600' as const,
      letterSpacing: 0.4,
      color: '#94a3b8',
    },
  },

  touch: {
    minTargetSize: 44,
    hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
  },
} as const;

export type Theme = typeof theme;
