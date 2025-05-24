import Button from '@/components/BaseButton'
import Divider from '@/components/Divider'
import MapDisplay from '@/components/MapDisplay'
import CustomDateTimePicker from '@/components/modal/CustomDatetimePicker'
import { colors } from '@/const/color'
import { useTheme } from '@/context/ThemeContext'
import useLocation from '@/hooks/useLocation'
import useStopModal from '@/hooks/useStopModal'
import { buttonStyles } from '@/src/styles/ButtonStyles'
import { inputElementStyles, inputStyles } from '@/src/styles/InputStyles'
import { modalStyles } from '@/src/styles/ModalStyles'
import { AddableLap, AddableLapModalProp } from '@/src/types/AddableTravels'
import { formatDateForDisplay, formatLapTimeDisplay } from '@/src/utils/utils'
import { useFocusEffect } from '@react-navigation/native'
import moment from 'moment-timezone'
import React, { useEffect, useRef, useState } from 'react'
import {
    Alert,
    Modal,
    Pressable,
    Text,
    TextInput,
    View
} from 'react-native'
import EditTravelStopModal from '../travelModal/EditTravelStopModal'

export default function AddLapModal({ stops, isModalVisible, onClose, onSelect }: AddableLapModalProp) {
    const { theme } = useTheme()

    const {
        showStopModal,
        stopSearchQuery,
        setStopSearchQuery,
        openStopModal,
        closeStopModal
    } = useStopModal()

    const { location, refetchLocation } = useLocation()

    const mapRef = useRef(null)

    const [lap, setLap] = useState<AddableLap>({ time: undefined, lat: null, lon: null, stop_id: null, note: null })

    const [showDatetimePicker, setShowDatetimePicker] = useState(false)

    const [centerCoordinate, setCenterCoordinate] = useState<number[]>([0, 0])

    useEffect(() => {
        if (location) setCenterCoordinate([location.coords.longitude, location.coords.latitude])
    }, [location])

    useFocusEffect(
        React.useCallback(() => {
            const currentTime = new Date().toISOString()
            const formattedTime = formatLapTimeDisplay(currentTime)

            setLap({ ...lap, time: formattedTime, stop_id: null, note: null })

            if (location) {
                setLap({ ...lap, lon: location.coords.longitude, lat: location.coords.latitude, stop_id: null })
                setCenterCoordinate([location.coords.longitude, location.coords.latitude])
            }

            return () => {
                setCenterCoordinate([0, 0])
                setLap({ ...lap, time: formattedTime, stop_id: null, note: null })
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

        closeStopModal()
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

                            <View style={[inputElementStyles[theme].inputGroup, { height: 160 }]}>
                                <MapDisplay
                                    mapRef={mapRef}
                                    zoomLevel={15}
                                    centerCoordinate={centerCoordinate}
                                    draggable={false}
                                    getCurrentCoordinate={refetchLocation}
                                />
                            </View>

                            <View style={inputElementStyles[theme].inputGroup}>
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

                            <Divider />

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