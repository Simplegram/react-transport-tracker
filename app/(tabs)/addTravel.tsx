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
import EditTravelStopModal from '@/components/modal/editTravelModal/EditTravelStopModal';
import useStopModal from '@/hooks/useStopModal';
import CustomDateTimePicker from '@/components/CustomDatetimePicker';
import useGetTravelData from '@/hooks/useGetTravelData';
import { AddableTravel } from '@/src/types/AddableTravels';
import EditTravelRouteModal from '@/components/modal/editTravelModal/EditTravelRouteModal';
import Button from '@/components/BaseButton';
import EditTravelDirectionModal from '@/components/modal/editTravelModal/EditTravelDirectionModal';
import useModifyTravelData from '@/hooks/useModifyTravelData';
import { router } from 'expo-router';

export default function AddTravel() {
    const { stops, routes, directions, vehicleTypes } = useGetTravelData();

    const { addTravel } = useModifyTravelData()

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

    // RENAME old showDatePickerModal and update logic
    const openCustomPickerModal = (field: keyof Pick<DataItem, 'bus_initial_arrival' | 'bus_initial_departure' | 'bus_final_arrival'>) => {
        setEditingDateField(field);
        setShowCustomPicker(true);
    };

    // ADD handler for custom picker confirmation
    const handleCustomDateConfirm = (selectedDate: Date) => {
        const convertedTZ = selectedDate.toLocaleString('en-US', {
            timeZone: 'Asia/Jakarta',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).replace(", ", "T").replaceAll("/", "-").slice(0, 19)
        
        if (editingDateField) {
            setTravel(prev => prev ? ({ ...prev, [editingDateField]: convertedTZ }) : null);
        }
        closeCustomPicker();
    };

    // ADD function to close custom picker
    const closeCustomPicker = () => {
        setShowCustomPicker(false);
        setEditingDateField(null);
    };

    const screenTitle = 'Add New Travel';

    const formatDateForDisplay = (isoString: string | undefined | null) => {
        if (!isoString) return 'Select Date/Time...';
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return 'Invalid Date';

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        } catch (error) {
            console.error("Error formatting date:", isoString, error);
            return 'Invalid Date';
        }
    };

    if (!travel) {
        return (
            <View style={styles.centeredContainer}>
                <Text>Initializing new travel form...</Text>
            </View>
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
            setTravel({...travel, direction_id: directionId})
        }

        closeDirectionModal()
    }

    const handleOnSubmit = () => {
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

        addTravel(travel)
        setDefaultTravel()

        router.push('/(tabs)/mainMenu')
    };

    return (
        <CollapsibleHeaderPage largeHeaderText={screenTitle}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Bus Initial Arrival:</Text>
                <Pressable onPress={() => openCustomPickerModal('bus_initial_arrival')} style={styles.pressableInput}>
                    <Text style={styles.insideLabel}>{formatDateForDisplay(travel.bus_initial_arrival)}</Text>
                </Pressable>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Bus Initial Departure:</Text>
                <Pressable onPress={() => openCustomPickerModal('bus_initial_departure')} style={styles.pressableInput}>
                    <Text style={styles.insideLabel}>{formatDateForDisplay(travel.bus_initial_departure)}</Text>
                </Pressable>
            </View>

            <View style={[styles.inputGroup, {paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ccc'}]}>
                <Text style={styles.label}>Bus Final Arrival:</Text>
                <Pressable onPress={() => openCustomPickerModal('bus_final_arrival')} style={styles.pressableInput}>
                    <Text style={styles.insideLabel}>{formatDateForDisplay(travel.bus_final_arrival)}</Text>
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

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Route:</Text>
                <Pressable
                    style={styles.pressableInput}
                    onPress={() => openRouteModal()}>
                    <Text style={styles.insideLabel}>
                        {`${routes.find(route => route.id === travel.route_id)?.code || `Select`} | ${routes.find(route => route.id === travel.route_id)?.name || `Route...`}`}
                    </Text>
                </Pressable>
            </View>

            <View style={[styles.inputGroup, {paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ccc'}]}>
                <Text style={styles.label}>Type:</Text>
                <TextInput
                    editable={false}
                    style={styles.input}
                    value={vehicleTypes.find(type => type.id === travel.type_id)?.name}
                    placeholder="Vehicle type..."
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Direction:</Text>
                <Pressable
                    style={styles.pressableInput}
                    onPress={() => openDirectionModal()}>
                    <Text style={styles.insideLabel}>
                        {directions.find(direction => direction.id === travel.direction_id)?.name || 'Select Direction...'}
                    </Text>
                </Pressable>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>First Stop:</Text>
                <Pressable
                    style={styles.pressableInput}
                    onPress={() => openStopModal('first_stop_id')}>
                    <Text style={styles.insideLabel}>{stops.find(stop => stop.id === travel.first_stop_id)?.name || 'Select First Stop...'}</Text>
                </Pressable>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Stop:</Text>
                <Pressable
                    style={styles.pressableInput}
                    onPress={() => openStopModal('last_stop_id')}>
                    <Text style={styles.insideLabel}>{stops.find(stop => stop.id === travel.last_stop_id)?.name || 'Select Last Stop...'}</Text>
                </Pressable>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Vehicle Code:</Text>
                <TextInput
                    style={styles.input}
                    value={travel.vehicle_code || ''}
                    onChangeText={(text) => handleChangeText('vehicle_code', text)}
                    placeholder="Enter vehicle code"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes:</Text>
                <TextInput
                    style={[styles.input, styles.multilineInput]}
                    value={travel.notes || ''}
                    onChangeText={(text) => handleChangeText('notes', text)}
                    multiline={true}
                    numberOfLines={4}
                    placeholder="Enter notes (optional)"
                />
            </View>

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

const styles = StyleSheet.create({
    container: { // This style was defined but not used, can be kept or removed
        flex: 1,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
    },
    insideLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    input: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: Platform.OS === 'ios' ? 12 : 10,
        minHeight: Platform.OS === 'ios' ? 48 : 44,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    multilineInput: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    pressableInput: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: Platform.OS === 'ios' ? 48 : 44,
        backgroundColor: '#fff',
    },
    picker: {
        backgroundColor: Platform.OS === 'ios' ? '#fff' : '#E0E0E0',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: Platform.OS === 'ios' ? 5 : 0,
        minHeight: Platform.OS === 'ios' ? 48 : 44,
        justifyContent: 'center',
    },
});

const buttonStyles = StyleSheet.create({
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        gap: 10,
    },
    addButton: {
        backgroundColor: '#1E88E5',
        paddingVertical: 12,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        borderWidth: 1,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButton: {
        paddingVertical: 12,
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        borderWidth: 1,
    },
    cancelButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
})