import axios from 'axios';

export default class ApiService {
    #key = '23810235-9c8819ce57204f1ed3ab78a6e';
    BASE_URL = 'https://pixabay.com/api/';

    constructor() {
        this.page = 1;
        this.searchItem = '';
        this.per_page = 40;
    }
    async fetchGallery() {
        const queryParams = new URLSearchParams({
            key: this.#key,
            q: this.searchItem,

            page: this.page,
            per_page: this.per_page,
        });
        const res = await axios.get(`${this.BASE_URL}?${queryParams}`);
        return res.data;
    }
    incrementPage() {
        this.page += 1;
    }

    set newInput(input) {
        this.searchItem = input;
    }
}
