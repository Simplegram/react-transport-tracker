import { AuthProvider, useAuth } from '@/context/AuthContext'
import { SupabaseProvider } from '@/context/SupabaseContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { Slot, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'

const InitialLayout = () => {
    const { session, initialized } = useAuth()
    const segments = useSegments()
    const router = useRouter()

    useEffect(() => {
        if (!initialized) return

        const inAuthGroup = segments[0] === '(tabs)'

        if (session && !inAuthGroup) {
            router.replace('/mainMenu')
        } else if (!session) {
            router.replace('/')
        }
    }, [session, initialized])

    return <Slot />
}

const RootLayout = () => {
    return (
        <SupabaseProvider>
            <AuthProvider>
                <ThemeProvider>
                    <InitialLayout />
                </ThemeProvider>
            </AuthProvider>
        </SupabaseProvider>
    )
}

export default RootLayout
