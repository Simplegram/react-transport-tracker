import { useTheme } from "@/context/ThemeContext"
import { inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { Pressable, Text, View } from "react-native"
import HighlightedText from "../HighlightedText"

interface ModalButtonProps {
    label: string
    condition: any
    value: any
    onPress: () => void
}

export default function ModalButton({ label, condition, value, onPress }: ModalButtonProps) {
    const { theme } = useTheme()

    return (
        <View style={inputElementStyles[theme].inputGroup}>
            <Text style={inputElementStyles[theme].inputLabel}>{label}</Text>
            <Pressable onPress={onPress} style={inputStyles[theme].pressableInput}>
                <HighlightedText condition={condition}>
                    {value}
                </HighlightedText>
            </Pressable>
        </View>
    )
}