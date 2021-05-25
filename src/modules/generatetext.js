/*После проверки таблицы расчета, функция вернет описание позиций
в блок текста с описанием */
export default function generateText(textOpt) {
  switch (textOpt) {
    case "Потолок":
      return "Потолочные панели из оцинкованной стали, поверхность которых обработана специальным лаком и защищена ПЭ пленкой, в виде кассет 600*600 для внутренней отделки потолков стерильных помещений; выполняются   в   герметичном исполнении, комплектуется необходимыми монтажными элементами, обладают высокой устойчивостью к химическим средствам и дезинфицирующим и чистящим химикатам.";
    case "Стены":
      return "Специализированный материал, основой которого являются листы из оцинкованной стали, обработанные специальным лаком и защищенные ПЭ пленкой.";
    case "Двери":
      return " Герметичные двери. Дверное полотно, заполненное внутри изолирующим негорючим материалом, корпус дверной створки образован фасонной кассетой, изготовленной методом точной формовки из оцинкованной или нержавеющей стали, поверхность которых обработана специальным лаком и защищена ПЭ пленкой. По периметру корпуса вклеены ребра жесткости дверной створки, для крепления петли и замка. В качестве стандартного заполнителя используется минеральное волокно. Двери оснащаются механическими доводчиками, для закрытия дверной створки, при необходимости возможно использования автоматического привода.";
    default:
      return "Позиции не выбраны";
  }
}