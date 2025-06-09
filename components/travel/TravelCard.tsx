import { useTheme } from "@/context/ThemeContext"
import { colors } from "@/src/const/color"
import { travelCardStyles } from "@/src/styles/TravelListStyles"
import { DataItemWithNewKey } from "@/src/utils/dataUtils"
import { formatDate } from "@/src/utils/dateUtils"
import { calculateDuration } from "@/src/utils/utils"
import React from "react"
import { View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { interpolate, interpolateColor, runOnJS, SharedValue, useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from "react-native-reanimated"
import Divider from "../Divider"
import Input from "../input/Input"

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
                        [travelCardStyles[theme].card.gap, ((totalLength + 1) > 1) ? -5 : 0, -2 * travelCardStyles[theme].card.gap]
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
            borderRadius: 10,
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
                        <Input.Subtitle style={{ textAlign: 'center' }}>
                            {item.routes?.code} | {item.routes?.name || item.routes?.code || 'N/A'}
                        </Input.Subtitle>
                        <Input.SubtitlePrimary style={{ textAlign: 'center' }}>
                            {item.vehicle_code || 'N/A'}
                        </Input.SubtitlePrimary>
                    </View>

                    <Divider />

                    <View style={travelCardStyles[theme].stopsTimeSection}>
                        <View style={travelCardStyles[theme].stopTimeBlock}>
                            <Input.ValuePrimary style={{ textAlign: 'center' }}>{item.first_stop_id?.name || 'N/A'}</Input.ValuePrimary>
                            <Input.Text style={{ textAlign: 'center' }}>
                                {item.bus_initial_departure ? formatDate(item.bus_initial_departure) : 'N/A'}
                            </Input.Text>
                        </View>

                        <View style={travelCardStyles[theme].stopArrowBlock}>
                            <Input.Title>➜</Input.Title>
                            <Input.Text style={{ textAlign: 'center' }}>{calculateDuration(item)}</Input.Text>
                        </View>

                        <View style={travelCardStyles[theme].stopTimeBlock}>
                            <Input.ValuePrimary style={{ textAlign: 'center' }}>{item.last_stop_id?.name || 'N/A'}</Input.ValuePrimary>
                            <Input.Text style={{ textAlign: 'center' }}>
                                {item.bus_final_arrival ? formatDate(item.bus_final_arrival) : 'N/A'}
                            </Input.Text>
                        </View>
                    </View>

                    <Divider />

                    <View style={travelCardStyles[theme].lapsSection}>
                        <Input.ValueText style={{ textAlign: 'center' }}>{item.lapCount} lap(s)</Input.ValueText>
                    </View>

                    <Divider />
                    <View style={travelCardStyles[theme].notesSection}>
                        <Input.Text>Notes:</Input.Text>
                        <Input.ValueText style={{ fontWeight: '300', fontStyle: 'italic' }}>
                            {item.notes || 'No notes'}
                        </Input.ValueText>
                    </View>
                </Animated.View>
            </GestureDetector>
        </Animated.View>
    )
}