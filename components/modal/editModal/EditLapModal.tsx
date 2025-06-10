import Button from '@/components/button/BaseButton'
import { ModalButton } from '@/components/button/ModalButton'
import Divider from '@/components/Divider'
import { TextInputBlock } from '@/components/input/TextInput'
import LoadingScreen from '@/components/LoadingScreen'
import CustomDateTimePicker from '@/components/modal/CustomDatetimePicker'
import ModalTemplate from '@/components/ModalTemplate'
import { useTheme } from '@/context/ThemeContext'
import useModalHandler from '@/hooks/useModalHandler'
import { EditableLap, EditableLapModalProp } from '@/src/types/EditableTravels'
import { formatDateForDisplay } from '@/src/utils/utils'
import moment from 'moment-timezone'
import React, { useEffect, useState } from 'react'
import {
    Alert
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
        <ModalTemplate.Bottom
            visible={isModalVisible}
            onRequestClose={onClose}
        >
            {!lap ? (
                <LoadingScreen></LoadingScreen>
            ) : (
                <>
                    <ModalTemplate.BottomContainer style={{ maxHeight: 600 }}>
                        <ModalButton.Block
                            label='Time:'
                            condition={lap.time}
                            value={formatDateForDisplay(lap.time)}
                            onPress={() => setShowDatetimePicker(true)}
                        />

                        <ModalButton.Block
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
                            onClear={() => setLap({ ...lap, note: '' })}
                        />

                        <Divider />

                        <Button.Row>
                            <Button.Dismiss label='Cancel' onPress={onClose} />
                            <Button.Add label='Edit Lap' onPress={handleOnSubmit} />
                        </Button.Row>
                    </ModalTemplate.BottomContainer>

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
                </>
            )}
        </ModalTemplate.Bottom>
    )
}