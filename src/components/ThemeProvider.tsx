'use client'

import { ConfigProvider } from 'antd'

const theme = {
  token: {
    colorPrimary: '#000000',
    colorSuccess: '#000000',
    colorWarning: '#000000',
    colorError: '#000000',
    colorInfo: '#000000',
    colorTextBase: '#000000',
    colorBgBase: '#ffffff',
    colorBorder: '#000000',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    colorBgLayout: '#f5f5f5',
    colorBgSpotlight: '#000000',
    colorText: '#000000',
    colorTextSecondary: '#666666',
    colorTextTertiary: '#999999',
    colorTextQuaternary: '#cccccc',
    borderRadius: 0,
    borderRadiusLG: 0,
    borderRadiusSM: 0,
    borderRadiusXS: 0,
    borderRadiusOuter: 0,
    lineWidth: 2,
    lineWidthBold: 3,
    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,
    paddingContentHorizontal: 24,
    paddingContentVertical: 16,
    marginXS: 8,
    marginSM: 12,
    margin: 16,
    marginMD: 20,
    marginLG: 24,
    marginXL: 32,
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
    linkDecoration: 'underline',
  },
  components: {
    Button: {
      borderRadius: 0,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      paddingContentHorizontal: 24,
      fontWeight: 600,
      defaultBorderColor: '#000000',
      defaultColor: '#000000',
      defaultBg: '#ffffff',
      primaryColor: '#ffffff',
      primaryShadow: 'none',
    },
    Card: {
      borderRadius: 0,
      paddingLG: 20,
      paddingMD: 16,
      marginXS: 0,
    },
    Table: {
      borderRadius: 0,
      headerBg: '#000000',
      headerColor: '#ffffff',
      headerBorderColor: '#000000',
      borderColor: '#000000',
      rowHoverBg: '#f0f0f0',
    },
    Tag: {
      borderRadius: 0,
      lineWidth: 1,
    },
    Menu: {
      borderRadius: 0,
      itemBorderRadius: 0,
      itemColor: '#666666',
      itemHoverColor: '#000000',
      itemSelectedColor: '#000000',
      itemSelectedBg: '#f0f0f0',
    },
    Input: {
      borderRadius: 0,
      controlHeight: 40,
      controlHeightLG: 48,
      controlHeightSM: 32,
      borderColor: '#000000',
      hoverBorderColor: '#000000',
      activeBorderColor: '#000000',
      activeShadow: 'none',
    },
    Select: {
      borderRadius: 0,
      controlHeight: 40,
      borderColor: '#000000',
      hoverBorderColor: '#000000',
    },
    Slider: {
      railBg: '#cccccc',
      railHoverBg: '#999999',
      trackBg: '#000000',
      trackHoverBg: '#000000',
      handleColor: '#000000',
      handleBorderColor: '#000000',
      handleActiveColor: '#000000',
      dotBorderColor: '#000000',
      dotActiveBorderColor: '#000000',
    },
    Modal: {
      borderRadius: 0,
      contentBg: '#ffffff',
      headerBg: '#ffffff',
      footerBg: '#ffffff',
    },
    Alert: {
      borderRadius: 0,
      borderWidth: 2,
    },
    Tabs: {
      borderRadius: 0,
      inkBarColor: '#000000',
      itemSelectedColor: '#000000',
      itemColor: '#666666',
      itemHoverColor: '#000000',
    },
    Progress: {
      borderRadius: 0,
      defaultColor: '#000000',
      remainingColor: '#e8e8e8',
    },
    Spin: {
      dotSizeLG: 40,
      dotSize: 32,
      dotSizeSM: 24,
    },
    Result: {
      borderRadius: 0,
      titleFontSize: 32,
      subtitleFontSize: 16,
    },
    Form: {
      labelColor: '#000000',
      labelFontSize: 14,
      verticalLabelPadding: '0 0 4px',
    },
    Checkbox: {
      borderRadius: 0,
      lineWidth: 2,
    },
    Radio: {
      borderRadius: 0,
      buttonBg: '#ffffff',
      buttonCheckedBg: '#000000',
      buttonCheckedColor: '#ffffff',
    },
    Switch: {
      borderRadius: 0,
      trackHeight: 24,
      handleSize: 20,
    },
    Badge: {
      borderRadius: 0,
    },
    Skeleton: {
      borderRadius: 0,
      gradientFrom: '#f0f0f0',
      gradientTo: '#e0e0e0',
    },
    Statistic: {
      contentFontSize: 24,
      titleFontSize: 14,
    },
    List: {
      borderRadius: 0,
    },
    Descriptions: {
      borderRadius: 0,
      labelBg: '#f5f5f5',
      borderColor: '#000000',
    },
  },
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={theme}>
      {children}
    </ConfigProvider>
  )
}
