import React, { createContext, useContext } from "react"
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage"

interface SettingsContextType {
    enableSwipeZone: boolean
    setEnableSwipeZone: (key: boolean) => void
    theme: 'light' | 'dark'
    setTheme: (key: 'light' | 'dark') => void
}

interface SettingsProviderProps {
    children: React.ReactNode
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
    const storage = new MMKVLoader().initialize()
    const [theme, setTheme] = useMMKVStorage<'light' | 'dark'>('appTheme', storage, 'light')
    const [enableSwipeZone, setEnableSwipeZone] = useMMKVStorage<boolean>('settings_swipeZone', storage, true)

    return (
        <SettingsContext.Provider value={{
            theme, setTheme,
            enableSwipeZone, setEnableSwipeZone,
        }}>
            {children}
        </SettingsContext.Provider>
    )
}

export const useSettings = () => {
    const context = useContext(SettingsContext)
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider')
    }
    return context
}