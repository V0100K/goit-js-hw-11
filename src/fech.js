export async function fetchPictures(q) {
    const params = new URLSearchParams({
        per_page: config.per_page,
        page: config.page,
    });

    const response = await axios.get(
        `${config.baseLink}?${
            config.key
        }&q=${q}&${params.toString()}&orientation=horizontal&safesearch=true&image_type=photo`,
    );
    if (response.status >= 200 && response.status < 300) {
        return response.data;
    }
    throw new Error(
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.'),
    );
}
