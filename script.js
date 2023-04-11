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
	audioSuccess: document.getElementById('audio-success'),
	audioMistake: document.getElementById('audio-mistake'),
	audioNextLevel: document.getElementById('audio-next-level'),
	audioLost: document.getElementById('audio-lost'),
	audioLastLevel: document.getElementById('audio-last-level'),
}


const state = {
	game: false,
	level: 1,
	rotateAngle: 0.01,
	initialBlur: 4,
	blur: 4,
	speed: 0.2,
	initialSpeed: 0.2,
	speedCatalisator: 0.025,
	shortMessageTime: 1000,
	gameOverNumber: 10,
	animation: null,
	messageTimeoutId: null,
}

const messages = {
	success: 'Ура😉',
	mistake: 'Блин🙁',
	win: 'Го дальше🙃',
	lost: 'Ну всё, хватит🤥',
	end: 'МОЛОДЕЦ😮 Это конец...',
}


function isPositionRight() {
	state.rotateAngle = Math.round(state.rotateAngle);
	let result = false;

	switch(state.rotateAngle){
		case 42: case 43: case 44: case 45: case 46:
		case 47: case 48: case 132: case 133: case 135:
		case 136: case 137: case 138: case 222: case 223:
		case 224: case 225: case 226: case 227: case 228:
		case 312:case 313: case 314: case 315: case 316:
		case 317: case 318:
			result = true
		break;
	}

	return result;
}


function showMessage (mood, time) {
	clearTimeout(state.messageTimeoutId);
	dom.message.style.display = 'block';
	dom.message.style.color = 'var(--yellow-color)';
	dom.message.classList.remove('active');

	switch (mood) {
		case 'success':
			dom.message.textContent = messages.success;
			dom.audioSuccess.play();
			break
		case 'mistake':
			dom.message.style.color = 'var(--red-color)';
			dom.message.textContent = messages.mistake;
			dom.audioMistake.play();
			break
		case 'lost':
			dom.message.style.color = 'var(--red-color)';
			dom.message.textContent = messages.lost;
			dom.audioLost.play();
			break
		case 'win':
			dom.message.classList.add('active');
			dom.message.textContent = messages.win;
			dom.audioNextLevel.play();
			break
		case 'end':
			dom.message.textContent = messages.end;
			break
	}

	if (time) state.messageTimeoutId = setTimeout(() => dom.message.style.display = 'none', time);
}

function rotate() {
	state.game = true;
	dom.square.style.transform = `rotate(${state.rotateAngle}deg)`;
	state.animation = requestAnimationFrame(rotate);

	if (state.rotateAngle > 360) state.rotateAngle = 0;
	state.rotateAngle += state.speed;
}

function decreaseImageBlur() {
	dom.blur.textContent = `${--state.blur}`;
	dom.squareImg.style.filter = `blur(${state.blur * 2}px)`;
}

function increaseImageBlur() {
	dom.blur.textContent = `${++state.blur}`;
	dom.squareImg.style.filter = `blur(${state.blur * 2}px)`;
}


function stopGame() {
	state.game = false;
	dom.square.style.transition = `1s`;
	state.rotateAngle = 0;
	dom.square.style.transform = `rotate(${state.rotateAngle}deg)`;
	setTimeout(() => dom.square.style.transition = `0s`, 1000);
}


function checkSquarePosition() {
	if (isPositionRight()) {
		decreaseImageBlur();
		if (state.blur === 0) {
			stopGame();
			if (state.level < 5) showMessage('win');
			else {
				showMessage('end');
				state.game = false;
			}
		} else showMessage('success', state.shortMessageTime);
	} else {
		increaseImageBlur();
		if(state.blur > state.gameOverNumber){
			state.game = true;
			showMessage('lost');
		} else showMessage('mistake', state.shortMessageTime);
	}
}



function stop() {
	state.game = false;
	cancelAnimationFrame(state.animation);
	state.speed += state.speedCatalisator;
	checkSquarePosition();
}


function changeLevel() {
	if (dom.message.textContent === messages.win) {
		state.game = false;
		state.level++;
		state.blur = state.initialBlur + state.level;
		dom.blur.textContent = state.blur;
		dom.message.style.display = 'none';
		dom.message.textContent = '';
		state.speed = (state.initialSpeed + (0.1 * state.level));
		dom.squareImg.src = `./assets/img/level-${state.level}.jpg`;
		dom.squareImg.style.filter = `blur(${state.blur * 2}px)`;
		if (state.level === 5) dom.audioLastLevel.play();
	}
}


dom.rotateBtn.addEventListener('click', () => {
	if (!state.game
		&& dom.message.textContent !== messages.win
		&& dom.message.textContent !== messages.end)
		rotate();
});
dom.stopBtn.addEventListener('click', () => {
	if (state.game && dom.message.textContent !== messages.lost) stop()
});
dom.message.addEventListener('click', () => changeLevel());

const toggleModal = () => dom.modal.classList.toggle('hidden');
dom.showModalBtn.addEventListener('click', () => toggleModal());
dom.closeModalBtn.addEventListener('click', () => toggleModal());

dom.reloadBtn.addEventListener('click', () => window.location.reload());

