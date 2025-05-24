import { useTheme } from "@/context/ThemeContext"
import { travelCardStyles } from "@/src/styles/TravelListStyles"
import { DataItemWithNewKey } from "@/src/utils/dataUtils"
import { FlatList } from "react-native"
import TravelCard from "./TravelCard"

interface TravelFlatlistProps {
    items: DataItemWithNewKey[]
    directionNameKey: string
    onPress: (directionNameKey: string, itemIndex: number) => void
}

export default function TravelFlatlist({ items, directionNameKey, onPress }: TravelFlatlistProps) {
    const { theme } = useTheme()

    return (
        <FlatList
            inverted={true}
            data={items}
            renderItem={({ item, index }) => (
                <TravelCard
                    item={item}
                    index={index}
                    directionNameKey={directionNameKey}
                    onPress={onPress}
                />
            )}
            contentContainerStyle={travelCardStyles[theme].cardHolder}
        />
    )
}