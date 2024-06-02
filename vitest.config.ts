import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        clearMocks: true,
        // reporters: ['html'],
        coverage: {
            provider: 'istanbul', // or 'v8'
            exclude: ['html/**']
        },
    }
})