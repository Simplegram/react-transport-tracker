import moment from 'moment'
import React from 'react'
import PagerView from 'react-native-pager-view'
import Divider from './Divider'

import TravelFlatlist from '@/components/TravelFlatlist'
import { useTravelContext } from '@/context/PageContext'
import { useSettings } from '@/context/SettingsContext'
import { useTheme } from '@/context/ThemeContext'
import { colors } from '@/src/const/color'
import { travelEmptyContainer } from '@/src/styles/TravelListStyles'
import { DataItemWithNewKey } from '@/src/utils/dataUtils'
import { router } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'

interface GroupedDataDisplayProps {
    data: Record<string, DataItemWithNewKey[]>
    currentDate: string
    refetch: () => void
}

export default function GroupedDataDisplay({ data: finalGroupedData, currentDate, refetch }: GroupedDataDisplayProps) {
    const { theme } = useTheme()
    const { enableSwipeZone } = useSettings()

    const { setSelectedItem, setSelectedTravelItems } = useTravelContext()

    const formattedCurrentDate = moment(currentDate).format('LL')

    const directionNames = Object.keys(finalGroupedData).sort()

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
                            <View key={directionNameKey} style={styles.cardCanvas}>
                                <TravelFlatlist
                                    items={finalGroupedData[directionNameKey]}
                                    onPress={handleItemPress}
                                    refetch={refetch}
                                    travelHeaderProps={{
                                        directionNameKey: directionNameKey,
                                        directionNamesLength: directionNames.length,
                                        index: index,
                                        theme: theme,
                                        onPress: handleViewTravelDetails
                                    }}
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
                <View style={[
                    travelEmptyContainer[theme].noDataContainer,
                    { borderColor: borderColor }
                ]}>
                    <Text style={travelEmptyContainer[theme].noDataText}>No data available to display</Text>
                </View>
            )}
        </View>
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
        paddingTop: 6,
        paddingLeft: 10,
        paddingBottom: 10,
        paddingRight: 10,
        borderWidth: 1,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    cardCanvas: {
        flex: 7,
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