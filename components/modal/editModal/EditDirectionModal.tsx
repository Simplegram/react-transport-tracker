import Button from "@/components/BaseButton"
import InputGroup from "@/components/input/InputGroup"
import { TextInputBlock } from "@/components/input/TextInput"
import { useDataEditContext } from "@/context/DataEditContext"
import { useTheme } from "@/context/ThemeContext"
import { useLoading } from "@/hooks/useLoading"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { Direction } from "@/src/types/Travels"
import { useState } from "react"
import { Alert, View } from "react-native"

export default function EditDirectionModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { theme } = useTheme()

    const { modalData: data } = useDataEditContext()

    const { loading } = useLoading()

    const [direction, setDirection] = useState<Direction>(data)

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
                <InputGroup.LoadingLabel />
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
                        <Button.Add label='Edit Route' onPress={handleOnSubmit} />
                    </View>
                </>
            )}
        </View>
    )
}