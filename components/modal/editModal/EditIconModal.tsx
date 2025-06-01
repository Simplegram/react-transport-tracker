import Button from "@/components/BaseButton"
import { TextInputBase } from "@/components/input/TextInput"
import { useDataEditContext } from "@/context/DataEditContext"
import { useTheme } from "@/context/ThemeContext"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { styles } from "@/src/styles/Styles"
import { AddableIconType } from "@/src/types/AddableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { useState } from "react"
import { Alert, Text, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'

export default function EditIconModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { theme } = useTheme()

    const { modalData: data } = useDataEditContext()

    const [icon, setIcon] = useState<AddableIconType>(data)
    const [iconQuery, setIconQuery] = useState<string>(data.name)

    const handleOnSubmit = () => {
        if (!icon.name?.trim()) {
            Alert.alert('Input Required', 'Please enter icon name')
            return
        }

        onSubmit(icon)
    }

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
            <Text style={inputElementStyles[theme].inputLabel}>Icon name (FontAwesome6):</Text>
            <View style={inputElementStyles[theme].inputContainer}>
                <View style={[inputElementStyles[theme].inputGroup, inputElementStyles[theme].inputGroupIcon]}>
                    <Icon style={styles[theme].icon} name={icon.name ? icon.name : 'xmark'} size={32} />
                    <TextInputBase
                        value={iconQuery}
                        placeholder="e.g., train-subway"
                        onChangeText={changeIcon}
                        style={{ flex: 1 }}
                    />
                </View>
            </View>

            <View style={buttonStyles[theme].buttonRow}>
                <Button title='Cancel' onPress={onCancel} style={buttonStyles[theme].cancelButton} textStyle={buttonStyles[theme].cancelButtonText}></Button>
                <Button title='Edit Icon' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles[theme].addButton} textStyle={buttonStyles[theme].addButtonText}></Button>
            </View>
        </View>
    )
}