import Button from "@/components/button/BaseButton"
import Input from "@/components/input/Input"
import { TextInputBlock } from "@/components/input/TextInput"
import { IconSelector } from "@/components/input/VehicleSelector"
import { useDataEditContext } from "@/context/DataEditContext"
import { useTheme } from "@/context/ThemeContext"
import useGetTravelData from "@/hooks/useGetTravelData"
import { useLoading } from "@/hooks/useLoading"
import { inputElementStyles } from "@/src/styles/InputStyles"
import { EditableVehicleType } from "@/src/types/EditableTravels"
import { BaseModalContentProps } from "@/src/types/ModalContentProps"
import { IconType } from "@/src/types/Travels"
import { sortByIdToFront } from "@/src/utils/utils"
import { useEffect, useRef, useState } from "react"
import { Alert, ScrollView, View } from "react-native"

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
                <Input.LoadingLabel />
            ) : (
                <>
                    <Input.Container>
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
                                <Input.Label>Icon:</Input.Label>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    keyboardShouldPersistTaps={"always"}
                                >
                                    {sortByIdToFront(icons, savedVehicleTypeId.current).map((icon: IconType) => (
                                        <IconSelector
                                            key={icon.id}
                                            icon={icon}
                                            condition={vehicleType.icon_id === icon.id}
                                            onPress={() => setVehicleType({ ...vehicleType, "icon_id": icon.id })}
                                        />
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </Input.Container>

                    <Button.Row>
                        <Button.Dismiss label='Cancel' onPress={onCancel} />
                        <Button.Add label='Edit Type' onPress={handleOnSubmit} />
                    </Button.Row>
                </>
            )}
        </View>
    )
}