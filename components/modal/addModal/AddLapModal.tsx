import Button from '@/components/BaseButton';
import CustomDateTimePicker from '@/components/CustomDatetimePicker';
import { AddableLap, AddableLapModalProp } from '@/src/types/AddableTravels';
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    Modal,
} from 'react-native';
import moment from 'moment-timezone'
import { formatDateForDisplay } from '@/src/utils/utils';
import useGetTravelData from '@/hooks/useGetTravelData';
import useStopModal from '@/hooks/useStopModal';
import EditTravelStopModal from '../travelModal/EditTravelStopModal';
import { modalStyles } from '@/src/styles/ModalStyles';
import { buttonStyles } from '@/src/styles/ButtonStyles';
import { inputElementStyles, inputStyles } from '@/src/styles/InputStyles';

export default function AddLapModal({ isModalVisible, onClose, onSelect }: AddableLapModalProp) {
    const { stops } = useGetTravelData()

    const {
        showStopModal,
        stopSearchQuery,
        setStopSearchQuery,
        openStopModal,
        closeStopModal
    } = useStopModal();

    const [lap, setLap] = useState<AddableLap>({ time: undefined, stop_id: null, note: null })

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
        onSelect(lap);
    };

    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={modalStyles.modalBackdrop} onPress={onClose}>
                <View style={[modalStyles.modalContainer, modalStyles.lapModalContainer]}>
                    <View style={inputElementStyles.inputGroup}>
                        <Text style={inputElementStyles.inputLabel}>Time:</Text>
                        <Pressable onPress={() => setShowDatetimePicker(true)} style={inputStyles.pressableInput}>
                            <Text style={inputElementStyles.inputLabel}>{formatDateForDisplay(lap.time)}</Text>
                        </Pressable>
                    </View>

                    <View style={inputElementStyles.inputGroup}>
                        <Text style={inputElementStyles.inputLabel}>Stop:</Text>
                        <Pressable
                            style={inputStyles.pressableInput}
                            onPress={() => openStopModal('last_stop_id')}>
                            <Text style={[inputElementStyles.inputLabel, { marginBottom: 0 }]}>
                                {stops.find(item => item.id === lap.stop_id)?.name || 'Select Stop'}
                            </Text>
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

                    <View style={[inputElementStyles.inputGroup, inputElementStyles.inputGroupEnd]}>
                        <Text style={inputElementStyles.inputLabel}>Note:</Text>
                        <TextInput
                            placeholder="Optional notes"
                            value={lap.note || ''}
                            onChangeText={text => setLap({ ...lap, note: text })}
                            keyboardType="default"
                            returnKeyType="done"
                            multiline={true}
                            numberOfLines={3}
                            style={[inputStyles.textInput, inputStyles.multilineTextInput, inputElementStyles.inputLabel]}
                        />
                    </View>

                    <View style={buttonStyles.buttonRow}>
                        <Button title='Cancel' color='#E0E0E0' onPress={onClose} style={buttonStyles.cancelButton} textStyle={buttonStyles.cancelButtonText}></Button>
                        <Button title='Add Direction' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
                    </View>
                </View>

                <EditTravelStopModal
                    isModalVisible={showStopModal}
                    searchQuery={stopSearchQuery}
                    setSearchQuery={setStopSearchQuery}
                    onSelect={handleStopSelect}
                    onClose={closeStopModal}
                />
            </Pressable>
        </Modal>
    );
};