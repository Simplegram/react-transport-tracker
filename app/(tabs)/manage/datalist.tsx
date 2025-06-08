import Button from '@/components/button/BaseButton'
import Divider from '@/components/Divider'
import Input from '@/components/input/Input'
import { TextInputBase } from '@/components/input/TextInput'
import LoadingScreen from '@/components/LoadingScreen'
import ModalTemplate from '@/components/ModalTemplate'
import { EmptyHeaderComponent } from '@/components/travel/TravelFlatlist'
import { useDataEditContext } from '@/context/DataEditContext'
import { useTheme } from '@/context/ThemeContext'
import useDataList from '@/hooks/useDataList'
import useDatalistModal from '@/hooks/useDatalistModal'
import useGetTravelData from '@/hooks/useGetTravelData'
import { useLoading } from '@/hooks/useLoading'
import useModalHandler from '@/hooks/useModalHandler'
import { colors } from '@/src/const/color'
import { DatalistStyles, ItemStyles } from '@/src/styles/DatalistStyles'
import { styles } from '@/src/styles/Styles'
import { useFocusEffect } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Keyboard, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome6'

interface ItemTemplate {
    id: string | number
    name: string
    [key: string]: any
}

export default function DataListScreen() {
    const { theme } = useTheme()

    const { setModalData } = useDataEditContext()

    const {
        directions,
        stops,
        routes,
        vehicleTypes,
        icons,
        refetchTravelData,
    } = useGetTravelData()

    const {
        dataType,
        filteredData: data,
        searchQuery, setSearchQuery,
    } = useDataList({ directions, stops, routes, vehicleTypes, icons })

    const {
        showModal,
        openModal, closeModal
    } = useModalHandler()

    const {
        activeModalConfig,
        setActiveModal, setActiveEditModal
    } = useDatalistModal(() => refetchTravelData(300))

    const {
        loading
    } = useLoading()

    const [keyboardShown, setKeyboardShown] = useState<boolean>(false)

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardShown(true)
        })
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardShown(false)
        })

        return () => {
            showSubscription.remove()
            hideSubscription.remove()
        }
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            refetchTravelData()
        }, [])
    )

    const handleModify = (item: ItemTemplate) => {
        setActiveEditModal(dataType)
        setModalData(item)
        openModal()
    }

    const handleAddNew = () => {
        setActiveModal(dataType)
        openModal()
    }

    const handleSubmitFromModal = (data: any) => {
        if (activeModalConfig?.onSubmitDataHandler) {
            activeModalConfig.onSubmitDataHandler(data)
        } else {
            console.error("No data handler defined for this modal config.")
            Alert.alert("Error", "Configuration error: Could not process data.")
        }
        closeModal()
    }

    const renderItem = ({ item }: { item: ItemTemplate }) => (
        <TouchableOpacity
            style={[
                ItemStyles[theme].itemContainer,
                { flex: 1, justifyContent: 'space-between' }
            ]}
            activeOpacity={0.8}
            onPress={() => handleModify(item)}
        >
            <View style={ItemStyles[theme].textContainer}>
                {dataType === "Stops" ? (
                    <>
                        <Icon style={styles[theme].icon} name={item.vehicle_type?.icon_id.name} size={20}></Icon>
                        <Text style={ItemStyles[theme].itemSubtitle}>{item.vehicle_type?.name}</Text>
                    </>
                ) : null}
                {dataType === "Routes" ? (
                    <>
                        <Icon style={styles[theme].icon} name={item.vehicle_type_id?.icon_id.name} size={20}></Icon>
                        <Text style={ItemStyles[theme].itemSubtitle}>{item.code}</Text>
                    </>
                ) : null}
                <Text style={ItemStyles[theme].itemTitle}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    )

    const ModalContentComponent = activeModalConfig?.content

    return (
        <View style={DatalistStyles[theme].container}>
            {loading || !dataType ? (
                <LoadingScreen />
            ) : (
                <>
                    {data.length === 0 ? (
                        <View style={DatalistStyles[theme].emptyContainer}>
                            <Text style={DatalistStyles[theme].emptyText}>No {dataType} found.</Text>
                        </View>
                    ) : (
                        <FlatList
                            refreshing={loading}
                            onRefresh={refetchTravelData}
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={item => item.id.toString()}
                            contentContainerStyle={DatalistStyles[theme].listContent}
                            columnWrapperStyle={{ gap: 8 }}
                            keyboardShouldPersistTaps={'always'}
                            ListHeaderComponent={EmptyHeaderComponent}
                            ListHeaderComponentStyle={{ flex: 1 }}
                            numColumns={2}
                        />
                    )}

                    <Divider />

                    <TextInputBase
                        value={searchQuery}
                        placeholder={`Search ${dataType}...`}
                        onChangeText={setSearchQuery}
                        style={theme === 'light' ? { borderColor: colors.black } : { borderColor: colors.white_100 }}
                    />

                    <Button.Row>
                        <Button.Add label={`Add New ${dataType.slice(0, -1)}`} onPress={handleAddNew} />
                    </Button.Row>

                    <ModalTemplate
                        isModalVisible={showModal}
                        handleCloseModal={closeModal}
                        title={activeModalConfig?.title}
                    >
                        {ModalContentComponent ? (
                            <ModalContentComponent
                                stops={stops}
                                icons={icons}
                                onSubmit={handleSubmitFromModal}
                                onCancel={closeModal}
                            />
                        ) : (
                            <Input.LoadingLabel />
                        )}
                    </ModalTemplate>
                </>
            )}
        </View>
    )
}