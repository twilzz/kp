import reducePrices from './modules/reducer';
import getDataTest from './modules/getpostdata';
import collectRows from './modules/collectrows';
import createCaculatingTable from './modules/createcaculatingtable';
import createNewButton from './modules/createbutton';
import html2pdf from 'html2pdf.js';
// import jsPDF from 'jspdf';
document.addEventListener("DOMContentLoaded", () => {
  //БЛОК ПОЗИЦИЙ ДЛЯ РАСЧЕТА И РАБОТЫ С БД


  const resultDiv = document.querySelector(".result_grid_body"),
        buttonAdd = document.querySelector("#add2base"),
        buttonShow = document.querySelector("#showbase"),
        buttonShowInfo = document.querySelector('#showinfo'),
        showInfoText = document.querySelector('.exist_text'),
        popupWindow = document.querySelector(".popup__window");
 
  
  buttonShowInfo.addEventListener('click', ()=> {
    showInfoText.classList.toggle('unhide');
  });
  buttonAdd.addEventListener("click", () => {
    generateWindow();
    popupWindow.innerHTML = `<div class="form">
                                  <form class="add_form">
                                  <p style="text-align: center;">Добавть продукт в базу JSON</p>
                                  <select name="type">
                                    <option value="none" hidden>Выбрать тип</option>
                                    <option value="Потолок">Потолок</option>
                                    <option value="Стены">Стены</option>
                                    <option value="Двери">Двери</option>
                                  </select>
                                  <input type="text" name="descripton" placeholder="Описание позиции">
                                  <input type="number" name="koeff" placeholder="Коэффициент">
                                  <input type="text" name="price" placeholder="Стоимость, руб">
                                  <input type="submit" value="Добавить">
                                </form>
                              </div>`;
    const form = document.querySelector("form");
    postData(form);
  });
//Входная кнопка для начала выбора позиций и расчета 
  buttonShow.addEventListener("click", () => {
    getDataTest(getTestDataHandler);
    // let newGridTop = document.createElement("div");
    // newGridTop.classList.add("result_grid_top_window");
    // newGridTop.innerHTML = `<div class='result_grid_position'>ID</div>
    //                         <div class='result_grid_position'>Тип</div>
    //                         <div class='result_grid_position'>Описание позиции</div>
    //                         <div class='result_grid_position'>СЕБЕСТ ед.</div>
    //                       `;
    // popupWindow.append(newGridTop);
    // getData();
  });
  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape") {
      generateWindow();
    }});
  function generateWindow() {
    popupWindow.classList.toggle("popup__window_show");
    while (popupWindow.firstChild) {
      popupWindow.removeChild(popupWindow.firstChild);
    }
  }

  function postData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let formData = new FormData(form);
      let postObject = Object.fromEntries(formData.entries());
      axios.post("http://localhost:3000/products", postObject);
    });
  }

 

// БЛОК ВВОДА ОБЩ ДАННЫХ
{
const saveBtn = document.querySelector('#saveBtn'), 
      editBtn = document.querySelector('#editBtn'),
      dataInsteadInputs = document.querySelectorAll('.values li');
    
saveBtn.addEventListener('click', ()=>{
  saveData();
});
editBtn.addEventListener('click', ()=>{
  editData();
});
function saveData (){
  dataInputs = document.querySelectorAll('.values input');
  dataInputs.forEach((input,index) => {
    if (!input.value) {
      input.style.borderColor = 'red';
      input.value = "Заполнить или 0";
      console.log(input.style);
    } else {
      saveBtn.disabled = true;
      dataInsteadInputs[index].innerHTML = `<span>${input.value}</span>`;
    }
})}
function editData(){
  const spans2Inputs = document.querySelectorAll('.values span'),
  li = document.querySelectorAll('.values li');
  li.forEach((inp, index) => {
  inp.innerHTML = `<input type="text" value='${spans2Inputs[index].textContent}'>`;
});
saveBtn.disabled = false;
}
}




/*Принимает массив из GET запроса в JSON сервер, мапит этот массив,
добавляя верстку в элементы массива */
function getTestDataHandler(array) {
  const mappedArray = array.map((element) => {
    return `<div data-id="${element.id}">${element.id}</div>
            <div>${element.type}</div>
            <div>${element.descripton}</div>
            <div>${element.price}</div>`;
  });
  createNewWindow(mappedArray, popupWindow,'products_row');
}

/* Oткрывает всплывающее окно и создает в нем строки с товарами на основе массива, обвешивает их
обработчиками для изменения класса по клику, создает кнопку для добавления в расчет */
function createNewWindow(arr, target, className) {
  generateWindow();
  const topRow = document.createElement("div");
    topRow.classList.add(`${className}_top`);
    topRow.innerHTML = `<div>ID</div><div>Тип</div>
                        <div>Описание позиции</div>
                        <div>Себ-сть</div>`;
    target.appendChild(topRow);
  for (let i=0; i<arr.length; i++){
    const newRow = document.createElement("div");
    newRow.classList.add(className);
    newRow.innerHTML = arr[i];
    target.appendChild(newRow);
  }
  let newRow = document.querySelectorAll(`.${className}`);
  newRow.forEach((elem,id) => {
    elem.addEventListener('click', ()=> {
      elem.classList.toggle(className+'_clicked');
    });
  });
  createNewButton('Добавить в расчет','add2calc',target,collectHandler);
}

//Обработчик кнопки "ДОБАВИТЬ В РАСЧЕТ"
function collectHandler(){
  let result = collectRows();
//повторно запрашивает данные с сервера, пробрасывая собранные IDшки
    getDataTest(rebuildListItems, result);
    if (result){
    generateWindow();
}}
//Обработчик кнопки "РАССЧИТАТЬ СУММУ"
function calcSumHandler() {
  document.querySelector('.total_result').textContent = reducePrices();
  createNewButton('Подготовить', 'prepPrint', resultDiv,prepare2Print);
}

/*Навешивает на инпуты количества материалов обработчик выполняющий расчеты и выводящий 
промежуточные результаты выбранных позиций в отдельный столбец итогов */
function calculatePosition() {
  const inputs = document.querySelectorAll('.result_grid_body input');
  const targets = document.querySelectorAll('.result_grid_body span');
  inputs.forEach((input, index) => {
    const price = +input.parentElement.previousElementSibling.innerText;
    input.addEventListener('input', ()=> {
      targets[index].innerText = (+input.value*price).toLocaleString(undefined,{style: 'currency', currency: 'RUB'});
    });
  });
}

/* Принимает данные с сервера, фильрует поступивший массив по
массиву собранных ID функции collectrows, отдает отфильтрованный массив
на постройку расчетной таблицы*/
function rebuildListItems(data,ids) {
  const filteredArray = [];
  ids.forEach((element) => {
   filteredArray.push(data.find(data => data.id === element));
  });
//отдает В данные на постройку интерфейса 
  if(document.querySelector('#removeMe')){
    document.querySelector('#removeMe').remove();
  }
  document.querySelector('.result_grid_top').style.display = 'grid';
  createCaculatingTable(filteredArray,"result_grid_body","result_rows");
  calculatePosition();
  createNewButton('Рассчитать сумму', 'sumCalc', resultDiv,calcSumHandler);
}
function prepare2Print() {
  const elements = document.querySelectorAll('[data-print]');
  elements.forEach(element => element.remove());
  console.log(elements);
  const inputs = document.querySelectorAll('.exist input');
  inputs.forEach(input => {
    input.parentElement.innerHTML = `<span>${input.value}</span>`;
  });
  createNewButton('Распечатать', 'printBtn', resultDiv,printDoc);
}
function printDoc() {
  console.log(`Заглушка`);
  const newPdfDoc = document.querySelector('.main');
  const printOptions = {
    margin: 5,
    jsPDF: {
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
     }
  };
  html2pdf(newPdfDoc,printOptions);
}

});
