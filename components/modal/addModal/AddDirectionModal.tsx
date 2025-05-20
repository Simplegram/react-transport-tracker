import Button from "@/components/BaseButton"
import { useLoading } from "@/hooks/useLoading"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { AddableDirection } from "@/src/types/AddableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { useState } from "react"
import { Alert, StyleSheet, Text, TextInput, View } from "react-native"

export default function AddDirectionModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const [direction, setDirection] = useState<AddableDirection>({ name: undefined })

    const { loading } = useLoading()

    const handleOnSubmit = () => {
        if (!direction.name?.trim()) {
            Alert.alert('Input Required', 'Please enter a direction name');
            return
        }

        onSubmit(direction);
    };

    return (
        <View>
            {loading ? (
                <Text style={inputElementStyles['light'].inputLabel}>Loading...</Text>
            ) : (
                <>
                    <View style={inputElementStyles['light'].inputContainer}>
                        <View style={inputElementStyles['light'].inputGroup}>
                            <Text style={inputElementStyles['light'].insideLabel}>Name:</Text>
                            <TextInput
                                style={inputStyles.pressableInput}
                                placeholder="Direction name..."
                                value={direction.name}
                                onChangeText={text => (setDirection({ ...direction, "name": text }))}
                            />
                        </View>
                    </View>

                    <View style={buttonStyles.buttonRow}>
                        <Button title='Cancel' onPress={onCancel} style={buttonStyles.cancelButton} textStyle={buttonStyles.cancelButtonText}></Button>
                        <Button title='Add Direction' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
                    </View>
                </>
            )}
        </View>
    )
}