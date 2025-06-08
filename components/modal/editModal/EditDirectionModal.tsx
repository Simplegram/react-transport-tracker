import Button from "@/components/button/BaseButton"
import Input from "@/components/input/Input"
import { TextInputBlock } from "@/components/input/TextInput"
import { useDataEditContext } from "@/context/DataEditContext"
import { useTheme } from "@/context/ThemeContext"
import { useLoading } from "@/hooks/useLoading"
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
                <Input.LoadingLabel />
            ) : (
                <>
                    <Input.Container>
                        <TextInputBlock
                            value={direction.name}
                            label="Name:"
                            placeholder="Direction name..."
                            onChangeText={(text) => setDirection({ ...direction, "name": text })}
                        />
                    </Input.Container>

                    <Button.Row>
                        <Button.Dismiss label='Cancel' onPress={onCancel} />
                        <Button.Add label='Edit Route' onPress={handleOnSubmit} />
                    </Button.Row>
                </>
            )}
        </View>
    )
}