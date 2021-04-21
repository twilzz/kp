export default function createCaculatingTable(array, target, className) {
//Формирование верстки и запись ее в массив.
    const mappedArray = array.map(position => {
        let {id,type,descripton,koeff,price} = position;
        return `<div>${type}</div>
                <div>${descripton}</div>
                <div>${price*koeff}</div>
                <div><input type='text' placeholder='колво'></div>
                <div><span>0 руб.</span></div>
        `;
    });
//Размещение сверстанных элементов массива в целевом расчетном блоке страницы
    for (let i=0; i<array.length; i++){
        const newRow = document.createElement("div");
        newRow.classList.add(className);
        newRow.innerHTML = mappedArray[i];
        document.querySelector(`.${target}`).appendChild(newRow);
    }


}