import Button from '@/components/BaseButton'
import { useTheme } from '@/context/ThemeContext'
import useStopModal from '@/hooks/useStopModal'
import { colors } from '@/src/const/color'
import { buttonStyles } from '@/src/styles/ButtonStyles'
import { inputElementStyles } from '@/src/styles/InputStyles'
import { modalStyles } from '@/src/styles/ModalStyles'
import { AddableLap, AddableLapsModalProp } from '@/src/types/AddableTravels'
import { formatLapTimeDisplay } from '@/src/utils/utils'
import React, { useEffect, useState } from 'react'
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'
import AddLapModal from '../addModal/AddLapModal'
import EditLapModal from '../editModal/EditLapModal'

export default function AddTravelLapsModal({ stops, currentLaps, isModalVisible, onClose, onSelect }: AddableLapsModalProp) {
    const { theme } = useTheme()

    const {
        showStopModal: showLapModal,
        openStopModal: openLapModal,
        closeStopModal: closeLapModal
    } = useStopModal()

    const {
        showStopModal: showEditLapModal,
        openStopModal: openEditLapModal,
        closeStopModal: closeEditLapModal
    } = useStopModal()

    const [laps, setLaps] = useState<AddableLap[]>([])
    const [selectedLap, setSelectedLap] = useState<AddableLap | undefined>(undefined)

    const handleOnSubmit = () => {
        onSelect(laps)
    }

    const handleLapSelect = (lap: AddableLap) => {
        setSelectedLap(lap)
        openEditLapModal()
    }

    const handleLapAdd = (lap: AddableLap) => {
        if (laps) setLaps([...laps, lap])

        closeLapModal()
    }

    const handleLapEdit = (lap: AddableLap) => {
        const updatedLaps = laps.map(item => {
            if (item.time === lap.time) {
                return lap
            }
            return item
        })

        setLaps(updatedLaps)
        closeEditLapModal()
    }

    const handleLapRemove = (index: number) => {
        const newLaps = [...laps]
        newLaps.splice(index, 1)
        setLaps(newLaps)
    }

    useEffect(() => {
        setLaps(currentLaps)
    }, [currentLaps])

    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={modalStyles[theme].modalBackdrop}>
                <View style={modalStyles[theme].modalContainer}>
                    <View style={modalStyles[theme].inputContainer}>
                        {laps.length === 0 ? (
                            <View style={styles[theme].emptyList}>
                                <Text style={inputElementStyles[theme].inputLabel}>No lap found</Text>
                            </View>
                        ) : (
                            <ScrollView
                                contentContainerStyle={modalStyles[theme].scrollView}
                            >
                                {laps.map((lap: AddableLap, index) => (
                                    <Pressable key={index} style={styles[theme].detailRow} onPress={() => handleLapSelect(lap)}>
                                        <View style={{
                                            flex: 1,
                                            width: '100%',
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                        }}>
                                            <Text style={inputElementStyles[theme].inputLabel}>{formatLapTimeDisplay(lap.time)}</Text>
                                            <Pressable onPress={() => handleLapRemove(index)}>
                                                <Text style={[inputElementStyles[theme].inputLabel, { color: 'red' }]}>Remove</Text>
                                            </Pressable>
                                        </View>
                                        {stops.find(stop => stop.id === lap.stop_id) ? (
                                            <Text style={[inputElementStyles[theme].inputLabel, { color: colors.appBlue }]}>
                                                {stops.find(stop => stop.id === lap.stop_id)?.name}
                                            </Text>
                                        ) : null}

                                        {lap.note && (
                                            <Text style={inputElementStyles[theme].inputLabelLight}>{lap.note}</Text>
                                        )}
                                    </Pressable>
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    <View style={buttonStyles[theme].buttonRow}>
                        <Button title='Add lap' color={colors.appBlue} onPress={openLapModal} style={buttonStyles[theme].addButton} textStyle={buttonStyles[theme].addButtonText}></Button>
                    </View>

                    <View style={buttonStyles[theme].buttonRow}>
                        <Button title='Cancel' onPress={onClose} style={buttonStyles[theme].cancelButton} textStyle={buttonStyles[theme].cancelButtonText}></Button>
                        <Button title='Save Laps' onPress={handleOnSubmit} style={buttonStyles[theme].addButton} textStyle={buttonStyles[theme].addButtonText}></Button>
                    </View>
                </View>

                <EditLapModal
                    stops={stops}
                    selectedLap={selectedLap}
                    isModalVisible={showEditLapModal}
                    onSelect={handleLapEdit}
                    onClose={closeEditLapModal}
                />

                <AddLapModal
                    stops={stops}
                    isModalVisible={showLapModal}
                    onSelect={handleLapAdd}
                    onClose={closeLapModal}
                />
            </View>
        </Modal>
    )
};

const lightStyles = StyleSheet.create({
    emptyList: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailRow: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderRadius: 10,
    },
})

const styles = {
    light: lightStyles,
    dark: StyleSheet.create({
        emptyList: {
            ...lightStyles.emptyList,
        },
        detailRow: {
            ...lightStyles.detailRow,
            paddingHorizontal: 0,
        },
    })
}

const addButtonStyles = StyleSheet.create({
    buttonContainer: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
    },
    plusText: {
        color: 'white',
        fontWeight: 'bold',
    },
})