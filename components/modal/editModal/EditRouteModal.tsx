import Button from "@/components/BaseButton"
import { colors } from "@/const/color"
import { useModalContext } from "@/context/ModalContext"
import { useTheme } from "@/context/ThemeContext"
import useGetTravelData from "@/hooks/useGetTravelData"
import { useLoading } from "@/hooks/useLoading"
import useStopModal from "@/hooks/useStopModal"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { iconPickerStyles, inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { styles } from "@/src/styles/Styles"
import { EditableRoute } from "@/src/types/EditableTravels"
import { ModalProp } from "@/src/types/TravelModal"
import { VehicleType } from "@/src/types/Travels"
import { sortByIdToFront } from "@/src/utils/utils"
import { useRef, useState } from "react"
import { Alert, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'
import EditTravelStopModal from "../travelModal/EditTravelStopModal"


export default function EditRouteModal({ stops: stops, onCancel, onSubmit }: ModalProp) {
    const { theme } = useTheme()

    const { modalData: data } = useModalContext()

    const { fullVehicleTypes } = useGetTravelData()

    const {
        showStopModal,
        editingStopField,
        stopSearchQuery,
        setStopSearchQuery,
        openStopModal,
        closeStopModal
    } = useStopModal();

    const [route, setRoute] = useState<EditableRoute>({
        ...data,
        'first_stop_id': data.first_stop_id.id,
        'last_stop_id': data.last_stop_id.id,
        'vehicle_type_id': data.vehicle_type_id.id
    })

    const savedVehicleTypeId = useRef(route.vehicle_type_id)

    const { loading } = useLoading()

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
                <Text style={inputElementStyles[theme].inputLabel}>Loading...</Text>
            ) : (
                <>
                    <View style={inputElementStyles[theme].inputContainer}>
                        <View style={inputElementStyles[theme].inputGroup}>
                            <Text style={inputElementStyles[theme].inputLabel}>Code:</Text>
                            <TextInput
                                style={inputStyles[theme].textInput}
                                placeholder="Route code..."
                                placeholderTextColor={colors.text.placeholderGray}
                                value={route.code}
                                onChangeText={text => (setRoute({ ...route, "code": text }))}
                            />
                        </View>

                        <View style={inputElementStyles[theme].inputGroup}>
                            <Text style={inputElementStyles[theme].inputLabel}>Name:</Text>
                            <TextInput
                                style={inputStyles[theme].textInput}
                                placeholder="Route name..."
                                placeholderTextColor={colors.text.placeholderGray}
                                value={route.name}
                                onChangeText={text => (setRoute({ ...route, "name": text }))}
                            />
                        </View>

                        <View style={inputElementStyles[theme].inputGroup}>
                            <Text style={inputElementStyles[theme].inputLabel}>First Stop:</Text>
                            <Pressable
                                style={inputStyles[theme].pressableInput}
                                onPress={() => openStopModal('first_stop_id')}>
                                <Text style={[inputElementStyles[theme].insideLabel, { marginBottom: 0 }]}>{stops.find(item => item.id === route.first_stop_id)?.name || 'Select First Stop'}</Text>
                            </Pressable>
                        </View>

                        <View style={inputElementStyles[theme].inputGroup}>
                            <Text style={inputElementStyles[theme].inputLabel}>Last Stop:</Text>
                            <Pressable
                                style={inputStyles[theme].pressableInput}
                                onPress={() => openStopModal('last_stop_id')}>
                                <Text style={[inputElementStyles[theme].insideLabel, { marginBottom: 0 }]}>{stops.find(item => item.id === route.last_stop_id)?.name || 'Select Last Stop'}</Text>
                            </Pressable>
                        </View>

                        <View style={[inputElementStyles[theme].inputGroup, inputElementStyles[theme].inputGroupEnd]}>
                            <View style={{
                                flexDirection: 'column',
                            }}>
                                <Text style={inputElementStyles[theme].inputLabel}>Type:</Text>
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
                                            <Text style={inputElementStyles[theme].inputLabel}>{type.name.slice(0, 5)}</Text>
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

                    <View style={buttonStyles[theme].buttonRow}>
                        <Button title='Cancel' onPress={onCancel} style={buttonStyles[theme].cancelButton} textStyle={buttonStyles[theme].cancelButtonText}></Button>
                        <Button title='Edit Route' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles[theme].addButton} textStyle={buttonStyles[theme].addButtonText}></Button>
                    </View>
                </>
            )}
        </View>
    )
}