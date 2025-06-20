import { AuthProvider, useAuth } from '@/context/AuthContext'
import { DialogProvider } from '@/context/DialogContext'
import { SettingsProvider } from '@/context/SettingsContext'
import { SupabaseProvider } from '@/context/SupabaseContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { Slot, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const InitialLayout = () => {
    const { session, initialized } = useAuth()
    const segments = useSegments()
    const router = useRouter()

    useEffect(() => {
        if (!initialized) return

        const inAuthGroup = segments[0] === '(tabs)'

        if (session && !inAuthGroup) {
            router.replace('/main')
        } else if (!session) {
            router.replace('/')
        }
    }, [session, initialized])

    return <Slot />
}

const RootLayout = () => {
    return (
        <SupabaseProvider schema={process.env.EXPO_PUBLIC_SUPABASE_SCHEMA}>
            <AuthProvider>
                <SettingsProvider>
                    <ThemeProvider>
                        <DialogProvider>
                            <GestureHandlerRootView>
                                <InitialLayout />
                            </GestureHandlerRootView>
                        </DialogProvider>
                    </ThemeProvider>
                </SettingsProvider>
            </AuthProvider>
        </SupabaseProvider>
    )
}

export default RootLayout
