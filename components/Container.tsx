import { useTheme } from "@/context/ThemeContext"
import { View, ViewProps } from "react-native"

export default function Container(props: ViewProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { style, ...restProps } = props

    return (
        <View
            style={[
                {
                    gap: 10,
                    flexGrow: 1,
                    paddingTop: 5,
                    paddingBottom: 20,
                    paddingHorizontal: 15,
                    justifyContent: 'center',
                    backgroundColor: theme.palette.background
                }, style
            ]}
            {...restProps}
        >
            {props.children}
        </View>
    )
}