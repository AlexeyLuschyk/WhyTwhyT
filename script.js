const app = document.getElementById('app');

let startGameButton;
let recordsButton;
let rulesButton;
let formGroup;

let playerNameInput;
let playerName;
let gameType;
let radiosCollection;

let totalPoints = 0;
let point;
let toWinGameRes;
let testGameRes;

let resArr = [];
let userResult = {};

let fireUsersList;
let resultObj;
let tableBody;
let cell;
let cellText;
let row;

let shuffledPoints1;
let shuffledPoints2;
let shuffledPoints3;

let questionsQty; //желаемое кол-во вопросов в тесте
let maxResult; //Максимально возможное кол-во баллов за игру

let startButton, nextButton, restartButton;
let questionContainerElement;
let selectedButton; //кнопка, которую выбрали в качестве ответа


let questionElement;
let answerButtonsElement;
let shuffledQuestions;
let currentQuestionIndex;

//Аудио
let audioIntro = new Audio('../Project WhyTwhyT/sounds/intro.mp3');
let audioApplause = new Audio('../Project WhyTwhyT/sounds/applause.mp3');
let audioError = new Audio('../Project WhyTwhyT/sounds/error.mp3');
let audioFinal = new Audio('../Project WhyTwhyT/sounds/final.mp3');
let audioRecords = new Audio('../Project WhyTwhyT/sounds/records.mp3');
let audioSelectAnswer = new Audio('../Project WhyTwhyT/sounds/selectAnswer.mp3');

app.insertAdjacentHTML("afterbegin",gameName); //добавляем на страницу верстку с названием игры
app.insertAdjacentHTML("beforeend",introModal); //добавляем на страницу верстку со стартовыми кнопками

startGameButton = document.getElementById('startGame-btn');
startGameButton.addEventListener('click', openAuthModal); //по клику на "Начать игру" открывает модалку идентификации

recordsButton = document.getElementById('records-btn');
recordsButton.addEventListener('click', openRecordsModal); //по клику на "Рекорды" открывает модалку рекордов

rulesButton = document.getElementById('rules-btn');
rulesButton.addEventListener('click', openRulesModal); //по клику на "Правила игры" открывает модалку правил

function openAuthModal(){
    audioRecords.pause();
    audioIntro.play();
    //обнуляем все переменные
    resArr = [];
    maxResult = 0;

    app.innerHTML = ''; //стираем верстку в главном div

    app.insertAdjacentHTML("afterbegin", alertNote); //добавляем предупреждение
    app.insertAdjacentHTML("afterbegin", authModal); //добавляем верстку с формой регистрации
    app.insertAdjacentHTML("beforeend", questionModal) //добавляем верстку блока вопросов
    app.insertAdjacentHTML("beforeend", gameOverModal) //добавляем верстку блока окончания игры
    app.insertAdjacentHTML("beforeend", controlsModal); //добавляем верстку с кнопками start и next
    
    startButton = document.getElementById('start-btn'); //получаем кнопки
    nextButton = document.getElementById('next-btn');
    restartButton = document.getElementById('restart-btn');

    startButton.disabled = true; //дизейблим кнопку пока не выберем тип игры

    //вешаем обработчики
    startButton.addEventListener('click', startGame);
    nextButton.addEventListener('click', ()=>{
        currentQuestionIndex++;
        setNextQuestion();
    });
    restartButton.addEventListener('click', openAuthModal);
}

function startGame(){
    audioIntro.pause();
    playerName = document.getElementById('name').value; //сохраняем в переменную имя игрока
    questionsQty = document.getElementById('selectbasic').value;//сохраняем кол-во вопросов

    //получаем общий массив отсортированных вопросов
    shuffledPoints1 = questions.points1.sort(compareRandom);//сортируем в случайном порядке
    shuffledPoints2 = questions.points2.sort(compareRandom);//сортируем в случайном порядке
    shuffledPoints3 = questions.points3.sort(compareRandom);//сортируем в случайном порядке
    //пушим в общий массив отсортированные вопросы по категориям
    //меняя кол-во элементов массива в slice можем менять количество вопросов в категории
    resArr.push(...shuffledPoints1.slice(0,3),...shuffledPoints2.slice(0,3),...shuffledPoints3.slice(0,(questionsQty-6))); //questionsQty поменять
    // console.log(resArr);

    app.firstChild.remove(); //удаляем верстку с формой входа
    startButton.classList.add('hide'); //прячем стартовую кнопку
    
    currentQuestionIndex = 0; //начинаем отсчет вопросов
    questionContainerElement =  document.getElementById('question-container');
    questionContainerElement.classList.remove('hide'); //показываем контейнер с вопросом
    setNextQuestion();
}

function setNextQuestion(){
    document.querySelector('.alertNote').classList.remove('hide');
    resetState();
    showQuestion(resArr[currentQuestionIndex]);
}

function showQuestion(quest){ //показываем пользователю вопрос и варианты ответов
    audioApplause.pause();
    questionElement = document.getElementById('question');
    questionElement.innerHTML = "";
    questionElement.insertAdjacentHTML('afterbegin', quest.question); //Вставляем в контейнер текст вопроса из базы
    quest.answers.forEach(answer => { // для каждого ответа из базы
        const button = document.createElement('button'); // создаем кнопку с ответом
        button.innerText = answer.text;
        button.classList.add('btnQ'); //добавляем стили на кнопки ответов
        
        if (answer.isCorrect){
            button.dataset.correct = answer.isCorrect; //вешаем data-атрибут на кнопку с правильным ответом
        }

        button.dataset.pointsQty = answer.points; // вешаем дата-атрибут с кол-вом баллов за выбор этого ответа
        button.addEventListener('click', selectAnswer);//вешаем на нее обработчик выбранного ответа
        answerButtonsElement.appendChild(button); // создаем кнопку с ответом
    });
}

function selectAnswer(event){ //обработка выбранного ответа в зависимости от типа игры
    audioSelectAnswer.play();
    if (gameType == "game-test") { //проверка на то, какой тип игры выбран
        testGame();
    } else {
        toWinGame();
    }
}

function testGame() {
    selectedButton = event.target;
    selectedButton.classList.add('selected');
    setStatusClass(selectedButton, selectedButton.dataset.correct); //устанавливаем дата-атрибут только на выбранную кнопку

    document.querySelectorAll('.btnQ').forEach(button => { //дизейблим остальные кнопки кроме выбранной
        (button.classList.contains('selected')) ? (button.disabled = false) : (button.disabled = true);
    });
    
    point = selectedButton.dataset.pointsQty;
    //складываем заработанные пользователем баллы
    testResult(point);

    if (currentQuestionIndex + 1 < resArr.length){
        nextButton.classList.remove('hide'); //показываем следующий вопрос
    } else { //заканчиваем игру
        audioError.pause();
        audioApplause.pause();
        audioFinal.play();
        document.querySelector('.alertNote').classList.add('hide');
        document.getElementById('question-container').classList.add('hide');

        //забрасываем пользователя и его результат в хэш
        userResult.name = playerName;
        userResult.res = totalPoints;
        
        maxResult = 9+(questionsQty-6)*3;
        testGameRes = Math.round((totalPoints/maxResult)*100); //результат теста в процентах

        document.querySelector('.notification').classList.remove('hide'); //добавляем див Игра завершена
        document.querySelector('.notification').innerHTML += `<p>${playerName}, расчетная вероятность твоего попадания в IT: ${testGameRes}%</p>`;
        
        writeUserData(playerName, testGameRes, gameType); //записываем в firebase результат игры
        localStorage.setItem(playerName, JSON.stringify(totalPoints)); //дублируем на всякий случай

        if (testGameRes < 25) {
            document.querySelector('.notification').innerHTML += `<p>Возможно, оставить родной завод была и не такая хорошая идея! =)</p>`;
        } else if (testGameRes < 50) {
            document.querySelector('.notification').innerHTML += `<p>Не все еще потеряно, подучи азы и пробуй снова!</p>`;
        } else if (testGameRes < 75){
            document.querySelector('.notification').innerHTML += `<p>Неплохо, но нужно лучше! У тебя есть все шансы войти в айти!</p>`;
        } else {
            document.querySelector('.notification').innerHTML += `<p>Этеншн!!! Senior detected! =)</p>`;
        }
        
        document.getElementById('res').classList.remove('hide'); //добавляем кнопку Просмотреть результат
        document.getElementById('res').addEventListener('click', openRecordsModal);
        restartButton.classList.remove('hide');

        //обнуляем все переменные после клика на рестарт
        testGameRes = 0;
        totalPoints = 0;
        maxResult=0;
    }
}

function toWinGame() {
    selectedButton = event.target;
    selectedButton.classList.add('selected');
    setStatusClass(selectedButton, selectedButton.dataset.correct); //устанавливаем дата-атрибут только на выбранную кнопку
    
    document.querySelectorAll('.btnQ').forEach(button => { //дизейблим остальные кнопки кроме выбранной
        (button.classList.contains('selected')) ? (button.disabled = false) : (button.disabled = true);
    });
    
    point = selectedButton.dataset.pointsQty;
    testResult(point);//считаем очки за игру

    //если вопросы еще есть и мы ответили правильно,то...
    if((currentQuestionIndex + 1 < resArr.length) && (selectedButton.dataset.correct)){
        setTimeout(() => { nextButton.classList.remove('hide');}, 1000); //показываем следующий вопрос
    } else {
        setTimeout(() => { //заканчиваем игру
            audioError.pause();
            audioApplause.pause();
            audioFinal.play();
            document.querySelector('.alertNote').classList.add('hide');
            document.getElementById('question-container').classList.add('hide');

            userResult.name = playerName;
            maxResult = 9+(questionsQty-6)*3;
            toWinGameRes = Math.round((totalPoints/maxResult)*100);
            writeUserData(playerName, toWinGameRes, gameType); //записываем в firebase результат игры
            document.querySelector('.notification').classList.remove('hide'); //добавляем блок с уведомлением
            document.querySelector('.notification').innerHTML += `${playerName}, расчетная вероятность твоего попадания в IT: ${toWinGameRes}%`;
            if (toWinGameRes < 25) {
                document.querySelector('.notification').innerHTML += `<br>Возможно, оставить родной завод была и не такая хорошая идея! =)`;
            } else if (toWinGameRes < 50) {
                document.querySelector('.notification').innerHTML += `<br>Не все еще потеряно, подучи азы и пробуй снова!`;
            } else if (toWinGameRes < 75){
                document.querySelector('.notification').innerHTML += `<br>Неплохо, но нужно лучше! У тебя есть все шансы войти в айти!`;
            } else {
                document.querySelector('.notification').innerHTML += `<br>Этеншн!!! Senior detected! =) `;
            }
            
            document.getElementById('res').classList.remove('hide'); //добавляем кнопку посмотреть результат
            document.getElementById('res').addEventListener('click', openRecordsModal);
            restartButton.classList.remove('hide');

            //обнуляем все переменные перед новой игрой
            toWinGameRes = 0;
            totalPoints = 0;
            maxResult=0;
        }, 1000);
    }
}


//Вспомогательные функции

function check() { //функция проверки какой тип игры выбран и введено ли имя
    radiosCollection = document.getElementsByName('radios');
    for (let i = 0; i < radiosCollection.length; i++) {
        if (radiosCollection[i].type == "radio" && radiosCollection[i].checked) {
            gameType = radiosCollection[i].id;
        }
    }

    if (gameType && document.getElementById('name').value !== ""){
        document.getElementById('start-btn').disabled = false; //раздизейбливаем кнопку
    } 
}

function compareRandom(a, b) { //функция рандомной сортировки вопросов
	return Math.random() - 0.5;
}

function resetState(){ //очищаем все элементы после клика на NEXT, но перед показом нового вопроса
    nextButton.classList.add('hide');
    answerButtonsElement = document.getElementById('answer-buttons');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function testResult(point){
    return totalPoints = totalPoints + Number(point); //суммируем результат игрока
}

function setStatusClass(element, correct){ //c
    clearStatusClass(element);
    if (correct){
        setTimeout(() => {
            element.classList.add('correct');
            audioApplause.play();
        }, 1000);
    } else {
        setTimeout(() => {
            element.classList.add('wrong');
            audioError.play();
        }, 1000);
    }
}

function clearStatusClass(element){ //очищаем данный класс со всех элементов
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function writeUserData(username, userResult, gameType) { //Заброс в БД результата пользователя
    database.ref('users/' + username).set({
      gameType: gameType,
      userResult: userResult,
      order: 1000000000000 - userResult,
    });
  }

function openRecordsModal(){
    audioRecords.play();

    app.innerHTML = ''; //стираем верстку в главном div
    app.insertAdjacentHTML("beforeend", resultsTable); //добавляем верстку с таблицей результатов
    app.insertAdjacentHTML("beforeend", controlsModal); //добавляем верстку с кнопкой Смогу лучше!

    tableBody = document.getElementById('table-body');
    restartButton = document.getElementById('restart-btn');
    startButton = document.getElementById('start-btn');

    startButton.classList.add('hide');
    restartButton.classList.remove('hide');
    restartButton.innerHTML = "Смогу лучше!!!";
    restartButton.addEventListener('click', openAuthModal);

    buildRecordsTable();
}

function buildRecordsTable(){
    fireUsersList = database.ref("/users");
    
    fireUsersList.once('value').then(function(snapshot) {
        resultObj =  snapshot.val(); //получаем наш итоговый объект со всеми пользователяи и их результатами
        // console.log(resultObj);
    });
    
    // fireUsersList.orderByValue().on("value", function(snapshot) { //сортировка по имени пользователя
    fireUsersList.orderByChild('order').on("value", function(snapshot) { //сортируем по результату и отрисовываем таблицу
            let rating = 1;
        snapshot.forEach(function(data) {
            //console.log("The " + data.key + " score is " + data.val());
            //console.log(data.val().userResult);

            row = document.createElement("tr"); //создаем строку в таблице
            let cell1 = document.createElement("td");
            let cellText1 = document.createTextNode(rating); // вносим текст в 1ю ячейку
            cell1.appendChild(cellText1);
            row.appendChild(cell1);
            let cell2 = document.createElement("td");
            let cellText2 = document.createTextNode(data.key); // вносим текст во 2ю ячейку
            cell2.appendChild(cellText2);
            row.appendChild(cell2);

            //выделяем текущего игрока красным цветом
            if (data.key == playerName){
                cell2.style.color = "red";
                cell2.style.fontWeight = "bold";
            }

            let cell3 = document.createElement("td");
            let cellText3 = document.createTextNode(data.val().userResult); // вносим текст в ячейку
            cell3.appendChild(cellText3);
            row.appendChild(cell3);
            let cell4 = document.createElement("td");
            let cellText4 = document.createTextNode(data.val().gameType); // вносим текст в ячейку
            cell4.appendChild(cellText4);
            row.appendChild(cell4);

            tableBody.appendChild(row); //добавляем таблицу построчно
            rating++;
        });
    });
}

//Открывает модалку с правилами игры
function openRulesModal(){
    audioRecords.play();
    app.innerHTML = ''; //стираем верстку в главном div
    app.insertAdjacentHTML("afterbegin", rules); //добавляем блок правил
    app.insertAdjacentHTML("beforeend", controlsModal); //добавляем верстку с кнопками start и next
    startButton = document.getElementById('start-btn'); //получаем кнопки
    startButton.addEventListener('click', openAuthModal)
}
