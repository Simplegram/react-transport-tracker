import React, { createContext, PropsWithChildren, useContext } from "react"
import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage"

interface ThemeContextType {
    theme: 'light' | 'dark'
    setTheme: (key: 'light' | 'dark') => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    const storage = new MMKVLoader().initialize()
    const [theme, setTheme] = useMMKVStorage<'light' | 'dark'>('appTheme', storage, 'light')

    return (
        <ThemeContext.Provider value={{
            theme, setTheme
        }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}