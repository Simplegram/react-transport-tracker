import Button from '@/components/BaseButton'
import ModalButtonBlock from '@/components/button/ModalButton'
import Divider from '@/components/Divider'
import { TextInputBlock } from '@/components/input/TextInput'
import LoadingScreen from '@/components/LoadingScreen'
import CustomDateTimePicker from '@/components/modal/CustomDatetimePicker'
import { useTheme } from '@/context/ThemeContext'
import useModalHandler from '@/hooks/useModalHandler'
import { buttonStyles } from '@/src/styles/ButtonStyles'
import { modalStyles } from '@/src/styles/ModalStyles'
import { EditableLap, EditableLapModalProp } from '@/src/types/EditableTravels'
import { formatDateForDisplay } from '@/src/utils/utils'
import moment from 'moment-timezone'
import React, { useEffect, useState } from 'react'
import {
    Alert,
    Modal,
    Pressable,
    View
} from 'react-native'
import EditTravelStopModal from '../travelModal/EditTravelStopModal'

export default function EditLapModal({ stops, selectedLap, isModalVisible, onClose, onSelect }: EditableLapModalProp) {
    const { theme } = useTheme()

    const {
        showModal,
        searchQuery,
        setSearchQuery,
        openModal,
        closeModal
    } = useModalHandler()

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
        closeModal()
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
                        <ModalButtonBlock
                            label='Time:'
                            condition={lap.time}
                            value={formatDateForDisplay(lap.time)}
                            onPress={() => setShowDatetimePicker(true)}
                        />

                        <ModalButtonBlock
                            label='Stop:'
                            condition={lap.stop_id}
                            value={stops.find(item => item.id === lap.stop_id)?.name || 'Select Stop'}
                            onPress={openModal}
                        />

                        <TextInputBlock.Multiline
                            label='Note:'
                            value={lap.note}
                            placeholder='Notes (optional)'
                            onChangeText={(text) => setLap({ ...lap, note: text })}
                        />

                        <Divider />

                        <View style={buttonStyles[theme].buttonRow}>
                            <Button label='Cancel' onPress={onClose} style={buttonStyles[theme].cancelButton} textStyle={buttonStyles[theme].cancelButtonText}></Button>
                            <Button label='Edit Lap' onPress={handleOnSubmit} style={buttonStyles[theme].addButton} textStyle={buttonStyles[theme].addButtonText}></Button>
                        </View>
                    </View>

                    <EditTravelStopModal
                        stops={stops}
                        isModalVisible={showModal}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onSelect={handleStopSelect}
                        onClose={closeModal}
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