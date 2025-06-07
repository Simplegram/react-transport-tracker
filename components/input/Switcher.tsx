import { useTheme } from "@/context/ThemeContext"
import { StyleSheet, View } from "react-native"
import CustomSwitch from "./CustomSwitch"
import InputGroup from "./Input"

interface SwitcherProps {
    title?: string
    onPress: () => void
    overrideIsEnabled?: boolean
    children?: string
}

export default function Switcher({ title, onPress, overrideIsEnabled, children }: SwitcherProps) {
    const { theme } = useTheme()

    return (
        <View style={styles.container}>
            <InputGroup.Label>{title ? title : children}</InputGroup.Label>
            <CustomSwitch onPress={onPress} overrideIsEnabled={overrideIsEnabled} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 30,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    }
})