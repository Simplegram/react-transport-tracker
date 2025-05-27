import Button from '@/components/BaseButton'
import Divider from '@/components/Divider'
import LoadingScreen from '@/components/LoadingScreen'
import CustomDateTimePicker from '@/components/modal/CustomDatetimePicker'
import { useTheme } from '@/context/ThemeContext'
import useStopModal from '@/hooks/useStopModal'
import { colors } from '@/src/const/color'
import { buttonStyles } from '@/src/styles/ButtonStyles'
import { inputElementStyles, inputStyles } from '@/src/styles/InputStyles'
import { modalStyles } from '@/src/styles/ModalStyles'
import { EditableLap, EditableLapModalProp } from '@/src/types/EditableTravels'
import { formatDateForDisplay } from '@/src/utils/utils'
import moment from 'moment-timezone'
import React, { useEffect, useState } from 'react'
import {
    Alert,
    Modal,
    Pressable,
    Text,
    TextInput,
    View
} from 'react-native'
import EditTravelStopModal from '../travelModal/EditTravelStopModal'

export default function EditLapModal({ stops, selectedLap, isModalVisible, onClose, onSelect }: EditableLapModalProp) {
    const { theme } = useTheme()

    const {
        showStopModal,
        stopSearchQuery,
        setStopSearchQuery,
        openStopModal,
        closeStopModal
    } = useStopModal()

    const [lap, setLap] = useState<EditableLap>()

    const [showDatetimePicker, setShowDatetimePicker] = useState(false)

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
            Alert.alert('Input Required', 'Please select time')
            return
        }

        setLap({ ...lap, time: isoSelectedDate })

        setShowDatetimePicker(false)
    }

    const handleStopSelect = (stopId: number) => {
        if (!lap) {
            Alert.alert(
                "Unexpected Error",
                "Lap is null which is not supposed to happen. Try again."
            )

            return
        }

        setLap({ ...lap, stop_id: stopId })
        closeStopModal()
    }

    const handleOnSubmit = () => {
        if (!lap) {
            Alert.alert(
                "Unexpected Error",
                "Lap is null which is not supposed to happen. Try again."
            )

            return
        }

        onSelect(lap)
    }

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
                <Pressable style={modalStyles[theme].modalBackdrop}>
                    <View style={[modalStyles[theme].modalContainer, modalStyles[theme].lapModalContainer]}>
                        <View style={inputElementStyles[theme].inputGroup}>
                            <Text style={inputElementStyles[theme].insideLabel}>Time:</Text>
                            <Pressable onPress={() => setShowDatetimePicker(true)} style={inputStyles[theme].pressableInput}>
                                <Text style={inputElementStyles[theme].inputLabel}>{formatDateForDisplay(lap.time)}</Text>
                            </Pressable>
                        </View>

                        <View style={inputElementStyles[theme].inputGroup}>
                            <Text style={inputElementStyles[theme].insideLabel}>Stop:</Text>
                            <Pressable
                                style={inputStyles[theme].pressableInput}
                                onPress={() => openStopModal('last_stop_id')}>
                                <Text style={[inputElementStyles[theme].inputLabel, { marginBottom: 0 }]}>
                                    {stops.find(item => item.id === lap.stop_id)?.name || 'Select Stop'}
                                </Text>
                            </Pressable>
                        </View>

                        <View style={inputElementStyles[theme].inputGroup}>
                            <Text style={inputElementStyles[theme].inputLabel}>Note:</Text>
                            <TextInput
                                placeholder="Optional notes"
                                placeholderTextColor={colors.placeholderGray}
                                value={lap.note || ''}
                                onChangeText={text => setLap({ ...lap, note: text })}
                                keyboardType="default"
                                returnKeyType="done"
                                multiline={true}
                                numberOfLines={3}
                                style={[inputStyles[theme].textInput, inputStyles[theme].multilineTextInput, inputElementStyles[theme].insideLabel]}
                            />
                        </View>

                        <Divider />

                        <View style={buttonStyles[theme].buttonRow}>
                            <Button title='Cancel' onPress={onClose} style={buttonStyles[theme].cancelButton} textStyle={buttonStyles[theme].cancelButtonText}></Button>
                            <Button title='Edit Lap' onPress={handleOnSubmit} style={buttonStyles[theme].addButton} textStyle={buttonStyles[theme].addButtonText}></Button>
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

                    {showDatetimePicker && (
                        <CustomDateTimePicker
                            visible={showDatetimePicker}
                            initialDateTime={new Date()}
                            onClose={() => setShowDatetimePicker(false)}
                            onConfirm={handleCustomDateConfirm}
                        />
                    )}
                </Pressable>
            )}
        </Modal>
    )
}