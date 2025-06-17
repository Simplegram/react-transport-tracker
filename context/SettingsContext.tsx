import React, { createContext, PropsWithChildren, useContext } from "react"
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage"

interface SettingsContextType {
    enableVibration: boolean
    setEnableVibration: (key: boolean) => void
    theme: 'light' | 'dark'
    setTheme: (key: 'light' | 'dark') => void
    travelDisplayMode: 'card' | 'list'
    setTravelDisplayMode: (key: 'card' | 'list') => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const SettingsProvider = ({ children }: PropsWithChildren) => {
    const storage = new MMKVLoader().initialize()
    const [theme, setTheme] = useMMKVStorage<'light' | 'dark'>('appTheme', storage, 'light')
    const [enableVibration, setEnableVibration] = useMMKVStorage<boolean>('settings_vibration', storage, true)
    const [travelDisplayMode, setTravelDisplayMode] = useMMKVStorage<'card' | 'list'>('settings_travelDisplayMode', storage, 'card')

    return (
        <SettingsContext.Provider value={{
            theme, setTheme,
            enableVibration, setEnableVibration,
            travelDisplayMode, setTravelDisplayMode,
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