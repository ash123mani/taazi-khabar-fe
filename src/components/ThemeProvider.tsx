'use client'

import { ConfigProvider, theme } from 'antd'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1a1a1a',
          colorSuccess: '#2e7d32',
          colorWarning: '#e65100',
          colorError: '#c62828',
          colorInfo: '#1565c0',
          colorBgBase: '#fafafa',
          colorBgContainer: '#ffffff',
          colorBgElevated: '#ffffff',
          colorBorder: '#e0e0e0',
          colorTextBase: '#1a1a1a',
          colorTextSecondary: '#757575',
          borderRadius: 4,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: 14,
          controlHeight: 38,
          wireframe: true,
        },
        components: {
          Card: {
            paddingLG: 20,
            borderRadiusLG: 4,
            boxShadowTertiary: '0 1px 3px 0 rgba(0,0,0,0.08)',
          },
          Table: {
            headerBg: '#f5f5f5',
            headerColor: '#1a1a1a',
            rowHoverBg: '#f5f5f5',
            borderColor: '#e0e0e0',
          },
          Menu: {
            itemBg: 'transparent',
            itemBorderRadius: 4,
            horizontalItemSelectedColor: '#1a1a1a',
            itemColor: '#1a1a1a',
            itemHoverBg: '#f0f0f0',
          },
          Tag: {
            defaultBg: '#f5f5f5',
            defaultColor: '#1a1a1a',
          },
          Button: {
            fontWeight: 600,
            primaryShadow: 'none',
            controlHeight: 38,
            defaultBorderColor: '#d0d0d0',
          },
          Input: {
            controlHeight: 40,
            addonBg: '#f5f5f5',
          },
          Modal: {
            contentBg: '#ffffff',
            headerBg: '#ffffff',
          },
          Select: {
            controlHeight: 40,
            optionSelectedBg: '#e0e0e0',
          },
          Layout: {
            headerBg: '#ffffff',
            headerHeight: 56,
            siderBg: '#fafafa',
            bodyBg: '#f5f5f5',
          },
          Tabs: {
            inkBarColor: '#1a1a1a',
            itemSelectedColor: '#1a1a1a',
            horizontalMargin: '0',
          },
          Switch: {
            trackMinWidth: 40,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}
