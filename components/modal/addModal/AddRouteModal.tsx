import Button from "@/components/BaseButton"
import { ModalButton } from "@/components/button/ModalButton"
import Input from "@/components/input/Input"
import { TextInputBlock } from "@/components/input/TextInput"
import { useModalContext } from "@/context/ModalContext"
import { useTheme } from "@/context/ThemeContext"
import useGetTravelData from "@/hooks/useGetTravelData"
import { useLoading } from "@/hooks/useLoading"
import useModalHandler from "@/hooks/useModalHandler"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { iconPickerStyles, inputElementStyles } from "@/src/styles/InputStyles"
import { styles } from "@/src/styles/Styles"
import { AddableRoute } from "@/src/types/AddableTravels"
import { ModalProp } from "@/src/types/TravelModal"
import { useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import { Alert, ScrollView, TouchableOpacity, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'
import EditTravelStopModal from "../travelModal/EditTravelStopModal"

export default function AddRouteModal({ stops: stops, onCancel, onSubmit }: ModalProp) {
    const { theme } = useTheme()
    const { setVehicleTypeId } = useModalContext()

    const { fullVehicleTypes } = useGetTravelData()

    const { loading } = useLoading()

    const {
        showModal,
        editingField,
        searchQuery,
        setSearchQuery,
        openModalWithSearch,
        closeModal
    } = useModalHandler()

    const [route, setRoute] = useState<AddableRoute>({
        code: undefined,
        first_stop_id: undefined,
        last_stop_id: undefined,
        name: undefined,
        vehicle_type_id: undefined
    })

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
                <Input.LoadingLabel />
            ) : (
                <>
                    <Input.Container>
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
                                <Input.Label>Type:</Input.Label>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyboardShouldPersistTaps={"always"}
                                >
                                    {fullVehicleTypes.map((type) => (
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
                                            <Input.Label
                                                style={route.vehicle_type_id === type.id && iconPickerStyles[theme].selectedText}
                                            >{type.name.slice(0, 5)}</Input.Label>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </Input.Container>

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
                        <Button.Add label='Add Route' onPress={handleOnSubmit} />
                    </View>
                </>
            )}
        </View>
    )
}