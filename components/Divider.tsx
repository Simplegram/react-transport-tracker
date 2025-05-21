import { useTheme } from "@/context/ThemeContext";
import { dividerStyles } from "@/src/styles/Styles";
import { StyleSheet, View } from "react-native";

interface DividerProp {
    size?: number
}

export default function Divider({size = 5}: DividerProp) {
    const { theme } = useTheme()

    return (
        <View style={{
            paddingTop: size,
            marginBottom: size,
            borderBottomWidth: 1,
            borderColor: dividerStyles[theme]
        }} />
    )
}