import Button from "@/components/BaseButton"
import { ModalButton } from "@/components/button/ModalButton"
import InputGroup from "@/components/input/Input"
import { TextInputBlock } from "@/components/input/TextInput"
import { useDataEditContext } from "@/context/DataEditContext"
import { useModalContext } from "@/context/ModalContext"
import { useTheme } from "@/context/ThemeContext"
import useGetTravelData from "@/hooks/useGetTravelData"
import { useLoading } from "@/hooks/useLoading"
import useModalHandler from "@/hooks/useModalHandler"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { iconPickerStyles, inputElementStyles } from "@/src/styles/InputStyles"
import { styles } from "@/src/styles/Styles"
import { EditableRoute } from "@/src/types/EditableTravels"
import { ModalProp } from "@/src/types/TravelModal"
import { VehicleType } from "@/src/types/Travels"
import { sortByIdToFront } from "@/src/utils/utils"
import { useFocusEffect } from "expo-router"
import { useCallback, useRef, useState } from "react"
import { Alert, ScrollView, TouchableOpacity, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'
import EditTravelStopModal from "../travelModal/EditTravelStopModal"


export default function EditRouteModal({ stops: stops, onCancel, onSubmit }: ModalProp) {
    const { theme } = useTheme()
    const { setVehicleTypeId } = useModalContext()

    const { modalData: data } = useDataEditContext()

    const { fullVehicleTypes } = useGetTravelData()

    const {
        showModal,
        editingField,
        searchQuery,
        setSearchQuery,
        openModalWithSearch,
        closeModal
    } = useModalHandler()

    const [route, setRoute] = useState<EditableRoute>({
        ...data,
        'first_stop_id': data.first_stop_id.id,
        'last_stop_id': data.last_stop_id.id,
        'vehicle_type_id': data.vehicle_type_id.id
    })

    const savedVehicleTypeId = useRef(route.vehicle_type_id)

    const { loading } = useLoading()

    useFocusEffect(
        useCallback(() => {
            setVehicleTypeId(null)
        }, [])
    )

    const handleStopSelect = (stopId: number) => {
        if (!editingField) {
            return
        }

        setRoute({ ...route, [editingField]: stopId })
        closeModal()
    }

    const handleOnSubmit = () => {
        if (!route.name || !route.first_stop_id || !route.last_stop_id || !route.vehicle_type_id) {
            Alert.alert('Input Required', 'Please add route name/stops/vehicle type')
            return
        }

        onSubmit(route)
    }

    return (
        <View>
            {loading || !stops ? (
                <InputGroup.LoadingLabel />
            ) : (
                <>
                    <View style={inputElementStyles[theme].inputContainer}>
                        <TextInputBlock
                            label="Code:"
                            value={route.code}
                            placeholder="Route code..."
                            onChangeText={(text) => setRoute({ ...route, "code": text })}
                        />

                        <TextInputBlock
                            label="Name:"
                            value={route.name}
                            placeholder="Route name..."
                            onChangeText={(text) => setRoute({ ...route, "name": text })}
                        />

                        <ModalButton.Block
                            label="First Stop:"
                            condition={route.first_stop_id}
                            value={stops.find(item => item.id === route.first_stop_id)?.name || 'Select First Stop'}
                            onPress={() => openModalWithSearch('first_stop_id')}
                        />

                        <ModalButton.Block
                            label="Last Stop:"
                            condition={route.last_stop_id}
                            value={stops.find(item => item.id === route.last_stop_id)?.name || 'Select Last Stop'}
                            onPress={() => openModalWithSearch('last_stop_id')}
                        />

                        <View style={inputElementStyles[theme].inputGroup}>
                            <View style={{
                                flexDirection: 'column',
                            }}>
                                <InputGroup.Label>Type:</InputGroup.Label>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyboardShouldPersistTaps={"always"}
                                >
                                    {sortByIdToFront(fullVehicleTypes, savedVehicleTypeId.current).map((type: VehicleType) => (
                                        <TouchableOpacity
                                            key={type.id}
                                            style={[
                                                iconPickerStyles[theme].iconTextContainer,
                                                route.vehicle_type_id === type.id && iconPickerStyles[theme].selectedIconContainer,
                                            ]}
                                            onPress={() => setRoute({ ...route, vehicle_type_id: type.id })}
                                        >
                                            <Icon
                                                style={
                                                    route.vehicle_type_id === type.id ?
                                                        iconPickerStyles[theme].selectedIcon
                                                        :
                                                        styles[theme].icon
                                                }
                                                name={type.icon_id.name}
                                                size={20}
                                            />
                                            <InputGroup.Label
                                                style={route.vehicle_type_id === type.id && iconPickerStyles[theme].selectedText}
                                            >{type.name.slice(0, 5)}</InputGroup.Label>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </View>

                    <EditTravelStopModal
                        stops={stops}
                        isModalVisible={showModal}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onSelect={handleStopSelect}
                        onClose={closeModal}
                    />

                    <View style={buttonStyles[theme].buttonRow}>
                        <Button.Dismiss label='Cancel' onPress={onCancel} />
                        <Button.Add label='Edit Route' onPress={handleOnSubmit} />
                    </View>
                </>
            )}
        </View>
    )
}