export default async function getDataTest(func,ids = null) {

    if (ids) {
        await axios.get("https://api.jsonbin.io/v3/b/60acd4efb2b1d74df21d2454/latest", {
            headers: {"X-Master-Key": "$2b$10$45OT.WYgKBbFDtaPeXP0EOzc4/qU/A7Iv5ie9iTYzYD6ns.SzidtS"}
        })
        .then(data => func(data.data.record.products, ids))
        .catch((err) => {
            if (err.response) {
                alert(err.response.data);
                alert(err.response.status);
                alert(err.response.headers);
            } else if (err.request) {
                alert(err.request);
            } else {
                alert('Error', err.message);
            }
        });
    } else {
        await axios.get("https://api.jsonbin.io/v3/b/60acd4efb2b1d74df21d2454/latest", {
                        headers: 
                        {"X-Master-Key": "$2b$10$45OT.WYgKBbFDtaPeXP0EOzc4/qU/A7Iv5ie9iTYzYD6ns.SzidtS"}
                })
                .then((data) => {
                    func(data.data.record.products)})
                .catch((err) => {
                    showErrMsg();
                    if (err.response) {
                        console.log(err.response.data);
                        console.log(err.response.status);
                        console.log(err.response.headers);
                    } else if (err.request) {
                        console.log(err.request);
                    } else {
                        console.log('Error', err.message);
                    }
                });
        }
    }
    

function showErrMsg() {
    let errDiv = document.querySelector('.result_grid_body')
    errDiv.innerHTML = `<p>Ошибка Связи с сервером.</p>`    
}
