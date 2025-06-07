import Button from '@/components/BaseButton'
import { ModalButton } from '@/components/button/ModalButton'
import Divider from '@/components/Divider'
import InputGroup from '@/components/input/Input'
import { TextInputBlock } from '@/components/input/TextInput'
import MapDisplay from '@/components/MapDisplay'
import CustomDateTimePicker from '@/components/modal/CustomDatetimePicker'
import { useTheme } from '@/context/ThemeContext'
import useLocation from '@/hooks/useLocation'
import useModalHandler from '@/hooks/useModalHandler'
import { buttonStyles } from '@/src/styles/ButtonStyles'
import { inputElementStyles } from '@/src/styles/InputStyles'
import { modalStyles } from '@/src/styles/ModalStyles'
import { AddableLap, AddableLapModalProp } from '@/src/types/AddableTravels'
import { formatDateForDisplay, formatLapTimeDisplay } from '@/src/utils/utils'
import * as Crypto from 'expo-crypto'
import { useFocusEffect } from 'expo-router'
import moment from 'moment-timezone'
import React, { useRef, useState } from 'react'
import {
    Alert,
    Modal,
    Pressable,
    View
} from 'react-native'
import EditTravelStopModal from '../travelModal/EditTravelStopModal'

export default function AddLapModal({ stops, isModalVisible, onClose, onSelect }: AddableLapModalProp) {
    const { theme } = useTheme()

    const {
        showModal,
        searchQuery,
        setSearchQuery,
        openModal,
        closeModal
    } = useModalHandler()

    const { location, refetchLocation } = useLocation()

    const mapRef = useRef(null)

    const [lap, setLap] = useState<AddableLap>({ id: '', time: undefined, lat: undefined, lon: undefined, stop_id: undefined, note: undefined })

    const [showDatetimePicker, setShowDatetimePicker] = useState(false)

    const [centerCoordinate, setCenterCoordinate] = useState<number[]>([0, 0])

    useFocusEffect(
        React.useCallback(() => {
            let lon: number = 0
            let lat: number = 0
            if (location) {
                lon = location.coords.longitude
                lat = location.coords.latitude
            }

            setLap({ ...lap, lon: lon, lat: lat })
            setCenterCoordinate([lon, lat])
        }, [location])
    )

    useFocusEffect(
        React.useCallback(() => {
            refetchLocation()

            const currentTime = new Date().toISOString()
            const formattedTime = formatLapTimeDisplay(currentTime)

            setLap({ ...lap, id: Crypto.randomUUID(), time: formattedTime, lon: undefined, lat: undefined, stop_id: undefined, note: undefined })

            return () => {
                setLap({ ...lap, id: Crypto.randomUUID(), time: formattedTime, lon: undefined, lat: undefined, stop_id: undefined, note: undefined })
            }
        }, [isModalVisible])
    )

    const handleCustomDateConfirm = (selectedDate: Date) => {
        const isoSelectedDate = moment(selectedDate).tz('Asia/Jakarta').format()

        setLap({ ...lap, time: isoSelectedDate })

        setShowDatetimePicker(false)
    }

    const handleStopSelect = (stopId: number) => {
        setLap({ ...lap, stop_id: stopId })

        const stop = stops.find(stop => stop.id === stopId)
        if (stop && stop.lat && stop.lon) {
            setLap({ ...lap, lon: stop.lon, lat: stop.lat, stop_id: stopId })
            setCenterCoordinate([stop.lon, stop.lat])
        }

        closeModal()
    }

    const handleOnSubmit = () => {
        if (!lap.time) {
            Alert.alert('Input Required', 'Please select time')
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
            <Pressable style={modalStyles[theme].modalBackdrop}>
                {!stops ? (
                    <InputGroup.LoadingLabel />
                ) : (
                    <>
                        <View style={[modalStyles[theme].modalContainer, modalStyles[theme].lapModalContainer]}>
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
                                onPress={() => openModal()}
                            />

                            <View style={[inputElementStyles[theme].inputGroup, { height: 160 }]}>
                                <MapDisplay
                                    mapRef={mapRef}
                                    zoomLevel={15}
                                    centerCoordinate={centerCoordinate}
                                    draggable={false}
                                    getCurrentCoordinate={refetchLocation}
                                />
                            </View>

                            <TextInputBlock.Multiline
                                label='Note:'
                                value={lap.note}
                                placeholder='Notes (optional)'
                                onChangeText={(text) => setLap({ ...lap, note: text })}
                            />

                            <Divider />

                            <View style={buttonStyles[theme].buttonRow}>
                                <Button.Dismiss label='Cancel' onPress={onClose} />
                                <Button.Add label='Add Lap' onPress={handleOnSubmit} />
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
                    </>
                )}
            </Pressable>
        </Modal>
    )
}