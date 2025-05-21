import Button from '@/components/BaseButton';
import CustomDateTimePicker from '@/components/modal/CustomDatetimePicker';
import { colors } from '@/const/color';
import { useTheme } from '@/context/ThemeContext';
import useStopModal from '@/hooks/useStopModal';
import { buttonStyles } from '@/src/styles/ButtonStyles';
import { inputElementStyles, inputStyles } from '@/src/styles/InputStyles';
import { modalStyles } from '@/src/styles/ModalStyles';
import { AddableLap, AddableLapModalProp } from '@/src/types/AddableTravels';
import { formatDateForDisplay } from '@/src/utils/utils';
import moment from 'moment-timezone';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    Text,
    TextInput,
    View
} from 'react-native';
import EditTravelStopModal from '../travelModal/EditTravelStopModal';

export default function AddLapModal({ stops, isModalVisible, onClose, onSelect }: AddableLapModalProp) {
    const { theme } = useTheme()

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
        if (!lap.time) {
            Alert.alert('Input Required', 'Please select time');
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
            <Pressable style={modalStyles[theme].modalBackdrop} onPress={onClose}>
                {!stops ? (
                    <Text style={inputElementStyles[theme].inputLabel}>Loading...</Text>
                ) : (
                    <>
                        <View style={[modalStyles[theme].modalContainer, modalStyles[theme].lapModalContainer]}>
                            <View style={inputElementStyles[theme].inputGroup}>
                                <Text style={inputElementStyles[theme].inputLabel}>Time:</Text>
                                <Pressable onPress={() => setShowDatetimePicker(true)} style={inputStyles[theme].pressableInput}>
                                    <Text style={inputElementStyles[theme].insideLabel}>{formatDateForDisplay(lap.time)}</Text>
                                </Pressable>
                            </View>

                            <View style={inputElementStyles[theme].inputGroup}>
                                <Text style={inputElementStyles[theme].inputLabel}>Stop:</Text>
                                <Pressable
                                    style={inputStyles[theme].pressableInput}
                                    onPress={() => openStopModal('last_stop_id')}>
                                    <Text style={[inputElementStyles[theme].insideLabel, { marginBottom: 0 }]}>
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

                            <View style={[inputElementStyles[theme].inputGroup, inputElementStyles[theme].inputGroupEnd]}>
                                <Text style={inputElementStyles[theme].inputLabel}>Note:</Text>
                                <TextInput
                                    placeholder="Optional notes"
                                    placeholderTextColor={colors.text.placeholderGray}
                                    value={lap.note || ''}
                                    onChangeText={text => setLap({ ...lap, note: text })}
                                    keyboardType="default"
                                    returnKeyType="done"
                                    multiline={true}
                                    numberOfLines={3}
                                    style={[inputStyles[theme].textInput, inputStyles[theme].multilineTextInput, inputElementStyles[theme].insideLabel]}
                                />
                            </View>

                            <View style={buttonStyles[theme].buttonRow}>
                                <Button title='Cancel' onPress={onClose} style={buttonStyles[theme].cancelButton} textStyle={buttonStyles[theme].cancelButtonText}></Button>
                                <Button title='Add Lap' onPress={handleOnSubmit} style={buttonStyles[theme].addButton} textStyle={buttonStyles[theme].addButtonText}></Button>
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
                    </>
                )}
            </Pressable>
        </Modal>
    );
};