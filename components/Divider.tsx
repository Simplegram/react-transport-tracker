import { useTheme } from "@/context/ThemeContext";
import { dividerStyles } from "@/src/styles/Styles";
import { StyleSheet, View } from "react-native";

export default function Divider() {
    const { theme } = useTheme()

    return (
        <View style={[styles.divider, {borderColor: dividerStyles[theme]}]} />
    )
}

const styles = StyleSheet.create({
    divider: {
        paddingTop: 5,
        marginBottom: 5,
        borderBottomWidth: 1,
    }
})