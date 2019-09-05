const fetchLatestRates = async () => {
    console.log('fetchLatestRates')
    const endpoint = `https://api.exchangeratesapi.io/latest`

    const respone = await fetch(endpoint)
    const json = await respone.json()
    return json
}

const fetchHistory = async (startAt, endAt, symbols) => {
    console.log('fetchHistory')
    const endpoint = `https://api.exchangeratesapi.io/history?start_at=${startAt}&end_at=${endAt}&symbols=${symbols}`

    const respone = await fetch(endpoint)
    const json = await respone.json()
    return json
}

export {fetchLatestRates, fetchHistory};