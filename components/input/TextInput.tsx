import { useTheme } from "@/context/ThemeContext"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { TextInput, TextInputProps, View } from "react-native"
import Input from "./Input"

export function TextInputBase(props: TextInputProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { placeholderTextColor, value, style, ...restOfProps } = props

    return (
        <TextInput
            value={props.value || ''}
            style={[
                {
                    borderRadius: 10,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    minHeight: 48,
                    fontSize: 14,
                    fontWeight: '200',
                    borderWidth: 1,

                    color: theme.palette.textDark,
                    borderColor: theme.palette.borderColorSoft,
                    backgroundColor: theme.palette.background,
                },
                props.value && { fontWeight: '900' },
                props.style
            ]}
            placeholderTextColor={theme.palette.textPlaceholder}
            {...restOfProps}
        />
    )
}

function TextInputNumeric(props: TextInputProps) {
    const { textAlign, keyboardType, ...restOfProps } = props

    return (
        <TextInputBase
            style={{ width: '100%' }}
            textAlign='center'
            keyboardType="numeric"
            {...restOfProps}
        />
    )
}

interface TextInputBlockProps extends TextInputProps {
    label: string
}

export function TextInputBlock(props: TextInputBlockProps) {
    const { theme } = useTheme()

    const { label, ...restOfProps } = props

    return (
        <View style={inputElementStyles[theme].inputGroup}>
            {props.label && <Input.Label>{props.label}</Input.Label>}
            <TextInputBase {...restOfProps} />
        </View>
    )
}

function TextInputMultiline(props: TextInputBlockProps) {
    const { multiline, ...restOfProps } = props

    return (
        <TextInputBlock
            style={{
                minHeight: 100,
                textAlignVertical: 'top',
            }}
            multiline={true}
            numberOfLines={4}
            {...restOfProps}
        />
    )
}

TextInputBase.Numeric = TextInputNumeric

TextInputBlock.Multiline = TextInputMultiline