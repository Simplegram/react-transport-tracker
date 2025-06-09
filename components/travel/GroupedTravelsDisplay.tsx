import moment from 'moment'
import React, { useEffect, useState } from 'react'
import PagerView from 'react-native-pager-view'
import Divider from '../Divider'

import { useSettings } from '@/context/SettingsContext'
import { useTheme } from '@/context/ThemeContext'
import { useTravelContext } from '@/context/TravelContext'
import { colors } from '@/src/const/color'
import { DataItemWithNewKey, getKeysSortedByCreatedAt } from '@/src/utils/dataUtils'
import { router } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { getDateString, getTimeString } from '@/src/utils/dateUtils'
import Input from '../input/Input'
import TravelCards from './TravelCards'

interface GroupedDataDisplayProps {
    data: Record<string, DataItemWithNewKey[]>
    currentDate: string
    refetch: () => void
}

export default function GroupedDataDisplay({ data: finalGroupedData, currentDate, refetch }: GroupedDataDisplayProps) {
    const { theme } = useTheme()
    const { enableSwipeZone } = useSettings()

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

    const borderColor = theme === 'light' ? colors.black : colors.white_300
    const dateLabelColor = theme === 'light' ? '#2c3e50' : colors.white_100
    const selectedDateColor = theme === 'light' ? '#2c3e50' : colors.white_300

    const styles = StyleSheet.create({
        content: {
            flex: 1.55,
            borderWidth: 1,
            borderColor: borderColor,
            borderRadius: 10,
            overflow: 'hidden',
            paddingHorizontal: 10,
            paddingBottom: 5,
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
            borderColor: borderColor,
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