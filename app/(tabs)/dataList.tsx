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

interface ItemTemplate {
    id: string | number;
    name: string;
    [key: string]: any;
}

export default function DataListScreen() {
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
    } = useDatalistModal(() => refetchTravelData(500))

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
        <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
                {dataType === "Stops" ? (
                    <>
                        <Icon name={item.vehicle_type?.icon_id.name} size={20}></Icon>
                        <Text>{item.vehicle_type?.name}</Text>
                    </>
                ) : null}
                {dataType === "Routes" ? (
                    <>
                        <Icon name={item.vehicle_type_id?.icon_id.name} size={20}></Icon>
                        <Text style={[styles.itemName, { color: '#007bff' }]}>{item.code}</Text>
                    </>
                ) : null}
                <Text style={styles.itemName}>{item.name}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <View style={styles.fillerContainer}></View>
                <TouchableOpacity
                    style={styles.modifyButton}
                    onPress={() => handleModify(item)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.modifyButtonText}>Modify</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const ModalContentComponent = activeModalConfig?.content

    return (
        <View style={styles.container}>
            {loading || !dataType ? (
                <LoadingScreen />
            ) : (
                <>
                    {data.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No {dataType} found.</Text>
                        </View>
                    ) : (
                        <FlatList
                            refreshing={loading}
                            onRefresh={refetchTravelData}
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={item => item.id.toString()} // Ensure key is a string
                            contentContainerStyle={styles.listContent}
                            keyboardShouldPersistTaps={'always'}
                        />
                    )}

                    <TextInput
                        style={styles.modalSearchInput}
                        placeholder={`Search ${dataType}...`}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus={true}
                    />

                    <View style={styles.addButtonContainer}>
                        <Button
                            color='#007bff'
                            title={`Add New ${dataType.slice(0, -1)}`}
                            onPress={handleAddNew}
                            style={styles.button}
                            textStyle={styles.buttonText}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        gap: 10,
        backgroundColor: '#fff',
    },
    fillerContainer: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'column',
    },
    itemContainer: {
        padding: 10,
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#000',
        gap: 10,
    },
    textContainer: {
        flexDirection: 'column',
    },
    itemName: {
        flex: 1,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    modifyButton: {
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    modifyButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    listContent: {
        gap: 10,
    },
    addButtonContainer: {

    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
    },
    button: {
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    modalSearchInput: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
});