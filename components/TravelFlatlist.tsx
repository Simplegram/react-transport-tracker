import { useTheme } from "@/context/ThemeContext"
import { useLoading } from "@/hooks/useLoading"
import { colors } from "@/src/const/color"
import { travelCardStyles } from "@/src/styles/TravelListStyles"
import { DataItemWithNewKey } from "@/src/utils/dataUtils"
import { PropsWithChildren } from "react"
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native"
import LoadingScreen from "./LoadingScreen"
import TravelCard from "./TravelCard"

interface TravelHeaderProps {
    index: number
    directionNameKey: string
    directionNamesLength: number
    theme: 'light' | 'dark'
    onPress: (key: string) => void
}

interface TravelFlatlistProps {
    items: DataItemWithNewKey[]
    onPress: (directionNameKey: string, itemIndex: number) => void
    refetch: () => void
    travelHeaderProps: TravelHeaderProps
}

export default function TravelFlatlist({ items, onPress, refetch, travelHeaderProps }: TravelFlatlistProps) {
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
                            directionNameKey={travelHeaderProps.directionNameKey}
                            onPress={onPress}
                        />
                    )}
                    contentContainerStyle={travelCardStyles[theme].cardHolder}
                    ListHeaderComponent={TravelFlatlistHeader({ ...travelHeaderProps, theme: theme })}
                    ListHeaderComponentStyle={{ flex: 1 }}
                />
            )}
        </>
    )
}

export function EmptyHeaderComponent({ children }: PropsWithChildren) {
    const { height, width } = useWindowDimensions()

    const minHeight = width < height ? height * 0.3 : 0

    return (
        <View style={{ flex: 1, minHeight: minHeight, justifyContent: 'center', alignItems: 'center' }}>
            {children}
        </View>
    )
}

export function TravelFlatlistHeader({ index, directionNameKey, directionNamesLength, theme, onPress }: TravelHeaderProps) {
    return (
        <EmptyHeaderComponent>
            <Pressable onPress={() => onPress(directionNameKey)}>
                <Text style={styles[theme].title}>
                    Direction ({index + 1}/{directionNamesLength}):
                </Text>
                <Text style={styles[theme].label}>
                    {directionNameKey}
                </Text>
            </Pressable>
        </EmptyHeaderComponent>
    )
}

const lightStyles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2c3e50'
    },
})

const styles = {
    light: { ...lightStyles, label: lightStyles.title },
    dark: StyleSheet.create({
        title: {
            ...lightStyles.title,
            color: colors.white_300,
        },
        label: {
            ...lightStyles.title,
            color: colors.white_100,
        },
    })
}