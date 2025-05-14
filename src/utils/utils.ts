import { DataItem } from "../types/Travels";

const sortByIdToFront = (arr: any, targetId: number) => {
    // Find the index of the object with the targetId
    const targetIndex = arr.findIndex(item => item.id === targetId);

    // If the targetId is found, move the object to the front
    if (targetIndex !== -1) {
        const targetObject = arr[targetIndex];
        const newArray = [...arr]; // Create a copy to avoid modifying the original array
        newArray.splice(targetIndex, 1); // Remove the object from its original position
        newArray.unshift(targetObject); // Add the object to the beginning
        return newArray;
    }

    // If the targetId is not found, return the original array
    return arr;
};

function calculateDuration(item: DataItem): string | null {
    if (!item.bus_initial_departure || !item.bus_final_arrival) {
        return null; // Cannot calculate duration if dates are missing
    }

    const departureDate = new Date(item.bus_initial_departure);
    const arrivalDate = new Date(item.bus_final_arrival);

    // Check if dates are valid
    if (isNaN(departureDate.getTime()) || isNaN(arrivalDate.getTime())) {
        return null; // Invalid date format
    }

    const durationInMilliseconds = arrivalDate.getTime() - departureDate.getTime();

    // Handle cases where arrival is before departure (e.g., data error)
    if (durationInMilliseconds < 0) {
        return null;
    }

    const durationInSeconds = Math.floor(durationInMilliseconds / 1000);
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    let durationString = '';
    if (hours > 0) {
        durationString += `${hours}h`;
        if (minutes > 0 || seconds > 0) {
        durationString += ' ';
        }
    }
    if (minutes > 0) {
        durationString += `${minutes}m`;
        if (seconds > 0) {
        durationString += ' ';
        }
    }

    if (durationString === '') {
        return '0m';
    }

    return durationString.trim(); // Remove trailing space if any
}

export {
    sortByIdToFront,
    calculateDuration
}