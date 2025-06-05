import { useTheme } from "@/context/ThemeContext"
import { dividerStyles } from "@/src/styles/Styles"
import { View } from "react-native"

interface DividerProp {
    paddingSize?: number
    width?: number
}

export default function Divider({ paddingSize = 5, width = 0.5 }: DividerProp) {
    const { theme } = useTheme()

    return (
        <View style={{
            paddingTop: paddingSize,
            marginBottom: paddingSize,
            borderBottomWidth: width,
            borderColor: dividerStyles[theme]
        }} />
    )
}