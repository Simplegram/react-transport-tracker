import { useSupabase } from '@/context/SupabaseContext'
import { Session, User } from '@supabase/supabase-js'
import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

type AuthProps = {
    user: User | null
    session: Session | null
    initialized?: boolean
    signOut?: () => void
}

export const AuthContext = createContext<Partial<AuthProps>>({})

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
        if (supabaseClient) await supabaseClient.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{
            user,
            session,
            initialized,
            signOut,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider')
    }
    return context
}