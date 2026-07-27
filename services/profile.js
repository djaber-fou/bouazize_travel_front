export const getProfile = async ()=>{
    const authStore = useAuthStore()
    const url = authStore.User.role === "admin" ? "/admin/profile" : "/profile"
    const response = await sendApi(url,null,'GET');
    return response
}

export const changePassword = async (data)=>{
    const response = await sendApi('/auth/change-password',data,'PUT');
    return response;
}


