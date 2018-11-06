import { MAIN_URL, TOKEN } from "./config";

export const api = {
    fetchTasks: async () => {
        const response = await fetch(`${MAIN_URL}/${TOKEN}`, {
            method: "GET",
        });

        const data = await response.json();

        console.log(data);
    },
};
