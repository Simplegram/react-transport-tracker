import Button from "@/components/BaseButton";
import { useModalContext } from "@/context/ModalContext";
import { buttonStyles } from "@/src/styles/ButtonStyles";
import { inputStyles } from "@/src/styles/Styles"
import { AddableIconType } from "@/src/types/AddableTravels";
import { BaseModalContentProps } from "@/src/types/ModalContentProps";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome6'

export default function EditIconModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { modalData: data } = useModalContext()

    const [icon, setIcon] = useState<AddableIconType>(data)
    const [iconQuery, setIconQuery] = useState<string>(data.name)

    const handleOnSubmit = () => {
        if (!icon.name?.trim()) {
            Alert.alert('Input Required', 'Please enter an icon name.');
            return
        }

        onSubmit(icon);
    };

    const changeIcon = (text: string) => {
        if (!text) {
            setIconQuery(text)
            setIcon({ ...icon, 'name': undefined })
        }
        else {
            setIconQuery(text)
            setIcon({ ...icon, 'name': text })
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Icon name (FontAwesome6):</Text>
            <View style={styles.inputContainer}>
                <Icon style={styles.icon} name={icon.name ? icon.name : 'xmark'} size={32} />
                <TextInput
                    style={[inputStyles.pressableInput, { flex: 1 }]}
                    placeholder="e.g., train-subway"
                    value={iconQuery}
                    onChangeText={changeIcon}
                    autoFocus={true}
                />
            </View>

            <View style={buttonStyles.buttonRow}>
                <Button title='Cancel' color='#E0E0E0' onPress={onCancel} style={buttonStyles.cancelButton} textStyle={buttonStyles.cancelButtonText}></Button>
                <Button title='Edit Icon' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {},
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    inputContainer: {
        gap: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    icon: {
        paddingLeft: 5,
        alignItems: 'center',
    },
    iconScrollView: {
        marginBottom: 20,
    },
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
    selectedIconContainer: {
        borderColor: '#0284f5', // Highlight selected icon
        backgroundColor: '#e3f2fd', // Light background for selected
    },
});