var flag_access = document.getElementsByClassName('login_access');
var timerInterval = null; // the timer that changes opacity every 0.1 seconds.   

if (parseInt(flag_access[0].getAttribute('token')) == 1) { //Проверка на токен - вход в приложение
    flag_access[0].innerHTML = 'You has a logged!'
    flag_access[0].style.backgroundColor = 'green';
    flag_access[0].style.opacity = 0;
    timerInterval = setInterval(function () {
        ChangeOpacity();
    }, 100);
}
function ChangeOpacity() { //отображение нотификейшена о входе
    var object = flag_access[0];
    var currentOpacity = object.style.opacity;
    var newOpacity = parseFloat(currentOpacity) + parseFloat(0.1);
    object.style.opacity = newOpacity;
    if (newOpacity == 1.0) { StopTimer(); }
}

function StopTimer() {//остановка интервала
    window.clearInterval(timerInterval);
    timerInterval = setInterval(function () {
        ClearOpacity();
    }, 100);

}
function ClearOpacity() { // удаление нотификейшена
    var object = flag_access[0];
    var currentOpacity = object.style.opacity;
    var newOpacity = parseFloat(currentOpacity) - parseFloat(0.1);
    object.style.opacity = newOpacity;
    if (newOpacity == 0) {
        window.clearInterval(timerInterval);
        timerInterval = 0;
    }
}