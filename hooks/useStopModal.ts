import { useState } from "react";

export default function useStopModal() {
    const [showStopModal, setShowStopModal] = useState(false);
    const [editingStopField, setEditingStopField] = useState<string | null>(null); 
    const [stopSearchQuery, setStopSearchQuery] = useState('');

    const openStopModal = (field: string) => {
        setEditingStopField(field);
        setStopSearchQuery(''); // Clear search query on opening
        setShowStopModal(true);
    };

    const closeStopModal = () => {
        setShowStopModal(false);
        setEditingStopField(null);
        setStopSearchQuery('');
    };

    return {
        showStopModal,
        editingStopField,
        stopSearchQuery,
        setShowStopModal,
        setEditingStopField,
        setStopSearchQuery,
        openStopModal,
        closeStopModal
    }
}