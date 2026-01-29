// Authentic MSN Messenger + Windows XP Luna Theme
export const Colors = {
  // Windows XP Luna Blue Theme
  xpTitleBarStart: '#0A246A',
  xpTitleBarEnd: '#A6CAF0',
  xpTitleBarActive: '#0054E3',
  xpToolbarStart: '#6B91C9',
  xpToolbarEnd: '#9ABFEA',
  
  // MSN Header Gradient (the lighter blue area)
  msnHeaderStart: '#6994CD',
  msnHeaderMid: '#85A8D6',
  msnHeaderEnd: '#B1C8E5',
  
  // Classic MSN Buddy colors
  msnGreen: '#6DC02A',
  msnBlue: '#1E90FF',
  msnOrange: '#FF8C00',
  
  // Status colors (classic MSN)
  online: '#5CB400',
  away: '#E7A330',
  busy: '#DF3C3C',
  offline: '#8C8C8C',
  
  // UI Colors (XP style)
  windowBackground: '#ECE9D8',
  white: '#FFFFFF',
  panelBackground: '#F1EFE2',
  listBackground: '#FFFFFF',
  
  // Borders (XP 3D effect)
  borderLight: '#FFFFFF',
  borderMid: '#D4D0C8',
  borderDark: '#ACA899',
  borderDarker: '#716F64',
  
  // Text
  textPrimary: '#000000',
  textSecondary: '#4A4A4A',
  textLink: '#0066CC',
  textDisabled: '#8C8C8C',
  textLight: '#FFFFFF',
  
  // Selection
  selectionBg: '#316AC5',
  selectionText: '#FFFFFF',
  
  // Button (XP style)
  buttonFace: '#ECE9D8',
  buttonHighlight: '#FFFFFF',
  buttonShadow: '#ACA899',
  
  // Input fields
  inputBg: '#FFFFFF',
  inputBorder: '#7F9DB9',
  
  // Chat
  chatBackground: '#FFFFFF',
  divider: '#D4D0C8',

  // Legacy names for compatibility
  primary: '#0054E3',
  background: '#ECE9D8',
  backgroundSecondary: '#F1EFE2',
  border: '#ACA899',
  chatBubbleSent: '#E1EEFF',
  chatBubbleReceived: '#FFFFFF',
};

// Status options matching MSN Messenger exactly
export const StatusOptions = [
  { id: 'online', label: 'Online', color: Colors.online, icon: '🟢' },
  { id: 'busy', label: 'Busy', color: Colors.busy, icon: '🔴' },
  { id: 'brb', label: 'Be Right Back', color: Colors.away, icon: '🟡' },
  { id: 'away', label: 'Away', color: Colors.away, icon: '🟡' },
  { id: 'phone', label: 'On the Phone', color: Colors.busy, icon: '📞' },
  { id: 'lunch', label: 'Out to Lunch', color: Colors.away, icon: '🟡' },
  { id: 'offline', label: 'Appear Offline', color: Colors.offline, icon: '⚫' },
];

// Classic MSN Emoticons
export const Emoticons: Record<string, string> = {
  ':)': '😊',
  ':D': '😃',
  ';)': '😉',
  ':P': '😛',
  ':(': '😢',
  ':S': '😖',
  ':O': '😮',
  ':|': '😐',
  ":'(": '😭',
  '8)': '😎',
  '(A)': '😇',
  '(L)': '❤️',
  '(U)': '💔',
  '(M)': '📧',
  '(@)': '🐱',
  '(&)': '🐶',
  '(C)': '☕',
  '(D)': '🍺',
  '(K)': '💋',
  '(F)': '🌹',
  '(W)': '💀',
  '(O)': '⏰',
  '(T)': '📞',
  '(I)': '💡',
  '(8)': '🎵',
  '(S)': '🌙',
  '(*)': '⭐',
  '(#)': '☀️',
  '(Y)': '👍',
  '(N)': '👎',
  '(H)': '😎',
  '(G)': '🎁',
  '(P)': '📷',
  '(^)': '🎂',
};

// Typography - Tahoma was THE MSN/XP font
export const Typography = {
  fontFamily: 'Tahoma, Segoe UI, sans-serif',
  fontSizes: {
    xs: 9,
    sm: 11,
    md: 12,
    lg: 13,
    xl: 14,
    xxl: 16,
    title: 11,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

// Spacing
export const Spacing = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
};
