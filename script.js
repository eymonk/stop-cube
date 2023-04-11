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
	audioNice: document.getElementById('audio-nice'),
	audioNotNice: document.getElementById('audio-not-nice'),
	audioNextLevel: document.getElementById('audio-next-level'),
	audioLost: document.getElementById('audio-ost'),
	audioLastLevel: document.getElementById('audio-last-level'),
}


const state = {
	game: true,
	level: 1,
	rotateAngle: 0.01,
	initialBlur: 4,
	blur: 4,
	speed: 0.2,
	speedCatalisator: 0.05,
	animation: null,
	shortMessageTime: 1000,
	gameOverNumber: 10,
}

const messages = {
	success: 'Ура😉',
	mistake: 'Блин🙁',
	win: 'Го дальше🙃',
	lost: 'Ну всё, хватит🤥',
	end: 'МОЛОДЕЦ😮',
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


function showMessage (mood, time){
	dom.message.style.display = 'block';
	dom.message.style.color = 'var(--yellow-color)';

	switch(mood){
		case 'success':
			dom.message.textContent = messages.success;
		break
		case 'mistake':
			dom.message.style.color = 'var(--red-color)';
			dom.message.textContent = messages.mistake;
		break
		case 'lost':
			dom.message.style.color = 'var(--red-color)';
			dom.message.textContent = messages.lost;
		break
		case 'win':
			dom.message.textContent = messages.win;
		break
		case 'end':
			dom.message.textContent = messages.end;
		break
	}

	time && setTimeout(() => dom.message.style.display = 'none', time);
}


function rotate() {
	dom.square.style.transform = `rotate(${state.rotateAngle}deg)`;
	state.animation = requestAnimationFrame(rotate);
	state.game = false;

	if (state.rotateAngle > 360) state.rotateAngle = 0;
	state.rotateAngle += state.speed;
}


function stop() {
	if (dom.message.textContent !== messages.win) {
		state.game = true;
		cancelAnimationFrame(state.animation);
		if (isPositionRight()) {
			state.blur--;
			dom.blur.textContent = state.blur;
			dom.squareImg.style.filter = `blur(${state.blur}px)`;
			state.speed += state.speedCatalisator;
			if (state.blur === 0) {
				state.game = false;
				dom.audioNextLevel.play();
				showMessage('win');
				state.rotateAngle = 0;
				dom.square.style.transition = `1s`;
				dom.square.style.transform = `rotate(${state.rotateAngle}deg)`;
				setTimeout(() => dom.square.style.transition = `0s`, 1000);
			} else {
				dom.audioNice.play();
				showMessage('success', state.shortMessageTime);
			}
		} else {
			dom.audioNotNice.play();
			state.blur++;
			dom.blur.textContent = state.blur;
			dom.squareImg.style.filter = `blur(${state.blur}px)`;
			if(state.blur > state.gameOverNumber){
				dom.audioLost.play();
				state.game = false;
				showMessage('lost');
			} else showMessage('mistake', state.shortMessageTime);
		}
	}
}


function changeLevel() {
	if (dom.message.textContent === 'Го дальше🙃') {
		dom.message.textContent = '';
		dom.message.style.display = 'none';
		state.blur = state.initialBlur + state.level;
		state.level++;
		state.rotateAngle = 0;
		state.speed += 0.1;
		state.game = true;
		dom.blur.textContent = state.blur;
		dom.square.style.transform = `rotate(${state.rotateAngle}deg)`;
		dom.squareImg.style.filter = `blur(${state.blur}px)`;
		dom.squareImg.src = `./assets/img/level-${state.level}.jpg`;
		if (state.level === 5) setTimeout(()=> dom.audioLastLevel.play(), 700);
	}

	if (state.level > 5) {
		showMessage('end');
		state.game = false;
	}
}


dom.rotateBtn.addEventListener('click', () => { if(state.game) rotate() });
dom.stopBtn.addEventListener('click', () => { if(!state.game) stop() });
dom.message.addEventListener('click', () => changeLevel());

const toggleModal = () => dom.modal.classList.toggle('hidden');
dom.showModalBtn.addEventListener('click', () => toggleModal());
dom.closeModalBtn.addEventListener('click', () => toggleModal());

dom.reloadBtn.addEventListener('click', () => window.location.reload());

