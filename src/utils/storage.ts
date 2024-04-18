import { createLocalforage, createStorage } from ':/global-utils/src'
import type { Local, Session } from ':/types/storge'

export const localStg = createStorage<Local>('local')

export const sessionStg = createStorage<Session>('session')

export const localforage = createLocalforage<Local>('local')
