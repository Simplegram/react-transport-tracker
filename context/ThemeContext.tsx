import React, { createContext, useContext, useState } from "react"

interface ThemeContextType {
    theme: 'light' | 'dark'
}

interface ThemeProviderProps {
    children: React.ReactNode
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    return (
        <ThemeContext.Provider
            value={{
                theme
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}