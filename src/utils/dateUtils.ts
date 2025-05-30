import moment from "moment"

export const getTodayString = () => {
    const todaysDate = new Date().toISOString().split('T')[0].toString()
    return todaysDate
}

export const formatDate = (date: string) => {
    const cleanDate = date.replace("T", " ")
    const formattedDate = moment(cleanDate, "YYYY-MM-DD hh:mm:ss").format("HH:mm:ss")

    return formattedDate
}

export const getMonthsSinceEarliestDate = (dates: string[]): number => {
    if (!dates || dates.length === 0) {
        return 0
    }

    // Assuming dates are already sorted from getDates(), the first element is the earliest
    const earliestDate = moment(dates[0])
    const today = moment(getTodayString())

    const monthsDifference = today.diff(earliestDate, 'months') + 2

    return monthsDifference
}

export const getFutureMonthFromLatestDate = (dates: string[], offset: number = 0): number => {
    const today = moment(getTodayString())
    let latestDate = today

    if (dates && dates.length > 0) {
        latestDate = moment(dates[dates.length - 1])
    }

    const baseMonth = moment.max(latestDate.clone().startOf('month'), today.clone().startOf('month'))
    const futureMonth = baseMonth.clone().add(1 + offset, 'months')
    const monthsDifference = Math.abs(today.diff(futureMonth, 'months'))

    return monthsDifference
}