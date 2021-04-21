export default function collectRows() {
    const idArray = [];
    const rows = document.querySelectorAll('.products_row_clicked');
    if (rows.length === 0){
      console.log('Empty Row Array');
      return null;
    } else {
      rows.forEach(row => {
        idArray.push(+row.firstElementChild.getAttribute('data-id'));
      });
    }
    return idArray;
  }