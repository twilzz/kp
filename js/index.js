document.addEventListener("DOMContentLoaded", () => {
  const resultDiv = document.querySelector(".result_grid_body"),
    buttonPlace = document.querySelector(".button_line"),
    stepText = document.querySelector(".exist p");
  let subButton, buttonReset;
  let prices = [];

  
  getData();

const buttonAdd = document.querySelector('#add2base'),
      buttonShow = document.querySelector('#showbase'),
      buttonStart = document.querySelector('#startCalc'),
      popupWindow = document.querySelector('.popup__window');

      buttonAdd.addEventListener('click', ()=> {
        generateWindow();
        popupWindow.innerHTML = `<div class="form">
                                  <form class="add_form">
                                  <p style="text-align: center;">Добавть продукт в базу JSON</p>
                                  <select name="type">
                                    <option value="none" hidden>Выбрать тип</option>
                                    <option value="potolok">Потолок</option>
                                    <option value="walls">Стены</option>
                                    <option value="doors">Двери</option>
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
      buttonShow.addEventListener('click', ()=> {
        generateWindow();
        if (popupWindow.firstChild) {
        popupWindow.removeChild(popupWindow.firstChild);
        }
      });
      buttonStart.addEventListener('click', ()=> {
        generateWindow();
        if (popupWindow.firstChild) {
          popupWindow.removeChild(popupWindow.firstChild);
          }
      });
  function generateWindow() {
    popupWindow.classList.toggle('popup__window_show');
  }

  //ШАГ 1 - СБОР РАСЧЕТНОГО ЛИСТА
  function postData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let formData = new FormData(form);
      let postObject = Object.fromEntries(formData.entries());
      axios.post("http://localhost:3000/products", postObject);
    });
  }

  function getData() {
    stepText.textContent =
      "Шаг 1 - Выбор позиций  для коммерческого предложения";
    axios.get("http://localhost:3000/products").then((data) => {
      data.data.forEach((item) => {
        renderExists(item);
      });
      subButton = document.createElement("button");
      subButton.innerText = "Собрать";
      buttonPlace.append(subButton);
      const rowOfProduct = document.querySelectorAll(".result_grid");
      rowOfProduct.forEach((item, index) =>
        item.addEventListener("click", () => {
          item.classList.toggle(`result_grid_clicked`);
        })
      );
      subButton.addEventListener("click", () => {
        filterRows(".result_grid");
      });
    });
  }

  function renderExists({ id, type, descripton, koeff, price }) {
    const newRow = document.createElement("div");
    newRow.classList.add("result_grid");
    newRow.innerHTML = `<div class='result_grid_position'>${id}</div>
                        <div class='result_grid_position' name="type">${type}</div>
                        <div class='result_grid_position' style="text-align:left" data-koeff="${koeff}" data-price="${price}">${descripton}</div>
                        <div class='result_grid_position' name="koeff">${koeff}</div>
                        <div class='result_grid_position' name="price">${price}</div>`;
    resultDiv.append(newRow);
  }

  function filterRows(selector) {
    const rows = document.querySelectorAll(selector);
    stepText.textContent = "Шаг 1 - Проверка собранного листа";
    rows.forEach((item, index) => {
      if (item.classList.contains("result_grid_clicked")) {
        item.classList.remove("result_grid_clicked");
      } else {
        item.remove();
      }
    });
    recreateButtons("Следующий  шаг", recreateNewData);
    buttonReset = document.createElement("button");
    buttonReset.innerText = "Сбросить лист";
    buttonPlace.append(buttonReset);
    buttonReset.addEventListener("click", () => {
      let rows = document.querySelectorAll(selector);
      rows.forEach((item) => item.remove());
      subButton.remove();
      buttonReset.remove();
      getData();
    });
  }
  //ШАГ 2 - РАБОТА С ОБЪЕМАМИ
  function recreateNewData() {
    const gridTopParent = document.querySelector(".result_grid_top");
    gridTopParent.remove();
    let newGridTop = document.createElement("div");
    newGridTop.classList.add("result_grid_top");
    newGridTop.style.gridTemplateColumns = "0.5fr 3fr 0.5fr 0.5fr 0.5fr";
    newGridTop.innerHTML = `<div class='result_grid_position'>ID</div>
                          <div class='result_grid_position'>ОПИСАНИЕ</div>
                          <div class='result_grid_position'>ЦЕНА ЗА ЕД</div>
                          <div class='result_grid_position'>КОЛИЧЕСТВО</div>
                          <div class='result_grid_position'>ЦЕНА ОБЪЕМА</div>
                          `;
    resultDiv.before(newGridTop);
    let divs = document.querySelectorAll(".result_grid_position");
    divs.forEach((item) => {
      if (
        item.getAttribute("name") == "type" ||
        item.getAttribute("name") == "koeff"
      ) {
        item.remove();
      }
      if (item.getAttribute("name") == "price") {
        item.textContent =
          item.previousElementSibling.getAttribute(`data-koeff`) *
          item.previousElementSibling.getAttribute(`data-price`);
      }
    });
    let divsParent = document.querySelectorAll(".result_grid");
    divsParent.forEach((item) => {
      item.style.gridTemplateColumns = "0.5fr 3fr 0.5fr 0.5fr 0.5fr";
      let quantityDiv = document.createElement("div");
      quantityDiv.classList.add("result_grid_position");
      quantityDiv.setAttribute("name", "quantity");
      quantityDiv.innerHTML = `<input type="text" placeholder="Кол-во">`;
      item.appendChild(quantityDiv);
      let totalDiv = document.createElement("div");
      totalDiv.classList.add("result_grid_position");
      totalDiv.innerHTML = `<span style="text-align: center">0</span>руб`;
      item.appendChild(totalDiv);
    });
    recreateButtons("К расчету", reducePrices);
    startCalculating();
  }
  function startCalculating() {
    const quantityInputs = document.querySelectorAll(
      ".result_grid_position input"
    );
    quantityInputs.forEach((item) => {
      item.addEventListener("input", () => {
        item.parentElement.nextSibling.innerHTML = `<span>${
          item.value * +item.parentElement.previousSibling.textContent
        }</span>руб.`;
      });
    });
  }

  function reducePrices() {
    let spanPrices = document.querySelectorAll("span");
    spanPrices.forEach((item) => prices.push(+item.textContent));
    console.log(prices.reduce((a, b) => a + b));
  }
  function recreateButtons(buttonText, func) {
    subButton.remove();
    subButton = document.createElement("button");
    subButton.innerText = buttonText;
    buttonPlace.append(subButton);
    subButton.addEventListener("click", func);
  }
});
