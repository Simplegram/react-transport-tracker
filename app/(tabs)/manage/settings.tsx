import Button from "@/components/BaseButton"
import CollapsibleHeaderPage from "@/components/CollapsibleHeaderPage"
import Divider from "@/components/Divider"
import Switcher from "@/components/Switcher"
import { useAuth } from "@/context/AuthContext"
import { useSettings } from "@/context/SettingsContext"
import { useTheme } from "@/context/ThemeContext"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { travelDetailStyles } from "@/src/styles/TravelDetailStyles"
import { router } from "expo-router"
import { StyleSheet, View } from "react-native"

export default function Settings() {
    const {
        theme, setTheme
    } = useTheme()

    const {
        enableSwipeZone, setEnableSwipeZone,
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
                    <Switcher onPress={() => setEnableSwipeZone(!enableSwipeZone)} overrideIsEnabled={enableSwipeZone}>Enable "Safe Swipe Zone"</Switcher>
                    <Divider />
                    <Switcher onPress={() => setEnableVibration(!enableVibration)} overrideIsEnabled={enableVibration}>Enable vibration</Switcher>
                    <Divider />
                    <Switcher onPress={handleThemeChange} overrideIsEnabled={theme === 'light' ? false : true}>Dark mode</Switcher>
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