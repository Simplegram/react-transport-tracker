import { useLoading } from '@/hooks/useLoading';
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
import LoadingScreen from '../LoadingScreen';
import { useTheme } from '@/context/ThemeContext';
import { datetimePickerStyles } from '@/src/styles/DatetimePickerStyles';
import Divider from '../Divider';
import { inputStyles } from '@/src/styles/InputStyles';
import { colors } from '@/const/color';

interface CustomDateTimePickerProps {
    visible: boolean;
    initialDateTime: Date;
    onClose: () => void;
    onConfirm: (dateTime: Date) => void;
    incrementSeconds?: number;
}

export default function CustomDateTimePicker({
    visible,
    initialDateTime,
    onClose,
    onConfirm,
    incrementSeconds = 5,
}: CustomDateTimePickerProps) {
    const { theme } = useTheme()

    const { loading } = useLoading(250)

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
        const now = new Date()

        handlePartChange('year', now.getFullYear().toString())
        handlePartChange('month', (now.getMonth() + 1).toString().padStart(2, '0'))
        handlePartChange('day', now.getDate().toString().padStart(2, '0'))
        handlePartChange('hours', now.getHours().toString().padStart(2, '0'))
        handlePartChange('minutes', now.getMinutes().toString().padStart(2, '0'))
        handlePartChange('seconds', now.getSeconds().toString().padStart(2, '0'))
    }

    const inputRow = (label: string, value: string, onChangeText: (text: string) => void, placeholder: string, maxLength?: number) => (
        <View style={datetimePickerStyles[theme].inputRow}>
            <Text style={datetimePickerStyles[theme].inputLabel}>{label}</Text>
            <TextInput
                style={[inputStyles[theme].textInput, { width: '100%' }]}
                value={value}
                onChangeText={onChangeText}
                keyboardType="numeric"
                maxLength={maxLength}
                placeholder={placeholder}
                placeholderTextColor={colors.text.placeholderGray}
                textAlign='center'
            />
        </View>
    );

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={onClose}
        >
            {loading ? (
                <LoadingScreen></LoadingScreen>
            ) : (
                <Pressable style={datetimePickerStyles[theme].modalBackdrop} onPress={onClose}>
                    <Pressable onPress={(e) => e.stopPropagation()} style={datetimePickerStyles[theme].modalContainer}>
                        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={datetimePickerStyles[theme].scrollContainer}>
                            <Text style={datetimePickerStyles[theme].modalTitle}>Set Date and Time</Text>

                            <View style={datetimePickerStyles[theme].dateTimeSection}>
                                <View style={datetimePickerStyles[theme].timePicker}>
                                    {inputRow('Year', year, (text) => handlePartChange('year', text), 'YYYY', 4)}
                                    {inputRow('Month', month, (text) => handlePartChange('month', text), 'MM', 2)}
                                    {inputRow('Day', day, (text) => handlePartChange('day', text), 'DD', 2)}
                                </View>
                            </View>

                            <View style={datetimePickerStyles[theme].dateTimeSection}>
                                <View style={datetimePickerStyles[theme].timePicker}>
                                    {inputRow('Hours', hours, (text) => handlePartChange('hours', text), 'HH', 2)}
                                    {inputRow('Minutes', minutes, (text) => handlePartChange('minutes', text), 'mm', 2)}
                                    {inputRow('Seconds', seconds, (text) => handlePartChange('seconds', text), 'ss', 2)}
                                </View>
                            </View>

                            <Divider />

                            <View style={datetimePickerStyles[theme].actionButtons}>
                                <TouchableOpacity style={[datetimePickerStyles[theme].button, datetimePickerStyles[theme].cancelButton]} onPress={onClose}>
                                    <Text style={datetimePickerStyles[theme].buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[datetimePickerStyles[theme].nowButton]}
                                    onPress={handleTimeNow}
                                >
                                    <Text style={datetimePickerStyles[theme].buttonText}>Now</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[datetimePickerStyles[theme].button, datetimePickerStyles[theme].confirmButton]} onPress={handleConfirm}>
                                    <Text style={datetimePickerStyles[theme].buttonText}>Confirm</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </Pressable>
                </Pressable>
            )}
        </Modal>
    );
};