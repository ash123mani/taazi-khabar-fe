'use client'

import { ConfigProvider, theme } from 'antd'
import { usePathname } from 'next/navigation'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        cssVar: { key: 'taazi', prefix: '--ant-' },
        token: {
          colorPrimary: '#6366f1',
          colorSuccess: '#22c55e',
          colorWarning: '#eab308',
          colorError: '#ef4444',
          colorInfo: '#6366f1',
          colorBgBase: '#000000',
          colorBgContainer: '#0a0a0a',
          colorBgElevated: '#141414',
          colorBgLayout: '#000000',
          colorBorder: '#1f1f1f',
          colorBorderSecondary: '#1a1a1a',
          colorTextBase: '#ffffff',
          colorTextSecondary: '#a1a1a1',
          colorTextTertiary: '#6b6b6b',
          colorTextQuaternary: '#4a4a4a',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: 14,
          fontSizeSM: 12,
          fontSizeLG: 16,
          fontSizeXL: 20,
          controlHeight: 40,
          controlHeightSM: 32,
          wireframe: false,
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.5)',
          boxShadowSecondary: '0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -2px rgba(0,0,0,0.5)',
        },
        components: {
          Card: {
            paddingLG: 24,
            borderRadiusLG: 12,
            boxShadowTertiary: 'none',
            colorBorderSecondary: '#1f1f1f',
          },
          Table: {
            headerBg: '#0a0a0a',
            headerColor: '#a1a1a1',
            headerSortActiveBg: '#141414',
            headerSortHoverBg: '#141414',
            rowHoverBg: '#0f0f0f',
            borderColor: '#1f1f1f',
            headerBorderRadius: 8,
            cellPaddingBlock: 16,
            cellPaddingInline: 20,
          },
          Menu: {
            itemBg: 'transparent',
            itemBorderRadius: 6,
            horizontalItemSelectedColor: '#ffffff',
            itemColor: '#a1a1a1',
            itemHoverBg: 'rgba(255,255,255,0.04)',
            itemHoverColor: '#ffffff',
            subMenuItemBg: 'transparent',
            itemSelectedBg: 'rgba(255,255,255,0.08)',
            itemSelectedColor: '#ffffff',
            itemMarginInline: 4,
            itemPaddingInline: 12,
          },
          Tag: {
            defaultBg: '#141414',
            defaultColor: '#a1a1a1',
            borderRadiusSM: 6,
            fontSizeSM: 11,
          },
          Button: {
            fontWeight: 500,
            primaryShadow: 'none',
            controlHeight: 40,
            defaultBorderColor: '#2a2a2a',
            primaryColor: '#ffffff',
            borderRadius: 8,
            contentFontSizeSM: 13,
            contentFontSizeLG: 14,
            borderColorDisabled: '#1f1f1f',
            defaultGhostBorderColor: '#6366f1',
            defaultGhostColor: '#6366f1',
          },
          Input: {
            controlHeight: 44,
            addonBg: '#141414',
            borderRadius: 8,
            activeBorderColor: '#6366f1',
            hoverBorderColor: '#3a3a3a',
            paddingInline: 16,
            paddingBlock: 12,
            colorBgContainer: '#0a0a0a',
            colorBgContainerDisabled: '#0a0a0a',
          },
          Modal: {
            contentBg: '#0a0a0a',
            headerBg: '#0a0a0a',
            titleColor: '#ffffff',
            borderRadiusLG: 16,
            paddingLG: 24,
          },
          Select: {
            controlHeight: 44,
            optionSelectedBg: '#1a1a1a',
            borderRadius: 8,
            optionActiveBg: '#141414',
            colorBgContainer: '#0a0a0a',
            colorBgElevated: '#141414',
          },
          Layout: {
            headerBg: '#000000',
            headerHeight: 64,
            siderBg: '#000000',
            bodyBg: '#000000',
          },
          Tabs: {
            inkBarColor: '#6366f1',
            itemSelectedColor: '#ffffff',
            horizontalMargin: '0',
            itemHoverColor: '#a1a1a1',
            itemColor: '#6b6b6b',
            cardGutter: 4,
            cardBg: '#0a0a0a',

          },
          Switch: {
            trackMinWidth: 44,
            trackHeight: 24,
          },
          Collapse: {
            headerBg: 'transparent',
            contentBg: 'transparent',
            headerPadding: '16px 0',
            contentPadding: '0 0 16px 0',
            borderRadiusLG: 8,
          },
          DatePicker: {
            activeBorderColor: '#6366f1',
            hoverBorderColor: '#3a3a3a',
            activeShadow: '0 0 0 3px rgba(99, 102, 241, 0.15)',
            borderRadius: 8,
            colorBgContainer: '#0a0a0a',
            colorBgElevated: '#141414',
          },
          Dropdown: {
            borderRadiusLG: 12,
            paddingBlock: 8,
          },
          Message: {
            contentBg: '#141414',
            borderRadiusLG: 10,
          },
          Notification: {
            borderRadiusLG: 12,
          },
          Statistic: {
            titleFontSize: 12,
          },
          Progress: {
            remainingColor: '#1f1f1f',
          },
          Segmented: {
            itemSelectedBg: '#6366f1',
            itemSelectedColor: '#ffffff',
            trackBg: '#141414',
            itemColor: '#a1a1a1',
            itemHoverColor: '#ffffff',
          },
          Tooltip: {
            colorBgSpotlight: '#141414',
          },
          Popconfirm: {
            colorBgElevated: '#141414',
            borderRadiusLG: 12,
          },
          Badge: {
            indicatorHeight: 18,
          },
          Skeleton: {
            color: '#141414',
          },
          Spin: {
            dotSize: 32,
            dotSizeSM: 20,
            dotSizeLG: 48,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}
