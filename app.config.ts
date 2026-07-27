export default defineAppConfig({
    ui:{
        formField:{
            slots:{
                root: '',
                wrapper: '',
                labelWrapper: '',
                label: 'text-primary font-bold',
                container: '',
                description: '',
                error: 'text-error text-sm font-thin',
                hint: '',
                help: '',
            },
        },
        navigationMenu:{
            slots:{
                list:'text-primary',
                link:'font-bold',

            },
        },
        button: {
            slots: {
              base: 'cursor-pointer',
            },
            defaultVariants: { size: 'md' }
        },
        card: {
            slots: { root: 'rounded-none' }
        }
    }
})