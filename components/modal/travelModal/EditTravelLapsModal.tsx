import Button from '@/components/BaseButton'
import Divider from '@/components/Divider'
import { useTheme } from '@/context/ThemeContext'
import useModalHandler from '@/hooks/useModalHandler'
import { colors } from '@/src/const/color'
import { buttonStyles } from '@/src/styles/ButtonStyles'
import { inputElementStyles } from '@/src/styles/InputStyles'
import { modalStyles } from '@/src/styles/ModalStyles'
import { AddableLap } from '@/src/types/AddableTravels'
import { EditableLap, EditableLapsModalProp } from '@/src/types/EditableTravels'
import { sortLaps } from '@/src/utils/dataUtils'
import { formatLapTimeDisplay } from '@/src/utils/utils'
import { useFocusEffect } from 'expo-router'
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

export default function EditTravelLapsModal({ stops, travel_id, currentLaps, isModalVisible, onClose, onSelect }: EditableLapsModalProp) {
    const { theme } = useTheme()

    const {
        showModal: showLapModal,
        openModal: openLapModal,
        closeModal: closeLapModal
    } = useModalHandler()

    const {
        showModal: showEditLapModal,
        openModal: openEditLapModal,
        closeModal: closeEditLapModal
    } = useModalHandler()

    const [laps, setLaps] = useState<EditableLap[]>([])
    const [selectedLap, setSelectedLap] = useState<EditableLap | undefined>(undefined)

    const handleOnSubmit = () => {
        onSelect(laps)
    }

    const handleLapSelect = (lap: EditableLap) => {
        setSelectedLap(lap)
        openEditLapModal()
    }

    const handleLapAdd = (lap: AddableLap) => {
        if (laps) setLaps([lap, ...laps])

        closeLapModal()
    }

    const handleLapEdit = (lap: EditableLap) => {
        const updatedLaps = laps.map(item => {
            if (item.id === lap.id) {
                return lap
            }
            return item
        })

        setLaps(updatedLaps)
        closeEditLapModal()
    }

    useEffect(() => {
        const sortedLaps = sortLaps(currentLaps)
        setLaps(sortedLaps)
    }, [currentLaps])

    useFocusEffect(
        React.useCallback(() => {
            setLaps(currentLaps)
        }, [isModalVisible])
    )

    return (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={modalStyles[theme].modalBackdrop}>
                <View style={[modalStyles[theme].modalContainer]}>
                    <View style={modalStyles[theme].inputContainer}>
                        {laps.length === 0 ? (
                            <View style={styles[theme].emptyList}>
                                <Text style={inputElementStyles[theme].inputLabel}>No lap found</Text>
                            </View>
                        ) : (
                            <ScrollView
                                contentContainerStyle={modalStyles[theme].scrollView}
                            >
                                {laps.map((lap: EditableLap, index) => (
                                    <React.Fragment key={index}>
                                        <Pressable style={styles[theme].detailRow} onPress={() => handleLapSelect(lap)}>
                                            <Text style={inputElementStyles[theme].insideLabel}>{formatLapTimeDisplay(lap.time)}</Text>
                                            {stops.find(stop => stop.id === lap.stop_id) ? (
                                                <Text style={[inputElementStyles[theme].inputLabel, { color: colors.primary }]}>
                                                    {stops.find(stop => stop.id === lap.stop_id)?.name}
                                                </Text>
                                            ) : null}

                                            {lap.note && (
                                                <Text style={inputElementStyles[theme].inputLabelLight}>{lap.note}</Text>
                                            )}
                                        </Pressable>
                                        {index < laps.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    <View style={buttonStyles[theme].buttonRow}>
                        <Button title='Add lap' color={colors.primary} onPress={openLapModal} style={buttonStyles[theme].addButton} textStyle={buttonStyles[theme].addButtonText}></Button>
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
                    travel_id={travel_id}
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
        alignItems: 'flex-start',
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