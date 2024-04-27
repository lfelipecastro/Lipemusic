/*
Projeto utilizando Bootstrap

Declarando todas as consts que são utilizadas e modificadas na interface
do reprodutor de músicas
*/
const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const song = document.getElementById('audio');
const play = document.getElementById('play');
const cover = document.getElementById('cover');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const likeButton = document.getElementById('like');
const currentProgress = document.getElementById('current-progess');
const progressContainer = document.getElementById('progress-container');
const shuffleButton = document.getElementById('shuffle');
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song-time');
const totalTime = document.getElementById('total-time');

/* Criação das informações das músicas para serem preenchidas no reprodutor */
const theHills = {
    songName : 'The Hills',
    bandName : 'The Weeknd',
    file : 'the hills',
    liked : false,
}

const starboy = {
    songName : 'Starboy',
    bandName : 'The Weeknd',
    file : 'starboy',
    liked : false,
}

const callOutMyName = {
    songName : 'Call Out My Name',
    bandName : 'The Weeknd',
    file : 'call out my name',
    liked : false,
}

/* Variaveis que serão modificadas ao longo das funções do reprodutor */
let isPlaying = false;
let isShuffled = false;
let repeatOn = false;
const originalPlaylist = JSON.parse(localStorage.getItem('playlist'))
?? [theHills, starboy, callOutMyName];
let sortedPlaylist = [...originalPlaylist];
let index = 0;

/* Função com o intuito de modificar o icone do play para o icone de pause, 
tocar a música e modificar a variável isPlaying para verdadeiro */
function playSong(){
    play.querySelector('.bi').classList.remove('bi-play-circle-fill');
    play.querySelector('.bi').classList.add('bi-pause-circle-fill');
    song.play();
    isPlaying = true;
}

/* Função que faz o oposto da playSong() */
function pauseSong(){
    play.querySelector('.bi').classList.remove('bi-pause-circle-fill');
    play.querySelector('.bi').classList.add('bi-play-circle-fill');
    song.pause();
    isPlaying = false;
}

/* Função que tem como objetivo algo simples, se a variavel isPlaying for
true, quer dizer que a música está tocando e é necessário pausar a música,
se isPlaying for false, quer dizer que a música não está tocando e então
chamará a função para tocar a música */
function playPauseDecider(){
    if(isPlaying === true){
        pauseSong();
    }else{
        playSong();
    }
}

/*Função para modificar o botão de like da música, caso a música já tenha
sido curtida previamente o botão de like será um coração preenchido, se não
será um coração sem preenchimento */
function likeButtonRender(){
    if(sortedPlaylist[index].liked === true){
        likeButton.querySelector('.bi').classList.remove('bi-heart');
        likeButton.querySelector('.bi').classList.add('bi-heart-fill');
        likeButton.classList.add('button-active');
    }else{
        likeButton.querySelector('.bi').classList.remove('bi-heart-fill');
        likeButton.querySelector('.bi').classList.add('bi-heart');
        likeButton.classList.remove('button-active');
    }
}

/* Função que faz a inicialização da música de acordo com o array criado
das 3 músicas existentes */
function initializeSong(){
    cover.src = `images/${sortedPlaylist[index].file}.jpg`;
    song.src = `songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].bandName;
    likeButtonRender();
}

/* Função que utiliza o array que contém as 3 músicas para ver qual é a 
música anterior do índice que está tocando no momento */
function previousSong(){
    if(index === 0){
        index = sortedPlaylist.length - 1;
    }else{
        index -= 1;
    }
    initializeSong();
    playSong();
}

/* Função que utiliza o array que contém as 3 músicas para ver qual é a 
música posterior do índice que está tocando no momento */
function nextSong(){
    if(index === sortedPlaylist.length - 1){
        index = 0;
    }else{
        index += 1;
    }
    initializeSong();
    playSong();
}

/* Essa função é totalmente responsável pela atualização da barra
de progresso da música, transformando um calculo em texto formatado
em horas:minutos:segundos */
function updateProgess(){
    const barWidth = (song.currentTime/song.duration)*100;
    currentProgress.style.setProperty('--progress', `${barWidth}%`);
    songTime.innerText = toHHMMSS(song.currentTime);
}

/* A função jumpTo é responsável por pular a música de acordo com
o usuário, fazendo um cálculo no eixo x da barra de progresso */
function jumpTo(event){
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition/width)*song.duration;
    song.currentTime = jumpToTime;
}

/* Função que permite o array das músicas ser embaralhado tocando
em ordem aleatória, a função utiliza a biblioteca Math para gerar
valores aleatórios e utiliza repetição para atribuir músicas aleatórias
em cada indice do array */
function shuffleArray(preShuffleArray){
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while(currentIndex > 0){
        let randomIndex = Math.floor(Math.random()* size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex -= 1;
    }
}

/* Função relacionada a chamar a função shuffleArray() e atribuir o botão
com uma cor diferente para demonstrar que foi clicado, tudo isso utilizando
uma condição relacionada a uma variável booleana */
function shuffleButtonClicked(){
    if(isShuffled === false){
        isShuffled = true;
        shuffleArray(sortedPlaylist);
        shuffleButton.classList.add('button-active');
    }else{
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        shuffleButton.classList.remove('button-active');
    }
}

/* Função para atribuir o botão uma cor diferente para demonstrar que foi
clicado e também atribuir um valor booleano a variável repeatOn */
function repeatButtonClicked(){
    if(repeatOn === false){
        repeatOn = true;
        repeatButton.classList.add('button-active');
    }else{
        repeatOn = false;
        repeatButton.classList.remove('button-active');
    }
}

/* Função somente com o objetivo de repetir ou continuar a música, caso
o botão de repetir esteja pressionado ou não */
function nextOrRepeat(){
    if(repeatOn === false){
        nextSong();
    }else{
        playSong();
    }
}

/* Função para transformar o número que é recebido somente em formato de
segundos para o formato horas:minutos:segundos */
function toHHMMSS(originalNumber){
    let hours = Math.floor(originalNumber/3600);
    let min = Math.floor((originalNumber - hours * 3600)/60);
    let secs = Math.floor(originalNumber - hours * 3600 - min * 60);
    
    return `${hours !== 0 ? hours.toString()
        .padStart(2, '0') + ":" : ""}${min.toString()
        .padStart(2, '0')}:${secs.toString()
        .padStart(2, '0')}`;
}

/* Função para atualizar o tempo da música no reprodutor */
function updateTotalTime(){
    totalTime.innerText = toHHMMSS(song.duration);
}

/* Função para modificar a variável booleana responsável pela
informação da música, se foi dado like ou não, e no final da linha dessa
função é feito um salvamento local da informação referente ao like */
function likeButtonClicked(){
    if(sortedPlaylist[index].liked === false){
        sortedPlaylist[index].liked = true;
    }else{
        sortedPlaylist[index].liked = false;
    }
    likeButtonRender();
    localStorage.setItem('playlist', JSON.stringify(originalPlaylist));
}

initializeSong();

/* Botões e seus respectivos comandos caso sejam clicados, e também comandos
para serem feitos durante a execução do reprodutor de músicas */
play.addEventListener('click', playPauseDecider);
previous.addEventListener('click', previousSong);
next.addEventListener('click', nextSong);
song.addEventListener('timeupdate', updateProgess);
song.addEventListener('ended', nextOrRepeat);
song.addEventListener('loadedmetadata', updateTotalTime);
progressContainer.addEventListener('click', jumpTo);
shuffleButton.addEventListener('click', shuffleButtonClicked);
repeatButton.addEventListener('click', repeatButtonClicked);
likeButton.addEventListener('click', likeButtonClicked);