// filter.js

// Устанавливаем соответствие между полями формы и столбцами таблицы
let correspond = {
    "Название": "structure",
    "Тип": "category",
    "Страна": "country",
    "Город": "city",
    "Год": ["yearFrom", "yearTo"],
    "Высота": ["heightFrom", "heightTo"]
};

// Функция для обработки данных формы
let dataFilter = (dataForm) => {

    let dictFilter = {};
    // перебираем все элементы формы с фильтрами

    for(let j = 0; j < dataForm.elements.length; j++) {

        // выделяем очередной элемент формы
        let item = dataForm.elements[j];

        // получаем значение элемента
        let valInput = item.value;

        // если поле типа text - приводим его значение к нижнему регистру
        if (item.type == "text") {
            valInput = valInput.toLowerCase();
        } else if (item.type == "number") {
            valInput = Number(valInput);
        }


        if (valInput == '') {
            if (item.id.indexOf("From") != -1){
                valInput = -Infinity;
            } else if (item.id.indexOf("To") != -1){
                valInput = Infinity;
            }
        }
        // формируем очередной элемент ассоциативного массива
        dictFilter[item.id] = valInput;
    }
    return dictFilter;
}

let filterTable = (data, idTable, dataForm) =>{

    // получаем данные из полей формы
    let datafilter = dataFilter(dataForm);

    // выбираем данные соответствующие фильтру и формируем таблицу из них
    let tableFilter = data.filter(item => {

        /* в этой переменной будут "накапливаться" результаты сравнения данных
           с параметрами фильтра */
        let result = true;

        // строка соответствует фильтру, если сравнение всех значения из input
        // со значением ячейки очередной строки - истина
        for(let key in item) {

            let val = item[key];

            // текстовые поля проверяем на вхождение
            if (typeof val == 'string') {
                val = item[key].toLowerCase()
                result &&= val.indexOf(datafilter[correspond[key]]) !== -1
            } else if (typeof val == 'number'){

                let fr = datafilter[correspond[key][0]];
                let till = datafilter[correspond[key][1]];

                result &&= val >= fr && val <= till;

            }
            // САМОСТОЯТЕЛЬНО проверить числовые поля на принадлежность интервалу

        }
        return result;
    });

    // САМОСТОЯТЕЛЬНО вызвать функцию, которая удаляет все строки таблицы с id=idTable
    clearTable(idTable);
    // показать на странице таблицу с отфильтрованными строками
    createTable(tableFilter, idTable);
}

function clearFilter(dataForm) {

    for(let j = 0; j < dataForm.elements.length; j++) {
        let item = dataForm.elements[j];
        if (item.type == "button") continue;
        item.value = "";
    }

    clearSort(document.getElementById('sort'));
}