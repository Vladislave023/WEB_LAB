// Когда DOM полностью загружен
document.addEventListener("DOMContentLoaded", function() {
    let sortForm = document.getElementById('sort');
    setSortSelects(buildings, sortForm); // Инициализируем выпадающие списки сортировки

    let selects = sortForm.getElementsByTagName('select');
    
    // Настроим обработчик для первого селектора
    selects[0].addEventListener("change", function() {
        changeNextSelect(selects[1].id, selects[0]);
    });
});

// Очистка и сброс сортировки
function clearSort(dataForm) {
    let selects = dataForm.getElementsByTagName('select');

    // Сбрасываем все поля и их состояние
    for (let i = 0; i < selects.length; i++) {
        selects[i].selectedIndex = 0; // Сбрасываем индекс в select
        let checkBox = document.getElementById(selects[i].id + 'Desc');
        checkBox.checked = false; // Снимаем галочку с чекбокса

        if (i > 0) selects[i].disabled = true; // Отключаем поля, если это не первый select
    }

    // Перерисовываем таблицу
    clearTable('list');
    createTable(buildings, 'list');
    filterTable(buildings, 'list', document.getElementById('filter'));
}

// Функция для создания опций в select
function createOption(label, value) {
    let option = document.createElement('option');
    option.text = label;
    option.value = value;
    return option;
}

// Функция для настройки одного select с выбором для сортировки
function setSortSelect(options, selectElement) {
    selectElement.append(createOption('Нет', 0)); // Опция "Нет" для отсутствия сортировки
    options.forEach((option, index) => {
        selectElement.append(createOption(option, index + 1)); // Добавляем опции
    });
}

// Функция для настройки всех селектов на форме
function setSortSelects(data, dataForm) {
    let headers = Object.keys(data[0]); // Берем заголовки таблицы (ключи объектов)
    let allSelects = dataForm.getElementsByTagName('select');

    // Для каждого селекта настраиваем доступные варианты сортировки
    Array.from(allSelects).forEach((select, index) => {
        setSortSelect(headers, select);

        // Делаем неактивным все селекты, кроме первого
        if (index > 0) select.disabled = true;
    });
}

// Обработчик для изменения состояния следующего селекта в цепочке сортировки
function changeNextSelect(nextSelectId, currentSelect) {
    let nextSelect = document.getElementById(nextSelectId);
    nextSelect.disabled = false;
    nextSelect.innerHTML = currentSelect.innerHTML; // Копируем содержимое текущего select

    // Удаляем выбранную опцию из следующего select, если она была выбрана
    if (currentSelect.value != 0) {
        nextSelect.remove(currentSelect.value); // Убираем выбранный элемент
    } else {
        nextSelect.disabled = true; // Отключаем селект, если выбрана опция "Нет"
    }
}

// Создание массива для сортировки на основе выбранных значений
function createSortArr(dataForm) {
    let sortArr = [];
    let sortSelects = dataForm.getElementsByTagName('select');

    Array.from(sortSelects).forEach(select => {
        let sortValue = select.value;
        if (sortValue == 0) return; // Если выбрана опция "Нет", прекращаем

        let desc = document.getElementById(select.id + 'Desc').checked; // Получаем состояние чекбокса
        sortArr.push({
            column: sortValue - 1, // Индекс колонки для сортировки
            order: desc // Направление сортировки
        });
    });

    return sortArr;
}

// Основная функция сортировки таблицы
function sortTable(tableId, dataForm) {
    let sortArr = createSortArr(dataForm); // Получаем массив с параметрами сортировки

    if (sortArr.length === 0) return false; // Если нет сортировки, ничего не делаем

    let table = document.getElementById(tableId);
    let rows = Array.from(table.rows);

    let header = rows.shift(); // Убираем заголовок таблицы

    // Сортируем строки по выбранным критериям
    rows.sort((first, second) => {
        for (let { column, order } of sortArr) {
            let firstValue = first.cells[column].innerHTML;
            let secondValue = second.cells[column].innerHTML;

            // Сравниваем значения в ячейках
            if (firstValue > secondValue) return order ? -1 : 1;
            if (firstValue < secondValue) return order ? 1 : -1;
        }
        return 0;
    });

    // Перерисовываем таблицу с отсортированными строками
    clearTable(tableId);
    rows.unshift(header); // Восстанавливаем заголовок
    rows.forEach(row => table.append(row)); // Добавляем отсортированные строки обратно в таблицу
}
