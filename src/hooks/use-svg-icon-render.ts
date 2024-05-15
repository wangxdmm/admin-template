import { h } from 'vue'
import type { Component } from 'vue'

export type IconStyle = Partial<Pick<CSSStyleDeclaration, 'color' | 'fontSize'>>

export interface IconConfig {
  /** Iconify icon name */
  icon?: string
  /** Local icon name */
  localIcon?: string
  /** Icon color */
  color?: string
  /** Icon size */
  fontSize?: number
}

/**
 * Svg icon render hook
 *
 * @param SvgIcon Svg icon component
 */
export default function useSvgIconRender(SvgIcon: Component) {
  /**
   * Svg icon VNode
   *
   * @param config
   */
  const SvgIconVNode = (config: IconConfig) => {
    const { color, fontSize, icon, localIcon } = config

    const style: IconStyle = {}

    if (color) {
      style.color = color
    }

    if (fontSize) {
      style.fontSize = `${fontSize}px`
    }

    if (!icon && !localIcon) {
      return undefined
    }

    return () => h(SvgIcon, { icon, localIcon, style })
  }

  return {
    SvgIconVNode,
  }
}
