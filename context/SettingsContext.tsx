import React, { createContext, PropsWithChildren, useContext } from "react"
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage"

interface SettingsContextType {
    enableVibration: boolean
    setEnableVibration: (key: boolean) => void
    theme: 'light' | 'dark'
    setTheme: (key: 'light' | 'dark') => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const SettingsProvider = ({ children }: PropsWithChildren) => {
    const storage = new MMKVLoader().initialize()
    const [theme, setTheme] = useMMKVStorage<'light' | 'dark'>('appTheme', storage, 'light')
    const [enableVibration, setEnableVibration] = useMMKVStorage<boolean>('settings_vibration', storage, true)

    return (
        <SettingsContext.Provider value={{
            enableVibration, setEnableVibration,
            theme, setTheme,
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