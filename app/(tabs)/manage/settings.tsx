import Button from "@/components/button/BaseButton"
import CollapsibleHeaderPage from "@/components/CollapsibleHeaderPage"
import Divider from "@/components/Divider"
import Switcher from "@/components/input/Switcher"
import { useAuth } from "@/context/AuthContext"
import { useSettings } from "@/context/SettingsContext"
import { useTheme } from "@/context/ThemeContext"
import { travelDetailStyles } from "@/src/styles/TravelDetailStyles"
import { router } from "expo-router"
import { StyleSheet, View } from "react-native"

export default function Settings() {
    const {
        theme, setTheme
    } = useTheme()

    const {
        enableVibration, setEnableVibration,
    } = useSettings()

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
                <View style={[travelDetailStyles[theme].card, { gap: 10 }]}>
                    <Switcher onPress={() => setEnableVibration(!enableVibration)} overrideIsEnabled={enableVibration}>Enable vibration</Switcher>
                    <Divider />
                    <Switcher onPress={handleThemeChange} overrideIsEnabled={theme === 'light' ? false : true}>Dark mode</Switcher>
                </View>
                <Divider />
                <Button.Cancel onPress={handleLogout}>Logout</Button.Cancel>
            </View>
        </CollapsibleHeaderPage>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10,
        justifyContent: 'flex-end',
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