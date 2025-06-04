import Button from '@/components/BaseButton'
import ModalButtonBlock from '@/components/button/ModalButton'
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'
import Divider from '@/components/Divider'
import { TextInputBlock } from '@/components/input/TextInput'
import LoadingScreen from '@/components/LoadingScreen'
import CustomDateTimePicker from '@/components/modal/CustomDatetimePicker'
import EditTravelDirectionModal from '@/components/modal/travelModal/EditTravelDirectionModal'
import EditTravelLapsModal from '@/components/modal/travelModal/EditTravelLapsModal'
import EditTravelRouteModal from '@/components/modal/travelModal/EditTravelRouteModal'
import EditTravelStopModal from '@/components/modal/travelModal/EditTravelStopModal'
import { useModalContext } from '@/context/ModalContext'
import { useTheme } from '@/context/ThemeContext'
import { useTravelContext } from '@/context/TravelContext'
import useGetTravelData from '@/hooks/useGetTravelData'
import { useToggleLoading } from '@/hooks/useLoading'
import useModalHandler from '@/hooks/useModalHandler'
import useModifyTravelData from '@/hooks/useModifyTravelData'
import { buttonStyles } from '@/src/styles/ButtonStyles'
import { inputElementStyles } from '@/src/styles/InputStyles'
import { AddableLap } from '@/src/types/AddableTravels'
import { EditableTravel } from '@/src/types/EditableTravels'
import { Lap } from '@/src/types/Travels'
import { formatDateForDisplay } from '@/src/utils/utils'
import { router, useFocusEffect } from 'expo-router'
import moment from 'moment-timezone'
import React, { useState } from 'react'
import {
    Alert,
    View
} from 'react-native'

export default function EditTravelItem() {
    const { theme } = useTheme()
    const { selectedItem: data } = useTravelContext()
    const { setVehicleTypeId } = useModalContext()

    const { loading, setLoading } = useToggleLoading()

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

    const [lapsCount, setLapsCount] = useState<number>(0)
    const [travel, setTravel] = useState<EditableTravel | null>()

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

            setVehicleTypeId(data.types.id)

            getLaps(data.id)
        }, [data])
    )

    const {
        showModal: showDatetimeModal,
        editingField: datetimeField,
        openModalWithSearch: openDatetimeModal,
        closeModal: closeDatetimeModal
    } = useModalHandler()

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

    const handleChangeText = (field: keyof EditableTravel, value: string) => {
        setTravel(prev => {
            if (prev) {
                if (field in prev) {
                    return { ...prev, [field]: value }
                }
                return prev
            }
        })
    }

    const handleCustomDateConfirm = (selectedDate: Date) => {
        const isoSelectedDate = moment(selectedDate).tz('Asia/Jakarta').format()

        if (datetimeField) {
            setTravel(prev => prev ? ({ ...prev, [datetimeField]: isoSelectedDate }) : null)
        }
        closeDatetimeModal()
    }

    const handleStopSelect = (stopId: number) => {
        if (stopEditingField && travel) {
            setTravel(prev => {
                if (prev) return {
                    ...prev,
                    [stopEditingField]: stopId
                }
            })
        }
        closeStopModal()
    }

    const handleRouteSelect = (routeId: number) => {
        if (travel) {
            setTravel(prev => {
                if (prev) return {
                    ...prev,
                    route_id: routeId,
                    type_id: routes.find(route => route.id === routeId)?.vehicle_type_id.id,
                    first_stop_id: routes.find(route => route.id === routeId)?.first_stop_id.id,
                    last_stop_id: routes.find(route => route.id === routeId)?.last_stop_id.id,
                }
            })
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

        setLoading(true)

        editTravel(travel)

        if (laps) {
            const idedLaps = laps.map(lap => { return { ...lap, travel_id: travel.id } })

            const lapsToEdit = idedLaps.filter(lap => typeof lap.id === 'number')
            const lapsToAdd = idedLaps.filter(lap => typeof lap.id === 'string')

            const cleanedLapsToAdd = lapsToAdd.map(item => {
                if (typeof item.id === 'string') {
                    const { id, ...cleanNewLap } = item
                    return cleanNewLap
                }
                return undefined
            }).filter(item => item !== undefined) as AddableLap[]

            if (lapsToEdit.length > 0) {
                editLaps(lapsToEdit)
            }

            if (lapsToAdd.length > 0) {
                addLaps(cleanedLapsToAdd)
            }
        }

        setLoading(false)

        router.back()
    }

    return (
        <CollapsibleHeaderPage
            headerText='Edit Travel'
        >
            {(loading || !travel || !laps) ? (
                <LoadingScreen />
            ) : (
                <>
                    <View style={[inputElementStyles[theme].inputContainer, { paddingBottom: 0 }]}>
                        <View style={inputElementStyles[theme].inputLargeGroup}>
                            <ModalButtonBlock
                                label='Bus Initial Arrival:'
                                condition={travel.bus_initial_arrival}
                                value={formatDateForDisplay(travel.bus_initial_arrival)}
                                onPress={() => openDatetimeModal('bus_initial_arrival')}
                            />

                            <ModalButtonBlock
                                label='Bus Initial Departure:'
                                condition={travel.bus_initial_departure}
                                value={formatDateForDisplay(travel.bus_initial_departure)}
                                onPress={() => openDatetimeModal('bus_initial_departure')}
                            />

                            <ModalButtonBlock
                                label='Bus Final Arrival:'
                                condition={travel.bus_final_arrival}
                                value={formatDateForDisplay(travel.bus_final_arrival)}
                                onPress={() => openDatetimeModal('bus_final_arrival')}
                            />
                        </View>

                        <Divider />

                        {showDatetimeModal && datetimeField && (
                            datetimeField === 'bus_initial_arrival' ||
                            datetimeField === 'bus_initial_departure' ||
                            datetimeField === 'bus_final_arrival'
                        ) && (
                                <CustomDateTimePicker
                                    visible={showDatetimeModal}
                                    initialDateTime={
                                        travel && travel[datetimeField]
                                            ? new Date(travel[datetimeField] as string)
                                            : new Date()
                                    }
                                    onClose={closeDatetimeModal}
                                    onConfirm={handleCustomDateConfirm}
                                />
                            )
                        }

                        <View style={inputElementStyles[theme].inputLargeGroup}>
                            <ModalButtonBlock
                                label='Route:'
                                condition={travel.route_id}
                                value={travel.route_id ? `${routes.find(route => route.id === travel.route_id)?.code || ''} | ${routes.find(route => route.id === travel.route_id)?.name || ''}` : 'Select Route...'}
                                onPress={() => openRouteModal()}
                            />

                            <TextInputBlock
                                editable={false}
                                label='Type:'
                                placeholder='Vehicle type (auto-filled)'
                                value={vehicleTypes.find(type => type.id === travel.type_id)?.name}
                            />

                            <TextInputBlock
                                label='Vehicle Code:'
                                placeholder='Enter vehicle code'
                                value={travel.vehicle_code}
                                onChangeText={(text) => handleChangeText('vehicle_code', text)}
                            />
                        </View>

                        <Divider />

                        <View style={inputElementStyles[theme].inputLargeGroup}>
                            <ModalButtonBlock
                                label='Direction:'
                                condition={travel.direction_id}
                                value={directions.find(direction => direction.id === travel.direction_id)?.name || 'Select Direction...'}
                                onPress={() => openDirectionModal()}
                            />

                            <ModalButtonBlock
                                label='First Stop:'
                                condition={travel.first_stop_id}
                                value={stops.find(stop => stop.id === travel.first_stop_id)?.name || 'Select First Stop...'}
                                onPress={() => openStopModal('first_stop_id')}
                            />

                            <ModalButtonBlock
                                label='Last Stop:'
                                condition={travel.last_stop_id}
                                value={stops.find(stop => stop.id === travel.last_stop_id)?.name || 'Select Last Stop...'}
                                onPress={() => openStopModal('last_stop_id')}
                            />
                        </View>

                        <Divider />

                        <View style={inputElementStyles[theme].inputLargeGroup}>
                            <TextInputBlock.Multiline
                                label='Notes:'
                                value={travel.notes}
                                placeholder='Notes (optional)'
                                onChangeText={(text) => handleChangeText('notes', text)}
                            />
                        </View>

                        <View style={inputElementStyles[theme].inputLargeGroup}>
                            <ModalButtonBlock
                                label='Laps:'
                                condition={lapsCount > 0}
                                value={`${lapsCount} lap${lapsCount !== 1 ? 's' : ''} selected`}
                                onPress={() => openLapsModal()}
                            />
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