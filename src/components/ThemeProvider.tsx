'use client'

import { useEffect } from 'react'
import { ConfigProvider, theme } from 'antd'
import { useThemeStore } from '@/stores/themeStore'

const DARK_TOKENS = {
  colorPrimary: '#6366f1',
  colorSuccess: '#22c55e',
  colorWarning: '#eab308',
  colorError: '#ef4444',
  colorInfo: '#6366f1',
  colorBgBase: '#0a0a0a',
  colorBgContainer: '#111111',
  colorBgElevated: '#1a1a1a',
  colorBgLayout: '#0a0a0a',
  colorBorder: '#1f1f1f',
  colorBorderSecondary: '#1a1a1a',
  colorTextBase: '#ffffff',
  colorTextSecondary: '#a1a1a1',
  colorTextTertiary: '#6b6b6b',
  colorTextQuaternary: '#4a4a4a',
  borderRadius: 8,
  fontFamily: "'Source Serif 4', Georgia, 'Times New Roman', serif",
  fontSize: 14,
  fontSizeSM: 12,
  fontSizeLG: 16,
  fontSizeXL: 20,
  controlHeight: 40,
  controlHeightSM: 32,
  wireframe: false,
  boxShadow: '0 1px 2px 0 rgba(0,0,0,0.5)',
  boxShadowSecondary: '0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -2px rgba(0,0,0,0.5)',
}

const LIGHT_TOKENS = {
  colorPrimary: '#6366f1',
  colorSuccess: '#22c55e',
  colorWarning: '#eab308',
  colorError: '#ef4444',
  colorInfo: '#6366f1',
  colorBgBase: '#ffffff',
  colorBgContainer: '#ffffff',
  colorBgElevated: '#ffffff',
  colorBgLayout: '#f5f5f5',
  colorBorder: '#e5e5e5',
  colorBorderSecondary: '#f0f0f0',
  colorTextBase: '#171717',
  colorTextSecondary: '#525252',
  colorTextTertiary: '#a3a3a3',
  colorTextQuaternary: '#d4d4d4',
  borderRadius: 8,
  fontFamily: "'Source Serif 4', Georgia, 'Times New Roman', serif",
  fontSize: 14,
  fontSizeSM: 12,
  fontSizeLG: 16,
  fontSizeXL: 20,
  controlHeight: 40,
  controlHeightSM: 32,
  wireframe: false,
  boxShadow: '0 1px 3px 0 rgba(0,0,0,0.04)',
  boxShadowSecondary: '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.04)',
}

const DARK_COMPONENTS = {
  Card: { paddingLG: 24, borderRadiusLG: 12, boxShadowTertiary: 'none', colorBorderSecondary: '#1f1f1f' },
  Table: { headerBg: '#0a0a0a', headerColor: '#a1a1a1', headerSortActiveBg: '#141414', headerSortHoverBg: '#141414', rowHoverBg: '#0f0f0f', borderColor: '#1f1f1f', headerBorderRadius: 8, cellPaddingBlock: 16, cellPaddingInline: 20 },
  Menu: { itemBg: 'transparent', itemBorderRadius: 6, horizontalItemSelectedColor: '#ffffff', itemColor: '#a1a1a1', itemHoverBg: 'rgba(255,255,255,0.04)', itemHoverColor: '#ffffff', subMenuItemBg: 'transparent', itemSelectedBg: 'rgba(255,255,255,0.08)', itemSelectedColor: '#ffffff', itemMarginInline: 4, itemPaddingInline: 12 },
  Tag: { defaultBg: '#141414', defaultColor: '#a1a1a1', borderRadiusSM: 6, fontSizeSM: 11 },
  Button: { fontWeight: 500, primaryShadow: 'none', controlHeight: 40, defaultBorderColor: '#2a2a2a', primaryColor: '#ffffff', borderRadius: 8, contentFontSizeSM: 13, contentFontSizeLG: 14, borderColorDisabled: '#1f1f1f', defaultGhostBorderColor: '#6366f1', defaultGhostColor: '#6366f1' },
  Input: { controlHeight: 44, addonBg: '#141414', borderRadius: 8, activeBorderColor: '#6366f1', hoverBorderColor: '#3a3a3a', paddingInline: 16, paddingBlock: 12, colorBgContainer: '#0a0a0a', colorBgContainerDisabled: '#0a0a0a' },
  Modal: { contentBg: '#0a0a0a', headerBg: '#0a0a0a', titleColor: '#ffffff', borderRadiusLG: 16, paddingLG: 24 },
  Select: { controlHeight: 44, optionSelectedBg: '#1a1a1a', borderRadius: 8, optionActiveBg: '#141414', colorBgContainer: '#0a0a0a', colorBgElevated: '#141414' },
  Layout: { headerBg: '#0a0a0a', headerHeight: 64, siderBg: '#0a0a0a', bodyBg: '#0a0a0a' },
  Tabs: { inkBarColor: '#6366f1', itemSelectedColor: '#ffffff', horizontalMargin: '0', itemHoverColor: '#a1a1a1', itemColor: '#6b6b6b', cardGutter: 4, cardBg: '#0a0a0a' },
  Switch: { trackMinWidth: 44, trackHeight: 24 },
  Collapse: { headerBg: 'transparent', contentBg: 'transparent', headerPadding: '16px 24px', contentPadding: '0 24px 20px', borderRadiusLG: 8 },
  DatePicker: { activeBorderColor: '#6366f1', hoverBorderColor: '#3a3a3a', activeShadow: '0 0 0 3px rgba(99, 102, 241, 0.15)', borderRadius: 8, colorBgContainer: '#0a0a0a', colorBgElevated: '#141414' },
  Dropdown: { borderRadiusLG: 12, paddingBlock: 8 },
  Message: { contentBg: '#141414', borderRadiusLG: 10 },
  Notification: { borderRadiusLG: 12 },
  Statistic: { titleFontSize: 12 },
  Progress: { remainingColor: '#1f1f1f' },
  Segmented: { itemSelectedBg: '#6366f1', itemSelectedColor: '#ffffff', trackBg: '#141414', itemColor: '#a1a1a1', itemHoverColor: '#ffffff' },
  Tooltip: { colorBgSpotlight: '#141414' },
  Popconfirm: { colorBgElevated: '#141414', borderRadiusLG: 12 },
  Badge: { indicatorHeight: 18 },
  Skeleton: { color: '#141414' },
  Spin: { dotSize: 32, dotSizeSM: 20, dotSizeLG: 48 },
}

const LIGHT_COMPONENTS = {
  Card: { paddingLG: 24, borderRadiusLG: 12, boxShadowTertiary: 'none', colorBorderSecondary: '#e5e5e5' },
  Table: { headerBg: '#fafafa', headerColor: '#525252', headerSortActiveBg: '#f0f0f0', headerSortHoverBg: '#f0f0f0', rowHoverBg: '#fafafa', borderColor: '#e5e5e5', headerBorderRadius: 8, cellPaddingBlock: 16, cellPaddingInline: 20 },
  Menu: { itemBg: 'transparent', itemBorderRadius: 6, horizontalItemSelectedColor: '#6366f1', itemColor: '#525252', itemHoverBg: 'rgba(99,102,241,0.04)', itemHoverColor: '#171717', subMenuItemBg: 'transparent', itemSelectedBg: 'rgba(99,102,241,0.08)', itemSelectedColor: '#6366f1', itemMarginInline: 4, itemPaddingInline: 12 },
  Tag: { defaultBg: '#f5f5f5', defaultColor: '#525252', borderRadiusSM: 6, fontSizeSM: 11 },
  Button: { fontWeight: 500, primaryShadow: 'none', controlHeight: 40, defaultBorderColor: '#d4d4d4', primaryColor: '#ffffff', borderRadius: 8, contentFontSizeSM: 13, contentFontSizeLG: 14, borderColorDisabled: '#e5e5e5', defaultGhostBorderColor: '#6366f1', defaultGhostColor: '#6366f1' },
  Input: { controlHeight: 44, addonBg: '#f5f5f5', borderRadius: 8, activeBorderColor: '#6366f1', hoverBorderColor: '#d4d4d4', paddingInline: 16, paddingBlock: 12, colorBgContainer: '#ffffff', colorBgContainerDisabled: '#f5f5f5' },
  Modal: { contentBg: '#ffffff', headerBg: '#ffffff', titleColor: '#171717', borderRadiusLG: 16, paddingLG: 24 },
  Select: { controlHeight: 44, optionSelectedBg: '#f0f0f0', borderRadius: 8, optionActiveBg: '#f5f5f5', colorBgContainer: '#ffffff', colorBgElevated: '#ffffff' },
  Layout: { headerBg: '#ffffff', headerHeight: 64, siderBg: '#000000', bodyBg: '#f5f5f5' },
  Tabs: { inkBarColor: '#6366f1', itemSelectedColor: '#6366f1', horizontalMargin: '0', itemHoverColor: '#525252', itemColor: '#a3a3a3', cardGutter: 4, cardBg: '#ffffff' },
  Switch: { trackMinWidth: 44, trackHeight: 24 },
  Collapse: { headerBg: 'transparent', contentBg: 'transparent', headerPadding: '16px 24px', contentPadding: '0 24px 20px', borderRadiusLG: 8 },
  DatePicker: { activeBorderColor: '#6366f1', hoverBorderColor: '#d4d4d4', activeShadow: '0 0 0 3px rgba(99, 102, 241, 0.15)', borderRadius: 8, colorBgContainer: '#ffffff', colorBgElevated: '#ffffff' },
  Dropdown: { borderRadiusLG: 12, paddingBlock: 8 },
  Message: { contentBg: '#ffffff', borderRadiusLG: 10 },
  Notification: { borderRadiusLG: 12 },
  Statistic: { titleFontSize: 12 },
  Progress: { remainingColor: '#e5e5e5' },
  Segmented: { itemSelectedBg: '#6366f1', itemSelectedColor: '#ffffff', trackBg: '#f0f0f0', itemColor: '#525252', itemHoverColor: '#171717' },
  Tooltip: { colorBgSpotlight: '#171717' },
  Popconfirm: { colorBgElevated: '#ffffff', borderRadiusLG: 12 },
  Badge: { indicatorHeight: 18 },
  Skeleton: { color: '#f0f0f0' },
  Spin: { dotSize: 32, dotSizeSM: 20, dotSizeLG: 48 },
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isDark = useThemeStore((s) => s.isDark)
  const setDark = useThemeStore((s) => s.setDark)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    setDark(isDark)
  }, [])

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        cssVar: { key: 'taazi', prefix: '--ant-' },
        token: isDark ? DARK_TOKENS : LIGHT_TOKENS,
        components: isDark ? DARK_COMPONENTS : LIGHT_COMPONENTS,
      }}
    >
      {children}
    </ConfigProvider>
  )
}
