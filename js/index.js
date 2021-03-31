document.addEventListener("DOMContentLoaded", () => {
  //БЛОК ПОЗИЦИЙ ДЛЯ РАСЧЕТА И РАБОТЫ С БД
{
  const resultDiv = document.querySelector(".result_grid_body"),
        buttonAdd = document.querySelector("#add2base"),
        buttonShow = document.querySelector("#showbase"),
        popupWindow = document.querySelector(".popup__window");
  let subButton;
  let prices = [];
showButton();
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
  buttonShow.addEventListener("click", () => {
    generateWindow();
    let newGridTop = document.createElement("div");
    newGridTop.classList.add("result_grid_top_window");
    newGridTop.innerHTML = `<div class='result_grid_position'>ID</div>
                            <div class='result_grid_position'>Тип</div>
                            <div class='result_grid_position'>Описание позиции</div>
                            <div class='result_grid_position'>Коэфф</div>
                            <div class='result_grid_position'>СЕБЕСТ ед.</div>
                          `;
    popupWindow.append(newGridTop);
    getData();
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
  async function getData() {
    await axios.get("http://localhost:3000/products").then((data) => {
      data.data.forEach((item) => {
        renderExists(item);
      });
      subButton = document.createElement("button");
      subButton.innerText = "Добавить в расчет";
      subButton.style.width = "150px";
      subButton.style.marginTop = "5px";
      popupWindow.append(subButton);
      const rowOfProduct = document.querySelectorAll(".result_grid");
      rowOfProduct.forEach((item, index) =>
        item.addEventListener("click", () => {
          item.classList.toggle(`result_grid_clicked`);
        })
      );
      subButton.addEventListener("click", () => {
        copyRows(".result_grid");
        generateWindow();
      });
    });
  }
  function renderExists({ id, type, descripton, koeff, price }) {
    const newRow = document.createElement("div");
    newRow.classList.add("result_grid");
    newRow.innerHTML = `<div class='result_grid_position'>${id}</div>
                        <div class='result_grid_position' style="border-left: 1px solid blue;border-right: 1px solid blue;" name="type">${type}</div>
                        <div class='result_grid_position' style="text-align:left; padding-left:5px" data-koeff="${koeff}" data-price="${price}">${descripton}</div>
                        <div class='result_grid_position' style="border-left: 1px solid blue;border-right: 1px solid blue;" name="koeff">${koeff}</div>
                        <div class='result_grid_position' name="price">${price}</div>`;
    popupWindow.append(newRow);
  }
  function copyRows(selector) {
    const rows = document.querySelectorAll(selector);
    rows.forEach((item) => {
      if (item.classList.contains("result_grid_clicked")) {
        let divs4remove = item.querySelectorAll("div");
        divs4remove.forEach((div) => {
          if (
            div.getAttribute("name") == "koeff" ||
            div.getAttribute("name") == "price"
          ) {
            div.remove();
          }
        });
        const newPriceDiv = document.createElement("div"),
              quantityDiv = document.createElement("div"),
              totalDiv = document.createElement("div");

        newPriceDiv.classList.add("result_grid_position");
        newPriceDiv.style.cssText = 'border-left: 1px solid blue; border-right: 1px solid blue;';
        quantityDiv.classList.add("result_grid_position");
        quantityDiv.style.borderRight = '1px solid blue';
        totalDiv.classList.add("result_grid_position");

        newPriceDiv.textContent = `${divs4remove[2].getAttribute('data-koeff')*divs4remove[2].getAttribute('data-price')}`;
        quantityDiv.setAttribute("name", "quantity");
        quantityDiv.innerHTML = `<input type="text" placeholder="Кол-во">`;
        totalDiv.innerHTML = `<span style="text-align: center">0</span>руб`;

        item.appendChild(newPriceDiv);
        item.appendChild(quantityDiv);
        item.appendChild(totalDiv);
        
        item.style.gridTemplateColumns = '0.5fr 0.5fr 3fr 0.5fr 1fr 0.5fr';
        item.classList.remove('result_grid_clicked');
        resultDiv.append(item);
      }
    });
    showButton();
    startCalculating();
  }
  function startCalculating() {
    const quantityInputs = document.querySelectorAll(
      ".result_grid_position input"
    );
    quantityInputs.forEach((item) => {
      item.addEventListener("input", () => {
        item.parentElement.nextSibling.innerHTML = `<span>${(item.value * +item.parentElement.previousSibling.textContent).toLocaleString()
        }</span> руб.`;
      });
    });
  }
  function reducePrices() {
    prices = [];
    let spanPrices = document.querySelectorAll("span");
    spanPrices.forEach((item) => {
      let newNum = item.textContent.replace(/\s/g,'');
      newNum = newNum.replace(/,/g,'.');
      prices.push(+newNum);
    });
    document.querySelector('.total_result div').textContent = `${(prices.reduce((a, b) => a + b)).toLocaleString()} руб`;
    console.log(prices.reduce((a, b) => a + b));
  }
  function showButton(){
    if (resultDiv.querySelector('div')) {
      console.log('not empty', resultDiv.querySelector('div'));
      document.querySelector('.button_line').style.display = 'grid';
      document.querySelector('.total_result').style.display = 'grid';
      document.querySelector('.result_grid_top').style.display = 'grid';
      const calcbutton = document.querySelector('.button_line button');
      calcbutton.addEventListener('click', ()=> {
        reducePrices();
      });
    } else {
      console.log('empty');
    }
  }
}
  // БЛОК СТАРТОВЫХ ЗНАЧЕНИЙ
const saveBtn = document.querySelector('#saveBtn'), 
      editBtn = document.querySelector('#editBtn'),
      dataLables = document.querySelectorAll('.headers li'),
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

});
