import moment from 'moment'
import React from 'react'
import PagerView from 'react-native-pager-view'

import { useTheme } from '@/context/ThemeContext'
import { useTravelContext } from '@/context/TravelContext'
import { DataItemWithNewKey, getKeysSortedByCreatedAt } from '@/src/utils/dataUtils'
import { router } from 'expo-router'
import { StyleSheet, View } from 'react-native'

import { GestureHandlerRootView, Pressable } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'
import Input from '../input/Input'
import TravelCards from './TravelCards'

const AnimatedPagerView = Animated.createAnimatedComponent(PagerView)

interface GroupedDataDisplayProps {
    data: Record<string, DataItemWithNewKey[]>
    currentDate: string
    refetch: () => void
}

export default function GroupedDataDisplay({ data: finalGroupedData, currentDate, refetch }: GroupedDataDisplayProps) {
    const { getTheme } = useTheme()
    const theme = getTheme()

    const { setSelectedItem, setSelectedTravelItems } = useTravelContext()

    const directionNames = getKeysSortedByCreatedAt(finalGroupedData)

    const handleItemPress = (directionNameKey: string, itemIndex: number) => {
        const itemToSelect = finalGroupedData[directionNameKey][itemIndex]
        if (itemToSelect) {
            setSelectedItem(itemToSelect)
            router.push("main/editTravel")
        }
    }

    const handleViewTravelDetails = (directionNameKey: string) => {
        setSelectedTravelItems(finalGroupedData[directionNameKey])
        router.push("main/travelDetail")
    }

    const styles = StyleSheet.create({
        content: {
            flex: 1,
            overflow: 'hidden',
        },
        pagerView: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        pagerViewContentContainer: {
            flex: 1,
            overflow: 'hidden',
            justifyContent: 'flex-end',

            borderColor: theme.palette.borderColor,
        },
        cardCanvas: {
            minHeight: 300,
            maxHeight: 325,
        },
    })

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.content}>
                <AnimatedPagerView
                    style={styles.pagerView}
                    initialPage={0}
                    key={directionNames.length}
                    pageMargin={10}
                >
                    {directionNames.length > 0 ? (
                        directionNames.map((directionNameKey, index) => (
                            <GestureHandlerRootView key={directionNameKey}>
                                <View style={styles.pagerViewContentContainer}>
                                    <Pressable
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            paddingBottom: 20,
                                        }}
                                        onPress={() => handleViewTravelDetails(directionNameKey)}
                                    >
                                        <Input.Title>{moment(currentDate).format('LL')}</Input.Title>
                                        <Input.Title>{`Direction (${index + 1}/${directionNames.length}): ${directionNameKey}`}</Input.Title>
                                    </Pressable>
                                    <View key={directionNameKey} style={styles.cardCanvas}>
                                        <TravelCards
                                            data={finalGroupedData[directionNameKey]}
                                            directionNameKey={directionNameKey}
                                            onPress={handleItemPress}
                                        />
                                    </View>
                                </View>
                            </GestureHandlerRootView>
                        ))
                    ) : (
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Input.Label>No data available to display</Input.Label>
                        </View>
                    )}
                </AnimatedPagerView>
            </View>
        </View >
    )
}