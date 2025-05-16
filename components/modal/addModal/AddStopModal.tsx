import Button from "@/components/BaseButton"
import useGetTravelData from "@/hooks/useGetTravelData"
import { useLoading } from "@/hooks/useLoading"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { iconPickerStyles, inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { AddableStop } from "@/src/types/AddableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'

export default function AddStopModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { loading } = useLoading()

    const { fullVehicleTypes } = useGetTravelData()

    const [stop, setStop] = useState<AddableStop>({
        name: undefined,
        lat: null,
        lon: null,
        name_alt: null,
        vehicle_type: undefined
    })

    const handleOnSubmit = () => {
        if (!stop.name?.trim() || !stop.vehicle_type) {
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
                                value={stop.lat ? stop.lat.toString() : ''}
                                onChangeText={text => (setStop({ ...stop, "lat": Number(text) }))}
                            />
                        </View>

                        <View style={inputElementStyles.inputGroup}>
                            <Text style={inputElementStyles.inputLabel}>Longitude:</Text>
                            <TextInput
                                style={inputStyles.pressableInput}
                                placeholder="Stop longitude..."
                                value={stop.lon ? stop.lon.toString() : ''}
                                onChangeText={text => (setStop({ ...stop, "lon": Number(text) }))}
                            />
                        </View>

                        <View style={inputElementStyles.inputGroup}>
                            <Text style={inputElementStyles.inputLabel}>Alternative name:</Text>
                            <TextInput
                                style={inputStyles.pressableInput}
                                placeholder="Alternative name..."
                                value={stop.name_alt ? stop.name_alt : ''}
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
                        <Button title='Add Stop' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
                    </View>
                </>
            )}
        </View>
    )
}