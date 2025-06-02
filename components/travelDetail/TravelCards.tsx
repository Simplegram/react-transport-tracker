import { useTheme } from "@/context/ThemeContext"
import { travelCardStyles } from "@/src/styles/TravelListStyles"
import { DataItemWithNewKey } from "@/src/utils/dataUtils"
import React from "react" // Import useEffect and useState
import { View } from "react-native" // Import Dimensions
import { Directions, Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler"
import { useSharedValue, withTiming } from "react-native-reanimated"
import TravelCard from "../TravelCard"
import { Text } from "react-native"

interface TravelCardsProps {
    data: DataItemWithNewKey[]
    directionNameKey: string
    onPress: (key: string, index: number) => void
}

export default function TravelCards({ data, directionNameKey, onPress }: TravelCardsProps) {
    const { theme } = useTheme()

    const duration = 200
    const activeIndex = useSharedValue(0)

    const flingUp = Gesture.Fling()
        .direction(Directions.UP)
        .onStart(() => {
            if ((activeIndex.value + 1) >= (data.length - 1)) {
                activeIndex.value = withTiming(data.length - 1, { duration })
                return
            }
            activeIndex.value = withTiming(Math.ceil(activeIndex.value) + 1, { duration })
        })

    const flingDown = Gesture.Fling()
        .direction(Directions.DOWN)
        .onStart(() => {
            if ((activeIndex.value - 1) <= 0) {
                activeIndex.value = withTiming(0, { duration })
                return
            }
            activeIndex.value = withTiming(Math.ceil(activeIndex.value) - 1, { duration })
        })

    return (
        <GestureHandlerRootView>
            <GestureDetector gesture={Gesture.Exclusive(flingUp, flingDown)}>
                <View>
                    <View style={travelCardStyles[theme].cardHolder}>
                        {data.map((item, index) => (
                            <TravelCard
                                key={index}
                                item={item}
                                index={index}
                                directionNameKey={directionNameKey}
                                totalLength={data.length - 1}
                                activeIndex={activeIndex}
                                onPress={() => onPress(directionNameKey, index)}
                            />
                        ))}
                    </View>
                </View>
            </GestureDetector>
        </GestureHandlerRootView>
    )
}