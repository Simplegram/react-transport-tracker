import Button from '@/components/BaseButton';
import CustomDateTimePicker from '@/components/CustomDatetimePicker';
import { AddableLap } from '@/src/types/AddableTravels';
import { BaseModalContentProps } from '@/src/types/ModalContentProps';
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
} from 'react-native';
import moment from 'moment-timezone'
import { formatDateForDisplay } from '@/src/utils/utils';
import useGetTravelData from '@/hooks/useGetTravelData';
import useStopModal from '@/hooks/useStopModal';
import EditTravelStopModal from '../editTravelModal/EditTravelStopModal';

export default function AddLapModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { stops } = useGetTravelData()

    const {
        showStopModal,
        stopSearchQuery,
        setStopSearchQuery,
        openStopModal,
        closeStopModal
    } = useStopModal();

    const [lap, setLap] = useState<AddableLap>({ travel_id: undefined, time: undefined, stop_id: null, notes: null })

    const [showDatetimePicker, setShowDatetimePicker] = useState(false);

    const handleCustomDateConfirm = (selectedDate: Date) => {
        const isoSelectedDate = moment(selectedDate).tz('Asia/Jakarta').format()

        setLap({ ...lap, time: isoSelectedDate })

        setShowDatetimePicker(false)
    };

    const handleStopSelect = (stopId: number) => {
        setLap({ ...lap, stop_id: stopId })
        closeStopModal();
    };

    const handleOnSubmit = () => {
        onSubmit(lap);
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <View style={styles.inputGroup}>
                    <View style={[styles.inputGroup, { paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ccc' }]}>
                        <Text style={styles.label}>Bus Final Arrival:</Text>
                        <Pressable onPress={() => setShowDatetimePicker(true)} style={styles.pressableInput}>
                            <Text style={styles.insideLabel}>{formatDateForDisplay(lap.time)}</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Stop:</Text>
                    <Pressable
                        style={styles.pressableInput}
                        onPress={() => openStopModal('last_stop_id')}>
                        <Text style={[styles.label, { marginBottom: 0 }]}>{stops.find(item => item.id === lap.stop_id)?.name || 'Select Stop'}</Text>
                    </Pressable>
                </View>

                {showDatetimePicker && (
                    <CustomDateTimePicker
                        visible={showDatetimePicker}
                        initialDateTime={new Date()}
                        onClose={() => setShowDatetimePicker(false)}
                        onConfirm={handleCustomDateConfirm}
                    />
                )}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Note:</Text>
                    <TextInput
                        placeholder="Optional notes"
                        value={lap.notes || ''}
                        onChangeText={text => setLap({ ...lap, notes: text })}
                        keyboardType="default"
                        returnKeyType="done"
                        multiline={true}
                        numberOfLines={3}
                        style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                    />
                </View>

                <EditTravelStopModal
                    isModalVisible={showStopModal}
                    searchQuery={stopSearchQuery}
                    setSearchQuery={setStopSearchQuery}
                    onSelect={handleStopSelect}
                    onClose={closeStopModal}
                />
            </View>

            <View style={buttonStyles.buttonRow}>
                <Button title='Cancel' color='#E0E0E0' onPress={onCancel} style={buttonStyles.cancelButton} textStyle={buttonStyles.cancelButtonText}></Button>
                <Button title='Add Direction' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        flexShrink: 0,
    },
    inputContainer: {
        gap: 10,
        flexDirection: 'column',
        paddingVertical: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#f9f9f9',
    },
    saveButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    inputGroup: {
        gap: 5,
    },
    insideLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    pressableInput: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 44,
        backgroundColor: '#fff',
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
    },
    cancelButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '600',
    },
})