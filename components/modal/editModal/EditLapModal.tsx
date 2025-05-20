import Button from '@/components/BaseButton';
import CustomDateTimePicker from '@/components/CustomDatetimePicker';
import { AddableLap } from '@/src/types/AddableTravels';
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    Modal,
    Alert,
} from 'react-native';
import moment from 'moment-timezone'
import { formatDateForDisplay } from '@/src/utils/utils';
import useStopModal from '@/hooks/useStopModal';
import EditTravelStopModal from '../travelModal/EditTravelStopModal';
import { modalStyles } from '@/src/styles/ModalStyles';
import { EditableLap, EditableLapModalProp } from '@/src/types/EditableTravels';
import LoadingScreen from '@/components/LoadingScreen';
import { buttonStyles } from '@/src/styles/ButtonStyles';
import { inputElementStyles, inputStyles } from '@/src/styles/InputStyles';

export default function EditLapModal({ stops, selectedLap, isModalVisible, onClose, onSelect }: EditableLapModalProp) {
    const {
        showStopModal,
        stopSearchQuery,
        setStopSearchQuery,
        openStopModal,
        closeStopModal
    } = useStopModal();

    const [lap, setLap] = useState<EditableLap>()

    const [showDatetimePicker, setShowDatetimePicker] = useState(false);

    useEffect(() => {
        setLap(selectedLap)
    }, [selectedLap])

    const handleCustomDateConfirm = (selectedDate: Date) => {
        const isoSelectedDate = moment(selectedDate).tz('Asia/Jakarta').format()

        if (!lap) {
            Alert.alert(
                "Unexpected Error",
                `Lap is null which is not supposed to happen. Try again.\nSelected date is ${isoSelectedDate}`
            )
            return
        }

        if (!lap.time) {
            Alert.alert('Input Required', 'Please select time');
            return
        }

        setLap({ ...lap, time: isoSelectedDate })

        setShowDatetimePicker(false)
    };

    const handleStopSelect = (stopId: number) => {
        if (!lap) {
            Alert.alert(
                "Unexpected Error",
                "Lap is null which is not supposed to happen. Try again."
            )

            return
        }

        setLap({ ...lap, stop_id: stopId })
        closeStopModal();
    };

    const handleOnSubmit = () => {
        if (!lap) {
            Alert.alert(
                "Unexpected Error",
                "Lap is null which is not supposed to happen. Try again."
            )

            return
        }

        onSelect(lap);
    };

    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            {!lap ? (
                <LoadingScreen></LoadingScreen>
            ) : (
                <Pressable style={modalStyles.modalBackdrop} onPress={onClose}>
                    <View style={[modalStyles.modalContainer, modalStyles.lapModalContainer]}>
                        <View style={inputElementStyles['light'].inputGroup}>
                            <Text style={inputElementStyles['light'].insideLabel}>Time:</Text>
                            <Pressable onPress={() => setShowDatetimePicker(true)} style={inputStyles.pressableInput}>
                                <Text style={inputElementStyles['light'].inputLabel}>{formatDateForDisplay(lap.time)}</Text>
                            </Pressable>
                        </View>

                        <View style={inputElementStyles['light'].inputGroup}>
                            <Text style={inputElementStyles['light'].insideLabel}>Stop:</Text>
                            <Pressable
                                style={inputStyles.pressableInput}
                                onPress={() => openStopModal('last_stop_id')}>
                                <Text style={[inputElementStyles['light'].inputLabel, { marginBottom: 0 }]}>
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

                        <View style={[inputElementStyles['light'].inputGroup, inputElementStyles['light'].inputGroupEnd]}>
                            <Text style={inputElementStyles['light'].inputLabel}>Note:</Text>
                            <TextInput
                                placeholder="Optional notes"
                                value={lap.note || ''}
                                onChangeText={text => setLap({ ...lap, note: text })}
                                keyboardType="default"
                                returnKeyType="done"
                                multiline={true}
                                numberOfLines={3}
                                style={[inputStyles.textInput, inputStyles.multilineTextInput, inputElementStyles['light'].insideLabel]}
                            />
                        </View>

                        <View style={buttonStyles.buttonRow}>
                            <Button title='Cancel' onPress={onClose} style={buttonStyles.cancelButton} textStyle={buttonStyles.cancelButtonText}></Button>
                            <Button title='Edit Lap' onPress={handleOnSubmit} style={buttonStyles.addButton} textStyle={buttonStyles.addButtonText}></Button>
                        </View>
                    </View>


                    <EditTravelStopModal
                        stops={stops}
                        isModalVisible={showStopModal}
                        searchQuery={stopSearchQuery}
                        setSearchQuery={setStopSearchQuery}
                        onSelect={handleStopSelect}
                        onClose={closeStopModal}
                    />
                </Pressable>
            )}
        </Modal>
    );
};