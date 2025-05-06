import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Platform,
    Pressable,
    Modal, // Import Modal
    FlatList, // Import FlatList for efficient list rendering
    TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { TravelContext, useTravelContext } from '@/context/PageContext';
import { DataItem, Stop } from '@/src/types/Travels'; // Assuming Stop type exists
import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage';
import useTravels from '@/hooks/useTravels';

// Mock data for pickers (needed to select options)
// Using mock data for Directions and Types as before.
// Stops will come from useStops.
const mockDirections = [
    { id: 1, name: "Pergi" },
    { id: 2, name: "Pulang" },
];

const EditTravelItemScreen = () => {
    const { selectedItem } = useTravelContext();
    const { stops, vehicleTypes } = useTravels();

    // Local state to hold editable values
    const [editableItem, setEditableItem] = useState<DataItem | null>(null);

    // State for Date Pickers
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [editingDateField, setEditingDateField] = useState<string | null>(null); // 'bus_initial_arrival', 'bus_final_arrival', 'bus_initial_departure'

    // State for Stop Picker Modal
    const [showStopModal, setShowStopModal] = useState(false);
    const [editingStopField, setEditingStopField] = useState<string | null>(null); // 'first_stop_id' or 'last_stop_id'
    const [stopSearchQuery, setStopSearchQuery] = useState('');

    // Initialize local state when context dataItem changes
    useEffect(() => {
        if (selectedItem) {
            // Create a deep copy to avoid modifying the context state directly
            // while editing. JSON methods are a quick way for JSON-serializable data.
            // Ensure nested objects like 'routes', 'types', 'first_stop_id', etc., are copied correctly.
            // If these are complex objects with non-JSON-serializable parts, a structuredClone or manual deep copy is better.
            // Assuming they are simple objects with id/name and maybe other primitives:
             try {
                 setEditableItem(JSON.parse(JSON.stringify(selectedItem)));
             } catch (e) {
                 console.error("Failed to deep copy selectedItem:", e);
                 // Fallback or handle error
                 setEditableItem(selectedItem); // Or a simple shallow copy depending on needs
             }

        } else {
            setEditableItem(null);
            console.warn("EditTravelItemScreen opened with no selected item in context.");
        }
        // Reset modal states when item changes
        setShowStopModal(false);
        setEditingStopField(null);
        setStopSearchQuery('');

    }, [selectedItem]);

    // Handle text input changes
    const handleChangeText = (field, value) => {
        // Handle nested updates for 'routes.name'
        if (field === 'route') {
            setEditableItem(prev => ({
                ...prev,
                routes: { ...prev?.routes, name: value }
            }));
        } else {
            setEditableItem(prev => ({ ...prev, [field]: value }));
        }
    };

    // Handle date changes from DateTimePicker
    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || new Date();

        // On Android, 'set' is the confirmation button. On iOS, the picker is often in a modal
        // and the value changes live. We typically hide the picker after 'set' on Android
        // or when the modal is dismissed on iOS (which requires separate handling, e.g., a 'Done' button
        // or listening to the modal dismissal). The current setup with two pickers (date/time)
        // shown simultaneously works better with iOS modal style. For Android 'default',
        // you'd typically show date, then time sequentially.
        // Let's hide the picker after selection for both platforms for simplicity here,
        // acknowledging Android default mode sequential flow might be needed for better UX.

        if (Platform.OS === 'android') {
             setShowDatePicker(false);
        }

        if (event.type === 'set') { // 'set' on Android when button is pressed, event type is different on iOS
            if (editingDateField) {
                 // Store as ISO string, backend likely expects this format
                setEditableItem(prev => ({ ...prev, [editingDateField]: currentDate.toISOString() }));
            }
        } else {
            // This handles changes on iOS where value changes without an explicit 'set' type event,
            // and also dismissals on Android if the backdrop is tapped (though event.type might be 'dismiss').
            // For simplicity, we'll update state on any change event that isn't 'set' but still hide.
             if (Platform.OS === 'ios') {
                 // On iOS, the date/time updates continuously. We might update the state live
                 // or wait for a 'Done' button if in a custom modal. For now, update live.
                  if (editingDateField) {
                      setEditableItem(prev => ({ ...prev, [editingDateField]: currentDate.toISOString() }));
                  }
             } else {
                // This case on Android often means dismissal (event.type === 'dismissed').
                // If event.type is 'set', it's handled above.
             }
        }

        // Only clear editingDateField if hiding the picker
        if (Platform.OS === 'android' && event.type === 'set') {
             setEditingDateField(null);
        }
         if (Platform.OS === 'ios' && !showDatePicker) { // If on iOS and we're closing the picker somehow (less common with default modal)
             setEditingDateField(null);
         }
         // Note: For robust iOS handling, consider wrapping DateTimePicker in your own Modal
         // with Done/Cancel buttons, controlling state updates and visibility there.
    };

    // Show the Date Picker
    const showDatePickerModal = (field) => {
        setEditingDateField(field);
        setShowDatePicker(true);
    };

    // --- Stop Picker Modal Logic ---

    // Show the Stop Picker Modal
    const openStopModal = (field) => {
        setEditingStopField(field);
        setStopSearchQuery(''); // Clear search query on opening
        setShowStopModal(true);
    };

    // Handle selection from the Stop Picker Modal
    const handleStopSelect = (selectedStop: Stop) => {
        if (editingStopField) {
            setEditableItem(prev => ({
                ...prev,
                [editingStopField]: selectedStop // Store the full stop object { id, name }
            }));
        }
        setShowStopModal(false);
        setEditingStopField(null);
        setStopSearchQuery('');
    };

    // Filter stops based on search query (use useMemo for performance)
    const filteredStops = useMemo(() => {
        if (!stops) return [];
        const query = stopSearchQuery.toLowerCase();
        return stops.filter(stop =>
            stop.name.toLowerCase().includes(query)
        );
    }, [stops, stopSearchQuery]);


    // --- Render Logic ---

    // Show loading or message if data isn't loaded yet
    if (!editableItem) {
        return (
            <View style={styles.centeredContainer}>
                <Text>Loading travel item...</Text>
            </View>
        );
    }


    // Helper to format date for display
    const formatDateForDisplay = (isoString: string | undefined | null) => {
        if (!isoString) return 'Select Date/Time';
        try {
            // Using native Date object parsing and formatting
            const date = new Date(isoString);
             if (isNaN(date.getTime())) {
                 return 'Invalid Date';
             }
            // Basic formatting: YYYY-MM-DD HH:MM
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
        <CollapsibleHeaderPage largeHeaderText='Edit Travel Item'>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Bus Initial Arrival:</Text>
                <Pressable onPress={() => showDatePickerModal('bus_initial_arrival')} style={styles.pressableInput}>
                    <Text>{formatDateForDisplay(editableItem.bus_initial_arrival)}</Text>
                </Pressable>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Bus Initial Departure:</Text>
                <Pressable onPress={() => showDatePickerModal('bus_initial_departure')} style={styles.pressableInput}>
                    <Text>{formatDateForDisplay(editableItem.bus_initial_departure)}</Text>
                </Pressable>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Bus Final Arrival:</Text>
                <Pressable onPress={() => showDatePickerModal('bus_final_arrival')} style={styles.pressableInput}>
                    <Text>{formatDateForDisplay(editableItem.bus_final_arrival)}</Text>
                </Pressable>
            </View>

            {showDatePicker && editingDateField && (
                <DateTimePicker
                    testID="dateTimePicker"
                    // Ensure value is a valid Date object. Use current date if the field value is null/invalid.
                    value={new Date(editableItem[editingDateField] ? editableItem[editingDateField] : Date.now())}
                    mode="datetime" // Use 'datetime' for one picker handling both
                    // Or use two pickers if 'datetime' mode isn't available or preferred
                    // mode={editingDateField.includes('date') ? 'date' : 'time'} <-- if using separate fields/modes
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                />
                // Note: For a better Android UX, you might want to show date picker,
                // then chain to show the time picker after date selection.
                // The current setup with one 'datetime' picker is simpler if supported,
                // or two separate 'date' and 'time' pickers shown simultaneously (less ideal on Android default display).
            )}

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Route:</Text>
                <TextInput
                    style={styles.input}
                    // Access nested name, provide fallback
                    value={editableItem.routes?.name || ''}
                    onChangeText={(text) => handleChangeText('route', text)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Type:</Text>
                <Picker
                    selectedValue={editableItem.types?.id} // Access nested id, handle potentially null types
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) => {
                        const selectedType = vehicleTypes.find(type => type.id === itemValue);
                        if (selectedType) {
                            setEditableItem(prev => ({ ...prev, types: selectedType }));
                        }
                    }}>
                    {vehicleTypes.map((type) => (
                        <Picker.Item key={type.id} label={type.name} value={type.id} />
                    ))}
                </Picker>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Vehicle Code:</Text>
                <TextInput
                    style={styles.input}
                    value={editableItem.vehicle_code || ''}
                    onChangeText={(text) => handleChangeText('vehicle_code', text)}
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
                <Text style={styles.label}>Direction:</Text>
                    {/* Standard Picker for Direction */}
                <Picker
                    selectedValue={editableItem.directions?.id} // Access nested id
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) => {
                        const selectedDirection = mockDirections.find(dir => dir.id === itemValue);
                        if (selectedDirection) {
                            setEditableItem(prev => ({ ...prev, directions: selectedDirection }));
                        }
                    }}>
                        {/* <Picker.Item label="Select Direction" value={null} /> */}
                    {mockDirections.map((dir) => (
                        <Picker.Item key={dir.id} label={dir.name} value={dir.id} />
                    ))}
                </Picker>
            </View>


            <View style={styles.inputGroup}>
                <Text style={styles.label}>Notes:</Text>
                <TextInput
                    style={[styles.input, styles.multilineInput]}
                    value={editableItem.notes || ''}
                    onChangeText={(text) => handleChangeText('notes', text)}
                    multiline={true} // Explicitly set multiline
                    numberOfLines={4} // Suggests a height for multiline
                />
            </View>

            <Modal
                visible={showStopModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowStopModal(false)}
            >
                <Pressable style={styles.modalBackdrop} onPress={() => setShowStopModal(false)}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select a Stop</Text>
                        </View>
                        <TextInput
                            style={styles.modalSearchInput}
                            placeholder="Search stops..."
                            value={stopSearchQuery}
                            onChangeText={setStopSearchQuery}
                            autoFocus={true}
                        />
                        {filteredStops.length === 0 ? (
                            <View style={styles.emptyList}>
                                <Text>No stops found.</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={filteredStops}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.stopListItem}
                                        onPress={() => handleStopSelect(item)}>
                                        <Text>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        )}

                        {/* Optional: Add a close button at the bottom */}
                        <Button title="Close" onPress={() => setShowStopModal(false)} />
                    </View>
                </Pressable>
            </Modal>
        </CollapsibleHeaderPage>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
     centeredContainer: { // For loading/error states
         flex: 1,
         justifyContent: 'center',
         alignItems: 'center',
     },
    title: { // Not used in the current layout with CollapsibleHeaderPage
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputGroup: { // Wrapper View style
        marginBottom: 15, // Add space between groups
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5, // Space between label and input
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    multilineInput: {
        minHeight: 80, // Give multiline inputs a default height
        textAlignVertical: 'top', // Align text to the top on Android
    },
    pressableInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        justifyContent: 'center', // Vertically align text
        minHeight: 44, // Standard touch target size
        backgroundColor: '#fff',
    },
    picker: {
        borderWidth: 1, // Note: styling Pickers is complex and platform-dependent
        borderColor: '#ccc', // This border might not show on all platforms/styles
        borderRadius: 5, // This radius might not show on all platforms/styles
        backgroundColor: '#fff',
        // minHeight: 44, // Ensure adequate height - can be controlled by the wrapping View
    },
    // --- Modal Styles ---
    modalContainer: {
        height: 400,
        marginTop: 'auto',
        padding: 20,
        borderTopLeftRadius: 10, // Optional: add rounded corners to the top
        borderTopRightRadius: 10,
        backgroundColor: '#fff',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
        justifyContent: 'flex-end', // Push the modal content to the bottom
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalCloseButton: {
        padding: 10,
    },
    modalCloseButtonText: {
        fontSize: 18,
        color: '#666',
    },
    modalSearchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    stopListItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    emptyList: {
        padding: 20,
        alignItems: 'center',
    }
});

export default EditTravelItemScreen;