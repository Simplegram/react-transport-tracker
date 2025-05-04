// src/types/ModalContentProps.ts (Create this file)
// Define the props that all specific modal content components will receive
export interface BaseModalContentProps {
  // onSubmit: Function to call when the user confirms "Add"
  // It should pass the collected data back to the parent
  onSubmit: (data: any) => void;
  // onCancel: Function to call when the user cancels
  onCancel: () => void;
}

// Example of a specific data type for a content component
export interface AddDirectionData {
    name: string;
}

export interface AddStopData {
    name: string;
    location: string; // Example additional field
}

// You can create specific prop types extending BaseModalContentProps
// if you need to pass additional data *down* to the content component,
// but for simple input collection, BaseModalContentProps is often enough.