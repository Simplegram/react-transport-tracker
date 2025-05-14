import CollapsibleHeaderPage from '@/components/CollapsibleHeaderPage';
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';

// Define the type for a single trip data item (same as before)
interface TripData {
  bus_final_arrival: string;
  bus_initial_arrival: string;
  bus_initial_departure: string;
  created_at: string;
  directions: { id: number; name: string };
  first_stop_id: { id: number; name: string; vehicle_type: number };
  id: number;
  last_stop_id: { id: number; name: string; vehicle_type: number };
  notes: string | null;
  routes: { code: string; id: number; name: string };
  types: { id: number; name: string };
  vehicle_code: string;
}

// Mock data for the *entire dataset*
const mockAllTripsData: TripData[] = [
    {
        "bus_final_arrival": "2025-02-05T08:56:12",
        "bus_initial_arrival": "2025-02-05T08:47:29",
        "bus_initial_departure": "2025-02-05T08:47:57",
        "created_at": "2025-02-05T08:45:37.944931+07:00",
        "directions": {"id": 1, "name": "Pergi"},
        "first_stop_id": {"id": 48, "name": "Denpasar", "vehicle_type": 1},
        "id": 422,
        "last_stop_id": {"id": 6, "name": "Duren Tiga", "vehicle_type": 1},
        "notes": null,
        "routes": {"code": "6B", "id": 24, "name": "Ragunan - Balai Kota via Semanggi"},
        "types": {"id": 1, "name": "BUS"},
        "vehicle_code": "BMP-240208"
    },
    {
        "bus_final_arrival": "2025-02-05T09:38:48",
        "bus_initial_arrival": "2025-02-05T09:23:50",
        "bus_initial_departure": "2025-02-05T09:24:21",
        "created_at": "2025-02-05T09:12:05.123745+07:00",
        "directions": {"id": 1, "name": "Pergi"},
        "first_stop_id": {"id": 6, "name": "Duren Tiga", "vehicle_type": 1},
        "id": 423,
        "last_stop_id": {"id": 13, "name": "Jln. Kemang Timur XVII", "vehicle_type": 1},
        "notes": null,
        "routes": {"code": "5N", "id": 6, "name": "Ragunan - Kampung Melayu"},
        "types": {"id": 1, "name": "BUS"},
        "vehicle_code": "JDM-230045"
    },
    {
        "bus_final_arrival": "2025-02-05T08:44:13",
        "bus_initial_arrival": "2025-02-05T08:13:25",
        "bus_initial_departure": "2025-02-05T08:13:57",
        "created_at": "2025-02-05T08:14:10.00854+07:00",
        "directions": {"id": 1, "name": "Pergi"},
        "first_stop_id": {"id": 46, "name": "Tanjung Duren Arah Timur", "vehicle_type": 1},
        "id": 421,
        "last_stop_id": {"id": 48, "name": "Denpasar", "vehicle_type": 1},
        "notes": "Ga boleh duduk di tangga lantai",
        "routes": {"code": "9", "id": 20, "name": "Pinang Ranti - Pluit"},
        "types": {"id": 1, "name": "BUS"},
        "vehicle_code": "MYS-21276"
    },
    {
        "bus_final_arrival": "2025-02-05T08:10:50",
        "bus_initial_arrival": "2025-02-05T06:46:15",
        "bus_initial_departure": "2025-02-05T06:46:39",
        "created_at": "2025-02-05T06:29:56.226475+07:00",
        "directions": {"id": 1, "name": "Pergi"},
        "first_stop_id": {"id": 34, "name": "Pratama Abadi", "vehicle_type": 1},
        "id": 420,
        "last_stop_id": {"id": 56, "name": "Taman Anggrek", "vehicle_type": 1},
        "notes": "Beberapa truk mogok di tengah jalan tol depan Mall @ alsut",
        "routes": {"code": "S11", "id": 2, "name": "BSD (Serpong) - Jelambar"},
        "types": {"id": 1, "name": "BUS"},
        "vehicle_code": "TJ-0695"}
];

const formatDurationMinutes = (milliseconds: number): string => {
    if (isNaN(milliseconds) || milliseconds < 0) {
        return 'N/A';
    }
    const minutes = Math.floor(milliseconds / (1000 * 60));
    return `${minutes} mins`;
};

export default function TravelDetail() {
    // Use the prop data if available, otherwise use mock data
    const dataToUse = mockAllTripsData;

    // --- Calculations ---

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


    dataToUse.forEach(trip => {
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

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Activity Counts</Text>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Total Trips Processed:</Text>
                    <Text style={styles.valueText}>{dataToUse.length}</Text>
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
)};

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
        alignItems: 'flex-start', // Align items to the top if value wraps
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