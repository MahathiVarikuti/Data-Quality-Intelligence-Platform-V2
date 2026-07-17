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


export async function cleanDataset(
    id,
    action,
    options = {}
) {
    const { data } = await api.post(
        `clean/${id}/`,
        {
            action,
            ...options,
        }
    );

    return data;
}



export async function getDashboard() {
    const { data } = await api.get("dashboard/");
    return data;
}

export async function getReport(id) {
    const { data } = await api.get(`report/${id}/`);
    return data;
}


export async function deleteDataset(id) {
    await api.delete(
        `datasets/${id}/delete/`
    );
}


export async function renameDataset(id, name) {

    const { data } = await api.patch(
        `datasets/${id}/rename/`,
        {
            name,
        }
    );

    return data;
}

export async function getOutliers(id) {
    const { data } = await api.get(
        `datasets/${id}/outliers/`
    );

    return data;
}


export async function undoCleaning(id) {
    const { data } = await api.post(
        `datasets/${id}/undo/`
    );

    return data;
}


export async function restoreOriginal(id) {
    const { data } = await api.post(
        `datasets/${id}/restore/`
    );

    return data;
}