import { colors } from "@/src/const/color"
import { Platform, StyleSheet } from "react-native"

const lightInputElementStyles = StyleSheet.create({
    inputContainer: {
        gap: 12,
        paddingBottom: 15,
    },
    inputGroup: {},
    inputLargeGroup: {
        gap: 16,
    },
    inputGroupCoord: {
        flex: 1,
        gap: 8,
        flexDirection: 'row',
    },
    inputGroupIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333333',
        marginBottom: 4,
    },
    inputLabelLight: {
        fontSize: 14,
        fontWeight: '300',
        color: '#4A4A4A',
        marginBottom: 5,
    },
    insideLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
    },
})

const inputElementStyles = {
    light: lightInputElementStyles,
    dark: StyleSheet.create({
        inputContainer: {
            ...lightInputElementStyles.inputContainer,
            backgroundColor: colors.black,
        },
        inputGroup: {
            ...lightInputElementStyles.inputGroup,
        },
        inputLargeGroup: {
            ...lightInputElementStyles.inputLargeGroup,
        },
        inputGroupCoord: {
            ...lightInputElementStyles.inputGroupCoord,
        },
        inputGroupIcon: {
            ...lightInputElementStyles.inputGroupIcon,
        },
        inputLabel: {
            ...lightInputElementStyles.inputLabel,
            color: colors.white_100,
        },
        inputLabelLight: {
            ...lightInputElementStyles.inputLabelLight,
            color: colors.white_400,
        },
        insideLabel: {
            ...lightInputElementStyles.insideLabel,
            color: colors.white_300,
        },
    })
}

const lightInputStyles = StyleSheet.create({
    textInput: {
        backgroundColor: colors.white_100,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 8,
        minHeight: Platform.OS === 'ios' ? 50 : 48,
        fontSize: 14,
        color: colors.white_800,
        borderWidth: 1,
        borderColor: colors.white_500,
    },
    multilineTextInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    pressableInput: {
        backgroundColor: colors.white_100,
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === 'ios' ? 14 : 12,
        justifyContent: 'center',
        minHeight: Platform.OS === 'ios' ? 50 : 48,
        borderWidth: 1,
        borderColor: colors.white_500,
    },
    pressableInputCoord: {
        flex: 1,
    }
})

const inputStyles = {
    light: lightInputStyles,
    dark: StyleSheet.create({
        textInput: {
            ...lightInputStyles.textInput,
            color: colors.white_300,
            backgroundColor: colors.black,
        },
        multilineTextInput: {
            ...lightInputStyles.multilineTextInput,
            backgroundColor: colors.black,
        },
        pressableInput: {
            ...lightInputStyles.pressableInput,
            backgroundColor: colors.black,
            color: colors.white_300,
        },
        pressableInputCoord: {
            ...lightInputStyles.pressableInputCoord,
        }
    })
}

const lightIconPickerStyles = StyleSheet.create({
    iconContainer: {
        width: 55,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 5,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconTextContainer: {
        width: 75,
        borderWidth: 1,
        borderColor: colors.white_500,
        borderRadius: 8,
        paddingTop: 10,
        flexDirection: 'column',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedIconContainer: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
    },
    selectedIcon: {
        color: colors.white_100,
    },
    selectedText: {
        color: colors.white_100,
        fontWeight: 'bold',
    }
})

const iconPickerStyles = {
    light: lightIconPickerStyles,
    dark: StyleSheet.create({
        iconContainer: {
            ...lightIconPickerStyles.iconContainer,
        },
        iconTextContainer: {
            ...lightIconPickerStyles.iconTextContainer,
        },
        selectedIconContainer: {
            ...lightIconPickerStyles.selectedIconContainer,
            backgroundColor: colors.black,
        },
        selectedIcon: {
            color: colors.primary_100
        },
        selectedText: {
            ...lightIconPickerStyles.selectedText,
            color: colors.primary_100
        }
    })
}

export {
    iconPickerStyles, inputElementStyles, inputStyles
}

