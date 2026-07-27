export const getCountries = async ()=>{
    const response = await sendApi('/visa');
    return response
}