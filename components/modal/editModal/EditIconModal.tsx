import Button from "@/components/button/BaseButton"
import Input from "@/components/input/Input"
import { TextInputBase } from "@/components/input/TextInput"
import { useDataEditContext } from "@/context/DataEditContext"
import { useTheme } from "@/context/ThemeContext"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { styles } from "@/src/styles/Styles"
import { AddableIconType } from "@/src/types/AddableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { useState } from "react"
import { Alert, View } from "react-native"
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
            <Input.Label>Icon name (FontAwesome6):</Input.Label>
            <Input.Container>
                <View style={[inputElementStyles[theme].inputGroup, inputElementStyles[theme].inputGroupIcon]}>
                    <Icon style={styles[theme].icon} name={icon.name ? icon.name : 'xmark'} size={32} />
                    <TextInputBase
                        value={iconQuery}
                        placeholder="e.g., train-subway"
                        onChangeText={changeIcon}
                        style={{ flex: 1 }}
                    />
                </View>
            </Input.Container>

            <Button.Row>
                <Button.Dismiss label='Cancel' onPress={onCancel} />
                <Button.Add label='Edit Icon' onPress={handleOnSubmit} />
            </Button.Row>
        </View>
    )
}