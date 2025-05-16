import Button from "@/components/BaseButton";
import { buttonStyles } from "@/src/styles/ButtonStyles";
import { inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import styles from "@/src/styles/Styles";
import { AddableIconType } from "@/src/types/AddableTravels";
import { BaseModalContentProps } from "@/src/types/ModalContentProps";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome6'

export default function AddIconModal({ onSubmit, onCancel }: BaseModalContentProps) {
    const [icon, setIcon] = useState<AddableIconType>({ 'name': undefined })
    const [iconQuery, setIconQuery] = useState<string>('')

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
        <View>
            <Text style={inputElementStyles.inputLabel}>Icon name (FontAwesome6):</Text>
            <View style={inputElementStyles.inputContainer}>
                <View style={[inputElementStyles.inputGroup, inputElementStyles.inputGroupIcon]}>
                    <Icon style={styles.icon} name={icon.name ? icon.name : 'xmark'} size={32} />
                    <TextInput
                        style={[inputStyles.pressableInput, { flex: 1 }]}
                        placeholder="e.g., train-subway"
                        value={iconQuery}
                        onChangeText={changeIcon}
                        autoFocus={true}
                    />
                </View>
            </View>

            <View style={buttonStyles.buttonRow}>
                <Button title='Cancel' onPress={onCancel} style={buttonStyles.cancelButton} textStyle={buttonStyles.cancelButtonText}></Button>
                <Button title='Add Icon' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
            </View>
        </View>
    )
}