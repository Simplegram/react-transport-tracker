import { useTheme } from "@/context/ThemeContext"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { StyleSheet, Text, View } from "react-native"
import CustomSwitch from "./CustomSwitch"

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
            <Text style={inputElementStyles[theme].inputLabel}>{title ? title : children}</Text>
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