/**
 * Namespace Env
 *
 * It is used to declare the type of the import.meta object
 */
declare namespace Env {
  /** The router history mode */
  type RouterHistoryMode = 'hash' | 'history' | 'memory'

  /** Interface for import.meta */
  interface ImportMeta extends ImportMetaEnv {
    /** The base url of the application */
    readonly VITE_BASE_URL: string
    /** The title of the application */
    readonly VITE_APP_TITLE: string
    readonly VITE_APP_CODE: number
    /** The description of the application */
    readonly VITE_APP_DESC: string
    /** The router history mode */
    readonly VITE_ROUTER_HISTORY_MODE?: RouterHistoryMode
    /** The prefix of the iconify icon */
    readonly VITE_ICON_PREFIX: 'icon'
    /**
     * The prefix of the local icon
     *
     * This prefix is start with the icon prefix
     */
    readonly VITE_ICON_LOCAL_PREFIX: 'local-icon'
    /** Backend service base url */
    readonly VITE_SERVICE_BASE_URL: string
    /**
     * Other backend service base url
     *
     * The value is a json
     */
    readonly VITE_OTHER_SERVICE_BASE_URL: string
    /**
     * Whether to enable the http proxy
     *
     * Only valid in the development environment
     */
    readonly VITE_HTTP_PROXY?: 'Y' | 'N'
    /**
     * The home route key
     *
     * It only has effect when the auth route mode is static, if the route mode
     * is dynamic, the home route key is defined in the back-end
     */
    readonly VITE_ROUTE_HOME: string
    /**
     * Default menu icon if menu icon is not set
     *
     * Iconify icon name
     */
    readonly VITE_MENU_ICON: string
    /** Whether to build with sourcemap */
    readonly VITE_SOURCE_MAP?: 'Y' | 'N'
    /**
     * Iconify api provider url
     *
     * If the project is deployed in intranet, you can set the api provider url
     * to the local iconify server
     *
     * @link https://docs.iconify.design/api/providers.html
     */
    readonly VITE_ICONIFY_URL?: string
  }
}
