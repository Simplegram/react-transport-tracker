import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { flatlistStyles } from "@/src/styles/ModalStyles"
import { EditableLap } from "@/src/types/EditableTravels"
import { Stop } from "@/src/types/Travels"
import { formatLapTimeDisplay } from "@/src/utils/utils"
import React from "react"
import { FlatList, Pressable, TouchableOpacity } from "react-native"
import Divider from "../Divider"
import Input from "../input/Input"

export default function FlatlistBase() { }

interface PickerProps {
    items: any[]
    maxHeight?: number
    onSelect: (id: any) => void
    children?: (item: any) => React.ReactNode
}

function PickerFlatlist({ items, maxHeight = 300, onSelect, children }: PickerProps) {
    const { theme } = useTheme()

    return (
        <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={flatlistStyles[theme].item}
                    onPress={() => onSelect(item.id)}
                >
                    {children && children(item)}
                </TouchableOpacity>
            )}
            keyboardShouldPersistTaps={'always'}
            style={{
                maxHeight: maxHeight
            }}
        />
    )
}

FlatlistBase.Picker = PickerFlatlist
FlatlistBase.Lap = LapFlatlist