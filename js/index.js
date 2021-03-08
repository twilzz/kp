document.addEventListener("DOMContentLoaded", () => {
  const resultDiv = document.querySelector(".result_grid_body"),
    buttonPlace = document.querySelector(".button_line"),
    divExist = document.querySelector('.exist');
  let subButton, buttonReset;
  let prices = [];

  const buttonAdd = document.querySelector("#add2base"),
    buttonShow = document.querySelector("#showbase"),
    buttonStart = document.querySelector("#startCalc"),
    popupWindow = document.querySelector(".popup__window");

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
    newGridTop.classList.add("result_grid_top");
    newGridTop.innerHTML = `<div class='result_grid_position'>ID</div>
                          <div class='result_grid_position'>Тип</div>
                          <div class='result_grid_position'>Описание позиции</div>
                          <div class='result_grid_position'>Коэфф</div>
                          <div class='result_grid_position'>СЕБЕСТ ед.</div>
                          `;
    popupWindow.append(newGridTop);
    getData();
  });
  buttonStart.addEventListener("click", () => {
    generateWindow();
  });
  function generateWindow() {
    popupWindow.classList.toggle("popup__window_show");
    while (popupWindow.firstChild) {
      popupWindow.removeChild(popupWindow.firstChild);
    }
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

  async function getData() {
    await axios.get("http://localhost:3000/products").then((data) => {
      data.data.forEach((item) => {
        renderExists(item);
      });
      subButton = document.createElement("button");
      subButton.innerText = "Добавить в расчет";
      subButton.style.width ='150px';
      subButton.style.marginTop ='5px';
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
    rows.forEach((item, index) => {
      if (item.classList.contains("result_grid_clicked")) {
        divExist.append(item);
        // item.classList.remove("result_grid_clicked");
      } else {
        item.remove();
      }
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

});
