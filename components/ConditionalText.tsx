import { useTheme } from "@/context/ThemeContext"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { Text } from "react-native"

interface ConditionalTextProps {
    condition: any
    children: string | React.ReactNode
}

export default function ConditionalText({ condition, children }: ConditionalTextProps) {
    const { theme } = useTheme()

    return (
        <Text
            style={[
                condition ? inputElementStyles[theme].selectedLabel : inputElementStyles[theme].unselectedLabel
            ]}
        >{children}</Text>
    )
}