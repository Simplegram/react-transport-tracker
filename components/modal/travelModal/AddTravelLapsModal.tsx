import Button from '@/components/BaseButton'
import Divider from '@/components/Divider'
import Input from '@/components/input/Input'
import { useTheme } from '@/context/ThemeContext'
import useModalHandler from '@/hooks/useModalHandler'
import { colors } from '@/src/const/color'
import { buttonStyles } from '@/src/styles/ButtonStyles'
import { inputElementStyles } from '@/src/styles/InputStyles'
import { modalStyles } from '@/src/styles/ModalStyles'
import { AddableLap, AddableLapsModalProp } from '@/src/types/AddableTravels'
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
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated'
import AddLapModal from '../addModal/AddLapModal'
import EditLapModal from '../editModal/EditLapModal'

export default function AddTravelLapsModal({ stops, currentLaps, isModalVisible, onClose, onSelect }: AddableLapsModalProp) {
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
        if (laps) setLaps([lap, ...laps])

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

    const handleLapRemove = (id: number | string) => {
        setLaps((laps) => {
            return laps.filter((lap) => lap.id !== id)
        })
    }

    useEffect(() => {
        setLaps(currentLaps)
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
                <View style={modalStyles[theme].modalContainer}>
                    <View style={modalStyles[theme].inputContainer}>
                        {laps.length === 0 ? (
                            <View style={styles[theme].emptyList}>
                                <Input.Label>No lap found</Input.Label>
                            </View>
                        ) : (
                            <ScrollView
                                contentContainerStyle={modalStyles[theme].scrollView}
                            >
                                {laps.map((lap: AddableLap, index) => (
                                    <Animated.View
                                        key={lap.id}
                                        entering={FadeIn.duration(250)}
                                        exiting={FadeOut.duration(125)}
                                        layout={LinearTransition}
                                    >
                                        <Pressable style={styles[theme].detailRow} onPress={() => handleLapSelect(lap)}>
                                            <View style={{
                                                flex: 1,
                                                width: '100%',
                                                justifyContent: 'space-between',
                                                flexDirection: 'row',
                                            }}>
                                                <Input.Label>{formatLapTimeDisplay(lap.time)}</Input.Label>
                                                <Pressable onPress={() => handleLapRemove(lap.id)}>
                                                    <Text style={[inputElementStyles[theme].insideLabel, { color: 'red' }]}>Remove</Text>
                                                </Pressable>
                                            </View>
                                            {stops.find(stop => stop.id === lap.stop_id) ? (
                                                <Input.Label style={{ color: colors.primary }}>
                                                    {stops.find(stop => stop.id === lap.stop_id)?.name}
                                                </Input.Label>
                                            ) : null}

                                            {lap.note && (
                                                <Input.Label>{lap.note}</Input.Label>)}
                                        </Pressable>
                                        {index < laps.length - 1 && <Divider />}
                                    </Animated.View>
                                ))}
                            </ScrollView>
                        )}
                    </View>

                    <View style={buttonStyles[theme].buttonRow}>
                        <Button.Add label='Add lap' onPress={openLapModal} />
                    </View>

                    <View style={buttonStyles[theme].buttonRow}>
                        <Button.Dismiss label='Cancel' onPress={onClose} />
                        <Button.Add label='Save Laps' onPress={handleOnSubmit} />
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
        </Modal >
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