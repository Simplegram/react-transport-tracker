import { colors } from "@/src/const/color"
import { StyleSheet } from "react-native"

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
    insideLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.white_800,
    },
    unselectedLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.white_500,
    },
    selectedLabel: {
        fontSize: 14,
        fontWeight: '900',
        color: colors.white_700,
    },
})

export const inputElementStyles = {
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
        insideLabel: {
            ...lightInputElementStyles.insideLabel,
            color: colors.white_300,
        },
        unselectedLabel: {
            ...lightInputElementStyles.unselectedLabel,
            color: colors.white_600,
        },
        selectedLabel: {
            ...lightInputElementStyles.selectedLabel,
            color: colors.white_300,
        }
    })
}

const lightIconPickerStyles = StyleSheet.create({
    iconContainer: {
        width: 55,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingVertical: 5,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconTextContainer: {
        width: 75,
        borderWidth: 1,
        borderColor: colors.white_500,
        borderRadius: 10,
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

export const iconPickerStyles = {
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

