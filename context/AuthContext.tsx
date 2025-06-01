import { useSupabase } from '@/context/SupabaseContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Session, User } from '@supabase/supabase-js'
import React, { createContext, PropsWithChildren, useEffect, useState } from 'react'

type AuthProps = {
    user: User | null
    session: Session | null
    initialized?: boolean
    signOut?: () => void
}

export const AuthContext = createContext<Partial<AuthProps>>({})

export function useAuth() {
    return React.useContext(AuthContext)
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const { supabaseClient } = useSupabase()

    const [user, setUser] = useState<User | null>()
    const [session, setSession] = useState<Session | null>(null)
    const [initialized, setInitialized] = useState<boolean>(false)

    useEffect(() => {
        if (supabaseClient) {
            const { data } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
                setSession(session)
                setUser(session ? session.user : null)
                setInitialized(true)
            })

            return () => {
                data.subscription.unsubscribe()
            }
        }
    }, [supabaseClient])

    const signOut = async () => {
        if (supabaseClient) {
            AsyncStorage.clear()
            await supabaseClient.auth.signOut()
        }
    }

    const value = {
        user,
        session,
        initialized,
        signOut,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
