import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Platform,
    Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTravelContext } from '@/context/PageContext';
import { DataItem, Stop } from '@/src/types/Travels';
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage';
import EditTravelStopModal from '@/components/modal/editModal/EditTravelStopModal';
import useStopModal from '@/hooks/useStopModal';
import CustomDateTimePicker from '@/components/CustomDatetimePicker';
import useGetTravelData from '@/hooks/useGetTravelData';

const mockDirections = [
    { id: 1, name: "Pergi" },
    { id: 2, name: "Pulang" },
];

const getDefaultDataItem = (
    availableVehicleTypes: { id: any; name: string }[],
    availableDirections: { id: any; name: string }[]
): DataItem => {
    const defaultType = availableVehicleTypes.length > 0 ? availableVehicleTypes[0] : null;
    const defaultDirection = availableDirections.length > 0 ? availableDirections[0] : null;

    return {
        id: undefined,
        bus_initial_arrival: null,
        bus_initial_departure: null,
        bus_final_arrival: null,
        routes: { id: null, name: '' },
        types: defaultType,
        directions: defaultDirection,
        vehicle_code: '',
        first_stop_id: null,
        last_stop_id: null,
        notes: '',
    };
};


const EditTravelItemScreen = () => {
    const { selectedItem } = useTravelContext();
    const { stops, vehicleTypes } = useGetTravelData();

    const isEditMode = useMemo(() => !!selectedItem, [selectedItem]);

    const [editableItem, setEditableItem] = useState<DataItem | null>(null);
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


    useEffect(() => {
        if (isEditMode && selectedItem) {
            try {
                const selectedItemJSON = JSON.parse(JSON.stringify(selectedItem));
                setEditableItem(selectedItemJSON);
            } catch (e) {
                console.error("Failed to deep copy selectedItem:", e);
                setEditableItem(selectedItem);
            }
        } else if (!isEditMode) {
            setEditableItem(getDefaultDataItem(vehicleTypes, mockDirections));
        }

        if (showStopModal) {
            closeStopModal();
        }

        if (showCustomPicker) {
            closeCustomPicker();
        }
    }, [selectedItem, isEditMode, vehicleTypes]);

    const handleChangeText = (field: keyof DataItem | 'route', value: string) => {
        setEditableItem(prev => {
            if (!prev) return null;
            if (field === 'route') {
                return {
                    ...prev,
                    routes: { ...(prev.routes || { id: null }), name: value }
                };
            }
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

    const handleCustomDateConfirm = (selectedDate: Date) => {
        if (editingDateField) {
            setEditableItem(prev => prev ? ({ ...prev, [editingDateField]: selectedDate.toISOString() }) : null);
        }
        closeCustomPicker();
    };

    const closeCustomPicker = () => {
        setShowCustomPicker(false);
        setEditingDateField(null);
    };

    const handleStopSelect = (selectedStop: Stop) => {
        if (editingStopField && editableItem) {
            setEditableItem(prev => prev ? ({
                ...prev,
                [editingStopField]: selectedStop
            }) : null);
        }
        closeStopModal();
    };

    const screenTitle = isEditMode ? 'Edit Travel Item' : 'Add New Travel';

    if (!editableItem) {
        return (
            <View style={styles.centeredContainer}>
                <Text>{isEditMode ? "Loading travel item..." : "Initializing new travel form..."}</Text>
            </View>
        );
    }

    const formatDateForDisplay = (isoString: string | undefined | null) => {
        if (!isoString) return 'Select Date/Time';
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return 'Invalid Date';

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        } catch (error) {
            console.error("Error formatting date:", isoString, error);
            return 'Invalid Date';
        }
    };

    return (
        <CollapsibleHeaderPage largeHeaderText={screenTitle}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Bus Initial Arrival:</Text>
                <Pressable onPress={() => openCustomPickerModal('bus_initial_arrival')} style={styles.pressableInput}>
                    <Text>{formatDateForDisplay(editableItem.bus_initial_arrival)}</Text>
                </Pressable>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Bus Initial Departure:</Text>
                <Pressable onPress={() => openCustomPickerModal('bus_initial_departure')} style={styles.pressableInput}>
                    <Text>{formatDateForDisplay(editableItem.bus_initial_departure)}</Text>
                </Pressable>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Bus Final Arrival:</Text>
                <Pressable onPress={() => openCustomPickerModal('bus_final_arrival')} style={styles.pressableInput}>
                    <Text>{formatDateForDisplay(editableItem.bus_final_arrival)}</Text>
                </Pressable>
            </View>

            {showCustomPicker && editingDateField && (
                <CustomDateTimePicker
                    visible={showCustomPicker}
                    initialDateTime={
                        editableItem && editableItem[editingDateField]
                            ? new Date(editableItem[editingDateField] as string)
                            : new Date()
                    }
                    onClose={closeCustomPicker}
                    onConfirm={handleCustomDateConfirm}
                // incrementSeconds={10} // Optional: example of customizing increment
                />
            )}

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Route:</Text>
                <TextInput
                    style={styles.input}
                    value={editableItem.routes?.name || ''}
                    onChangeText={(text) => handleChangeText('route', text)}
                    placeholder="Enter route name"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Type:</Text>
                <Picker
                    enabled={!isEditMode}
                    selectedValue={editableItem.types?.id || null}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                        if (itemValue === null) {
                            setEditableItem(prev => prev ? ({ ...prev, types: null }) : null);
                        } else {
                            const selectedType = vehicleTypes.find(type => type.id === itemValue);
                            if (selectedType) {
                                setEditableItem(prev => prev ? ({ ...prev, types: selectedType }) : null);
                            }
                        }
                    }}>
                    <Picker.Item label="Select Type..." value={null} />
                    {vehicleTypes.map((type) => (
                        <Picker.Item key={type.id} label={type.name} value={type.id} />
                    ))}
                </Picker>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Direction:</Text>
                <Picker
                    selectedValue={editableItem.directions?.id || null}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                        if (itemValue === null) {
                            setEditableItem(prev => prev ? ({ ...prev, directions: null }) : null);
                        } else {
                            const selectedDirection = mockDirections.find(dir => dir.id === itemValue);
                            if (selectedDirection) {
                                setEditableItem(prev => prev ? ({ ...prev, directions: selectedDirection }) : null);
                            }
                        }
                    }}>
                    <Picker.Item label="Select Direction..." value={null} />
                    {mockDirections.map((dir) => (
                        <Picker.Item key={dir.id} label={dir.name} value={dir.id} />
                    ))}
                </Picker>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Vehicle Code:</Text>
                <TextInput
                    style={styles.input}
                    value={editableItem.vehicle_code || ''}
                    onChangeText={(text) => handleChangeText('vehicle_code', text)}
                    placeholder="Enter vehicle code"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>First Stop:</Text>
                <Pressable
                    style={styles.pressableInput}
                    onPress={() => openStopModal('first_stop_id')}>
                    <Text>{editableItem.first_stop_id?.name || 'Select First Stop'}</Text>
                </Pressable>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Stop:</Text>
                <Pressable
                    style={styles.pressableInput}
                    onPress={() => openStopModal('last_stop_id')}>
                    <Text>{editableItem.last_stop_id?.name || 'Select Last Stop'}</Text>
                </Pressable>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes:</Text>
                <TextInput
                    style={[styles.input, styles.multilineInput]}
                    value={editableItem.notes || ''}
                    onChangeText={(text) => handleChangeText('notes', text)}
                    multiline={true}
                    numberOfLines={4}
                    placeholder="Enter notes (optional)"
                />
            </View>

            <EditTravelStopModal
                isModalVisible={showStopModal}
                searchQuery={stopSearchQuery}
                setSearchQuery={setStopSearchQuery}
                onSelect={handleStopSelect}
                onClose={closeStopModal}
            />
        </CollapsibleHeaderPage>
    );
};

const styles = StyleSheet.create({
    container: {
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
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: Platform.OS === 'ios' ? 12 : 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    multilineInput: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    pressableInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 12,
        justifyContent: 'center',
        minHeight: Platform.OS === 'ios' ? 48 : 44,
        backgroundColor: '#fff',
    },
    picker: {
        backgroundColor: Platform.OS === 'ios' ? '#fff' : '#E0E0E0',
        borderWidth: Platform.OS === 'ios' ? 1 : 0,
        borderColor: Platform.OS === 'ios' ? '#ccc' : undefined,
        borderRadius: Platform.OS === 'ios' ? 5 : 0,
        minHeight: Platform.OS === 'ios' ? 48 : 44,
        justifyContent: 'center',
    },
});

export default EditTravelItemScreen;