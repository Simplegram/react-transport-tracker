import { AddableRoute } from "@/src/types/AddableTravels"
import { useState } from "react"
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import EditTravelStopModal from "../travelModal/EditTravelStopModal"
import Button from "@/components/BaseButton"
import Icon from 'react-native-vector-icons/FontAwesome6'
import useGetTravelData from "@/hooks/useGetTravelData"
import { useLoading } from "@/hooks/useLoading"
import useStopModal from "@/hooks/useStopModal"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { iconPickerStyles, inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { ModalProp } from "@/src/types/TravelModal"

export default function AddRouteModal({ stops: stops, onCancel, onSubmit }: ModalProp) {
    const { fullVehicleTypes } = useGetTravelData()

    const { loading } = useLoading()

    const {
        showStopModal,
        editingStopField,
        stopSearchQuery,
        setStopSearchQuery,
        openStopModal,
        closeStopModal
    } = useStopModal();

    const [route, setRoute] = useState<AddableRoute>({
        code: undefined,
        first_stop_id: undefined,
        last_stop_id: undefined,
        name: undefined,
        vehicle_type_id: undefined
    })

    const handleStopSelect = (stopId: number) => {
        if (!editingStopField) {
            return
        }

        setRoute({ ...route, [editingStopField]: stopId })
        closeStopModal();
    };

    const handleOnSubmit = () => {
        if (!route.name || !route.first_stop_id || !route.last_stop_id || !route.vehicle_type_id) {
            Alert.alert('Input Required', 'Please add route name/stops/vehicle type');
            return
        }

        onSubmit(route);
    };

    return (
        <View>
            {loading || !stops ? (
                <Text style={inputElementStyles.inputLabel}>Loading...</Text>
            ) : (
                <>
                    <View style={inputElementStyles.inputContainer}>
                        <View style={inputElementStyles.inputGroup}>
                            <Text style={inputElementStyles.insideLabel}>Code:</Text>
                            <TextInput
                                style={inputStyles.pressableInput}
                                placeholder="Route code..."
                                value={route.code}
                                onChangeText={text => (setRoute({ ...route, "code": text }))}
                            />
                        </View>

                        <View style={inputElementStyles.inputGroup}>
                            <Text style={inputElementStyles.insideLabel}>Name:</Text>
                            <TextInput
                                style={inputStyles.pressableInput}
                                placeholder="Route name..."
                                value={route.name}
                                onChangeText={text => (setRoute({ ...route, "name": text }))}
                            />
                        </View>

                        <View style={inputElementStyles.inputGroup}>
                            <Text style={inputElementStyles.inputLabel}>First Stop:</Text>
                            <Pressable
                                style={inputStyles.pressableInput}
                                onPress={() => openStopModal('first_stop_id')}>
                                <Text style={[inputElementStyles.insideLabel, { marginBottom: 0 }]}>{stops.find(item => item.id === route.first_stop_id)?.name || 'Select First Stop'}</Text>
                            </Pressable>
                        </View>

                        <View style={inputElementStyles.inputGroup}>
                            <Text style={inputElementStyles.inputLabel}>Last Stop:</Text>
                            <Pressable
                                style={inputStyles.pressableInput}
                                onPress={() => openStopModal('last_stop_id')}>
                                <Text style={[inputElementStyles.insideLabel, { marginBottom: 0 }]}>{stops.find(item => item.id === route.last_stop_id)?.name || 'Select Last Stop'}</Text>
                            </Pressable>
                        </View>

                        <View style={[inputElementStyles.inputGroup, inputElementStyles.inputGroupEnd]}>
                            <View style={{
                                flexDirection: 'column',
                            }}>
                                <Text style={inputElementStyles.inputLabel}>Type:</Text>
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
                                                route.vehicle_type_id === type.id && iconPickerStyles.selectedIconContainer,
                                            ]}
                                            onPress={() => setRoute({ ...route, vehicle_type_id: type.id })}
                                        >
                                            <Icon name={type.icon_id.name} size={20}></Icon>
                                            <Text style={inputElementStyles.inputLabel}>{type.name.slice(0, 5)}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </View>

                    <EditTravelStopModal
                        stops={stops}
                        isModalVisible={showStopModal}
                        searchQuery={stopSearchQuery}
                        setSearchQuery={setStopSearchQuery}
                        onSelect={handleStopSelect}
                        onClose={closeStopModal}
                    />

                    <View style={buttonStyles.buttonRow}>
                        <Button title='Cancel' onPress={onCancel} style={buttonStyles.cancelButton} textStyle={buttonStyles.cancelButtonText}></Button>
                        <Button title='Add Route' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
                    </View>
                </>
            )}
        </View>
    )
}