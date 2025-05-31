import Button from "@/components/BaseButton"
import CTextInput from "@/components/input/CTextInput"
import { useTheme } from "@/context/ThemeContext"
import { useLoading } from "@/hooks/useLoading"
import { colors } from "@/src/const/color"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { AddableDirection } from "@/src/types/AddableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { useState } from "react"
import { Alert, Text, TextInput, View } from "react-native"

export default function AddDirectionModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { theme } = useTheme()

    const [direction, setDirection] = useState<AddableDirection>({ name: undefined })

    const { loading } = useLoading()

    const handleOnSubmit = () => {
        if (!direction.name?.trim()) {
            Alert.alert('Input Required', 'Please enter a direction name')
            return
        }

        onSubmit(direction)
    }

    return (
        <View>
            {loading ? (
                <Text style={inputElementStyles[theme].inputLabel}>Loading...</Text>
            ) : (
                <>
                    <View style={inputElementStyles[theme].inputContainer}>
                        <CTextInput
                            value={direction.name}
                            label="Name:"
                            placeholder="Direction name..."
                            onChangeText={(text) => setDirection({ ...direction, "name": text })}
                        />
                    </View>

                    <View style={buttonStyles[theme].buttonRow}>
                        <Button title='Cancel' onPress={onCancel} style={buttonStyles[theme].cancelButton} textStyle={buttonStyles[theme].cancelButtonText}></Button>
                        <Button title='Add Direction' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles[theme].addButton} textStyle={buttonStyles[theme].addButtonText}></Button>
                    </View>
                </>
            )}
        </View>
    )
}