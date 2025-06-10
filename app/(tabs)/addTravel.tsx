import Button from '@/components/button/BaseButton'
import { ModalButton } from '@/components/button/ModalButton'
import NetButton from '@/components/button/ValidNetButton'
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage'
import Divider from '@/components/Divider'
import Input from '@/components/input/Input'
import { TextInputBlock } from '@/components/input/TextInput'
import LoadingScreen from '@/components/LoadingScreen'
import CustomDateTimePicker from '@/components/modal/CustomDatetimePicker'
import AddTravelLapsModal from '@/components/modal/travelModal/AddTravelLapsModal'
import EditTravelDirectionModal from '@/components/modal/travelModal/EditTravelDirectionModal'
import EditTravelRouteModal from '@/components/modal/travelModal/EditTravelRouteModal'
import EditTravelStopModal from '@/components/modal/travelModal/EditTravelStopModal'
import { useTheme } from '@/context/ThemeContext'
import useGetTravelData from '@/hooks/useGetTravelData'
import { useToggleLoading } from '@/hooks/useLoading'
import useModalHandler from '@/hooks/useModalHandler'
import useModifyTravelData from '@/hooks/useModifyTravelData'
import { inputElementStyles } from '@/src/styles/InputStyles'
import { AddableLap, AddableTravel } from '@/src/types/AddableTravels'
import { datetimeFieldToCapitals, formatDateForDisplay } from '@/src/utils/utils'
import { router, useFocusEffect } from 'expo-router'
import moment from 'moment-timezone'
import React, { useEffect, useState } from 'react'
import {
    Alert,
    View
} from 'react-native'

export default function AddTravel() {
    const { theme } = useTheme()
    const { addTravel, addLaps } = useModifyTravelData()
    const { stops, routes, directions, vehicleTypes, refetchTravelData } = useGetTravelData()

    const { loading, setLoading } = useToggleLoading()

    const [laps, setLaps] = useState<AddableLap[]>([])
    const [lapsCount, setLapsCount] = useState<number>(0)

    const [travel, setTravel] = useState<AddableTravel | null>(null)

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

    const setDefaultTravel = () => {
        setTravel({
            direction_id: undefined,
            first_stop_id: undefined,
            last_stop_id: undefined,
            route_id: undefined,
            type_id: undefined,
            bus_final_arrival: undefined,
            bus_initial_arrival: undefined,
            bus_initial_departure: undefined,
            vehicle_code: undefined,
            notes: undefined,
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

    const handleCustomDateConfirm = (selectedDate: Date) => {
        const isoSelectedDate = moment(selectedDate).tz('Asia/Jakarta').format()

        if (datetimeField) {
            setTravel(prev => prev ? ({ ...prev, [datetimeField]: isoSelectedDate }) : null)
        }
        closeDatetimeModal()
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

        setLoading(true)

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

        setLoading(false)

        router.push('/(tabs)/main')
    }

    return (
        <CollapsibleHeaderPage
            headerText='Add New Travel'
        >
            {loading && (
                <LoadingScreen></LoadingScreen>
            )}
            <Input.Container style={{ paddingBottom: 0 }}>
                <View style={inputElementStyles[theme].inputLargeGroup}>
                    <ModalButton.Block
                        label='Bus Initial Arrival:'
                        condition={travel.bus_initial_arrival}
                        value={formatDateForDisplay(travel.bus_initial_arrival)}
                        onPress={() => openDatetimeModal('bus_initial_arrival')}
                    />

                    <ModalButton.Block
                        label='Bus Initial Departure:'
                        condition={travel.bus_initial_departure}
                        value={formatDateForDisplay(travel.bus_initial_departure)}
                        onPress={() => openDatetimeModal('bus_initial_departure')}
                    />

                    <ModalButton.Block
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
                            label={datetimeFieldToCapitals(datetimeField)}
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
                    <ModalButton.Block
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
                        onChangeText={(text) => setTravel({ ...travel, vehicle_code: text })}
                        onClear={() => setTravel({ ...travel, vehicle_code: '' })}
                    />
                </View>

                <Divider />

                <View style={inputElementStyles[theme].inputLargeGroup}>
                    <ModalButton.Block
                        label='Direction:'
                        condition={travel.direction_id}
                        value={directions.find(direction => direction.id === travel.direction_id)?.name || 'Select Direction...'}
                        onPress={() => openDirectionModal()}
                    />

                    <ModalButton.Block
                        label='First Stop:'
                        condition={travel.first_stop_id}
                        value={stops.find(stop => stop.id === travel.first_stop_id)?.name || 'Select First Stop...'}
                        onPress={() => openStopModal('first_stop_id')}
                    />

                    <ModalButton.Block
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
                        onChangeText={(text) => setTravel({ ...travel, notes: text })}
                        onClear={() => setTravel({ ...travel, notes: '' })}
                    />
                </View>

                <View style={inputElementStyles[theme].inputLargeGroup}>
                    <ModalButton.Block
                        label='Laps:'
                        condition={lapsCount > 0}
                        value={`${lapsCount} lap${lapsCount !== 1 ? 's' : ''} selected`}
                        onPress={() => openLapsModal()}
                    />
                </View>

                <Divider />

                <Button.Row>
                    <NetButton label='Add Travel' onPress={handleOnSubmit} />
                </Button.Row>
            </Input.Container>

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
        </CollapsibleHeaderPage>
    )
}