//Название игры
let gameName = '<div class="gameName">&lt;Why T&gt;..&lt;&frasl;why T&gt;</div>';

//Стартовое меню
let introModal = '<div class="intro">';
    introModal+= '<button id="startGame-btn" class="btn btn-primary">&lt;Start game&gt;</button>';
    introModal+= '<button id="records-btn"  class="btn btn-primary">&lt;Records&gt;</button>';
    introModal+= '<button id="rules-btn"  class="btn btn-primary">&lt;Rules&gt;</button></div>';

// Модальное окно "Начать игру"
let authModal = '<div class="form-group">'; 
    authModal +=    '<div class="playerName">';
    authModal +=        '<input class="area" type="text" id="name" name="name" placeholder="Введите ваше имя" onchange=check()>';
    authModal +=    '</div>';
    authModal +=    '<div class="gameType">';
    authModal +=        '<label class="control-labelRad" for="radios">Выберите тип игры</label>';
    authModal +=        '<div class="radio">';
    authModal +=            '<input type="radio" name="radios" id="game-test" onchange=check()>';
    authModal +=            '<label for="game-test">Тест</label>';
    authModal +=        '</div>';
    authModal +=        '<div class="radio">';
    authModal +=            '<input type="radio" name="radios" id="game-toWin" onchange=check()>';
    authModal +=            '<label for="game-toWin">Игра на выбывание</label>';
    authModal +=        '</div>';
    authModal +=    '</div>';
    authModal +=    '<div class="qQty">';
    authModal +=        '<label class="labelOptions" for="selectbasic">Кол-во вопросов</label>';
    authModal +=        '<select id="selectbasic" name="selectbasic" class="qQtyOptions">';
    authModal +=            '<option value="15" selected>15</option>';
    authModal +=            '<option value="21">21</option>';
    authModal +=            '<option value="30">30</option>';
    authModal +=        '</select>';
    authModal +=    '</div>';
    authModal += '</div>';

//Блок с вопросом
let questionModal = '<div id="question-container" class="question-container hide">';
    questionModal+= '  <div id="question" class="question">Question</div>';
    questionModal+= '  <div id="answer-buttons" class="buttons-grid"></div>';
    questionModal+= '</div>';

//Результат игры
let gameOverModal = '<div class="notification hide"><p>Игра завершена!</p></div>';

//Кнопки start, next, restart, res
let controlsModal = '<div class="controls">';
    // controlsModal += '<div class="notification hide"><p>Игра завершена!</p></div>';
    controlsModal += '<button id="res" class="res-btn hide">Results</button>';
    controlsModal += '<button id="start-btn" class="start-btn">START</button>';
    controlsModal += '<button id="next-btn" class="next-btn hide">NEXT</button>';
    controlsModal += '<button id="restart-btn" class="restart-btn hide">Restart</button>';
    controlsModal += '</div>';

//Таблица результатов
let resultsTable =     '<table id="usersRating">';
    resultsTable +=         '<thead class="table_header">';
    resultsTable +=         '<tr>';
    resultsTable +=             '<th>Рейтинг</th>';
    resultsTable +=             '<th>Пользователь</th>';
    resultsTable +=             '<th>Результат</th>';
    resultsTable +=             '<th>Тип игры</th>';
    resultsTable +=         '</tr>';
    resultsTable +=         '</thead>';
    resultsTable +=         '<tbody id="table-body"  class="table_body"></tbody>';
    resultsTable +=     '</table>';

//Уведомление о том, что поменять ответ будет нельзя
let alertNote = '<div class="alertNote hide"><p>Внимание!</p>';
    alertNote += '<p>После выбора варианта ответа изменить свое решение будет невозможно!</p>';
    alertNote += '<p>Будьте внимательны!</p>';
    alertNote += '</div>';

//Вкладка правила игры
let rules = '<div class="rules">';
    rules += '<p>Привет, будущие айтишники! =)</p>';
    rules += '<p>Позволю себе небольшой экскурс в историю:</p>';
    rules += '<p>Идея создания этой игры появилась в ходе обучения на курсе FD-2 в ПВТ.';
    rules += 'Однажды, на одном из занятий, мы решали задачки на глубокое понимание пройденных тем,';
    rules += 'похожие на те, что представлены в этой игре. Всей группе это чрезвычайно понравилось,'; 
    rules += 'несмотря даже на то, что большинство из них мы не смогли решить верно с первого раза =).';
    rules += 'Поэтому родилась идея собрать эти задачи воедино и использовать в качестве подготовки к ';
    rules += 'собеседованиям, на которых так или иначе каждая из этих тем поднимается.</p>';
    rules += '<p>Ну и, вероятнее всего, раз вы это сейчас читаете, значит я не остался на второй год и ';
    rules += 'благополучно выпустился с этого курса! =)</p>';
    rules += '<p>А теперь немного информации об этой игре:</p>';
    rules += '<p>1. Вы можете выбрать один из двух типов игры: тест или игра на вылет.</p>';
    rules += '<p>ТЕСТ: после того, как вы отвечаете на все предложенные вопросы, программа рассчитывает ваш ';
    rules += 'итоговый результат теста.</p>';
    rules += '<p>ИГРА НА ВЫЛЕТ: Игра ведется до первого неправильного ответа, после чего завершается и рассчитывается ваш';
    rules += ' результат.</p>';
    rules += '<p>2. Далее вы выбираете количество вопросов: 15, 21 или 30</p>';
    rules += '<p>3. Вопросы делятся на три категории:</p> ';
    rules += '<p>- простые, на знание основной теории (их в игре будет 3). За каждый правильный ответ ';
    rules += 'этой категории можно заработать 1 балл;</p>';
    rules += '<p>- средние, на понимание основ написания кода (их тоже в любой игре будет 3). За каждый правильный ответ ';
    rules += 'этой категории можно заработать 2 балла;</p>';
    rules += '<p>- сложные, на глубокое и осмысленное понимание основ JavaScript (все остальные). За каждый правильный ответ ';
    rules += 'этой категории можно заработать 3 балла;</p>';
    rules += '<p>Будьте внимательны, после выбора одного из вариантов ответа изменить свое решение будет невозможно!</p>';
    rules += '<p>Свой результат можно посмотреть, щелкнув по вкладке РЕКОРДЫ.</p>';
    rules += '<p>Всем удачи!!!</p>';
    rules += '</div>';