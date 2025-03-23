import { AxiosInstance } from "axios"


export const createShortUrl = async (authedApiClient: AxiosInstance, url: string) => {
    const response = await authedApiClient.post('/shorten/create-short-url', { long_url: url })
    return response.data
}