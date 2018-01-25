export default class Base {
	constructor({ item, playerInstance, options = {} }) {
		this.element = this.createElement(item);
		this.playerInstance = playerInstance;
		this.displayAt = item.displayAt;
		this.options = Object.assign({}, options, {  });
	}

	createElement() {
		throw new Error('METHOD NOT IMPLEMENTED!');
	}

	hide() {
		this.element.display = 'none';

	}

	show() {
		this.element.display = 'block';
	}

	remove() {
		if (this.element) {
			this.element.remove();

			this.element = null;
		}
	}
}
