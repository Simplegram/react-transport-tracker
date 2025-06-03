import moment from 'moment'
import React from 'react'
import PagerView from 'react-native-pager-view'
import Divider from '../Divider'

import { useSettings } from '@/context/SettingsContext'
import { useTheme } from '@/context/ThemeContext'
import { useTravelContext } from '@/context/TravelContext'
import { useLoading } from '@/hooks/useLoading'
import { colors } from '@/src/const/color'
import { travelEmptyContainer } from '@/src/styles/TravelListStyles'
import { DataItemWithNewKey, getKeysSortedByCreatedAt } from '@/src/utils/dataUtils'
import { router } from 'expo-router'
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'

import TravelCards from './TravelCards'
import { Header } from './TravelFlatlist'

interface GroupedDataDisplayProps {
    data: Record<string, DataItemWithNewKey[]>
    currentDate: string
    refetch: () => void
}

export default function GroupedDataDisplay({ data: finalGroupedData, currentDate, refetch }: GroupedDataDisplayProps) {
    const { theme } = useTheme()
    const { enableSwipeZone } = useSettings()

    const { loading } = useLoading()

    const { setSelectedItem, setSelectedTravelItems } = useTravelContext()

    const formattedCurrentDate = moment(currentDate).format('LL')

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

    const borderColor = theme === 'light' ? colors.black : colors.white_300
    const dateLabelColor = theme === 'light' ? '#2c3e50' : colors.white_100

    return (
        <View style={styles.mainContainer}>
            <Text style={[styles.groupTitle, { color: dateLabelColor }]}>
                {formattedCurrentDate}
            </Text>
            {directionNames.length > 0 ? (
                <PagerView
                    style={styles.pagerView}
                    initialPage={0}
                    key={directionNames.length}
                    pageMargin={10}
                >
                    {directionNames.map((directionNameKey, index) => (
                        <View key={directionNameKey} style={[styles.pagerViewContentContainer, { borderColor: borderColor }]}>
                            <Header
                                index={index}
                                directionNameKey={directionNameKey}
                                directionNamesLength={directionNames.length}
                                onPress={handleViewTravelDetails}
                            />
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
                                        <Text style={[styles.swipeZoneText, { color: dateLabelColor }]}>{`<<< Safe Swipe Zone >>>`}</Text>
                                    </View>
                                </>
                            )}
                        </View>
                    ))}
                </PagerView>
            ) : (
                <ScrollView
                    contentContainerStyle={[
                        travelEmptyContainer[theme].noDataContainer,
                        { borderColor: borderColor }
                    ]}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={refetch}
                        />
                    }
                >
                    <Text style={travelEmptyContainer[theme].noDataText}>No data available to display</Text>
                </ScrollView>
            )
            }
        </View >
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    pagerView: {
        flex: 1,
    },
    pagerViewContentContainer: {
        flex: 1,
        overflow: 'hidden',
        justifyContent: 'flex-end',
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
    },
    groupTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingBottom: 8,
        textAlign: 'center',
    },
})

const lightTextStyles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2c3e50'
    },
})

const textStyles = {
    light: { ...lightTextStyles, label: lightTextStyles.title },
    dark: StyleSheet.create({
        title: {
            ...lightTextStyles.title,
            color: colors.white_300,
        },
        label: {
            ...lightTextStyles.title,
            color: colors.white_100,
        },
    })
}