export default {
    form: {
        url: '',
        isValid: false,
    },
    process: {
        state: 'filling',
        watched: false,
    },
    message: {
        success: false,
        body: '',
    },
    rss: {
        feeds: [],
        posts: [],
        readPosts: new Set(),
    },
};