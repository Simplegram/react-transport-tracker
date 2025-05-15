import { Alert, View, TextInput, StyleSheet, Text, KeyboardAvoidingView } from 'react-native'
import { useState } from 'react'
import React from 'react'
import { supabase } from '@/lib/supabase'
import LoadingScreen from '@/components/LoadingScreen'
import Button from '@/components/BaseButton'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

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
                            
                            <View style={styles.inputContainer}>
                                <TextInput
                                    autoCapitalize="none"
                                    placeholder="john@doe.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    style={styles.inputField}
                                />
                                <TextInput
                                    placeholder="password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    style={styles.inputField}
                                />
                            </View>

                            <Button title='Sign in' color='#0284f5' onPress={onSignInPress} style={styles.button} textStyle={{ color: '#fff' }}></Button>
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
        padding: 15,
        justifyContent: 'center',
        gap: 25,
    },
    header: {
        fontSize: 30,
        textAlign: 'center',
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
        alignItems: 'center',
        backgroundColor: '#0284f5',
        padding: 12,
        borderRadius: 4,
    },
})

export default Login
