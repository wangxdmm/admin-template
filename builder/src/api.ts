import { userLoginCreator, userNormalCreator } from '@runafe/unified-api-user'
import http from './http'

export const userLogin = userLoginCreator(http)
export const userNormal = userNormalCreator(http)
