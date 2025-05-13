// components/CustomDateTimePicker.tsx
import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Pressable,
    ScrollView,
    Alert,
} from 'react-native';

interface CustomDateTimePickerProps {
    visible: boolean;
    initialDateTime: Date;
    onClose: () => void;
    onConfirm: (dateTime: Date) => void;
    incrementSeconds?: number;
}

const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
    visible,
    initialDateTime,
    onClose,
    onConfirm,
    incrementSeconds = 5,
}) => {
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [hours, setHours] = useState('');
    const [minutes, setMinutes] = useState('');
    const [seconds, setSeconds] = useState('');

    const updateStringPartsFromDate = (date: Date) => {
        setYear(date.getFullYear().toString());
        setMonth((date.getMonth() + 1).toString().padStart(2, '0'));
        setDay(date.getDate().toString().padStart(2, '0'));
        setHours(date.getHours().toString().padStart(2, '0'));
        setMinutes(date.getMinutes().toString().padStart(2, '0'));
        setSeconds(date.getSeconds().toString().padStart(2, '0'));
    };
    
    useEffect(() => {
        if (visible) {
            const dateToUse = initialDateTime instanceof Date && !isNaN(initialDateTime.getTime())
                ? new Date(initialDateTime) // Use a copy
                : new Date(); 
            updateStringPartsFromDate(dateToUse);
        }
    }, [visible, initialDateTime]);

    const handlePartChange = (part: 'year' | 'month' | 'day' | 'hours' | 'minutes' | 'seconds', value: string) => {
        const numericRegex = /^[0-9]*$/;
        if (!numericRegex.test(value)) return;

        switch (part) {
            case 'year': setYear(value.slice(0, 4)); break;
            case 'month': setMonth(value.slice(0, 2)); break;
            case 'day': setDay(value.slice(0, 2)); break;
            case 'hours': setHours(value.slice(0, 2)); break;
            case 'minutes': setMinutes(value.slice(0, 2)); break;
            case 'seconds': setSeconds(value.slice(0, 2)); break;
        }
    };

    const constructDateFromParts = (): Date | null => {
        const y = parseInt(year, 10);
        const m = parseInt(month, 10);
        const d = parseInt(day, 10);
        const h = parseInt(hours, 10);
        const min = parseInt(minutes, 10);
        const s = parseInt(seconds, 10);

        let errorMessage = "";

        if (isNaN(y) || isNaN(m) || isNaN(d) || isNaN(h) || isNaN(min) || isNaN(s)) {
            errorMessage = "One or more date/time fields are not valid numbers.";
        } else if (y < 1000 || y > 9999) {
            errorMessage = "Year must be between 1000 and 9999.";
        } else if (m < 1 || m > 12) {
            errorMessage = "Month must be between 1 and 12.";
        } else if (d < 1 || d > 31) { // Basic day validation
            errorMessage = "Day must be between 1 and 31.";
        } else if (h < 0 || h > 23) {
            errorMessage = "Hours must be between 0 and 23.";
        } else if (min < 0 || min > 59) {
            errorMessage = "Minutes must be between 0 and 59.";
        } else if (s < 0 || s > 59) {
            errorMessage = "Seconds must be between 0 and 59.";
        }

        if (errorMessage) {
            Alert.alert("Invalid Input", errorMessage);
            return null;
        }
        
        const date = new Date(y, m - 1, d, h, min, s); // Month is 0-indexed

        if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
            Alert.alert("Invalid Date", "The day is not valid for the selected month and year.");
            return null;
        }
        return date;
    };

    const handleTimeAdjustment = (adjustmentInSeconds: number) => {
        let currentDate = constructDateFromParts();
        if (!currentDate) {
            currentDate = initialDateTime instanceof Date && !isNaN(initialDateTime.getTime())
                ? new Date(initialDateTime)
                : new Date();
            updateStringPartsFromDate(currentDate);
             Alert.alert("Input Corrected", "Some date/time inputs were invalid and have been reset. Please try adjusting again.");
        }
        
        currentDate.setSeconds(currentDate.getSeconds() + adjustmentInSeconds);
        updateStringPartsFromDate(currentDate);
    };

    const handleConfirm = () => {
        const newDate = constructDateFromParts();
        if (newDate) {
            onConfirm(newDate);
        }
    };

    const handleTimeNow = () => {
        const timeNow = new Date()

        handlePartChange('year', timeNow.getFullYear().toString())
        handlePartChange('month', (timeNow.getMonth() + 1).toString().padStart(2, '0'))
        handlePartChange('day', timeNow.getDate().toString().padStart(2, '0'))
        handlePartChange('hours', timeNow.getHours().toString().padStart(2, '0'))
        handlePartChange('minutes', timeNow.getMinutes().toString().padStart(2, '0'))
        handlePartChange('seconds', timeNow.getSeconds().toString().padStart(2, '0'))
    }
    
    const inputRow = (label: string, value: string, onChangeText: (text: string) => void, placeholder: string, maxLength?: number) => (
        <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={styles.textInput}
                value={value}
                onChangeText={onChangeText}
                keyboardType="numeric"
                maxLength={maxLength}
                placeholder={placeholder}
                textAlign='center'
            />
        </View>
    );

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalBackdrop} onPress={onClose}>
                <Pressable onPress={(e) => e.stopPropagation()} style={styles.modalContainer}>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <Text style={styles.modalTitle}>Set Date and Time</Text>

                        <View style={styles.dateTimeSection}>
                            <View style={styles.timePicker}>
                                {inputRow('Year', year, (text) => handlePartChange('year', text), 'YYYY', 4)}
                                {inputRow('Month', month, (text) => handlePartChange('month', text), 'MM', 2)}
                                {inputRow('Day', day, (text) => handlePartChange('day', text), 'DD', 2)}
                            </View>
                        </View>

                        <View style={styles.dateTimeSection}>
                            <View style={styles.timePicker}>
                                {inputRow('Hours', hours, (text) => handlePartChange('hours', text), 'HH', 2)}
                                {inputRow('Minutes', minutes, (text) => handlePartChange('minutes', text), 'mm', 2)}
                                {inputRow('Seconds', seconds, (text) => handlePartChange('seconds', text), 'ss', 2)}
                            </View>
                        </View>

                        <View style={styles.timeAdjustmentButtons}>
                            <TouchableOpacity
                                style={styles.adjButton}
                                onPress={() => handleTimeAdjustment(-incrementSeconds)}
                            >
                                <Text style={styles.adjButtonText}>-{incrementSeconds}s</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.adjButton}
                                onPress={() => handleTimeAdjustment(incrementSeconds)}
                            >
                                <Text style={styles.adjButtonText}>+{incrementSeconds}s</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.adjButton, {backgroundColor: '#4CAF50'}]}
                                onPress={handleTimeNow}
                            >
                                <Text style={styles.adjButtonText}>Now</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
                                <Text style={styles.buttonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        width: '90%',
        maxHeight: '90%', // Increased max height
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    dateTimeSection: {
        marginBottom: 15,
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    timePicker: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    inputRow: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    inputLabel: {
        flex: 1, 
        fontSize: 16,
        minWidth: 70, 
        textAlign: 'center',
    },
    textInput: {
        flex: 1,
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: Platform.OS === 'ios' ? 10 : 8,
        fontSize: 16,
    },
    timeAdjustmentButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        gap: 10,
    },
    adjButton: {
        flex: 1,
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    adjButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        borderTopColor: '#eee',
        borderTopWidth: 1,
        paddingTop: 15,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginLeft: 10,
    },
    confirmButton: {
        backgroundColor: '#4CAF50', 
    },
    cancelButton: {
        backgroundColor: '#D32F2F', 
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CustomDateTimePicker;