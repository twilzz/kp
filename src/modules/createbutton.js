/*Создает Блок с кнопкой и обвешивает кнопку обработчиком 
!!!Универсальная Функция!!!*/
export default function createNewButton(text,id,place,handler) {
  if (document.querySelector('.div_btn')){
    place = document.querySelector('.div_btn');
    const newButton = document.createElement('button');
    newButton.setAttribute('id', id);
    newButton.innerText = text;
    place.appendChild(newButton);
  } else {
    const newButton = document.createElement('div');
    newButton.classList.add('div_btn');
    newButton.innerHTML = `<button id=${id}>${text}</button>`;
    place.appendChild(newButton);
  }
    document.getElementById(id).addEventListener('click', ()=> {
      
      handler();
    });
  }