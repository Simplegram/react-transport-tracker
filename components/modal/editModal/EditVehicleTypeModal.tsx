import Button from "@/components/BaseButton"
import { TextInputBlock } from "@/components/input/TextInput"
import { useDataEditContext } from "@/context/DataEditContext"
import { useTheme } from "@/context/ThemeContext"
import useGetTravelData from "@/hooks/useGetTravelData"
import { useLoading } from "@/hooks/useLoading"
import { buttonStyles } from "@/src/styles/ButtonStyles"
import { iconPickerStyles, inputElementStyles } from "@/src/styles/InputStyles"
import { styles } from "@/src/styles/Styles"
import { EditableVehicleType } from "@/src/types/EditableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { IconType } from "@/src/types/Travels"
import { sortByIdToFront } from "@/src/utils/utils"
import { useEffect, useRef, useState } from "react"
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native"
import Icon from 'react-native-vector-icons/FontAwesome6'

export default function EditVehicleTypeModal({ onSubmit, onCancel }: BaseModalContentProps) {
    const { theme } = useTheme()

    const { modalData: data } = useDataEditContext()

    const { icons, getIcons } = useGetTravelData()

    const [vehicleType, setVehicleType] = useState<EditableVehicleType>(data)
    const savedVehicleTypeId = useRef(vehicleType.icon_id)

    const { loading } = useLoading()

    useEffect(() => {
        getIcons()
    }, [icons])

    const handleOnSubmit = () => {
        if (!vehicleType.name || !vehicleType.icon_id) {
            Alert.alert('Input Required', 'Please enter a type name and choose an icon.')
            return
        }

        onSubmit(vehicleType)
    }

    return (
        <View>
            {loading ? (
                <Text style={inputElementStyles[theme].inputLabel}>Loading...</Text>
            ) : (
                <>
                    <View style={inputElementStyles[theme].inputContainer}>
                        <TextInputBlock
                            label="Name:"
                            value={vehicleType.name}
                            placeholder="e.g., Standard Bus"
                            onChangeText={(text) => setVehicleType({ ...vehicleType, "name": text })}
                        />

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
                                    {sortByIdToFront(icons, savedVehicleTypeId.current).map((icon: IconType) => (
                                        <TouchableOpacity
                                            key={icon.id}
                                            style={[
                                                iconPickerStyles[theme].iconContainer,
                                                vehicleType.icon_id === icon.id && iconPickerStyles[theme].selectedIconContainer,
                                            ]}
                                            onPress={() => setVehicleType({ ...vehicleType, icon_id: icon.id })}
                                        >
                                            <Icon
                                                style={
                                                    vehicleType.icon_id === icon.id ?
                                                        iconPickerStyles[theme].selectedIcon
                                                        :
                                                        styles[theme].icon
                                                }
                                                name={icon.name}
                                                size={20}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </View>

                    <View style={buttonStyles[theme].buttonRow}>
                        <Button.Dismiss label='Cancel' onPress={onCancel} />
                        <Button.Add label='Edit Type' onPress={handleOnSubmit} />
                    </View>
                </>
            )}
        </View>
    )
}