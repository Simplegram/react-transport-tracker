import { useEffect, useState } from "react";

export default function useModalLoading() {
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 500);
    }, [])

    return {
        loading
    }
}