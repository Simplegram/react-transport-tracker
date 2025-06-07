import Button from "@/components/BaseButton"
import { ModalButton } from "@/components/button/ModalButton"
import InputGroup from "@/components/input/InputGroup"
import { TextInputBase, TextInputBlock } from "@/components/input/TextInput"
import { useDataEditContext } from "@/context/DataEditContext"
import { useTheme } from "@/context/ThemeContext"
import useGetTravelData from "@/hooks/useGetTravelData"
import { useLoading } from "@/hooks/useLoading"
import useModalHandler from "@/hooks/useModalHandler"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { iconPickerStyles, inputElementStyles } from "@/src/styles/InputStyles"
import { styles } from "@/src/styles/Styles"
import { AddableCoordinates } from "@/src/types/AddableTravels"
import { EditableStop } from "@/src/types/EditableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { sortByIdToFront } from "@/src/utils/utils"
import { useRef, useState } from "react"
import { Alert, ScrollView, TouchableOpacity, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'
import AddCoordModal from "../addModal/AddCoordModal"

export default function EditStopModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { theme } = useTheme()

    const { modalData: data } = useDataEditContext()

    const { fullVehicleTypes } = useGetTravelData()
    const [stop, setStop] = useState<EditableStop>({ ...data, vehicle_type: data.vehicle_type?.id })

    const { loading } = useLoading()

    const {
        showModal: showCoordModal,
        openModalWithSearch: openCoordModal,
        closeModal: closeCoordModal
    } = useModalHandler()

    const savedVehicleTypeId = useRef(stop.vehicle_type)

    const handleCoordSelect = (coordinates: AddableCoordinates) => {
        if (!coordinates.lat || !coordinates.lon) {
            Alert.alert('Input Required', 'Please pick the right coordinates')
            return
        }

        setStop({ ...stop, lat: coordinates.lat, lon: coordinates.lon })
        closeCoordModal()
    }

    const handleOnSubmit = () => {
        if (!stop.name.trim() || !stop.vehicle_type) {
            Alert.alert('Input Required', 'Please enter a stop name and choose a vehicle type')
            return
        }

        onSubmit(stop)
    }

    return (
        <View>
            {loading ? (
                <InputGroup.LoadingLabel />
            ) : (
                <>
                    <View style={inputElementStyles[theme].inputContainer}>
                        <TextInputBlock
                            label="Name:"
                            value={stop.name}
                            placeholder="Stop name..."
                            onChangeText={(text) => setStop({ ...stop, "name": text })}
                        />

                        <View style={inputElementStyles[theme].inputGroup}>
                            <InputGroup.Label>Latitude and Longitude:</InputGroup.Label>
                            <View style={inputElementStyles[theme].inputGroupCoord}>
                                <TextInputBase
                                    value={stop.lat?.toString()}
                                    placeholder="Stop latitude..."
                                    onChangeText={(text) => setStop({ ...stop, "lat": Number(text) })}
                                    style={{ flex: 1 }}
                                />
                                <TextInputBase
                                    value={stop.lon?.toString()}
                                    placeholder="Stop longitude..."
                                    onChangeText={(text) => setStop({ ...stop, "lon": Number(text) })}
                                    style={{ flex: 1 }}
                                />
                            </View>
                            <ModalButton
                                condition={false}
                                value="Pick Latitude and Longitude..."
                                onPress={() => openCoordModal()}
                                style={{ marginTop: 10 }}
                            />
                        </View>

                        <TextInputBlock
                            label="Alternative name:"
                            value={stop.name_alt}
                            placeholder="Alternative name..."
                            onChangeText={(text) => setStop({ ...stop, "name_alt": text })}
                        />

                        <View style={inputElementStyles[theme].inputGroup}>
                            <View style={{
                                flexDirection: 'column',
                            }}>
                                <InputGroup.Label>Icon:</InputGroup.Label>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyboardShouldPersistTaps={"always"}
                                >
                                    {sortByIdToFront(fullVehicleTypes, savedVehicleTypeId.current).map((type: EditableStop) => (
                                        <TouchableOpacity
                                            key={type.id}
                                            style={[
                                                iconPickerStyles[theme].iconTextContainer,
                                                stop.vehicle_type === type.id && iconPickerStyles[theme].selectedIconContainer,
                                            ]}
                                            onPress={() => setStop({ ...stop, vehicle_type: type.id })}
                                        >
                                            <Icon
                                                style={
                                                    stop.vehicle_type === type.id ?
                                                        iconPickerStyles[theme].selectedIcon
                                                        :
                                                        styles[theme].icon
                                                }
                                                name={type.icon_id.name}
                                                size={20}
                                            />
                                            <InputGroup.Label
                                                style={stop.vehicle_type === type.id && iconPickerStyles[theme].selectedText}
                                            >{type.name.slice(0, 5)}</InputGroup.Label>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </View>

                    <AddCoordModal
                        currentCoordinates={{
                            lat: stop.lat,
                            lon: stop.lon
                        }}
                        isModalVisible={showCoordModal}
                        onClose={closeCoordModal}
                        onSelect={handleCoordSelect}
                    />

                    <View style={buttonStyles[theme].buttonRow}>
                        <Button.Dismiss label='Cancel' onPress={onCancel} />
                        <Button.Add label='Edit Stop' onPress={handleOnSubmit} />
                    </View>
                </>
            )}
        </View>
    )
}