import { useTheme } from "@/context/ThemeContext"
import { useLoading } from "@/hooks/useLoading"
import { travelCardStyles } from "@/src/styles/TravelListStyles"
import { DataItemWithNewKey } from "@/src/utils/dataUtils"
import { FlatList } from "react-native"
import TravelCard from "./TravelCard"
import LoadingScreen from "./LoadingScreen"

interface TravelFlatlistProps {
    items: DataItemWithNewKey[]
    directionNameKey: string
    onPress: (directionNameKey: string, itemIndex: number) => void
    refetch: () => void
}

export default function TravelFlatlist({ items, directionNameKey, onPress, refetch }: TravelFlatlistProps) {
    const { theme } = useTheme()

    const {
        loading
    } = useLoading(150)

    return (
        <>
            {loading ? (
                <LoadingScreen />
            ) : (
                <FlatList
                    refreshing={loading}
                    onRefresh={refetch}
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
            )}
        </>
    )
}