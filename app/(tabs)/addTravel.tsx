import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Platform,
    Pressable,
    Alert,
} from 'react-native';
import { DataItem } from '@/src/types/Travels';
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage';
import EditTravelStopModal from '@/components/modal/travelModal/EditTravelStopModal';
import useStopModal from '@/hooks/useStopModal';
import CustomDateTimePicker from '@/components/CustomDatetimePicker';
import useGetTravelData from '@/hooks/useGetTravelData';
import { AddableLap, AddableTravel } from '@/src/types/AddableTravels';
import EditTravelRouteModal from '@/components/modal/travelModal/EditTravelRouteModal';
import Button from '@/components/BaseButton';
import EditTravelDirectionModal from '@/components/modal/travelModal/EditTravelDirectionModal';
import useModifyTravelData from '@/hooks/useModifyTravelData';
import { router } from 'expo-router';
import { formatDateForDisplay } from '@/src/utils/utils';
import moment from 'moment-timezone'
import AddTravelLapsModal from '@/components/modal/travelModal/AddTravelLapsModal';
import { buttonStyles } from '@/src/styles/ButtonStyles';
import { inputElementStyles, inputStyles } from '@/src/styles/InputStyles';
import LoadingScreen from '@/components/LoadingScreen';

export default function AddTravel() {
    const { stops, routes, directions, vehicleTypes } = useGetTravelData();

    const { addTravel, addLaps } = useModifyTravelData()

    const [laps, setLaps] = useState<AddableLap[]>([])
    const [travel, setTravel] = useState<AddableTravel | null>(null);

    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const [editingDateField, setEditingDateField] = useState<keyof Pick<DataItem, 'bus_initial_arrival' | 'bus_initial_departure' | 'bus_final_arrival'> | null>(null);

    const {
        showStopModal,
        editingStopField,
        stopSearchQuery,
        setStopSearchQuery,
        openStopModal,
        closeStopModal
    } = useStopModal();

    const {
        showStopModal: showRouteModal,
        stopSearchQuery: routeSearchQuery,
        setStopSearchQuery: setRouteSearchQuery,
        openStopModal: openRouteModal,
        closeStopModal: closeRouteModal
    } = useStopModal();

    const {
        showStopModal: showDirectionModal,
        stopSearchQuery: directionSearchQuery,
        setStopSearchQuery: setDirectionSearchQuery,
        openStopModal: openDirectionModal,
        closeStopModal: closeDirectionModal
    } = useStopModal();

    const {
        showStopModal: showLapsModal,
        openStopModal: openLapsModal,
        closeStopModal: closeLapsModal
    } = useStopModal();

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
        });
        setLaps([])
    }

    useEffect(() => {
        setDefaultTravel()
    }, [])

    const handleChangeText = (field: keyof AddableTravel, value: string) => {
        setTravel(prev => {
            if (!prev) return null;
            if (field in prev) {
                return { ...prev, [field]: value };
            }
            return prev;
        });
    };

    const openCustomPickerModal = (field: keyof Pick<DataItem, 'bus_initial_arrival' | 'bus_initial_departure' | 'bus_final_arrival'>) => {
        setEditingDateField(field);
        setShowCustomPicker(true);
    };

    // Date should be stored in the database as isoformat instead of timezone based for flexibility
    // With that said, parsing on code should always be timezone based
    const handleCustomDateConfirm = (selectedDate: Date) => {
        const isoSelectedDate = moment(selectedDate).tz('Asia/Jakarta').format()

        if (editingDateField) {
            setTravel(prev => prev ? ({ ...prev, [editingDateField]: isoSelectedDate }) : null);
        }
        closeCustomPicker();
    };

    const closeCustomPicker = () => {
        setShowCustomPicker(false);
        setEditingDateField(null);
    };

    const screenTitle = 'Add New Travel';

    if (!travel) {
        return (
            <LoadingScreen></LoadingScreen>
        );
    }

    const handleStopSelect = (stopId: number) => {
        if (editingStopField && travel) {
            setTravel(prev => prev ? ({
                ...prev,
                [editingStopField]: stopId
            }) : null);
        }
        closeStopModal();
    };

    const handleRouteSelect = (routeId: number) => {
        if (travel) {
            setTravel(prev => prev ? ({
                ...prev,
                route_id: routeId,
                type_id: routes.find(route => route.id === routeId)?.vehicle_type_id.id,
                first_stop_id: routes.find(route => route.id === routeId)?.first_stop_id.id,
                last_stop_id: routes.find(route => route.id === routeId)?.last_stop_id.id,
            }) : null);
        }
        closeRouteModal();
    };

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
            Alert.alert('Input Required', 'Please choose a route/direction/stops.');
            return
        }

        const newTravel = await addTravel(travel, true)

        let newLaps: AddableLap[] = []
        if (newTravel) {
            newLaps = laps.map(lap => {
                return { ...lap, travel_id: newTravel[0].id }
            })
        }

        addLaps(newLaps)
        setDefaultTravel()

        router.push('/(tabs)/mainMenu')
    };

    return (
        <CollapsibleHeaderPage largeHeaderText={screenTitle}>
            <View style={inputElementStyles.inputContainer}>
                <View style={inputElementStyles.inputGroup}>
                    <Text style={inputElementStyles.inputLabel}>Bus Initial Arrival:</Text>
                    <Pressable onPress={() => openCustomPickerModal('bus_initial_arrival')} style={inputStyles.pressableInput}>
                        <Text style={inputElementStyles.insideLabel}>{formatDateForDisplay(travel.bus_initial_arrival)}</Text>
                    </Pressable>
                </View>

                <View style={inputElementStyles.inputGroup}>
                    <Text style={inputElementStyles.inputLabel}>Bus Initial Departure:</Text>
                    <Pressable onPress={() => openCustomPickerModal('bus_initial_departure')} style={inputStyles.pressableInput}>
                        <Text style={inputElementStyles.insideLabel}>{formatDateForDisplay(travel.bus_initial_departure)}</Text>
                    </Pressable>
                </View>

                <View style={[inputElementStyles.inputGroup, inputElementStyles.inputGroupEnd]}>
                    <Text style={inputElementStyles.inputLabel}>Bus Final Arrival:</Text>
                    <Pressable onPress={() => openCustomPickerModal('bus_final_arrival')} style={inputStyles.pressableInput}>
                        <Text style={inputElementStyles.insideLabel}>{formatDateForDisplay(travel.bus_final_arrival)}</Text>
                    </Pressable>
                </View>

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
                    // incrementSeconds={10} // Optional: example of customizing increment
                    />
                )}

                <View style={inputElementStyles.inputGroup}>
                    <Text style={inputElementStyles.inputLabel}>Route:</Text>
                    <Pressable
                        style={inputStyles.pressableInput}
                        onPress={() => openRouteModal()}>
                        <Text style={inputElementStyles.insideLabel}>
                            {`${routes.find(route => route.id === travel.route_id)?.code || `Select`} | ${routes.find(route => route.id === travel.route_id)?.name || `Route...`}`}
                        </Text>
                    </Pressable>
                </View>

                <View style={[inputElementStyles.inputGroup, inputElementStyles.inputGroupEnd]}>
                    <Text style={inputElementStyles.inputLabel}>Type:</Text>
                    <TextInput
                        editable={false}
                        style={inputStyles.textInput}
                        value={vehicleTypes.find(type => type.id === travel.type_id)?.name}
                        placeholder="Vehicle type..."
                    />
                </View>

                <View style={inputElementStyles.inputGroup}>
                    <Text style={inputElementStyles.inputLabel}>Direction:</Text>
                    <Pressable
                        style={inputStyles.pressableInput}
                        onPress={() => openDirectionModal()}>
                        <Text style={inputElementStyles.insideLabel}>
                            {directions.find(direction => direction.id === travel.direction_id)?.name || 'Select Direction...'}
                        </Text>
                    </Pressable>
                </View>

                <View style={inputElementStyles.inputGroup}>
                    <Text style={inputElementStyles.inputLabel}>First Stop:</Text>
                    <Pressable
                        style={inputStyles.pressableInput}
                        onPress={() => openStopModal('first_stop_id')}>
                        <Text style={inputElementStyles.insideLabel}>{stops.find(stop => stop.id === travel.first_stop_id)?.name || 'Select First Stop...'}</Text>
                    </Pressable>
                </View>

                <View style={inputElementStyles.inputGroup}>
                    <Text style={inputElementStyles.inputLabel}>Last Stop:</Text>
                    <Pressable
                        style={inputStyles.pressableInput}
                        onPress={() => openStopModal('last_stop_id')}>
                        <Text style={inputElementStyles.insideLabel}>{stops.find(stop => stop.id === travel.last_stop_id)?.name || 'Select Last Stop...'}</Text>
                    </Pressable>
                </View>

                <View style={inputElementStyles.inputGroup}>
                    <Text style={inputElementStyles.inputLabel}>Vehicle Code:</Text>
                    <TextInput
                        style={inputStyles.textInput}
                        value={travel.vehicle_code || ''}
                        onChangeText={(text) => handleChangeText('vehicle_code', text)}
                        placeholder="Enter vehicle code"
                    />
                </View>

                <View style={inputElementStyles.inputGroup}>
                    <Text style={inputElementStyles.inputLabel}>Notes:</Text>
                    <TextInput
                        style={[inputStyles.textInput, inputStyles.multilineTextInput]}
                        value={travel.notes || ''}
                        onChangeText={(text) => handleChangeText('notes', text)}
                        multiline={true}
                        numberOfLines={4}
                        placeholder="Enter notes (optional)"
                    />
                </View>

                <View style={inputElementStyles.inputGroup}>
                    <Text style={inputElementStyles.inputLabel}>Laps:</Text>
                    <Pressable
                        style={inputStyles.pressableInput}
                        onPress={() => openLapsModal()}>
                        <Text style={inputElementStyles.insideLabel}>{`${laps.length} laps`}</Text>
                    </Pressable>
                </View>
            </View>

            <AddTravelLapsModal
                currentLaps={laps}
                isModalVisible={showLapsModal}
                onSelect={handleLapsSelect}
                onClose={closeLapsModal}
            />

            <EditTravelDirectionModal
                isModalVisible={showDirectionModal}
                searchQuery={directionSearchQuery}
                setSearchQuery={setDirectionSearchQuery}
                onSelect={handleDirectionSelect}
                onClose={closeDirectionModal}
            />

            <EditTravelRouteModal
                isModalVisible={showRouteModal}
                searchQuery={routeSearchQuery}
                setSearchQuery={setRouteSearchQuery}
                onSelect={handleRouteSelect}
                onClose={closeRouteModal}
            />

            <EditTravelStopModal
                isModalVisible={showStopModal}
                searchQuery={stopSearchQuery}
                setSearchQuery={setStopSearchQuery}
                onSelect={handleStopSelect}
                onClose={closeStopModal}
            />

            <View style={buttonStyles.buttonRow}>
                <Button title='Add Direction' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
            </View>
        </CollapsibleHeaderPage>
    );
};