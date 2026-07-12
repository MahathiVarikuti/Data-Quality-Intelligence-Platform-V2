import api from "./axios";

export async function getProfile(id) {
    const { data } = await api.get(`profile/${id}/`);
    return data;
}