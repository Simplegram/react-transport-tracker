import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { travelDetailStyles } from "@/src/styles/TravelDetailStyles"
import { Pressable, StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native"
import HighlightedText from "../HighlightedText"

interface ModalButtonProps {
    label?: string
    condition: any
    value: any
    style?: StyleProp<ViewStyle>
    onPress: () => void
}

export default function ModalButton({ label, condition, value, style, onPress }: ModalButtonProps) {
    const { theme } = useTheme()

    return (
        <View style={inputElementStyles[theme].inputGroup}>
            <Text style={inputElementStyles[theme].inputLabel}>{label}</Text>
            <Pressable
                onPress={onPress}
                style={[inputStyles[theme].pressableInput, style]}
            >
                <HighlightedText condition={condition}>
                    {value}
                </HighlightedText>
            </Pressable>
        </View>
    )
}

export function AModalButton({ condition, value, style, onPress }: ModalButtonProps) {
    const { theme } = useTheme()

    return (
        <Pressable
            onPress={onPress}
            style={[inputStyles[theme].pressableInput, style]}
        >
            <HighlightedText condition={condition}>
                {value}
            </HighlightedText>
        </Pressable>
    )
}

interface TypeButtonProps {
    onPress: () => void
    label: React.ReactNode
    typeSelected: boolean
}

export function TypeButton({ label, onPress, typeSelected }: TypeButtonProps) {
    const { theme } = useTheme()

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            style={[
                travelDetailStyles[theme].detailRow,
                {
                    flex: 1,
                    alignItems: 'center',
                    borderColor: colors.white_500
                },
                typeSelected && { borderColor: colors.white_200 }
            ]}
            onPress={onPress}
        >
            <Text style={[
                inputElementStyles[theme].inputLabel,
                { color: colors.white_500 },
                typeSelected && { color: theme === 'light' ? colors.white : colors.white_200 }
            ]}>{label}</Text>
        </TouchableOpacity>
    )
}