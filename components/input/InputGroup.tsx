import { useTheme } from "@/context/ThemeContext"
import { Text, TextProps, View, ViewProps } from "react-native"

export default function InputGroup(props: ViewProps) {
    return (
        <View {...props} />
    )
}

function InputLabel(props: TextProps) {
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
        <InputLabel {...props}>Loading...</InputLabel>
    )
}

InputGroup.Label = InputLabel
InputGroup.LoadingLabel = LoadingLabel