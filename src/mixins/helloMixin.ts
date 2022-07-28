export const helloMixin = {
    methods: {
        hello() {
            console.log("hello");
        }
    },
    created() {
        (this as any).hello();
    }
}