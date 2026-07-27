const url = 'https://fakestoreapi.com/products';

export const getProducts = async () =>{
    const {data:products} = await useFetch(url,{
        method:'GET'
    })
    return products;
}
