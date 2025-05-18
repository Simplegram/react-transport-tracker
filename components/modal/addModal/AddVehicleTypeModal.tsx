import Button from "@/components/BaseButton";
import useGetTravelData from "@/hooks/useGetTravelData";
import { useLoading } from "@/hooks/useLoading";
import { buttonStyles } from "@/src/styles/ButtonStyles";
import { iconPickerStyles, inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { AddableVehicleType } from "@/src/types/AddableTravels";
import { BaseModalContentProps } from "@/src/types/ModalContentProps";
import { VehicleTypeModalProp } from "@/src/types/TravelModal";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome6'

export default function AddVehicleTypeModal({ icons, onSubmit, onCancel }: VehicleTypeModalProp) {
    const { loading } = useLoading()

    const [vehicleType, setVehicleType] = useState<AddableVehicleType>({ "name": undefined, "icon_id": undefined })

    const handleOnSubmit = () => {
        if (!vehicleType.name || !vehicleType.icon_id) {
            Alert.alert('Input Required', 'Please enter a type name and choose an icon.');
            return
        }

        onSubmit(vehicleType);
    };

    return (
        <View>
            {(loading || icons.length === 0) ? (
                <Text style={inputElementStyles.inputLabel}>Loading...</Text>
            ) : (
                <>
                    <View style={inputElementStyles.inputContainer}>
                        <View style={inputElementStyles.inputGroup}>
                            <Text style={inputElementStyles.inputLabel}>Name:</Text>
                            <TextInput
                                style={inputStyles.pressableInput}
                                placeholder="e.g., Standard Bus"
                                value={vehicleType.name}
                                onChangeText={text => setVehicleType({ ...vehicleType, "name": text })}
                            />
                        </View>

                        <View style={[inputElementStyles.inputGroup, inputElementStyles.inputGroupEnd]}>
                            <View style={{
                                flexDirection: 'column',
                            }}>
                                <Text style={inputElementStyles.inputLabel}>Icon:</Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyboardShouldPersistTaps={"always"}
                                >
                                    {icons.map((icon) => (
                                        <TouchableOpacity
                                            key={icon.id}
                                            style={[
                                                iconPickerStyles.iconContainer,
                                                vehicleType.icon_id === icon.id && iconPickerStyles.selectedIconContainer,
                                            ]}
                                            onPress={() => setVehicleType({ ...vehicleType, "icon_id": icon.id })}
                                        >
                                            <Icon name={icon.name} size={20}></Icon>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </View>

                    <View style={buttonStyles.buttonRow}>
                        <Button title='Cancel' onPress={onCancel} style={buttonStyles.cancelButton} textStyle={buttonStyles.cancelButtonText}></Button>
                        <Button title='Add Type' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
                    </View>
                </>
            )}
        </View>
    )
}