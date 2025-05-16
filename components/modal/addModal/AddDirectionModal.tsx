import Button from "@/components/BaseButton"
import { useLoading } from "@/hooks/useLoading"
import modalStyles from "@/src/styles/ModalStyles"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { AddableDirection } from "@/src/types/AddableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { useState } from "react"
import { Alert, StyleSheet, Text, TextInput, View } from "react-native"

export default function AddDirectionModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const [direction, setDirection] = useState<AddableDirection>({ name: undefined })

    const { loading } = useLoading()

    const handleOnSubmit = () => {
        if (!direction.name?.trim()) {
            Alert.alert('Input Required', 'Please enter a direction name.');
            return
        }

        onSubmit(direction);
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <Text style={styles.label}>Loading...</Text>
            ) : (
                <>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Name:</Text>
                        <TextInput
                            style={modalStyles.input}
                            placeholder="Direction name..."
                            value={direction.name}
                            onChangeText={text => (setDirection({ ...direction, "name": text }))}
                        />
                    </View>

                    <View style={buttonStyles.buttonRow}>
                        <Button title='Cancel' color='#E0E0E0' onPress={onCancel} style={buttonStyles.cancelButton} textStyle={buttonStyles.cancelButtonText}></Button>
                        <Button title='Add Direction' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
                    </View>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {},
    inputContainer: {
        gap: 10,
        flexDirection: 'column',
        paddingVertical: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8
    },
})