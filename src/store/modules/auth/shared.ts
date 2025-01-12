import Cookies from 'universal-cookie'
import { genUid } from '@monan/shared'
import type { UserInfo } from ':/types'
import { localStg } from ':/utils'

const cookies = new Cookies(null, { path: '/' })
/** Get token */
export function getToken() {
  const cookieToken = cookies.get('loginToken')

  if (!['null', 'undefined', ''].includes(cookieToken) && cookieToken) {
    return cookieToken
  }

  return localStg.get('token')
}

export function removeToken() {
  localStg.remove('token')
  cookies.remove('loginToken')
}

/** Get user info */
export function getUserInfo() {
  const emptyInfo: UserInfo = {
    userId: genUid('AutoGenerated_userId'),
    realName: '',
    haveCustomerService: '',
    attribute: '',
    administrationCode: '',
    roles: [],
  }
  const userInfo = localStg.get('userInfo') || emptyInfo

  return userInfo
}

/** Clear auth storage */
export function clearAuthStorage() {
  removeToken()
  localStg.remove('refreshToken')
  localStg.remove('userInfo')
}
