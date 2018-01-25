export default class Base {
	constructor({ item, playerInstance, options = {} }) {
		this.element = this.createElement(item);
		this.playerInstance = playerInstance;
		this.displayAt = item.displayAt;
		this.options = Object.assign({}, options, {  });
		this.displayed = false;
	}

	createElement() {
		throw new Error('METHOD NOT IMPLEMENTED!');
	}

	hide() {
		this.element.classList.remove('enter');
		this.element.classList.add('exit');

		setTimeout(() => this.remove(), 500);
	}

	show() {
		this.element.classList.remove('exit');
		this.element.classList.add('enter');
		this.displayed = true;
	}

	remove() {
		if (this.element) {
			this.element.remove();

			this.element = null;
		}
	}

	isDisplayed() {
		return this.displayed;
	}
}
