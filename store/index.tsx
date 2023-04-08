import React, {ReactElement, createContext, useContext} from 'react'
import { useLocalObservable, enableStaticRendering } from 'mobx-react-lite'
import createStore, {IStore} from './rootStore';

interface IProps {
  initialValue: Record<any, any>
  children: ReactElement
}


enableStaticRendering(!typeof window)

const StoreContext = createContext({})
export const StoreProvider = ({children, initialValue} : IProps) => {
  const store: IStore = useLocalObservable(createStore(initialValue))
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}


export const useStore = () => {
  const store: IStore = useContext(StoreContext) as IStore

  if(!store) {
    throw Error('数据不存在')
  }

  return store
}