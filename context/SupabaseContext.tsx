import { useMMKVString } from "react-native-mmkv";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

interface SupabaseContextType {
    supabaseClient: SupabaseClient<any, any, any> | undefined;
    supabaseUrl: string | undefined;
    setSupabaseUrl: (url: string | undefined) => void;
    supabaseAnonKey: string | undefined;
    setSupabaseAnonKey: (key: string | undefined) => void;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

interface ProviderProps {
    schema?: string
    children: React.ReactNode
}

export const SupabaseProvider = ({ schema = 'public_transport_tracker', children }: ProviderProps) => {
    const [supabaseUrl, setSupabaseUrl] = useMMKVString('supabase.url');
    const [supabaseAnonKey, setSupabaseAnonKey] = useMMKVString('supabase.anonKey');
    const [supabaseClient, setSupabaseClient] = useState<SupabaseClient<any, any, any> | undefined>(undefined);

    const createSupabaseClient = () => {
        if (!supabaseUrl || !supabaseAnonKey) {
            setSupabaseClient(undefined)
            return
        }

        const client = createClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                storage: AsyncStorage,
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: false,
            },
            db: {
                schema: schema
            },
        })

        return setSupabaseClient(client);
    };

    useEffect(() => {
        setSupabaseUrl(supabaseUrl ? supabaseUrl : process.env.EXPO_PUBLIC_SUPABASE_URL)
        setSupabaseAnonKey(supabaseAnonKey ? supabaseAnonKey : process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY)
    }, []);

    useEffect(() => {
        createSupabaseClient()
    }, [supabaseUrl, supabaseAnonKey, schema]);

    return (
        <SupabaseContext.Provider value={{
            supabaseClient,
            supabaseUrl, setSupabaseUrl,
            supabaseAnonKey, setSupabaseAnonKey
        }}>
            {children}
        </SupabaseContext.Provider>
    )
}

export const useSupabase = () => {
    const context = useContext(SupabaseContext);
    if (context === undefined) {
        throw new Error('useSupabase must be used within a SupabaseProvider');
    }
    return context;
};