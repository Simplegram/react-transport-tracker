import { MMKVLoader, useMMKVStorage } from "react-native-mmkv-storage";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from "react";

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
    const storage = new MMKVLoader().initialize()
    const [supabaseUrl, setSupabaseUrl] = useMMKVStorage<string | undefined>('supabaseUrl', storage, undefined);
    const [supabaseAnonKey, setSupabaseAnonKey] = useMMKVStorage<string | undefined>('supabaseAnonKey', storage, undefined);
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