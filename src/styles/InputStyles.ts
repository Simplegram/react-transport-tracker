import { Platform, StyleSheet } from "react-native";

const inputElementStyles = StyleSheet.create({
    inputContainer: {
        gap: 15,
        paddingBottom: 15,
    },
    inputGroup: {
        // flexDirection: 'column',
    },
    inputGroupIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    inputGroupEnd: {
        paddingBottom: 20, 
        borderBottomWidth: 1, 
        borderBottomColor: '#ccc'
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
    },
    inputLabelLight: {
        fontSize: 15,
        fontWeight: '500',
        color: '#000',
        marginBottom: 5,
    },
    insideLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
})

const inputStyles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: Platform.OS === 'ios' ? 12 : 10,
        minHeight: Platform.OS === 'ios' ? 48 : 44,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    multilineTextInput: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    pressableInput: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        justifyContent: 'center',
        minHeight: 44,
        fontSize: 16,
        backgroundColor: '#fff',
    },
})

const iconPickerStyles = StyleSheet.create({
    iconContainer: {
        width: 55,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 5,
        marginRight: 10, // Space between icons
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
        borderColor: '#0284f5', // Highlight selected icon
        backgroundColor: '#e3f2fd', // Light background for selected
    },
})

export {
    inputStyles,
    inputElementStyles,
    iconPickerStyles
}