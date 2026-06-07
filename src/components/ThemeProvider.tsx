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
          colorSuccess: '#10b981',
          colorWarning: '#f59e0b',
          colorError: '#ef4444',
          colorInfo: '#3b82f6',
          colorBgBase: '#0a0a0b',
          colorBgContainer: '#141416',
          colorBgElevated: '#1c1c1f',
          colorBorder: '#27272a',
          colorTextBase: '#fafafa',
          colorTextSecondary: '#a1a1aa',
          colorTextTertiary: '#d4d4d8',
          colorTextQuaternary: '#e4e4e7',
          borderRadius: 10,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: 14,
          controlHeight: 40,
          wireframe: false,
          boxShadow: '0 1px 3px 0 rgba(0,0,0,0.4), 0 1px 2px -1px rgba(0,0,0,0.4)',
          boxShadowSecondary: '0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -4px rgba(0,0,0,0.5)',
        },
        components: {
          Card: {
            paddingLG: 24,
            borderRadiusLG: 14,
            boxShadowTertiary: '0 4px 6px -1px rgba(0,0,0,0.3), 0 2px 4px -2px rgba(0,0,0,0.3)',
          },
          Table: {
            headerBg: '#1c1c1f',
            headerColor: '#fafafa',
            rowHoverBg: '#1c1c1f',
            borderColor: '#27272a',
            headerBorderRadius: 10,
          },
          Menu: {
            itemBg: 'transparent',
            itemBorderRadius: 8,
            horizontalItemSelectedColor: '#6366f1',
            itemColor: '#a1a1aa',
            itemHoverBg: 'rgba(255,255,255,0.05)',
            itemHoverColor: '#fafafa',
            subMenuItemBg: 'transparent',
            itemSelectedBg: 'rgba(99, 102, 241, 0.15)',
            itemSelectedColor: '#6366f1',
          },
          Tag: {
            defaultBg: '#27272a',
            defaultColor: '#a1a1aa',
            borderRadiusSM: 6,
          },
          Button: {
            fontWeight: 500,
            primaryShadow: 'none',
            controlHeight: 40,
            defaultBorderColor: '#3f3f46',
            primaryColor: '#fff',
            borderRadius: 8,
          },
          Input: {
            controlHeight: 42,
            addonBg: '#27272a',
            borderRadius: 8,
            activeBorderColor: '#6366f1',
            hoverBorderColor: '#818cf8',
          },
          Modal: {
            contentBg: '#141416',
            headerBg: '#141416',
            titleColor: '#fafafa',
            borderRadiusLG: 14,
          },
          Select: {
            controlHeight: 42,
            optionSelectedBg: '#6366f1',
            borderRadius: 8,
          },
          Layout: {
            headerBg: '#141416',
            headerHeight: 64,
            siderBg: '#0a0a0b',
            bodyBg: '#0a0a0b',
          },
          Tabs: {
            inkBarColor: '#6366f1',
            itemSelectedColor: '#6366f1',
            horizontalMargin: '0',
            itemHoverColor: '#818cf8',
          },
          Switch: {
            trackMinWidth: 44,
          },
          Collapse: {
            headerBg: '#141416',
            contentBg: '#141416',
            headerPadding: '12px 0',
            contentPadding: '0 0 12px 0',
            borderRadiusLG: 10,
          },
          DatePicker: {
            activeBorderColor: '#6366f1',
            hoverBorderColor: '#818cf8',
            activeShadow: '0 0 0 3px rgba(99, 102, 241, 0.15)',
            borderRadius: 8,
          },
          Dropdown: {
            borderRadiusLG: 10,
          },
          Message: {
            contentBg: '#141416',
            borderRadiusLG: 10,
          },
          Notification: {
            borderRadiusLG: 10,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}
