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

const state = {
	game: true,
	level: 1,
	count: 0.01,
	initialBlur: 4,
	blur: 4,
	speed: 0.2,
	speedCatalisator: 0.05,
	animation: null,
	shortMessageTime: 1000,
	gameOverNumber: 10,
}

function getCount(){
	state.count = Math.round(state.count);
	let result = -1;

	switch(state.count){
		case 42: case 43: case 44: case 45: case 46:
		case 47: case 48: case 132: case 133: case 135:
		case 136: case 137: case 138: case 222: case 223:
		case 224: case 225: case 226: case 227: case 228:
		case 312:case 313: case 314: case 315: case 316:
		case 317: case 318:
			result = 0
		break;
	}

	return result;
}

function showMessage (mood, time){
	dom.message.style.display = 'block';

	switch(mood){
		case '+':
			dom.message.style.color = 'var(--yellow-color)';
			dom.message.textContent = 'Ура😉';
		break
		case '-':
			dom.message.style.color = 'var(--red-color)';
			dom.message.textContent = 'Блин🙁';
		break
		case 'lost':
			dom.message.style.color = 'var(--red-color)';
			dom.message.textContent = 'Ну всё, достаточно🤥';
		break
		case 'win':
			dom.message.style.color = 'var(--yellow-color)';
			dom.message.textContent = 'Го дальше🙃';
		break
		case 'end':
			dom.message.style.color = 'var(--yellow-color)';
			dom.message.textContent = 'БОЛЬШОЙ УВАЖЕНИЙ😮';
		break
	}

	time && setTimeout(() => dom.message.style.display = 'none', time);
}

function rotate(){
	state.animation = requestAnimationFrame(rotate);
	state.game = false;
	dom.square.style.transform = `rotate(${state.count}deg)`;
	if (state.count > 360) state.count = 0;
	state.count += state.speed;
}

function stop(){
	if (dom.message.textContent !== 'Го дальше🙃') {
		state.game = true;
		cancelAnimationFrame(state.animation);
		if (getCount() === 0) {
			dom.nice.play();
			state.blur--;
			dom.blur.textContent = state.blur;
			dom.squareImg.style.filter = `blur(${state.blur}px)`;
			state.speed += state.speedCatalisator;
			if (state.blur === 0) {
				state.game = false;
				showMessage('win');
				state.count = 0;
				dom.square.style.transition = `1s`;
				dom.square.style.transform = `rotate(${state.count}deg)`;
				setTimeout(() => dom.square.style.transition = `0s`, 1000);
			} else showMessage('+', state.shortMessageTime);
		} else {
			dom.notNice.play();
			state.blur++;
			dom.blur.textContent = state.blur;
			dom.squareImg.style.filter = `blur(${state.blur}px)`;
			if(state.blur > state.gameOverNumber){
				dom.lost.play();
				state.game = false;
				showMessage('lost');
			} else showMessage('-', state.shortMessageTime);
		}
	}
}

function changeLevel(){
	if (dom.message.textContent === 'Го дальше🙃') {
		dom.nextLevel.play();
		dom.message.textContent = '';
		dom.message.style.display = 'none';
		state.blur = state.initialBlur + state.level;
		state.level++;
		state.count = 0;
		state.speed += 0.1;
		state.game = true;
		dom.blur.textContent = state.blur;
		dom.square.style.transform = `rotate(${state.count}deg)`;
		dom.squareImg.style.filter = `blur(${state.blur}px)`;
		dom.squareImg.src = `./assets/img/level-${state.level}.jpg`;
		if (state.level === 5) setTimeout(()=> dom.lastLevel.play(), 700);
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

