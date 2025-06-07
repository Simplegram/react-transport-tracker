import { useTheme } from "@/context/ThemeContext"
import { Pressable, StyleProp, ViewStyle } from "react-native"
import HighlightedText from "../HighlightedText"
import Input from "../input/Input"

interface ModalButtonProps {
    label?: string
    condition: any
    value: any
    style?: StyleProp<ViewStyle>
    onPress: () => void
}

export function ModalButton({ condition, value, style, onPress }: ModalButtonProps) {
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

function ModalButtonBlock({ label, condition, value, style, onPress }: ModalButtonProps) {
    const { theme } = useTheme()

    return (
        <Input>
            <Input.Label>{label}</Input.Label>
            <ModalButton
                condition={condition}
                value={value}
                onPress={onPress}
                style={style}
            />
        </Input>
    )
}

ModalButton.Block = ModalButtonBlock