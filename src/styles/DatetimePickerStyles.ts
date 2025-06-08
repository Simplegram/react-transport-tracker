import { colors } from "@/src/const/color"
import { Dimensions, StyleSheet } from "react-native"

const { width: screenWidth, height: screenHeight } = Dimensions.get('screen')

const modalWidth = screenWidth < screenHeight ? screenWidth * 0.85 : screenHeight * 0.85

const lightDatetimePickerStyles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: modalWidth,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    scrollContainer: {
        gap: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingBottom: 5,
    },
    dateTimeSection: {
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    timePicker: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    textInput: {
        flex: 1,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 16,
    },
    timeAdjustmentButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    adjButton: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    adjButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    nowButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    confirmButton: {
        backgroundColor: '#4CAF50',
    },
    cancelButton: {
        backgroundColor: colors.redCancel,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }
})

export const datetimePickerStyles = {
    light: lightDatetimePickerStyles,
    dark: StyleSheet.create({
        modalBackdrop: {
            ...lightDatetimePickerStyles.modalBackdrop,
        },
        modalContainer: {
            ...lightDatetimePickerStyles.modalContainer,
            borderWidth: 1,
            borderColor: colors.white_100,
            backgroundColor: colors.black,
        },
        scrollContainer: {
            ...lightDatetimePickerStyles.scrollContainer,
        },
        modalTitle: {
            ...lightDatetimePickerStyles.modalTitle,
            color: colors.white_100,
        },
        dateTimeSection: {
            ...lightDatetimePickerStyles.dateTimeSection,
        },
        sectionTitle: {
            ...lightDatetimePickerStyles.sectionTitle,
        },
        timePicker: {
            ...lightDatetimePickerStyles.timePicker,
        },
        textInput: {
            ...lightDatetimePickerStyles.textInput,
            color: colors.white_100,
        },
        timeAdjustmentButtons: {
            ...lightDatetimePickerStyles.timeAdjustmentButtons,
        },
        adjButton: {
            ...lightDatetimePickerStyles.adjButton,
            borderWidth: 1,
            borderColor: colors.primary_100,
            backgroundColor: colors.black,
        },
        adjButtonText: {
            ...lightDatetimePickerStyles.adjButtonText,
        },
        nowButton: {
            ...lightDatetimePickerStyles.nowButton,
            borderWidth: 1,
            borderColor: colors.white_300,
            backgroundColor: colors.black,
        },
        actionButtons: {
            ...lightDatetimePickerStyles.actionButtons,
        },
        button: {
            ...lightDatetimePickerStyles.button,
        },
        confirmButton: {
            ...lightDatetimePickerStyles.confirmButton,
            borderWidth: 1,
            borderColor: colors.greenPositive,
            backgroundColor: colors.black,
        },
        cancelButton: {
            ...lightDatetimePickerStyles.cancelButton,
            borderWidth: 1,
            borderColor: colors.redCancel_100,
            backgroundColor: colors.black,
        },
        buttonText: {
            ...lightDatetimePickerStyles.buttonText,
        }
    })
}