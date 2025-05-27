import { useTheme } from "@/context/ThemeContext"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { StyleSheet, Text, View } from "react-native"
import CustomSwitch from "./CustomSwitch"

interface SwitcherProps {
    title?: string
    onPress: () => void
    children?: string
}

export default function Switcher({ title, onPress, children }: SwitcherProps) {
    const { theme } = useTheme()

    return (
        <View style={styles.container}>
            <Text style={inputElementStyles[theme].inputLabel}>{title ? title : children}</Text>
            <CustomSwitch onPress={onPress} />
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