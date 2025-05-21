import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import Button from '@/components/BaseButton';
import LoadingScreen from '@/components/LoadingScreen';
import useDataList from '@/hooks/useDataList';
import ModalTemplate from '@/components/ModalTemplate';
import useStopModal from '@/hooks/useStopModal';
import useDatalistModal from '@/hooks/useDatalistModal';
import Icon from 'react-native-vector-icons/FontAwesome6'
import { useModalContext } from '@/context/ModalContext';
import { useLoading } from '@/hooks/useLoading';
import useGetTravelData from '@/hooks/useGetTravelData';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { buttonStyles } from '@/src/styles/ButtonStyles';
import { DatalistStyles, ItemStyles } from '@/src/styles/DatalistStyles';
import { colors } from '@/const/color';
import { inputStyles } from '@/src/styles/InputStyles';
import { styles } from '@/src/styles/Styles';

interface ItemTemplate {
    id: string | number;
    name: string;
    [key: string]: any;
}

export default function DataListScreen() {
    const { theme } = useTheme()

    const { setModalData } = useModalContext()

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
        showStopModal,
        openModal, closeStopModal
    } = useStopModal()

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
    };

    const handleAddNew = () => {
        setActiveModal(dataType)
        openModal()
    };

    const handleSubmitFromModal = (data: any) => {
        if (activeModalConfig?.onSubmitDataHandler) {
            // Call the specific handler defined in the config, passing the collected data
            activeModalConfig.onSubmitDataHandler(data);
        } else {
            console.error("No data handler defined for this modal config.");
            Alert.alert("Error", "Configuration error: Could not process data.");
        }
        // Always close the modal after handling submission
        closeStopModal();
    };

    const renderItem = ({ item }: { item: ItemTemplate }) => (
        <View style={ItemStyles[theme].itemContainer}>
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
            <View style={ItemStyles[theme].buttonContainer}>
                <View style={ItemStyles[theme].fillerContainer}></View>
                <TouchableOpacity
                    style={ItemStyles[theme].modifyButton}
                    onPress={() => handleModify(item)}
                    activeOpacity={0.8}
                >
                    <Text style={ItemStyles[theme].modifyButtonText}>Modify</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

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
                            keyExtractor={item => item.id.toString()} // Ensure key is a string
                            contentContainerStyle={DatalistStyles[theme].listContent}
                            keyboardShouldPersistTaps={'always'}
                        />
                    )}

                    <TextInput
                        style={inputStyles[theme].textInput}
                        placeholder={`Search ${dataType}...`}
                        placeholderTextColor={colors.text.placeholderGray}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus={true}
                    />

                    <View style={DatalistStyles[theme].addButtonContainer}>
                        <Button
                            title={`Add New ${dataType.slice(0, -1)}`}
                            onPress={handleAddNew}
                            style={[buttonStyles[theme].addButton, { flex: 0 }]}
                            textStyle={buttonStyles[theme].addButtonText}
                        />
                    </View>

                    <ModalTemplate
                        isModalVisible={showStopModal}
                        handleCloseModal={closeStopModal}
                        title={activeModalConfig?.title}
                    >
                        {ModalContentComponent ? (
                            <ModalContentComponent
                                stops={stops}
                                icons={icons}
                                onSubmit={handleSubmitFromModal}
                                onCancel={closeStopModal}
                            />
                        ) : (
                            <Text>Loading...</Text>
                        )}
                    </ModalTemplate>
                </>
            )}
        </View>
    );
};