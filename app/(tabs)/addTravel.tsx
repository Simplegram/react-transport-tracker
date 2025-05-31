import Button from '@/components/BaseButton'
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'
import Divider from '@/components/Divider'
import HighlightedText from '@/components/HighlightedText'
import CTextInput from '@/components/input/CTextInput'
import MultilineTextInput from '@/components/input/MultilineTextInput'
import LoadingScreen from '@/components/LoadingScreen'
import CustomDateTimePicker from '@/components/modal/CustomDatetimePicker'
import AddTravelLapsModal from '@/components/modal/travelModal/AddTravelLapsModal'
import EditTravelDirectionModal from '@/components/modal/travelModal/EditTravelDirectionModal'
import EditTravelRouteModal from '@/components/modal/travelModal/EditTravelRouteModal'
import EditTravelStopModal from '@/components/modal/travelModal/EditTravelStopModal'
import { useTheme } from '@/context/ThemeContext'
import useGetTravelData from '@/hooks/useGetTravelData'
import useModalHandler from '@/hooks/useModalHandler'
import useModifyTravelData from '@/hooks/useModifyTravelData'
import { colors } from '@/src/const/color'
import { buttonStyles } from '@/src/styles/ButtonStyles'
import { inputElementStyles, inputStyles } from '@/src/styles/InputStyles'
import { AddableLap, AddableTravel } from '@/src/types/AddableTravels'
import { DataItem } from '@/src/types/Travels'
import { formatDateForDisplay } from '@/src/utils/utils'
import { router, useFocusEffect } from 'expo-router'
import moment from 'moment-timezone'
import React, { useEffect, useState } from 'react'
import {
    Alert,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native'

export default function AddTravel() {
    const { theme } = useTheme()

    const { stops, routes, directions, vehicleTypes, refetchTravelData } = useGetTravelData()

    const { addTravel, addLaps } = useModifyTravelData()

    const [laps, setLaps] = useState<AddableLap[]>([])
    const [lapsCount, setLapsCount] = useState<number>(0)

    const [travel, setTravel] = useState<AddableTravel | null>(null)

    const [showCustomPicker, setShowCustomPicker] = useState(false)
    const [editingDateField, setEditingDateField] = useState<keyof Pick<DataItem, 'bus_initial_arrival' | 'bus_initial_departure' | 'bus_final_arrival'> | null>(null)

    const {
        showModal: showStopModal,
        editingField: stopEditingField,
        searchQuery: stopSearchQuery,
        setSearchQuery: setStopSearchQuery,
        openModalWithSearch: openStopModal,
        closeModal: closeStopModal
    } = useModalHandler()

    const {
        showModal: showRouteModal,
        searchQuery: routeSearchQuery,
        setSearchQuery: setRouteSearchQuery,
        openModalWithSearch: openRouteModal,
        closeModal: closeRouteModal
    } = useModalHandler()

    const {
        showModal: showDirectionModal,
        searchQuery: directionSearchQuery,
        setSearchQuery: setDirectionSearchQuery,
        openModalWithSearch: openDirectionModal,
        closeModal: closeDirectionModal
    } = useModalHandler()

    const {
        showModal: showLapsModal,
        openModalWithSearch: openLapsModal,
        closeModal: closeLapsModal
    } = useModalHandler()

    const setDefaultTravel = () => {
        setTravel({
            direction_id: undefined,
            first_stop_id: undefined,
            last_stop_id: undefined,
            route_id: undefined,
            type_id: undefined,
            bus_final_arrival: null,
            bus_initial_arrival: null,
            bus_initial_departure: null,
            vehicle_code: null,
            notes: null,
        })
        setLaps([])
    }

    useEffect(() => {
        setDefaultTravel()
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            refetchTravelData()
        }, [])
    )

    useFocusEffect(
        React.useCallback(() => {
            setLapsCount(laps.length)
        }, [laps])
    )

    const handleChangeText = (field: keyof AddableTravel, value: string) => {
        setTravel(prev => {
            if (!prev) return null
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

    if (!travel) {
        return (
            <LoadingScreen></LoadingScreen>
        )
    }

    const handleStopSelect = (stopId: number) => {
        if (stopEditingField && travel) {
            setTravel(prev => prev ? ({
                ...prev,
                [stopEditingField]: stopId
            }) : null)
        }
        closeStopModal()
    }

    const handleRouteSelect = (routeId: number) => {
        if (travel) {
            setTravel(prev => prev ? ({
                ...prev,
                route_id: routeId,
                type_id: routes.find(route => route.id === routeId)?.vehicle_type_id.id,
                first_stop_id: routes.find(route => route.id === routeId)?.first_stop_id.id,
                last_stop_id: routes.find(route => route.id === routeId)?.last_stop_id.id,
            }) : null)
        }
        closeRouteModal()
    }

    const handleDirectionSelect = (directionId: number) => {
        if (travel) {
            setTravel({ ...travel, direction_id: directionId })
        }

        closeDirectionModal()
    }

    const handleLapsSelect = (laps: AddableLap[]) => {
        if (laps) setLaps(laps)

        closeLapsModal()
    }

    const handleOnSubmit = async () => {
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

        const newTravel = await addTravel(travel, true)

        let newLaps: AddableLap[] = []
        if (newTravel && newTravel.length > 0) {
            newLaps = laps.map(lap => {
                return { ...lap, travel_id: newTravel[0].id }
            })
            if (newLaps.length > 0) {
                addLaps(newLaps)
            }
        }


        setDefaultTravel()

        router.push('/(tabs)/main')
    }

    return (
        <CollapsibleHeaderPage
            headerText='Add New Travel'
        >
            <View style={inputElementStyles[theme].inputContainer}>
                <View style={inputElementStyles[theme].inputLargeGroup}>
                    <View style={inputElementStyles[theme].inputGroup}>
                        <Text style={inputElementStyles[theme].inputLabel}>Bus Initial Arrival:</Text>
                        <Pressable onPress={() => openCustomPickerModal('bus_initial_arrival')} style={inputStyles[theme].pressableInput}>
                            <HighlightedText condition={travel.bus_initial_arrival}>
                                {formatDateForDisplay(travel.bus_initial_arrival)}
                            </HighlightedText>
                        </Pressable>
                    </View>

                    <View style={inputElementStyles[theme].inputGroup}>
                        <Text style={inputElementStyles[theme].inputLabel}>Bus Initial Departure:</Text>
                        <Pressable onPress={() => openCustomPickerModal('bus_initial_departure')} style={inputStyles[theme].pressableInput}>
                            <HighlightedText condition={travel.bus_initial_departure}>
                                {formatDateForDisplay(travel.bus_initial_departure)}
                            </HighlightedText>
                        </Pressable>
                    </View>

                    <View style={[inputElementStyles[theme].inputGroup]}>
                        <Text style={inputElementStyles[theme].inputLabel}>Bus Final Arrival:</Text>
                        <Pressable onPress={() => openCustomPickerModal('bus_final_arrival')} style={inputStyles[theme].pressableInput}>
                            <HighlightedText condition={travel.bus_final_arrival}>
                                {formatDateForDisplay(travel.bus_final_arrival)}
                            </HighlightedText>
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
                            <HighlightedText condition={travel.route_id}>{
                                travel.route_id ? `${routes.find(route => route.id === travel.route_id)?.code || ''} | ${routes.find(route => route.id === travel.route_id)?.name || ''}` : 'Select Route...'
                            }</HighlightedText>
                        </Pressable>
                    </View>

                    <CTextInput 
                        editable={false}
                        label='Type:'
                        placeholder='Vehicle type (auto-filled)'
                        value={vehicleTypes.find(type => type.id === travel.type_id)?.name}
                    />

                    <CTextInput 
                        label='Vehicle Code:'
                        placeholder='Enter vehicle code'
                        value={travel.vehicle_code}
                        onChangeText={(text) => handleChangeText('vehicle_code', text)}
                    />
                </View>

                <Divider />

                <View style={inputElementStyles[theme].inputLargeGroup}>
                    <View style={inputElementStyles[theme].inputGroup}>
                        <Text style={inputElementStyles[theme].inputLabel}>Direction:</Text>
                        <Pressable
                            style={inputStyles[theme].pressableInput}
                            onPress={() => openDirectionModal()}>
                            <HighlightedText condition={travel.direction_id}>
                                {directions.find(direction => direction.id === travel.direction_id)?.name || 'Select Direction...'}
                            </HighlightedText>
                        </Pressable>
                    </View>

                    <View style={inputElementStyles[theme].inputGroup}>
                        <Text style={inputElementStyles[theme].inputLabel}>First Stop:</Text>
                        <Pressable
                            style={inputStyles[theme].pressableInput}
                            onPress={() => openStopModal('first_stop_id')}>
                            <HighlightedText condition={travel.first_stop_id}>
                                {stops.find(stop => stop.id === travel.first_stop_id)?.name || 'Select First Stop...'}
                            </HighlightedText>
                        </Pressable>
                    </View>

                    <View style={inputElementStyles[theme].inputGroup}>
                        <Text style={inputElementStyles[theme].inputLabel}>Last Stop:</Text>
                        <Pressable
                            style={inputStyles[theme].pressableInput}
                            onPress={() => openStopModal('last_stop_id')}>
                            <HighlightedText condition={travel.last_stop_id}>
                                {stops.find(stop => stop.id === travel.last_stop_id)?.name || 'Select Last Stop...'}
                            </HighlightedText>
                        </Pressable>
                    </View>
                </View>

                <Divider />

                <View style={inputElementStyles[theme].inputLargeGroup}>
                    <MultilineTextInput 
                        label='Notes:'
                        value={travel.notes}
                        placeholder='Enter notes (optional)'
                        onChangeText={(text) => handleChangeText('notes', text)}
                    />
                </View>

                <View style={inputElementStyles[theme].inputLargeGroup}>
                    <View style={inputElementStyles[theme].inputGroup}>
                        <Text style={inputElementStyles[theme].inputLabel}>Laps:</Text>
                        <Pressable
                            style={inputStyles[theme].pressableInput}
                            onPress={() => openLapsModal()}>
                            <HighlightedText condition={lapsCount > 0}>
                                {`${lapsCount} lap${lapsCount !== 1 ? 's' : ''} selected`}
                            </HighlightedText>
                        </Pressable>
                    </View>
                </View>
            </View>

            <AddTravelLapsModal
                stops={stops}
                currentLaps={laps}
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

            <View style={buttonStyles[theme].buttonRow}>
                <Button
                    title='Add Travel'
                    color='#0284f5'
                    onPress={handleOnSubmit}
                    style={buttonStyles[theme].addButton}
                    textStyle={buttonStyles[theme].addButtonText}
                />
            </View>
        </CollapsibleHeaderPage>
    )
}