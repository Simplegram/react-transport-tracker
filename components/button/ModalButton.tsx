import { useTheme } from "@/context/ThemeContext"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { Pressable, StyleProp, Text, View, ViewStyle } from "react-native"
import HighlightedText from "../HighlightedText"

interface ModalButtonProps {
    label?: string
    condition: any
    value: any
    style?: StyleProp<ViewStyle>
    onPress: () => void
}

export function ModalButtonBase({ condition, value, style, onPress }: ModalButtonProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    return (
        <Pressable
            onPress={onPress}
            style={[
                {
                    minHeight: 48,
                    borderWidth: 1,
                    borderRadius: 10,
                    justifyContent: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    
                    borderColor: theme.palette.borderColorSoft,
                    backgroundColor: theme.palette.background,
                },
                style
            ]}
        >
            <HighlightedText condition={condition}>
                {value}
            </HighlightedText>
        </Pressable>
    )
}

export default function ModalButtonBlock({ label, condition, value, style, onPress }: ModalButtonProps) {
    const { theme } = useTheme()

    return (
        <View style={inputElementStyles[theme].inputGroup}>
            <Text style={inputElementStyles[theme].inputLabel}>{label}</Text>
            <ModalButtonBase
                condition={condition}
                value={value}
                onPress={onPress}
                style={style}
            />
        </View>
    )
}