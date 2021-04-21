
export default function reducePrices(source='.result_grid_body span',target='.total_result') {
    const array = [];
    let spanPrices = document.querySelectorAll(source);
    console.log(spanPrices);
    spanPrices.forEach((item) => {
      let newNum = Number(item.textContent.slice(0,-2).replace(/\s+/g,'').replace(',','.'));
      array.push(newNum);
    });
    console.log(array);
    document.querySelector(target).style.display = 'grid';
     return array.reduce((a, b) => a + b).toLocaleString(undefined,{style: 'currency', currency: 'RUB'});
     
  }
