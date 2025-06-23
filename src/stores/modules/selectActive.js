import { defineStore } from 'pinia';

export const usePageStore = defineStore('page', {
    state: () => ({
        currentPage: [],
    }),
    actions: {
        setPage(pageName) {
            this.currentPage = pageName;
            localStorage.setItem('pageMenu', pageName);
        },
        getPage(){
            this.currentPage = localStorage.getItem('pageMenu')
        }

    },
});