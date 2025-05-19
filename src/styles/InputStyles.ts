// src/styles/InputStyles.ts (or .js)
import { Platform, StyleSheet } from "react-native";

const inputElementStyles = StyleSheet.create({
    inputContainer: {
        gap: 10,
        paddingBottom: 20,
    },
    inputGroup: {
        // This remains a simple wrapper, no specific styles needed here
        // It contains a label and an input field
    },
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
    inputGroupEnd: {
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333333',
        marginBottom: 8,
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
});

const inputStyles = StyleSheet.create({
    textInput: {
        backgroundColor: '#F0F2F5',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === 'ios' ? 14 : 12,
        minHeight: Platform.OS === 'ios' ? 50 : 48,
        fontSize: 16,
        color: '#333333',
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    multilineTextInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    pressableInput: {
        backgroundColor: '#F0F2F5',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: Platform.OS === 'ios' ? 14 : 12,
        justifyContent: 'center',
        minHeight: Platform.OS === 'ios' ? 50 : 48,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    pressableInputCoord: {
        flex: 1,
    }
});

const iconPickerStyles = StyleSheet.create({
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
        borderColor: '#ccc',
        borderRadius: 8,
        paddingTop: 10,
        flexDirection: 'column',
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedIconContainer: {
        borderColor: '#0284f5',
        backgroundColor: '#e3f2fd',
    },
});

export {
    inputStyles,
    inputElementStyles,
    iconPickerStyles
};