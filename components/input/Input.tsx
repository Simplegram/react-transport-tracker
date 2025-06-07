import { useTheme } from "@/context/ThemeContext"
import { Text, TextProps, View, ViewProps } from "react-native"

export default function Input(props: ViewProps) {
    return (
        <View {...props} />
    )
}

function Label(props: TextProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { style, children, ...restProps } = props

    return (
        <Text
            style={[
                {
                    fontSize: 15,
                    fontWeight: '500',
                    marginBottom: 4,
                    color: theme.palette.textBlack,
                }, style
            ]}
            {...restProps}
        >{children}</Text>
    )
}

function LoadingLabel(props: TextProps) {
    return (
        <Label {...props}>Loading...</Label>
    )
}

Input.Label = Label
Input.LoadingLabel = LoadingLabel