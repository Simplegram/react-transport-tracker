import { Alert, View, TextInput, StyleSheet, Text, KeyboardAvoidingView } from 'react-native'
import { useEffect, useState } from 'react'
import React from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import Button from '@/components/BaseButton'
import { useToggleLoading } from '@/hooks/useLoading'
import { inputElementStyles, inputStyles } from '@/src/styles/InputStyles'
import { colors } from '@/const/color'
import { useSupabase } from '@/context/SupabaseContext'
import { SupabaseClient } from '@supabase/supabase-js'

const Login = () => {
    const {
        supabaseClient,
        supabaseUrl, setSupabaseUrl,
        supabaseAnonKey, setSupabaseAnonKey
    } = useSupabase()
    const { loading, setLoading, toggleLoading } = useToggleLoading(500, true)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [currentSupabaseClient, setCurrentSupabaseClient] = useState<SupabaseClient | undefined>(undefined)
    const [currentSupabaseUrl, setCurrentSupabaseUrl] = useState<string | undefined>(undefined)
    const [currentSupabaseAnonKey, setCurrentSupabaseAnonKey] = useState<string | undefined>(undefined)

    const onSignInPress = async () => {
        setLoading(true)

        setSupabaseUrl(currentSupabaseUrl)
        setSupabaseAnonKey(currentSupabaseAnonKey)

        try {
            const { error } = await currentSupabaseClient.auth.signInWithPassword({
                email,
                password,
            })

            if (error) Alert.alert(
                error.name,
                error.message
            )
        } catch (err: any) {
            console.error("An unexpected error during sign-in:", err);
            Alert.alert('Supabase URL or Anon Key missing', 'The Supabase client could not be initialized with missing Supabase URL or Anon Key');
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        toggleLoading()
        setCurrentSupabaseUrl(supabaseUrl)
        setCurrentSupabaseAnonKey(supabaseAnonKey)
    }, [])

    useEffect(() => {
        setCurrentSupabaseClient(supabaseClient)
    }, [supabaseClient])

    return (
        <KeyboardAvoidingView
            style={styles.keyboardView}
        >
            <View style={styles.container}>
                {loading ? (
                    <LoadingScreen text="Loading..."></LoadingScreen>
                ) :
                    (
                        <>
                            <Text style={styles.header}>Transport Tracker</Text>
                            <View style={[inputElementStyles['light'].inputContainer, { paddingBottom: 0 }]}>
                                <View style={inputElementStyles['light'].inputGroup}>
                                    <Text style={inputElementStyles['light'].inputLabel}>Supabase URL</Text>
                                    <TextInput
                                        autoCapitalize="none"
                                        placeholder="https://my-example-brand.supabase.co"
                                        value={currentSupabaseUrl}
                                        onChangeText={setCurrentSupabaseUrl}
                                        style={inputStyles.textInput}
                                        numberOfLines={1}
                                    />
                                </View>
                                <View style={inputElementStyles['light'].inputGroup}>
                                    <Text style={inputElementStyles['light'].inputLabel}>Supabase Anon Key</Text>
                                    <TextInput
                                        autoCapitalize="none"
                                        placeholder="abcdefghijklmnopqrstuvwxyz1234567890"
                                        value={currentSupabaseAnonKey}
                                        onChangeText={setCurrentSupabaseAnonKey}
                                        style={inputStyles.textInput}
                                        numberOfLines={1}
                                    />
                                </View>
                                <View style={inputElementStyles['light'].inputGroup}>
                                    <Text style={inputElementStyles['light'].inputLabel}>Supabase Account Email</Text>
                                    <TextInput
                                        autoCapitalize="none"
                                        placeholder="john@doe.com"
                                        value={email}
                                        onChangeText={setEmail}
                                        style={inputStyles.textInput}
                                    />
                                </View>
                                <View style={inputElementStyles['light'].inputGroup}>
                                    <Text style={inputElementStyles['light'].inputLabel}>Supabase Account Password</Text>
                                    <TextInput
                                        placeholder="password"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        style={inputStyles.textInput}
                                    />
                                </View>
                            </View>
                            <Button onPress={onSignInPress} style={styles.button} textStyle={{ color: '#fff' }}>Sign in</Button>
                        </>
                    )}
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
        padding: 15,
    },
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        gap: 25,
    },
    header: {
        fontSize: 30,
    },
    inputContainer: {
        gap: 10,
        flexDirection: 'column',
        paddingVertical: 10,
    },
    inputField: {
        height: 50,
        borderWidth: 1,
        borderColor: '#0284f5',
        borderRadius: 4,
        padding: 10,
        color: '#000'
    },
    button: {
        color: colors.appBlue,
        alignItems: 'center',
        backgroundColor: '#0284f5',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
})

export default Login