import Button from "@/components/BaseButton"
import Input from "@/components/input/Input"
import { TextInputBlock } from "@/components/input/TextInput"
import { useTheme } from "@/context/ThemeContext"
import { useLoading } from "@/hooks/useLoading"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { AddableDirection } from "@/src/types/AddableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { useState } from "react"
import { Alert, View } from "react-native"

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
                <Input.LoadingLabel />
            ) : (
                <>
                    <View style={inputElementStyles[theme].inputContainer}>
                        <TextInputBlock
                            value={direction.name}
                            label="Name:"
                            placeholder="Direction name..."
                            onChangeText={(text) => setDirection({ ...direction, "name": text })}
                        />
                    </View>

                    <View style={buttonStyles[theme].buttonRow}>
                        <Button.Dismiss label='Cancel' onPress={onCancel} />
                        <Button.Add label='Add Direction' onPress={handleOnSubmit} />
                    </View>
                </>
            )}
        </View>
    )
}