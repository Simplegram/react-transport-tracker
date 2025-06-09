import Button from '@/components/button/BaseButton'
import DataButtonBase, { ItemTemplate } from '@/components/button/DatalistButton'
import Container from '@/components/Container'
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
import { useFocusEffect } from 'expo-router'
import React from 'react'
import { Alert, FlatList, View } from 'react-native'

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

    const renderItem = (item: ItemTemplate) => (
        <DataButtonBase
            name={item.name}
            onPress={() => handleModify(item)}
        >
            {dataType === "Stops" ? (
                <DataButtonBase.Stops {...item} />
            ) : null}
            {dataType === "Routes" ? (
                <DataButtonBase.Routes {...item} />
            ) : null}
        </DataButtonBase>
    )

    const ModalContentComponent = activeModalConfig?.content

    return (
        <Container style={{ flex: 1 }}>
            {loading || !dataType ? (
                <LoadingScreen />
            ) : (
                <>
                    {data.length === 0 ? (
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Input.Title>No {dataType} found.</Input.Title>
                        </View>
                    ) : (
                        <FlatList
                            refreshing={loading}
                            onRefresh={refetchTravelData}
                            data={data}
                            renderItem={({ item }) => renderItem(item)}
                            keyExtractor={item => item.id.toString()}
                            contentContainerStyle={{
                                gap: 8,
                                flexGrow: 1,
                            }}
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

                    <ModalTemplate.BottomInput
                        visible={showModal}
                        onRequestClose={closeModal}
                        title={activeModalConfig ? activeModalConfig.title : 'Modal'}
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
                    </ModalTemplate.BottomInput>
                </>
            )}
        </Container>
    )
}