import { userLoginCreator, userNormalCreator } from '@runafe/unified-api-user'
import http from './http'
import { designerDoApplicationCreator } from ':/api/designer/do/application'

export const userLogin = userLoginCreator(http)
export const userNormal = userNormalCreator(http)
export const designerDoApplication = designerDoApplicationCreator(http)
