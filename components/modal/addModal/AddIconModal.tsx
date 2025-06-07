import Button from "@/components/BaseButton"
import InputGroup from "@/components/input/Input"
import { TextInputBase } from "@/components/input/TextInput"
import { useTheme } from "@/context/ThemeContext"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { styles } from "@/src/styles/Styles"
import { AddableIconType } from "@/src/types/AddableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { useState } from "react"
import { Alert, View } from "react-native"
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
            <InputGroup.Label>Icon name (FontAwesome6):</InputGroup.Label>
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
                <Button.Dismiss label='Cancel' onPress={onCancel} />
                <Button.Add label='Add Icon' onPress={handleOnSubmit} />
            </View>
        </View>
    )
}