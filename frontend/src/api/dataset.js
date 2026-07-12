import api from "./axios";

export async function getDatasets() {
    const { data } = await api.get("datasets/");
    return data;
}

export async function getDataset(id) {
    const { data } = await api.get(`datasets/${id}/`);
    return data;
}

export async function uploadDataset(file) {
    const formData = new FormData();

    formData.append("file", file);

    const { data } = await api.post(
        "datasets/upload/",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;
}


export async function getProfile(id) {
    const { data } = await api.get(`profile/${id}/`);
    return data;
}


export async function cleanDataset(id, action, columns = []) {
    const { data } = await api.post(
        `clean/${id}/`,
        {
            action,
            columns,
        }
    );

    return data;
}