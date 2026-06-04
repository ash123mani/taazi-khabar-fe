'use client'

import { ConfigProvider, theme } from 'antd'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#6366f1',
          colorSuccess: '#10b981',
          colorWarning: '#f59e0b',
          colorError: '#f43f5e',
          colorInfo: '#06b6d4',
          colorBgBase: '#08080f',
          colorBgContainer: '#14142a',
          colorBgElevated: '#1b1b3a',
          colorBorder: 'rgba(255, 255, 255, 0.06)',
          colorTextBase: '#e4e4f0',
          colorTextSecondary: '#7878a0',
          borderRadius: 10,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          fontSize: 14,
          controlHeight: 38,
          wireframe: false,
        },
        components: {
          Card: {
            paddingLG: 20,
            borderRadiusLG: 12,
            boxShadowTertiary: '0 1px 2px 0 rgba(0,0,0,0.3)',
          },
          Table: {
            headerBg: 'transparent',
            headerColor: '#7878a0',
            rowHoverBg: 'rgba(99, 102, 241, 0.06)',
          },
          Menu: {
            itemBg: 'transparent',
            itemBorderRadius: 8,
            horizontalItemSelectedColor: '#6366f1',
          },
          Tag: {
            defaultBg: 'rgba(255, 255, 255, 0.04)',
            defaultColor: '#8888b0',
          },
          Button: {
            fontWeight: 600,
            primaryShadow: '0 1px 2px 0 rgba(99, 102, 241, 0.3)',
            controlHeight: 38,
          },
          Input: {
            controlHeight: 40,
            addonBg: 'rgba(255, 255, 255, 0.02)',
          },
          Modal: {
            contentBg: '#1b1b3a',
            headerBg: 'transparent',
          },
          Select: {
            controlHeight: 40,
            optionSelectedBg: 'rgba(99, 102, 241, 0.15)',
          },
          Slider: {
            trackBg: '#6366f1',
            trackHoverBg: '#818cf8',
            handleColor: '#6366f1',
          },
          Layout: {
            headerBg: 'rgba(8, 8, 15, 0.8)',
            headerHeight: 56,
            siderBg: '#0d0d1a',
            bodyBg: 'transparent',
          },
          Tabs: {
            inkBarColor: '#6366f1',
            itemSelectedColor: '#6366f1',
            horizontalMargin: '0',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}
