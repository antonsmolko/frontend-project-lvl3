export default {
    form: {
        url: '',
        isValid: false,
        errorMessage: null,
    },
    process: {
        state: 'filling',
        response: {
        message: '',
        status: '',
        },
        watched: false,
    },
    rss: {
        feeds: [],
        posts: [],
        readPosts: new Set(),
    },
};