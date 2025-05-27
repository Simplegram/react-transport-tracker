import Button from "@/components/BaseButton"
import { useTheme } from "@/context/ThemeContext"
import useGetTravelData from "@/hooks/useGetTravelData"
import { useLoading } from "@/hooks/useLoading"
import useStopModal from "@/hooks/useStopModal"
import { colors } from "@/src/const/color"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { iconPickerStyles, inputElementStyles, inputStyles } from "@/src/styles/InputStyles"
import { styles } from "@/src/styles/Styles"
import { AddableCoordinates, AddableStop } from "@/src/types/AddableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { useState } from "react"
import { Alert, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
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
        showStopModal: showCoordModal,
        openStopModal: openCoordModal,
        closeStopModal: closeCoordModal
    } = useStopModal()

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
                <Text style={inputElementStyles[theme].inputLabel}>Loading...</Text>
            ) : (
                <>
                    <View style={inputElementStyles[theme].inputContainer}>
                        <View style={inputElementStyles[theme].inputGroup}>
                            <Text style={inputElementStyles[theme].inputLabel}>Name:</Text>
                            <TextInput
                                style={inputStyles[theme].textInput}
                                placeholder="Stop name..."
                                placeholderTextColor={colors.text.placeholderGray}
                                value={stop.name}
                                onChangeText={text => (setStop({ ...stop, "name": text }))}
                            />
                        </View>

                        <View style={inputElementStyles[theme].inputGroup}>
                            <Text style={inputElementStyles[theme].inputLabel}>Latitude and Longitude:</Text>
                            <View style={inputElementStyles[theme].inputGroupCoord}>
                                <TextInput
                                    style={[inputStyles[theme].textInput, inputStyles[theme].pressableInputCoord]}
                                    placeholder="Stop latitude..."
                                    placeholderTextColor={colors.text.placeholderGray}
                                    value={stop.lat?.toString()}
                                    onChangeText={text => (setStop({ ...stop, "lat": Number(text) }))}
                                />
                                <TextInput
                                    style={[inputStyles[theme].textInput, inputStyles[theme].pressableInputCoord]}
                                    placeholder="Stop longitude..."
                                    placeholderTextColor={colors.text.placeholderGray}
                                    value={stop.lon?.toString()}
                                    onChangeText={text => (setStop({ ...stop, "lon": Number(text) }))}
                                />
                            </View>
                            <Pressable
                                style={[inputStyles[theme].pressableInput, { marginTop: 10 }]}
                                onPress={() => openCoordModal()}>
                                <Text style={inputElementStyles[theme].insideLabel}>Pick Latitude and Longitude...</Text>
                            </Pressable>
                        </View>

                        <View style={inputElementStyles[theme].inputGroup}>
                            <Text style={inputElementStyles[theme].inputLabel}>Alternative name:</Text>
                            <TextInput
                                style={inputStyles[theme].textInput}
                                placeholder="Alternative name..."
                                placeholderTextColor={colors.text.placeholderGray}
                                value={stop.name_alt ? stop.name_alt : ''}
                                onChangeText={text => (setStop({ ...stop, "name_alt": text }))}
                            />
                        </View>

                        <View style={inputElementStyles[theme].inputGroup}>
                            <View style={{
                                flexDirection: 'column',
                            }}>
                                <Text style={inputElementStyles[theme].inputLabel}>Icon:</Text>
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
                                            <Text style={inputElementStyles[theme].inputLabel}>{type.name.slice(0, 5)}</Text>
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
                        <Button title='Cancel' onPress={onCancel} style={buttonStyles[theme].cancelButton} textStyle={buttonStyles[theme].cancelButtonText}></Button>
                        <Button title='Add Stop' color='#0284f5' onPress={handleOnSubmit} style={buttonStyles[theme].addButton} textStyle={buttonStyles[theme].addButtonText}></Button>
                    </View>
                </>
            )}
        </View>
    )
}