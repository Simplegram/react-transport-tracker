import { useEffect, useState } from "react";

export default function useLoading(timeout: number = 500) {
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, timeout);
    }, [])

    return {
        loading
    }
}