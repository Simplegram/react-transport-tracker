import Button from "@/components/BaseButton"
import { colors } from "@/const/color"
import { useTheme } from "@/context/ThemeContext"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { styles } from "@/src/styles/Styles"
import { AddableIconType } from "@/src/types/AddableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { useState } from "react"
import { Alert, Text, TextInput, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'

export default function AddIconModal({ onSubmit, onCancel }: BaseModalContentProps) {
    const { theme } = useTheme()

    const [icon, setIcon] = useState<AddableIconType>({ 'name': undefined })
    const [iconQuery, setIconQuery] = useState<string>('')

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
                    <TextInput
                        style={[inputStyles[theme].textInput, { flex: 1 }]}
                        placeholder="e.g., train-subway"
                        placeholderTextColor={colors.text.placeholderGray}
                        value={iconQuery}
                        onChangeText={changeIcon}
                        autoFocus={true}
                    />
                </View>
            </View>

            <View style={buttonStyles[theme].buttonRow}>
                <Button title='Cancel' onPress={onCancel} style={buttonStyles[theme].cancelButton} textStyle={buttonStyles[theme].cancelButtonText}></Button>
                <Button title='Add Icon' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles[theme].addButton} textStyle={buttonStyles[theme].addButtonText}></Button>
            </View>
        </View>
    )
}