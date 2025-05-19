import { Alert, View, TextInput, StyleSheet, Text, KeyboardAvoidingView } from 'react-native'
import { useEffect, useState } from 'react'
import React from 'react'
import { supabase } from '@/lib/supabase'
import LoadingScreen from '@/components/LoadingScreen'
import Button from '@/components/BaseButton'
import { useToggleLoading } from '@/hooks/useLoading'
import { inputElementStyles, inputStyles } from '@/src/styles/InputStyles'
import { colors } from '@/const/color'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // const [loading, setLoading] = useState(false)

    const { loading, setLoading, toggleLoading } = useToggleLoading(500, true)

    const onSignInPress = async () => {
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) Alert.alert(
            error.name,
            error.message
        )
        setLoading(false)
    }

    useEffect(() => {
        toggleLoading()
    }, [])

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
                            <View style={[inputElementStyles.inputContainer, { paddingBottom: 0 }]}>
                                <View style={inputElementStyles.inputGroup}>
                                    <Text style={inputElementStyles.inputLabel}>Supabase Account Email</Text>
                                    <TextInput
                                        autoCapitalize="none"
                                        placeholder="john@doe.com"
                                        value={email}
                                        onChangeText={setEmail}
                                        style={inputStyles.textInput}
                                    />
                                </View>
                                <View style={inputElementStyles.inputGroup}>
                                    <Text style={inputElementStyles.inputLabel}>Supabase Account Password</Text>
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
