export default {
    port: process.env.PORT,
    info: () => {
        console.log(`server is running on http://localhost:${process.env.PORT}`);
    },
}
