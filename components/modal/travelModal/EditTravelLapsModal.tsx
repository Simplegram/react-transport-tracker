import Button from '@/components/button/BaseButton'
import Divider from '@/components/Divider'
import Input from '@/components/input/Input'
import ModalTemplate from '@/components/ModalTemplate'
import { useTheme } from '@/context/ThemeContext'
import useModalHandler from '@/hooks/useModalHandler'
import { colors } from '@/src/const/color'
import { inputElementStyles } from '@/src/styles/InputStyles'
import { modalStyles } from '@/src/styles/ModalStyles'
import { AddableLap } from '@/src/types/AddableTravels'
import { EditableLap, EditableLapsModalProp } from '@/src/types/EditableTravels'
import { sortLaps } from '@/src/utils/dataUtils'
import { formatLapTimeDisplay } from '@/src/utils/utils'
import { useFocusEffect } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native'
import AddLapModal from '../addModal/AddLapModal'
import EditLapModal from '../editModal/EditLapModal'
import FlatlistBase from '../FlatlistPicker'

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
        <ModalTemplate.Bottom visible={isModalVisible}>
            <ModalTemplate.BottomContainer>
                <View style={modalStyles[theme].inputContainer}>
                    {laps.length === 0 ? (
                        <View style={styles[theme].emptyList}>
                            <Input.Label>No lap found</Input.Label>
                        </View>
                    ) : (
                        <FlatlistBase.Lap
                            laps={laps}
                            stops={stops}
                            onPress={handleLapSelect}
                        />
                    )}
                </View>

                <Button.Row>
                    <Button.Add label='Add lap' onPress={openLapModal} />
                </Button.Row>

                <Button.Row>
                    <Button.Dismiss label='Cancel' onPress={onClose} />
                    <Button.Add label='Save Laps' onPress={handleOnSubmit} />
                </Button.Row>
            </ModalTemplate.BottomContainer>

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
        </ModalTemplate.Bottom>
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