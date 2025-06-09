import moment from 'moment'
import React, { useEffect, useState } from 'react'
import PagerView from 'react-native-pager-view'

import { useTheme } from '@/context/ThemeContext'
import { useTravelContext } from '@/context/TravelContext'
import { DataItemWithNewKey, getKeysSortedByCreatedAt } from '@/src/utils/dataUtils'
import { router } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'

import { getDateString, getTimeString } from '@/src/utils/dateUtils'
import Input from '../input/Input'
import TravelCards from './TravelCards'

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

    const [currentTime, setCurrentTime] = useState<string>(getTimeString())

    useEffect(() => {
        setInterval(() => {
            setCurrentTime(getTimeString())
        }, 1000)
    }, [])

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
            flex: 1.55,
            overflow: 'hidden',
            borderWidth: 1,
            borderRadius: 10,
            paddingBottom: 5,
            paddingHorizontal: 10,

            borderColor: theme.palette.borderColor,
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
            height: 315,
        },
        swipeZone: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        swipeZoneText: {
            fontSize: 16,
            fontWeight: 'bold',
            color: dateLabelColor,
        },
    })

    return (
        <View style={{ flex: 1 }}>
            <View style={{
                flex: 1,
                marginVertical: 10,
                justifyContent: 'flex-end',
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    paddingHorizontal: 5,
                }}>
                    <View>
                        <Input.Header>{moment(getDateString()).format('dddd')}</Input.Header>
                        <Input.Header>{moment(getDateString()).format('LL')}</Input.Header>
                    </View>
                    <Input.Header>{currentTime}</Input.Header>
                </View>
            </View>
            <View style={styles.content}>
                <PagerView
                    style={styles.pagerView}
                    initialPage={0}
                    key={directionNames.length}
                    pageMargin={10}
                >
                    {directionNames.length > 0 ? (
                        directionNames.map((directionNameKey, index) => (
                            <View key={directionNameKey} style={styles.pagerViewContentContainer}>
                                <Pressable
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        paddingBottom: 16,
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
                                {(directionNames.length > 1) && enableSwipeZone && (
                                    <>
                                        <Divider />
                                        <View style={styles.swipeZone}>
                                            <Text style={styles.swipeZoneText}>{`<<< Safe Swipe Zone >>>`}</Text>
                                        </View>
                                    </>
                                )}
                            </View>
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
                </PagerView>
            </View>
        </View >
    )
}