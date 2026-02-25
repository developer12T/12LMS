import { defineStore } from 'pinia';

export const useUtilityStore = defineStore('utility', {
    state: () => ({
        selectedCheckboxes: [],
    }),
    actions: {
        updateSelectedCheckboxes(checkboxes) {
            this.selectedCheckboxes = checkboxes;
        },
    },
});
