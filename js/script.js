'use strict'


//DOM ELEMENTS
const dom = {
	square: document.getElementById('square'),
	squareImg: document.getElementById('square-img'),
	blur: document.getElementById('blur'),
	message: document.getElementById('message'),
	rotateBtn: document.getElementById('rotate'),
	stopBtn: document.getElementById('stop'),
	reloadBtn: document.getElementById('reload'),
	showModalBtn: document.getElementById('show-modal'),
	closeModalBtn: document.getElementById('close-modal'),
	modal: document.getElementById('modal-wrapper'),
	nice: document.getElementById('nice'),
	notNice: document.getElementById('not-nice'),
	nextLevel: document.getElementById('next-level'),
	lost: document.getElementById('lost'),
	lastLevel: document.getElementById('last-level'),
}


//DYNAMIC PARTS OF MECHANISMS
let count, animation, game, speed, blur, shortMessage, longMessage,
levelBlur, levelSpeed, speedCatalisator, level, lostNumber
level = 1
count = 0.01
speed = levelSpeed = 0.2
game = true
blur = levelBlur = 4
shortMessage = 1000
longMessage = -1
lostNumber = 10
speedCatalisator = 0.05


//MECHANISMS
function reload (){
	window.location.reload()
}

function showCloseModal(action){
	if(action === 'close') dom.modal.style.display = 'none'
	else dom.modal.style.display = 'flex'
}

function getCount(){
	count = Math.round(count)
	let result = -1
	switch(count){
		case 42: case 43: case 44: case 45: case 46:
		case 47: case 48: case 132: case 133: case 135:
		case 136: case 137: case 138: case 222: case 223:
		case 224: case 225: case 226: case 227: case 228:
		case 312:case 313: case 314: case 315: case 316:
		case 317: case 318:
			result = 0
		break
	}
	return result
}

function showMessage (mood, time){
	dom.message.style.display = 'block'
	switch(mood){
		case '+':
			dom.message.style.color = 'var(--yellow-color)'
			dom.message.textContent = 'Ура😉'
		break
		case '-':
			dom.message.style.color = 'var(--red-color)'
			dom.message.textContent = 'Блин🙁'
		break
		case 'lost':
			dom.message.style.color = 'var(--red-color)'
			dom.message.textContent = 'Ну всё, достаточно🤥'
		break
		case 'win':
			dom.message.style.color = 'var(--yellow-color)'
			dom.message.textContent = 'Го дальше🙃'
		break
		case 'end':
			dom.message.style.color = 'var(--yellow-color)'
			dom.message.textContent = 'БОЛЬШОЙ УВАЖЕНИЙ😮'
		break
	}
	if(time != -1) setTimeout(() => dom.message.style.display = 'none', time)
}

function rotate(){
	animation = requestAnimationFrame(rotate)
	game = false
	dom.square.style.transform = `rotate(${count}deg)`
	if(count > 360) count = 0
	count += speed
}

function stop(){
	if(dom.message.textContent !== 'Го дальше🙃'){
		game = true
		cancelAnimationFrame(animation)
		if(getCount() === 0){
			dom.nice.play()
			blur--
			dom.blur.textContent = blur
			dom.squareImg.style.filter = `blur(${blur}px)`
			speed += speedCatalisator
			if(blur === 0){
				game = false
				showMessage('win', longMessage)
				count = 0
				dom.square.style.transition = `1s`
				dom.square.style.transform = `rotate(${count}deg)`
				setTimeout(() => dom.square.style.transition = `0s`, 1000)
			} else showMessage('+', shortMessage)
		} else {
			dom.notNice.play()
			blur++
			dom.blur.textContent = blur
			dom.squareImg.style.filter = `blur(${blur}px)`
			if(blur > lostNumber){
				dom.lost.play()
				game = false
				showMessage('lost', longMessage)
			} else showMessage('-', shortMessage)
		}
	}
}

function changeLevel(){
	if(dom.message.textContent === 'Го дальше🙃'){
		dom.nextLevel.play()
		dom.message.textContent = ''
		dom.message.style.display = 'none'
		level++
		count = 0
		speed = levelSpeed += 0.1
		game = true
		blur = ++levelBlur
		dom.blur.textContent = blur
		dom.square.style.transform = `rotate(${count}deg)`
		dom.squareImg.style.filter = `blur(${blur}px)`
		dom.squareImg.src = `./img/level-${level}.jpg`
		if(level === 5){
			setTimeout(()=> dom.lastLevel.play(), 700)
		}
	}
	if(level > 5){{
		showMessage('end', longMessage)
		game = false
	}}
}

dom.rotateBtn.addEventListener('click', () => { if(game) rotate() })
dom.stopBtn.addEventListener('click', () => { if(!game) stop() })
dom.showModalBtn.addEventListener('click', () => showCloseModal('show'))
dom.closeModalBtn.addEventListener('click', () => showCloseModal('close'))
dom.reloadBtn.addEventListener('click', () => reload())
dom.message.addEventListener('click', () => changeLevel())
