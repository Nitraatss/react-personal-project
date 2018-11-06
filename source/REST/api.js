import { MAIN_URL, TOKEN } from "./config";

export const api = {
    async fetchTasks () {
        const response = await fetch(MAIN_URL, {
            method:  "GET",
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.status !== 200) {
            throw new Error("Fetch error");
        }

        const { data: tasks } = await response.json();

        return tasks;
    },

    async createTask (message) {
        const response = await fetch(MAIN_URL, {
            method:  "POST",
            headers: {
                authorization:  TOKEN,
                "content-type": "application/json",
            },
            body: JSON.stringify({ message }),
        });

        if (response.status !== 200) {
            throw new Error("Create error");
        }

        const { data } = await response.json();

        return data;
    },

    async removeTask (id) {
        const response = await fetch(`${MAIN_URL}/${id}`, {
            method:  "DELETE",
            headers: {
                authorization: TOKEN,
            },
        });

        if (response.status !== 204) {
            throw new Error("Delete error");
        }

        return true;
    },

    async updateTask (arr) {
        const response = await fetch(MAIN_URL, {
            method:  "PUT",
            headers: {
                authorization:  TOKEN,
                "content-type": "application/json",
            },
            body: JSON.stringify(arr),
        });

        if (response.status !== 200) {
            throw new Error("Update error");
        }

        return true;
    },
};
