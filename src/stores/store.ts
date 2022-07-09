import { defineStore } from 'pinia'

//export type State = {loginInfo ?: User | undefined} // {loginInfo : User | undefined}

export const mainStore = defineStore({
  id: 'main',
  state: () => ({
    size: 3
  })
})
