import { useState } from "react"

export default function useStopModal() {
    const [showStopModal, setShowStopModal] = useState(false)
    const [editingStopField, setEditingStopField] = useState<string | undefined>(undefined)
    const [stopSearchQuery, setStopSearchQuery] = useState('')

    const openStopModal = (field?: string) => {
        if (field) setEditingStopField(field)
        setStopSearchQuery('') // Clear search query on opening
        setShowStopModal(true)
    }

    const openModal = () => {
        setShowStopModal(true)
    }

    const closeStopModal = () => {
        setShowStopModal(false)
        setEditingStopField(undefined)
        setStopSearchQuery('')
    }

    return {
        showStopModal,
        editingStopField,
        stopSearchQuery,
        setShowStopModal,
        setEditingStopField,
        setStopSearchQuery,
        openModal,
        openStopModal,
        closeStopModal
    }
}