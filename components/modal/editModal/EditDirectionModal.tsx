import Button from "@/components/BaseButton"
import { useModalContext } from "@/context/ModalContext"
import { useLoading } from "@/hooks/useLoading"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { Direction } from "@/src/types/Travels"
import { useState } from "react"
import { Alert, StyleSheet, Text, TextInput, View } from "react-native"

export default function EditDirectionModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { modalData: data } = useModalContext()

    const { loading } = useLoading()

    const [direction, setDirection] = useState<Direction>(data)

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
                <Text style={inputElementStyles.inputLabel}>Loading...</Text>
            ) : (
                <>
                    <View style={inputElementStyles.inputContainer}>
                        <View style={inputElementStyles.inputGroup}>
                            <Text style={inputElementStyles.inputLabel}>Name:</Text>
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
                        <Button title='Edit Route' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
                    </View>
                </>
            )}
        </View>
    )
}