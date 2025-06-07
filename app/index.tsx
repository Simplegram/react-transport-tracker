import Button from '@/components/BaseButton'
import Input from '@/components/input/Input'
import { TextInputBlock } from '@/components/input/TextInput'
import LoadingScreen from '@/components/LoadingScreen'
import { useSupabase } from '@/context/SupabaseContext'
import { useTheme } from '@/context/ThemeContext'
import { useToggleLoading } from '@/hooks/useLoading'
import { colors } from '@/src/const/color'
import { statusBarStyles } from '@/src/styles/Styles'
import { SupabaseClient } from '@supabase/supabase-js'
import React, { useEffect, useState } from 'react'
import { Alert, KeyboardAvoidingView, StatusBar, StyleSheet, Text, View } from 'react-native'

const Login = () => {
    const {
        supabaseClient,
        supabaseUrl, setSupabaseUrl,
        supabaseAnonKey, setSupabaseAnonKey
    } = useSupabase()
    const { loading, setLoading, toggleLoading } = useToggleLoading(500, true)

    const { theme } = useTheme()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [currentSupabaseClient, setCurrentSupabaseClient] = useState<SupabaseClient | undefined>(undefined)
    const [currentSupabaseUrl, setCurrentSupabaseUrl] = useState<string | undefined>(undefined)
    const [currentSupabaseAnonKey, setCurrentSupabaseAnonKey] = useState<string | undefined>(undefined)

    const onSignInPress = async () => {
        setLoading(true)

        setSupabaseUrl(currentSupabaseUrl)
        setSupabaseAnonKey(currentSupabaseAnonKey)

        if (currentSupabaseClient) {
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
                console.error("An unexpected error during sign-in:", err)
                Alert.alert('Supabase URL or Anon Key missing', 'The Supabase client could not be initialized with missing Supabase URL or Anon Key')
            } finally {
                setLoading(false)
            }
        } else {
            return
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
            style={styles[theme].keyboardView}
        >
            <StatusBar
                backgroundColor={statusBarStyles[theme]}
            />
            <View style={styles[theme].container}>
                {loading ? (
                    <LoadingScreen text="Loading..."></LoadingScreen>
                ) :
                    (
                        <>
                            <Text style={styles[theme].header}>Transport Tracker</Text>
                            <Input.Container style={{ paddingBottom: 0 }}>
                                <TextInputBlock
                                    label='Supabase URL'
                                    autoCapitalize="none"
                                    placeholder="https://my-example-brand.supabase.co"
                                    value={currentSupabaseUrl}
                                    onChangeText={setCurrentSupabaseUrl}
                                    numberOfLines={1}
                                />
                                <TextInputBlock
                                    label='Supabase Anon Key'
                                    autoCapitalize="none"
                                    placeholder="abcdefghijklmnopqrstuvwxyz1234567890"
                                    value={currentSupabaseAnonKey}
                                    onChangeText={setCurrentSupabaseAnonKey}
                                    numberOfLines={1}
                                />
                                <TextInputBlock
                                    label='Supabase Account Email'
                                    autoCapitalize="none"
                                    placeholder="john@doe.com"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                                <TextInputBlock
                                    label='Supabase Account Password'
                                    autoCapitalize="none"
                                    placeholder="password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </Input.Container>
                            <Button.Add label='Sign in' onPress={onSignInPress} />
                        </>
                    )}
            </View>
        </KeyboardAvoidingView>
    )
}

const lightStyles = StyleSheet.create({
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
})

const styles = {
    light: lightStyles,
    dark: StyleSheet.create({
        keyboardView: {
            ...lightStyles.keyboardView,
            backgroundColor: colors.black,
        },
        container: {
            ...lightStyles.container,
            backgroundColor: colors.black,
        },
        header: {
            ...lightStyles.header,
            color: colors.white_100,
        },
    })
}

export default Login