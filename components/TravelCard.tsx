import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { travelCardStyles } from "@/src/styles/TravelListStyles"
import { DataItemWithNewKey } from "@/src/utils/dataUtils"
import { formatDate } from "@/src/utils/dateUtils"
import { calculateDuration } from "@/src/utils/utils"
import React from "react"
import { Text, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { interpolate, interpolateColor, runOnJS, SharedValue, useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from "react-native-reanimated"
import Divider from "./Divider"

interface TravelCardProps {
    item: DataItemWithNewKey
    index: number
    directionNameKey: string
    activeIndex: SharedValue<number>
    totalLength: number
    onPress: (directionNameKey: string, itemIndex: number) => void
}

export default function TravelCard({ item, index, directionNameKey, activeIndex, totalLength, onPress }: TravelCardProps) {
    const { theme } = useTheme()

    const styles = useAnimatedStyle(() => {
        return {
            width: '100%',
            position: 'absolute',
            zIndex: interpolate(
                activeIndex.value,
                [index - 1, index, index + 1],
                [0, totalLength - index, 0]
            ),
            opacity: interpolate(
                activeIndex.value,
                [index - 1, index, index + 1],
                [1 - 1 / 3, 1, 1 - 1 / 3]
            ),
            transform: [
                {
                    translateY: interpolate(
                        activeIndex.value,
                        [index - 1, index, index + 1],
                        [travelCardStyles[theme].card.gap, (totalLength > 1) ? -5 : 0, -2 * travelCardStyles[theme].card.gap]
                    )
                },
                {
                    scale: interpolate(
                        activeIndex.value,
                        [index - 1, index, index + 1],
                        [0.96, 1, 0.96]
                    )
                }
            ],
        }
    })

    const borderColor = useSharedValue(0)
    const cardStyles = useAnimatedStyle(() => {
        return {
            borderRadius: 8,
            borderColor: interpolateColor(
                borderColor.value,
                [0, 1],
                [travelCardStyles[theme].card.borderColor, theme === 'light' ? colors.primary : colors.primary_100]
            ),
            borderWidth: 1,
        }
    })

    const doubleTap = Gesture.Tap()
        .maxDuration(100)
        .numberOfTaps(2)
        .onBegin(() => {
            borderColor.value = withSequence(
                withTiming(1, { duration: 100 }),
                withDelay(50, withTiming(0, { duration: 100 }))
            )
        })
        .onStart(() => {
            runOnJS(onPress)(directionNameKey, index)
        })

    return (
        <Animated.View style={[styles, cardStyles]}>
            <GestureDetector gesture={Gesture.Exclusive(doubleTap)}>
                <Animated.View
                    key={item.id}
                    style={travelCardStyles[theme].card}
                >
                    <View style={travelCardStyles[theme].routeInfoSection}>
                        <Text style={travelCardStyles[theme].routeText}>
                            {item.routes?.code} | {item.routes?.name || item.routes?.code || 'N/A'}
                        </Text>
                        <Text style={travelCardStyles[theme].vehicleText}>
                            {item.vehicle_code || 'N/A'}
                        </Text>
                    </View>

                    <Divider />

                    <View style={travelCardStyles[theme].stopsTimeSection}>
                        <View style={travelCardStyles[theme].stopTimeBlock}>
                            <Text style={travelCardStyles[theme].stopText}>{item.first_stop_id?.name || 'N/A'}</Text>
                            <Text style={travelCardStyles[theme].timeText}>
                                {item.bus_initial_departure ? formatDate(item.bus_initial_departure) : 'N/A'}
                            </Text>
                        </View>

                        <View style={travelCardStyles[theme].stopArrowBlock}>
                            <Text style={travelCardStyles[theme].stopArrowText}>➜</Text>
                            <Text style={travelCardStyles[theme].notesLabel}>{calculateDuration(item)}</Text>
                        </View>

                        <View style={travelCardStyles[theme].stopTimeBlock}>
                            <Text style={travelCardStyles[theme].stopText}>{item.last_stop_id?.name || 'N/A'}</Text>
                            <Text style={travelCardStyles[theme].timeText}>
                                {item.bus_final_arrival ? formatDate(item.bus_final_arrival) : 'N/A'}
                            </Text>
                        </View>
                    </View>

                    <Divider />

                    <View style={travelCardStyles[theme].lapsSection}>
                        <Text style={travelCardStyles[theme].lapText}>{item.lapCount} lap(s)</Text>
                    </View>

                    <Divider />
                    <View style={travelCardStyles[theme].notesSection}>
                        <Text style={travelCardStyles[theme].notesLabel}>Notes:</Text>
                        <Text style={travelCardStyles[theme].notesText}>
                            {item.notes || 'No notes'}
                        </Text>
                    </View>
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    )
}