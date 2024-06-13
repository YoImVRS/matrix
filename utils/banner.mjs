import axios from 'axios';

const BANNER_URL = 'https://raw.githubusercontent.com/ottersek/matrix/main/banner';

async function getBanner() {
    try {
        const response = await axios.get(BANNER_URL);
        return response.data;
    } catch (error) {
        return 'Failed to load banner.';
    }
}

export { getBanner };
