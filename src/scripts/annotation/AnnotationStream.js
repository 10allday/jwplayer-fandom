import { stringToHtml } from "./utils";

export default class AnnotationStream {
	constructor(playerInstance, options = {}) {
		this.list = [];
		this.playerInstance = playerInstance;
		this.currentlyVisibleAnnotations = [];
		this.wrapper = this.createWrapper();
		this.options = Object.assign({}, {amount: 2, delay: 5000}, options);

		this.attachListeners();

		setTimeout(() => this.attachWrapper(), 2000);
	}

	attachListeners() {
		this.playerInstance.on('time', ({ position }) => {
			const nextAnnotation = this.findLastSuitableElement(position);
			
			if (nextAnnotation && !this.currentlyVisibleAnnotations.includes(nextAnnotation)) {
				this.currentlyVisibleAnnotations.push(nextAnnotation);
				this.manageElements(nextAnnotation);
			}
		})
	}

	createWrapper() {
		return stringToHtml(`<div class="wikia-annotation__wrapper"></div>`);
	}

	attachWrapper() {
		this.playerInstance.getContainer().appendChild(this.wrapper);
	}

	add(items) {
		this.list = [...this.list, ...items].sort((a, b) => a.displayAt > b.displayAt);

		return this;
	}

	findLastSuitableElement(position) {
		const available = this.list
			.filter((annotation) => annotation.displayAt < position);

		return available[available.length - 1];
	}

	manageElements(nextAnnotation) {
		if (this.currentlyVisibleAnnotations.length > this.options.amount) {
			return;
		}

		this.wrapper.prepend(nextAnnotation.element);
		
		console.log('#######', '', nextAnnotation.element);

		this.removeWithDelay(nextAnnotation);
	}

	removeWithDelay(nextAnnotation) {
		setTimeout(() => {
			const index = this.currentlyVisibleAnnotations.indexOf(nextAnnotation);
			
			console.log('#######', '', index);
			
			index !== -1 && this.currentlyVisibleAnnotations[index].remove();

			this.currentlyVisibleAnnotations.shift();

		}, this.options.delay);
	}
}
