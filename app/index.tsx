import Button from '@/components/BaseButton'
import LoadingScreen from '@/components/LoadingScreen'
import { useSupabase } from '@/context/SupabaseContext'
import { useTheme } from '@/context/ThemeContext'
import { useToggleLoading } from '@/hooks/useLoading'
import { colors } from '@/src/const/color'
import { buttonStyles } from '@/src/styles/ButtonStyles'
import { inputElementStyles, inputStyles } from '@/src/styles/InputStyles'
import { statusBarStyles } from '@/src/styles/Styles'
import { SupabaseClient } from '@supabase/supabase-js'
import React, { useEffect, useState } from 'react'
import { Alert, KeyboardAvoidingView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'

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
                            <View style={[inputElementStyles[theme].inputContainer, { paddingBottom: 0 }]}>
                                <View style={inputElementStyles[theme].inputGroup}>
                                    <Text style={inputElementStyles[theme].inputLabel}>Supabase URL</Text>
                                    <TextInput
                                        autoCapitalize="none"
                                        placeholder="https://my-example-brand.supabase.co"
                                        placeholderTextColor={colors.placeholderGray}
                                        value={currentSupabaseUrl}
                                        onChangeText={setCurrentSupabaseUrl}
                                        style={inputStyles[theme].textInput}
                                        numberOfLines={1}
                                    />
                                </View>
                                <View style={inputElementStyles[theme].inputGroup}>
                                    <Text style={inputElementStyles[theme].inputLabel}>Supabase Anon Key</Text>
                                    <TextInput
                                        autoCapitalize="none"
                                        placeholder="abcdefghijklmnopqrstuvwxyz1234567890"
                                        placeholderTextColor={colors.placeholderGray}
                                        value={currentSupabaseAnonKey}
                                        onChangeText={setCurrentSupabaseAnonKey}
                                        style={inputStyles[theme].textInput}
                                        numberOfLines={1}
                                    />
                                </View>
                                <View style={inputElementStyles[theme].inputGroup}>
                                    <Text style={inputElementStyles[theme].inputLabel}>Supabase Account Email</Text>
                                    <TextInput
                                        autoCapitalize="none"
                                        placeholder="john@doe.com"
                                        placeholderTextColor={colors.placeholderGray}
                                        value={email}
                                        onChangeText={setEmail}
                                        style={inputStyles[theme].textInput}
                                    />
                                </View>
                                <View style={inputElementStyles[theme].inputGroup}>
                                    <Text style={inputElementStyles[theme].inputLabel}>Supabase Account Password</Text>
                                    <TextInput
                                        placeholder="password"
                                        placeholderTextColor={colors.placeholderGray}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        style={inputStyles[theme].textInput}
                                    />
                                </View>
                            </View>
                            <Button onPress={onSignInPress} style={buttonStyles[theme].addButton} textStyle={{ color: '#fff' }}>Sign in</Button>
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
            color: colors.dimWhite,
        },
    })
}

export default Login