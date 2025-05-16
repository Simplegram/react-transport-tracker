import Button from "@/components/BaseButton";
import { useModalContext } from "@/context/ModalContext";
import useGetTravelData from "@/hooks/useGetTravelData";
import { useLoading } from "@/hooks/useLoading";
import { buttonStyles } from "@/src/styles/ButtonStyles";
import { iconPickerStyles, inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { EditableStop } from "@/src/types/EditableTravels";
import { BaseModalContentProps } from "@/src/types/ModalContentProps";
import { useState } from "react";
import { Alert } from "react-native";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome6'

export default function EditStopModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { modalData: data } = useModalContext()

    const { fullVehicleTypes } = useGetTravelData()
    const [stop, setStop] = useState<EditableStop>({ ...data, vehicle_type: data.vehicle_type?.id })

    const { loading } = useLoading()

    const handleOnSubmit = () => {
        if (!stop.name.trim() || !stop.vehicle_type) {
            Alert.alert('Input Required', 'Please enter a stop name and choose a vehicle type.');
            return
        }

        onSubmit(stop);
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
                                placeholder="Stop name..."
                                value={stop.name}
                                onChangeText={text => (setStop({ ...stop, "name": text }))}
                            />
                        </View>

                        <View style={inputElementStyles.inputGroup}>
                            <Text style={inputElementStyles.inputLabel}>Latitude:</Text>
                            <TextInput
                                style={inputStyles.pressableInput}
                                placeholder="Stop latitude..."
                                value={stop.lat?.toString()}
                                onChangeText={text => (setStop({ ...stop, "lat": Number(text) }))}
                            />
                        </View>

                        <View style={inputElementStyles.inputGroup}>
                            <Text style={inputElementStyles.inputLabel}>Longitude:</Text>
                            <TextInput
                                style={inputStyles.pressableInput}
                                placeholder="Stop longitude..."
                                value={stop.lon?.toString()}
                                onChangeText={text => (setStop({ ...stop, "lon": Number(text) }))}
                            />
                        </View>

                        <View style={inputElementStyles.inputGroup}>
                            <Text style={inputElementStyles.inputLabel}>Alternative name:</Text>
                            <TextInput
                                style={inputStyles.pressableInput}
                                placeholder="Alternative name..."
                                value={stop.name_alt}
                                onChangeText={text => (setStop({ ...stop, "name_alt": text }))}
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
                                    {fullVehicleTypes.map((type) => (
                                        <TouchableOpacity
                                            key={type.id}
                                            style={[
                                                iconPickerStyles.iconTextContainer,
                                                stop.vehicle_type === type.id && iconPickerStyles.selectedIconContainer,
                                            ]}
                                            onPress={() => setStop({ ...stop, vehicle_type: type.id })}
                                        >
                                            <Icon name={type.icon_id.name} size={20}></Icon>
                                            <Text style={inputElementStyles.inputLabel}>{type.name.slice(0, 5)}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </View>

                    <View style={buttonStyles.buttonRow}>
                        <Button title='Cancel' onPress={onCancel} style={buttonStyles.cancelButton} textStyle={buttonStyles.cancelButtonText}></Button>
                        <Button title='Edit Stop' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
                    </View>
                </>
            )}
        </View>
    )
}