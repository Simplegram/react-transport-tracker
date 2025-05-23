import Button from '@/components/BaseButton'
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'
import Divider from '@/components/Divider'
import LoadingScreen from '@/components/LoadingScreen'
import CustomDateTimePicker from '@/components/modal/CustomDatetimePicker'
import EditTravelDirectionModal from '@/components/modal/travelModal/EditTravelDirectionModal'
import EditTravelLapsModal from '@/components/modal/travelModal/EditTravelLapsModal'
import EditTravelRouteModal from '@/components/modal/travelModal/EditTravelRouteModal'
import EditTravelStopModal from '@/components/modal/travelModal/EditTravelStopModal'
import { colors } from '@/const/color'
import { useTravelContext } from '@/context/PageContext'
import { useTheme } from '@/context/ThemeContext'
import useGetTravelData from '@/hooks/useGetTravelData'
import useModifyTravelData from '@/hooks/useModifyTravelData'
import useStopModal from '@/hooks/useStopModal'
import { buttonStyles } from '@/src/styles/ButtonStyles'
import { inputElementStyles, inputStyles } from '@/src/styles/InputStyles'
import { EditableTravel } from '@/src/types/EditableTravels'
import { DataItem, Lap } from '@/src/types/Travels'
import { formatDateForDisplay } from '@/src/utils/utils'
import { router, useFocusEffect } from 'expo-router'
import moment from 'moment-timezone'
import React, { useState } from 'react'
import {
    Alert,
    Pressable,
    Text,
    TextInput,
    View
} from 'react-native'

export default function EditTravelItem() {
    const { theme } = useTheme()
    const { selectedItem: data } = useTravelContext()

    const {
        stops,
        routes,
        directions,
        vehicleTypes,
        laps, getLaps, setLaps,
        refetchTravelData
    } = useGetTravelData()

    const {
        editTravel,
        addLaps, editLaps
    } = useModifyTravelData()

    const [travel, setTravel] = useState<EditableTravel>()

    useFocusEffect(
        React.useCallback(() => {
            refetchTravelData()

            setTravel({
                id: data.id,
                bus_final_arrival: data?.bus_final_arrival,
                bus_initial_arrival: data?.bus_initial_arrival,
                bus_initial_departure: data?.bus_initial_departure,
                notes: data?.notes,
                vehicle_code: data?.vehicle_code,
                direction_id: data.directions.id,
                first_stop_id: data.first_stop_id.id,
                last_stop_id: data.last_stop_id.id,
                route_id: data.routes.id,
                type_id: data.types.id
            })

            getLaps(data.id)
        }, [data])
    )

    const [showCustomPicker, setShowCustomPicker] = useState(false)
    const [editingDateField, setEditingDateField] = useState<keyof Pick<DataItem, 'bus_initial_arrival' | 'bus_initial_departure' | 'bus_final_arrival'> | null>(null)

    const {
        showStopModal,
        editingStopField,
        stopSearchQuery,
        setStopSearchQuery,
        openStopModal,
        closeStopModal
    } = useStopModal()

    const {
        showStopModal: showRouteModal,
        stopSearchQuery: routeSearchQuery,
        setStopSearchQuery: setRouteSearchQuery,
        openStopModal: openRouteModal,
        closeStopModal: closeRouteModal
    } = useStopModal()

    const {
        showStopModal: showDirectionModal,
        stopSearchQuery: directionSearchQuery,
        setStopSearchQuery: setDirectionSearchQuery,
        openStopModal: openDirectionModal,
        closeStopModal: closeDirectionModal
    } = useStopModal()

    const {
        showStopModal: showLapsModal,
        openStopModal: openLapsModal,
        closeStopModal: closeLapsModal
    } = useStopModal()

    const handleChangeText = (field: keyof EditableTravel, value: string) => {
        setTravel(prev => {
            if (field in prev) {
                return { ...prev, [field]: value }
            }
            return prev
        })
    }

    const openCustomPickerModal = (field: keyof Pick<DataItem, 'bus_initial_arrival' | 'bus_initial_departure' | 'bus_final_arrival'>) => {
        setEditingDateField(field)
        setShowCustomPicker(true)
    }

    const handleCustomDateConfirm = (selectedDate: Date) => {
        const isoSelectedDate = moment(selectedDate).tz('Asia/Jakarta').format()

        if (editingDateField) {
            setTravel(prev => prev ? ({ ...prev, [editingDateField]: isoSelectedDate }) : null)
        }
        closeCustomPicker()
    }

    const closeCustomPicker = () => {
        setShowCustomPicker(false)
        setEditingDateField(null)
    }

    const handleStopSelect = (stopId: number) => {
        if (editingStopField && travel) {
            setTravel(prev => ({
                ...prev,
                [editingStopField]: stopId
            }))
        }
        closeStopModal()
    }

    const handleRouteSelect = (routeId: number) => {
        if (travel) {
            setTravel(prev => ({
                ...prev,
                route_id: routeId,
                type_id: routes.find(route => route.id === routeId)?.vehicle_type_id.id,
                first_stop_id: routes.find(route => route.id === routeId)?.first_stop_id.id,
                last_stop_id: routes.find(route => route.id === routeId)?.last_stop_id.id,
            }))
        }
        closeRouteModal()
    }

    const handleDirectionSelect = (directionId: number) => {
        if (travel) {
            setTravel({ ...travel, direction_id: directionId })
        }

        closeDirectionModal()
    }

    const handleLapsSelect = (laps: Lap[]) => {
        if (laps) setLaps(laps)

        closeLapsModal()
    }

    const handleOnSubmit = () => {
        if (!travel) {
            Alert.alert('Input Required', 'Data is broken.')
            return
        }

        if (
            !travel.direction_id ||
            !travel.first_stop_id ||
            !travel.last_stop_id ||
            !travel.route_id ||
            !travel.type_id
        ) {
            Alert.alert('Input Required', 'Please choose a route/direction/stops.')
            return
        }

        editTravel(travel)

        if (laps) {
            const idedLaps = laps.map(lap => { return { ...lap, travel_id: travel.id } })

            const lapsToEdit = idedLaps.filter(lap => lap.id)
            const lapsToAdd = idedLaps.filter(lap => !lap.id)

            if (lapsToEdit.length > 0) {
                editLaps(lapsToEdit)
            }

            if (lapsToAdd.length > 0) {
                addLaps(lapsToAdd)
            }
        }

        router.push('/(tabs)/mainMenu')
    }

    return (
        <CollapsibleHeaderPage
            headerText='Edit Travel'
        >
            {(!travel || !laps || !travel) ? (
                <LoadingScreen />
            ) : (
                <>
                    <View style={inputElementStyles[theme].inputContainer}>
                        <View style={inputElementStyles[theme].inputLargeGroup}>
                            <View style={inputElementStyles[theme].inputGroup}>
                                <Text style={inputElementStyles[theme].inputLabel}>Bus Initial Arrival:</Text>
                                <Pressable onPress={() => openCustomPickerModal('bus_initial_arrival')} style={inputStyles[theme].pressableInput}>
                                    <Text style={inputElementStyles[theme].insideLabel}>{formatDateForDisplay(travel.bus_initial_arrival)}</Text>
                                </Pressable>
                            </View>

                            <View style={inputElementStyles[theme].inputGroup}>
                                <Text style={inputElementStyles[theme].inputLabel}>Bus Initial Departure:</Text>
                                <Pressable onPress={() => openCustomPickerModal('bus_initial_departure')} style={inputStyles[theme].pressableInput}>
                                    <Text style={inputElementStyles[theme].insideLabel}>{formatDateForDisplay(travel.bus_initial_departure)}</Text>
                                </Pressable>
                            </View>

                            <View style={inputElementStyles[theme].inputGroup}>
                                <Text style={inputElementStyles[theme].inputLabel}>Bus Final Arrival:</Text>
                                <Pressable onPress={() => openCustomPickerModal('bus_final_arrival')} style={inputStyles[theme].pressableInput}>
                                    <Text style={inputElementStyles[theme].insideLabel}>{formatDateForDisplay(travel.bus_final_arrival)}</Text>
                                </Pressable>
                            </View>
                        </View>

                        <Divider />

                        {showCustomPicker && editingDateField && (
                            <CustomDateTimePicker
                                visible={showCustomPicker}
                                initialDateTime={
                                    travel && travel[editingDateField]
                                        ? new Date(travel[editingDateField] as string)
                                        : new Date()
                                }
                                onClose={closeCustomPicker}
                                onConfirm={handleCustomDateConfirm}
                            />
                        )}

                        <View style={inputElementStyles[theme].inputLargeGroup}>
                            <View style={inputElementStyles[theme].inputGroup}>
                                <Text style={inputElementStyles[theme].inputLabel}>Route:</Text>
                                <Pressable
                                    style={inputStyles[theme].pressableInput}
                                    onPress={() => openRouteModal()}>
                                    <Text style={inputElementStyles[theme].insideLabel}>
                                        {`${routes.find(route => route.id === travel.route_id)?.code || `Select`} | ${routes.find(route => route.id === travel.route_id)?.name || `Route...`}`}
                                    </Text>
                                </Pressable>
                            </View>

                            <View style={inputElementStyles[theme].inputGroup}>
                                <Text style={inputElementStyles[theme].inputLabel}>Type:</Text>
                                <TextInput
                                    editable={false}
                                    style={inputStyles[theme].textInput}
                                    value={vehicleTypes.find(type => type.id === travel.type_id)?.name}
                                    placeholder="Vehicle type..."
                                    placeholderTextColor={colors.text.placeholderGray}
                                />
                            </View>

                            <View style={inputElementStyles[theme].inputGroup}>
                                <Text style={inputElementStyles[theme].inputLabel}>Vehicle Code:</Text>
                                <TextInput
                                    style={inputStyles[theme].textInput}
                                    value={travel.vehicle_code || ''}
                                    onChangeText={(text) => handleChangeText('vehicle_code', text)}
                                    placeholder="Enter vehicle code"
                                    placeholderTextColor={colors.text.placeholderGray}
                                />
                            </View>
                        </View>

                        <Divider />

                        <View style={inputElementStyles[theme].inputLargeGroup}>
                            <View style={inputElementStyles[theme].inputGroup}>
                                <Text style={inputElementStyles[theme].inputLabel}>Direction:</Text>
                                <Pressable
                                    style={inputStyles[theme].pressableInput}
                                    onPress={() => openDirectionModal()}>
                                    <Text style={inputElementStyles[theme].insideLabel}>
                                        {directions.find(direction => direction.id === travel.direction_id)?.name || 'Select Direction...'}
                                    </Text>
                                </Pressable>
                            </View>

                            <View style={inputElementStyles[theme].inputGroup}>
                                <Text style={inputElementStyles[theme].inputLabel}>First Stop:</Text>
                                <Pressable
                                    style={inputStyles[theme].pressableInput}
                                    onPress={() => openStopModal('first_stop_id')}>
                                    <Text style={inputElementStyles[theme].insideLabel}>{stops.find(stop => stop.id === travel.first_stop_id)?.name || 'Select First Stop...'}</Text>
                                </Pressable>
                            </View>

                            <View style={inputElementStyles[theme].inputGroup}>
                                <Text style={inputElementStyles[theme].inputLabel}>Last Stop:</Text>
                                <Pressable
                                    style={inputStyles[theme].pressableInput}
                                    onPress={() => openStopModal('last_stop_id')}>
                                    <Text style={inputElementStyles[theme].insideLabel}>{stops.find(stop => stop.id === travel.last_stop_id)?.name || 'Select Last Stop...'}</Text>
                                </Pressable>
                            </View>
                        </View>

                        <Divider />

                        <View style={inputElementStyles[theme].inputLargeGroup}>
                            <View style={inputElementStyles[theme].inputGroup}>
                                <Text style={inputElementStyles[theme].inputLabel}>Notes:</Text>
                                <TextInput
                                    style={[inputStyles[theme].textInput, inputStyles[theme].multilineTextInput]}
                                    value={travel.notes || ''}
                                    onChangeText={(text) => handleChangeText('notes', text)}
                                    multiline={true}
                                    numberOfLines={4}
                                    placeholder="Enter notes (optional)"
                                    placeholderTextColor={colors.text.placeholderGray}
                                />
                            </View>
                        </View>

                        <View style={inputElementStyles[theme].inputLargeGroup}>
                            <View style={inputElementStyles[theme].inputGroup}>
                                <Text style={inputElementStyles[theme].inputLabel}>Laps:</Text>
                                <Pressable
                                    style={inputStyles[theme].pressableInput}
                                    onPress={() => openLapsModal()}>
                                    <Text style={inputElementStyles[theme].insideLabel}>{`${laps.length} laps`}</Text>
                                </Pressable>
                            </View>
                        </View>

                        <Divider />

                        <View style={buttonStyles[theme].buttonRow}>
                            <Button title='Save Travel Edit(s)' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles[theme].addButton} textStyle={buttonStyles[theme].addButtonText}></Button>
                        </View>
                    </View>

                    <EditTravelLapsModal
                        travel_id={travel.id}
                        currentLaps={laps ? laps : []}
                        stops={stops}
                        isModalVisible={showLapsModal}
                        onSelect={handleLapsSelect}
                        onClose={closeLapsModal}
                    />

                    <EditTravelDirectionModal
                        directions={directions}
                        isModalVisible={showDirectionModal}
                        searchQuery={directionSearchQuery}
                        setSearchQuery={setDirectionSearchQuery}
                        onSelect={handleDirectionSelect}
                        onClose={closeDirectionModal}
                    />

                    <EditTravelRouteModal
                        routes={routes}
                        isModalVisible={showRouteModal}
                        searchQuery={routeSearchQuery}
                        setSearchQuery={setRouteSearchQuery}
                        onSelect={handleRouteSelect}
                        onClose={closeRouteModal}
                    />

                    <EditTravelStopModal
                        stops={stops}
                        isModalVisible={showStopModal}
                        searchQuery={stopSearchQuery}
                        setSearchQuery={setStopSearchQuery}
                        onSelect={handleStopSelect}
                        onClose={closeStopModal}
                    />
                </>
            )}
        </CollapsibleHeaderPage>
    )
}