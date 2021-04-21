export default async function getDataTest(func,ids = null) {
    if (ids) {
        await axios.get("http://localhost:3000/products").then((data) => func(data.data, ids));
    } else {
        await axios.get("http://localhost:3000/products").then((data) => func(data.data));
    }
    
}

