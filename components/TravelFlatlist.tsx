import { useTheme } from "@/context/ThemeContext"
import { useLoading } from "@/hooks/useLoading"
import { travelCardStyles } from "@/src/styles/TravelListStyles"
import { DataItemWithNewKey } from "@/src/utils/dataUtils"
import { Dimensions, FlatList, useWindowDimensions, View } from "react-native"
import LoadingScreen from "./LoadingScreen"
import TravelCard from "./TravelCard"

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
                    ListHeaderComponent={EmptyHeaderComponent}
                    ListHeaderComponentStyle={{ flex: 1 }}
                />
            )}
        </>
    )
}

export function EmptyHeaderComponent() {
    const {height, width} = useWindowDimensions()

    const minHeight = width < height ? height * 0.25 : 0

    return (
        <View style={{ minHeight: minHeight }}></View>
    )
}