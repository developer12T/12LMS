import { defineStore } from 'pinia';

export const usePageStore = defineStore('page', {
    state: () => ({
        currentPage: [],
    }),
    actions: {
        setPage(pageName) {
            this.currentPage = pageName;
            localStorage.setItem('pocoPage', pageName);
        },
        getPage(){
            this.currentPage = localStorage.getItem('pocoPage')
        }

    },
});