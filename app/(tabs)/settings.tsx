import Button from "@/components/BaseButton"
import CollapsibleHeaderPage from "@/components/CollapsibleHeaderPage"
import Divider from "@/components/Divider"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { router } from "expo-router"
import { StyleSheet, View } from "react-native"

export default function Settings() {
    const { theme, setTheme } = useTheme()

    const { signOut } = useAuth()

    const handleLogout = () => {
        signOut()
        router.push("/")
    }

    const handleThemeChange = () => {
        if (theme === 'light') setTheme('dark')
        else setTheme('light')
    }

    return (
        <CollapsibleHeaderPage
            headerText="Settings"
        >
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                    <Button
                        title={`Enable ${theme === 'light' ? 'dark' : 'light'} mode`}
                        style={buttonStyles[theme].addButton}
                        textStyle={buttonStyles[theme].addButtonText}
                        onPress={handleThemeChange}
                    />
                </View>
                <Divider />
                <Button
                    style={buttonStyles[theme].redButton}
                    textStyle={buttonStyles[theme].addButtonText}
                    onPress={handleLogout}
                >Logout</Button>
            </View>
        </CollapsibleHeaderPage>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10,
        justifyContent: 'flex-end',
        paddingBottom: 10,
    },
    fillingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        gap: 10,
    },
})