import Button from "@/components/BaseButton";
import { useModalContext } from "@/context/ModalContext";
import useGetTravelData from "@/hooks/useGetTravelData";
import { useLoading } from "@/hooks/useLoading";
import { buttonStyles } from "@/src/styles/ButtonStyles";
import { iconPickerStyles, inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { EditableStop } from "@/src/types/EditableTravels";
import { BaseModalContentProps } from "@/src/types/ModalContentProps";
import { useState } from "react";
import { Alert, Pressable } from "react-native";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome6'
import AddCoordModal from "../addModal/AddCoordModal";
import useStopModal from "@/hooks/useStopModal";
import { AddableCoordinates, AddableCoordModalProp } from "@/src/types/AddableTravels";
import { colors } from "@/const/color";

export default function EditStopModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { modalData: data } = useModalContext()

    const { fullVehicleTypes } = useGetTravelData()
    const [stop, setStop] = useState<EditableStop>({ ...data, vehicle_type: data.vehicle_type?.id })

    const { loading } = useLoading()

    const {
        showStopModal: showCoordModal,
        openStopModal: openCoordModal,
        closeStopModal: closeCoordModal
    } = useStopModal();

    const handleCoordSelect = (coordinates: AddableCoordinates) => {
        if (!coordinates.lat || !coordinates.lon) {
            Alert.alert('Input Required', 'Please pick the right coordinates');
            return
        }

        setStop({ ...stop, lat: coordinates.lat, lon: coordinates.lon })
        closeCoordModal();
    };

    const handleOnSubmit = () => {
        if (!stop.name.trim() || !stop.vehicle_type) {
            Alert.alert('Input Required', 'Please enter a stop name and choose a vehicle type');
            return
        }

        onSubmit(stop);
    };

    return (
        <View>
            {loading ? (
                <Text style={inputElementStyles['light'].inputLabel}>Loading...</Text>
            ) : (
                <>
                    <View style={inputElementStyles['light'].inputContainer}>
                        <View style={inputElementStyles['light'].inputGroup}>
                            <Text style={inputElementStyles['light'].inputLabel}>Name:</Text>
                            <TextInput
                                style={inputStyles['light'].pressableInput}
                                placeholder="Stop name..."
                                value={stop.name}
                                onChangeText={text => (setStop({ ...stop, "name": text }))}
                            />
                        </View>

                        <View style={inputElementStyles['light'].inputGroup}>
                            <Text style={inputElementStyles['light'].inputLabel}>Latitude and Longitude:</Text>
                            <View style={inputElementStyles['light'].inputGroupCoord}>
                                <TextInput
                                    style={[inputStyles['light'].pressableInput, inputStyles['light'].pressableInputCoord]}
                                    placeholder="Stop latitude..."
                                    value={stop.lat?.toString()}
                                    onChangeText={text => (setStop({ ...stop, "lat": Number(text) }))}
                                />
                                <TextInput
                                    style={[inputStyles['light'].pressableInput, inputStyles['light'].pressableInputCoord]}
                                    placeholder="Stop longitude..."
                                    value={stop.lon?.toString()}
                                    onChangeText={text => (setStop({ ...stop, "lon": Number(text) }))}
                                />
                            </View>
                            <Pressable
                                style={[inputStyles['light'].pressableInput, { marginTop: 10 }]}
                                onPress={() => openCoordModal()}>
                                <Text style={inputElementStyles['light'].insideLabel}>Pick Latitude and Longitude...</Text>
                            </Pressable>
                        </View>

                        <View style={inputElementStyles['light'].inputGroup}>
                            <Text style={inputElementStyles['light'].inputLabel}>Alternative name:</Text>
                            <TextInput
                                style={inputStyles['light'].pressableInput}
                                placeholder="Alternative name..."
                                value={stop.name_alt}
                                onChangeText={text => (setStop({ ...stop, "name_alt": text }))}
                            />
                        </View>

                        <View style={[inputElementStyles['light'].inputGroup, inputElementStyles['light'].inputGroupEnd]}>
                            <View style={{
                                flexDirection: 'column',
                            }}>
                                <Text style={inputElementStyles['light'].inputLabel}>Icon:</Text>
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
                                            <Text style={inputElementStyles['light'].inputLabel}>{type.name.slice(0, 5)}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </View>

                    <AddCoordModal
                        currentCoordinates={{
                            lat: stop.lat,
                            lon: stop.lon
                        }}
                        isModalVisible={showCoordModal}
                        onClose={closeCoordModal}
                        onSelect={handleCoordSelect}
                    />

                    <View style={buttonStyles.buttonRow}>
                        <Button title='Cancel' onPress={onCancel} style={buttonStyles.cancelButton} textStyle={buttonStyles.cancelButtonText}></Button>
                        <Button title='Edit Stop' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
                    </View>
                </>
            )}
        </View>
    )
}

const addButtonStyles = StyleSheet.create({
    buttonContainer: {
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: colors.appBlue,
    },
    plusText: {
        color: 'white',
        fontWeight: 'bold',
    },
})