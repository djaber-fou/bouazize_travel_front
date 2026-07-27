import { useAuthStore } from "#imports"

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();
    const token = authStore.Authorization?.token;
    const user = authStore.User;

    // Admin pages (obfuscated hashes)
    const adminHashes = [
        '/gfljgan5465ds',
        '/x8dj29msk',
        '/p9q8w7e6r',
        '/c1m2n3b4v',
        '/v0o9i8u7y',
        '/v1p2l3m4k',
        '/o0m9r8a7o',
        '/o1m2r3a4o',
        '/v0o9y8a7o',
        '/v1o2y3a4o',
        '/b2n3m4k5l',
        '/c2c3p4p5',
        '/s3t4t5i6n'
    ];

    // Client/User protected pages (require login, any role except admin, or admin is fine too depending on business logic, but typically admin doesn't use client pages)
    const isClientPage = to.path.startsWith('/client') || to.path.startsWith('/payment') || to.path === '/profile';
    const isAdminPage = adminHashes.includes(to.path);
    const isAuthPage = to.path.startsWith('/auth');

    // 1. If trying to access a protected page without a token -> Redirect to login
    if ((isClientPage || isAdminPage) && !token) {
        return navigateTo('/auth/login');
    }

    // 2. If logged in and trying to access Auth pages (login/register) -> Redirect to appropriate dashboard
    if (token && isAuthPage) {
        if (user?.role === 'admin') {
            return navigateTo('/x8dj29msk'); // Main admin dashboard (users or global state)
        } else {
            return navigateTo('/profile');
        }
    }

    // 3. If logged in, prevent non-admins from accessing admin pages
    if (isAdminPage && token && user?.role !== 'admin') {
        return navigateTo('/');
    }

    // 4. If logged in, prevent admins from accessing client-specific pages (optional, but good practice if client pages are broken for admins)
    // if (isClientPage && token && user?.role === 'admin') {
    //     return navigateTo('/x8dj29msk');
    // }
});
