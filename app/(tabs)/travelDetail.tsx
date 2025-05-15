import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage';
import LoadingScreen from '@/components/LoadingScreen';
import { useTravelContext } from '@/context/PageContext';
import { DataItem } from '@/src/types/Travels';
import { useFocusEffect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const formatDurationMinutes = (milliseconds: number): string => {
    if (isNaN(milliseconds) || milliseconds < 0) {
        return 'N/A';
    }
    const minutes = Math.floor(milliseconds / (1000 * 60));
    return `${minutes} mins`;
};

const formatDurationHoursMinutes = (milliseconds: number): string => {
    if (isNaN(milliseconds) || milliseconds < 0) {
        return 'N/A';
    }
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m / ${totalMinutes}m`;
};

export default function TravelDetail() {
    const { selectedTravelItems } = useTravelContext()

    const [dataToUse, setDataToUse] = useState<DataItem[]>([])

    if (!selectedTravelItems) {
        return (
            <LoadingScreen></LoadingScreen>
        )
    }

    useEffect(() => {
        setDataToUse(selectedTravelItems)
    }, [selectedTravelItems])

    useFocusEffect(
        React.useCallback(() => {
            setDataToUse(selectedTravelItems)
        }, [selectedTravelItems])
    )

    const sortedData = [...dataToUse].sort((a, b) => {
        const dateAInitialArrival = a.bus_initial_arrival ? new Date(a.bus_initial_arrival).getTime() : null;
        const dateBInitialArrival = b.bus_initial_arrival ? new Date(b.bus_initial_arrival).getTime() : null;

        if (dateAInitialArrival !== null && dateBInitialArrival !== null) {
            return dateAInitialArrival - dateBInitialArrival;
        }

        const dateACreatedAt = new Date(a.created_at).getTime();
        const dateBCreatedAt = new Date(b.created_at).getTime();

        return dateACreatedAt - dateBCreatedAt;
    });

    let totalOnRoadMilliseconds = 0;
    let earliestStartMillis: number | null = null;
    let latestEndMillis: number | null = null;
    let validTripCount = 0;
    let sumInitialStopDurationMilliseconds = 0;
    let uniqueVehicles = new Set<string>();
    let uniqueRoutes = new Set<string>();
    let uniqueOrigins = new Set<string>();
    let uniqueDestinations = new Set<string>();
    let tripsByType: { [key: string]: number } = {};


    sortedData.forEach(trip => {
        try {
            const initialArrivalDate = new Date(trip.bus_initial_arrival);
            const departureDate = new Date(trip.bus_initial_departure);
            const finalArrivalDate = new Date(trip.bus_final_arrival);

            const initialArrivalValid = !isNaN(initialArrivalDate.getTime());
            const departureValid = !isNaN(departureDate.getTime());
            const finalArrivalValid = !isNaN(finalArrivalDate.getTime());

            // --- Calculate Trip Duration and Update Overall Span ---
            if (departureValid && finalArrivalValid) {
                // Ensure arrival is not before departure (basic data integrity check)
                if (finalArrivalDate.getTime() >= departureDate.getTime()) {
                    totalOnRoadMilliseconds += finalArrivalDate.getTime() - departureDate.getTime();
                    validTripCount++; // Count this trip as valid for averaging durations

                    // Find earliest start across all valid trips
                    if (earliestStartMillis === null || departureDate.getTime() < earliestStartMillis) {
                        earliestStartMillis = departureDate.getTime();
                    }

                    // Find latest end across all valid trips
                    if (latestEndMillis === null || finalArrivalDate.getTime() > latestEndMillis) {
                        latestEndMillis = finalArrivalDate.getTime();
                    }

                } else {
                    console.warn(`Trip ID ${trip.id}: Final arrival (${trip.bus_final_arrival}) is before initial departure (${trip.bus_initial_departure}). Excluding from duration calcs.`);
                }
            } else {
                console.warn(`Trip ID ${trip.id}: Invalid departure or final arrival date.`);
            }


            // --- Calculate Time at Initial Stop ---
            if (initialArrivalValid && departureValid) {
                if (departureDate.getTime() >= initialArrivalDate.getTime()) {
                    sumInitialStopDurationMilliseconds += departureDate.getTime() - initialArrivalDate.getTime();
                } else {
                    console.warn(`Trip ID ${trip.id}: Initial departure (${trip.bus_initial_departure}) is before initial arrival (${trip.bus_initial_arrival}). Excluding from initial stop duration calc.`);
                }
            } else {
                console.warn(`Trip ID ${trip.id}: Invalid initial arrival or departure date for stop time calc.`);
            }


            // --- Collect Unique Items ---
            if (trip.vehicle_code) {
                uniqueVehicles.add(trip.vehicle_code);
            }
            if (trip.routes?.name) {
                uniqueRoutes.add(trip.routes.name);
            }
            if (trip.first_stop_id?.name) {
                uniqueOrigins.add(trip.first_stop_id.name);
            }
            if (trip.last_stop_id?.name) {
                uniqueDestinations.add(trip.last_stop_id.name);
            }

            // --- Count Trips by Type ---
            if (trip.types?.name) {
                tripsByType[trip.types.name] = (tripsByType[trip.types.name] || 0) + 1;
            }


        } catch (error) {
            console.error(`Error processing trip ID ${trip.id || 'unknown'}:`, error);
        }
    });

    // --- Final Calculations ---

    let totalCalendarSpanMilliseconds = 0;
    if (earliestStartMillis !== null && latestEndMillis !== null && latestEndMillis > earliestStartMillis) {
        totalCalendarSpanMilliseconds = latestEndMillis - earliestStartMillis;
    }

    let efficiencyPercentage = 0;
    if (totalCalendarSpanMilliseconds > 0) {
        efficiencyPercentage = (totalOnRoadMilliseconds / totalCalendarSpanMilliseconds) * 100;
    }

    // Convert Sets to Arrays for rendering
    const uniqueVehiclesList = [...uniqueVehicles.values()];
    const uniqueRoutesList = [...uniqueRoutes.values()];
    const uniqueOriginsList = [...uniqueOrigins.values()];
    const uniqueDestinationsList = [...uniqueDestinations.values()];

    return (
        <CollapsibleHeaderPage>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Efficiency Overview</Text>

                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Total Time Span:</Text>
                        <Text style={styles.valueText}>{formatDurationMinutes(totalCalendarSpanMilliseconds)}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Total On-Road Time:</Text>
                        <Text style={styles.valueText}>{formatDurationMinutes(totalOnRoadMilliseconds)}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Calculated Efficiency:</Text>
                        <Text style={[styles.valueText, styles.specialValue]}>
                            {efficiencyPercentage.toFixed(2)}%
                        </Text>
                    </View>
                </View>

                {sortedData.length > 0 && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Individual Trip Durations</Text>
                        {sortedData.sort(data => data.id).map((trip) => {
                            try {
                                const departureDate = new Date(trip.bus_initial_departure);
                                const finalArrivalDate = new Date(trip.bus_final_arrival);
                                const durationMillis = finalArrivalDate.getTime() - departureDate.getTime();
                                const durationString = formatDurationHoursMinutes(durationMillis);

                                // Display trip identifier (e.g., Vehicle Code - Route Name)
                                const tripIdentifier = `${trip.vehicle_code || 'N/A'} - ${trip.routes?.name || 'N/A'}`;

                                return (
                                    <View key={trip.id} style={styles.detailRow}>
                                        <Text style={styles.label}>{tripIdentifier}:</Text>
                                        <Text style={styles.valueText}>{durationString}</Text>
                                    </View>
                                );
                            } catch (error) {
                                console.error(`Error calculating duration for trip ID ${trip.id || 'unknown'}:`, error);
                                return (
                                    <View key={trip.id} style={styles.detailRow}>
                                        <Text style={styles.label}>Trip ID {trip.id || 'N/A'} Duration:</Text>
                                        <Text style={styles.valueText}>Calculation Error</Text>
                                    </View>
                                );
                            }
                        })}
                    </View>
                )}

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Activity Counts</Text>

                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Total Trips Processed:</Text>
                        <Text style={styles.valueText}>{sortedData.length}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Valid Trips for Duration:</Text>
                        <Text style={styles.valueText}>{validTripCount}</Text>
                    </View>

                    {Object.keys(tripsByType).length > 0 && (
                        <View style={styles.detailRow}>
                            <Text style={styles.label}>Trips by Type:</Text>
                            <View style={styles.value}>
                                {Object.entries(tripsByType).map(([type, count]) => (
                                    <Text key={type} style={[styles.valueText, styles.specialValue]}>{type}: {count}</Text>
                                ))}
                            </View>
                        </View>
                    )}
                </View>

                {(uniqueVehiclesList.length > 0 || uniqueRoutesList.length > 0 || uniqueOriginsList.length > 0 || uniqueDestinationsList.length > 0) && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Unique Items</Text>

                        {uniqueVehiclesList.length > 0 && (
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Unique Vehicles ({uniqueVehiclesList.length}):</Text>
                                <View style={styles.value}>
                                    {uniqueVehiclesList.map((item, index) => (
                                        <Text key={index} style={[styles.valueText, styles.specialValue]}>{item}</Text>
                                    ))}
                                </View>
                            </View>
                        )}

                        {uniqueRoutesList.length > 0 && (
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Unique Routes ({uniqueRoutesList.length}):</Text>
                                <View style={styles.value}>
                                    {uniqueRoutesList.map((item, index) => (
                                        <Text key={index} style={styles.valueText}>{item}</Text>
                                    ))}
                                </View>
                            </View>
                        )}

                        {uniqueOriginsList.length > 0 && (
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Unique Origins ({uniqueOriginsList.length}):</Text>
                                <View style={styles.value}>
                                    {uniqueOriginsList.map((item, index) => (
                                        <Text key={index} style={styles.valueText}>{item}</Text>
                                    ))}
                                </View>
                            </View>
                        )}

                        {uniqueDestinationsList.length > 0 && (
                            <View style={styles.detailRow}>
                                <Text style={styles.label}>Unique Destinations ({uniqueDestinationsList.length}):</Text>
                                <View style={styles.value}>
                                    {uniqueDestinationsList.map((item, index) => (
                                        <Text key={index} style={styles.valueText}>{item}</Text>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </CollapsibleHeaderPage>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 15,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        borderWidth: 1,
        gap: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 8,
        color: '#555',
    },
    detailRow: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderRadius: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    value: {},
    valueText: {
        fontSize: 14,
        color: '#555',
        flexShrink: 1,
        fontWeight: 'bold',
    },
    specialValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007bff',
    },
});