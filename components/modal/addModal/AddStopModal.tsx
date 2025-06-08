import Button from "@/components/button/BaseButton"
import { ModalButton } from "@/components/button/ModalButton"
import Input from "@/components/input/Input"
import { TextInputBase, TextInputBlock } from "@/components/input/TextInput"
import { useTheme } from "@/context/ThemeContext"
import useGetTravelData from "@/hooks/useGetTravelData"
import { useLoading } from "@/hooks/useLoading"
import useModalHandler from "@/hooks/useModalHandler"
import { iconPickerStyles, inputElementStyles } from "@/src/styles/InputStyles"
import { styles } from "@/src/styles/Styles"
import { AddableCoordinates, AddableStop } from "@/src/types/AddableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { useState } from "react"
import { Alert, ScrollView, TouchableOpacity, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'
import AddCoordModal from "./AddCoordModal"

export default function AddStopModal({ onCancel, onSubmit }: BaseModalContentProps) {
    const { theme } = useTheme()

    const { fullVehicleTypes } = useGetTravelData()

    const [stop, setStop] = useState<AddableStop>({
        name: undefined,
        lat: null,
        lon: null,
        name_alt: null,
        vehicle_type: undefined
    })

    const { loading } = useLoading()

    const {
        showModal: showCoordModal,
        openModalWithSearch: openCoordModal,
        closeModal: closeCoordModal
    } = useModalHandler()

    const handleCoordSelect = (coordinates: AddableCoordinates) => {
        if (!coordinates.lat || !coordinates.lon) {
            Alert.alert('Input Required', 'Please pick the right coordinates')
            return
        }

        setStop({ ...stop, lat: coordinates.lat, lon: coordinates.lon })
        closeCoordModal()
    }

    const handleOnSubmit = () => {
        if (!stop.name?.trim() || !stop.vehicle_type) {
            Alert.alert('Input Required', 'Please enter a stop name and choose a vehicle type.')
            return
        }

        onSubmit(stop)
    }

    return (
        <View>
            {loading ? (
                <Input.LoadingLabel />
            ) : (
                <>
                    <Input.Container>
                        <TextInputBlock
                            label="Name:"
                            value={stop.name}
                            placeholder="Stop name..."
                            onChangeText={(text) => setStop({ ...stop, "name": text })}
                        />

                        <View style={inputElementStyles[theme].inputGroup}>
                            <Input.Label>Latitude and Longitude:</Input.Label>
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
                                <Input.Label>Icon:</Input.Label>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyboardShouldPersistTaps={"always"}
                                >
                                    {fullVehicleTypes.map((type) => (
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
                                            <Input.Label
                                                style={stop.vehicle_type === type.id && iconPickerStyles[theme].selectedText}
                                            >{type.name.slice(0, 5)}</Input.Label>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </Input.Container>

                    <AddCoordModal
                        currentCoordinates={{
                            lat: stop.lat,
                            lon: stop.lon
                        }}
                        isModalVisible={showCoordModal}
                        onClose={closeCoordModal}
                        onSelect={handleCoordSelect}
                    />

                    <Button.Row>
                        <Button.Dismiss label='Cancel' onPress={onCancel} />
                        <Button.Add label='Add Stop' onPress={handleOnSubmit} />
                    </Button.Row>
                </>
            )}
        </View>
    )
}