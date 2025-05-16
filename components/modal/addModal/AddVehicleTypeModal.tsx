import Button from "@/components/BaseButton";
import useGetTravelData from "@/hooks/useGetTravelData";
import { useLoading } from "@/hooks/useLoading";
import { buttonStyles } from "@/src/styles/ButtonStyles";
import { inputStyles } from "@/src/styles/Styles"
import { AddableVehicleType } from "@/src/types/AddableTravels";
import { BaseModalContentProps } from "@/src/types/ModalContentProps";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome6'

export default function AddVehicleTypeModal({ onSubmit, onCancel }: BaseModalContentProps) {
    const { icons } = useGetTravelData()

    const { loading } = useLoading()

    const [vehicleType, setVehicleType] = useState<AddableVehicleType>({ "name": undefined, "icon_id": undefined })

    const handleOnSubmit = () => {
        if (!vehicleType.name?.trim() || !vehicleType.icon_id) {
            Alert.alert('Input Required', 'Please enter a type name and choose an icon.');
            return
        }

        onSubmit(vehicleType);
    };

    return (
        <View style={styles.container}>
            {(loading || icons.length === 0) ? (
                <Text style={styles.label}>Loading...</Text>
            ) : (
                <>
                    <View style={styles.inputContainer}>
                        <View>
                            <Text style={styles.label}>Name:</Text>
                            <TextInput
                                style={inputStyles.pressableInput}
                                placeholder="e.g., Standard Bus"
                                value={vehicleType.name}
                                onChangeText={text => setVehicleType({ ...vehicleType, "name": text })}
                            />
                        </View>

                        <View style={{
                            flexDirection: 'column',
                        }}>
                            <Text style={styles.label}>Icon:</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.iconScrollView}
                                keyboardShouldPersistTaps={"always"}
                            >
                                {icons.map((icon) => (
                                    <TouchableOpacity
                                        key={icon.id}
                                        style={[
                                            styles.iconContainer,
                                            vehicleType.icon_id === icon.id && styles.selectedIconContainer,
                                        ]}
                                        onPress={() => setVehicleType({ ...vehicleType, "icon_id": icon.id })}
                                    >
                                        <Icon name={icon.name} size={20}></Icon>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </View>

                    <View style={buttonStyles.buttonRow}>
                        <Button title='Cancel' color='#E0E0E0' onPress={onCancel} style={buttonStyles.cancelButton} textStyle={buttonStyles.cancelButtonText}></Button>
                        <Button title='Add Type' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
                    </View>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {},
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    inputContainer: {
        gap: 10,
    },
    icon: {
        paddingLeft: 5,
        alignItems: 'center',
    },
    iconScrollView: {
        marginBottom: 20,
    },
    iconContainer: {
        width: 55,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 5,
        marginRight: 10, // Space between icons
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedIconContainer: {
        borderColor: '#0284f5', // Highlight selected icon
        backgroundColor: '#e3f2fd', // Light background for selected
    },
});