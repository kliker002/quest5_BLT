var appeal = new Vue({
    el: '.appeal',
    data: {
        person: 'Гость'
    }
});
if(document.getElementById('token_person').getAttribute('token') != 'null'){
    appeal._data.person = document.getElementById('token_person').getAttribute('token');
}
