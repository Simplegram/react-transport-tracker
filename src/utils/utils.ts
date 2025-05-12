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

export {
    sortByIdToFront
}