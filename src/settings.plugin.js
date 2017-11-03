function wikiaJWPlayerSettingsPlugin(player, config, div) {
	this.player = player;
	this.wikiaSettingsElement = div;
	this.buttonID = 'wikiaSettings';
	this.config = config;
	this.documentClickHandler = this.documentClickHandler.bind(this);

	this.addSettingsContent(this.wikiaSettingsElement);

	document.addEventListener('click', this.documentClickHandler);

	window.player = player;
}

wikiaJWPlayerSettingsPlugin.prototype.documentClickHandler = function (event) {
	// check if user didn't click the settings menu or settings button and if settings menu is open
	if (!event.target.closest('.wikia-jw-settings, .wikia-jw-settings-button') && this.wikiaSettingsElement.style.display) {
		this.close();
	}
};

wikiaJWPlayerSettingsPlugin.prototype.addButton = function () {
	var settingsIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon' +
			' jw-svg-icon-wikia-settings" viewBox="0 0 24 24">' + wikiaJWPlayerIcons.settings + '</svg>';

	this.player.addButton(settingsIcon, 'Settings', function () {
		if (!this.wikiaSettingsElement.style.display) {
			this.open();
		} else {
			this.close();
		}
	}.bind(this), this.buttonID, 'wikia-jw-settings-button');
};

wikiaJWPlayerSettingsPlugin.prototype.removeButton = function () {
	this.player.removeButton(this.buttonID);
};

/**
 * closes settings menu
 */
wikiaJWPlayerSettingsPlugin.prototype.close = function () {
	this.showSettingsList();
	this.wikiaSettingsElement.style.display = null;
	this.player.getContainer().classList.remove('wikia-jw-settings-open');
};

/**
 * opens settings menu
 */
wikiaJWPlayerSettingsPlugin.prototype.open = function () {
	this.wikiaSettingsElement.style.display = 'block';
	this.player.getContainer().classList.add('wikia-jw-settings-open');
};

/**
 * hides the entire plugin (button and settings menu_
 */
wikiaJWPlayerSettingsPlugin.prototype.hide = function () {
	this.close();
	this.removeButton();
};

/**
 * shows back the entire plugin (adds button back)
 */
wikiaJWPlayerSettingsPlugin.prototype.show = function () {
	if(!this.player.getContainer().querySelector('[button=wikiaSettings]')) {
		this.addButton();
	}
};

wikiaJWPlayerSettingsPlugin.prototype.showQualityLevelsList = function () {
	this.settingsList.style.display = 'none';
	this.qualityLevelsList.style.display = 'block';
};

wikiaJWPlayerSettingsPlugin.prototype.showSettingsList = function () {
	this.settingsList.style.display = 'block';
	this.qualityLevelsList.style.display = 'none';
};

wikiaJWPlayerSettingsPlugin.prototype.addSettingsContent = function (div) {
	div.classList.add('wikia-jw-settings');
	div.classList.remove('jw-reset', 'jw-plugin');
	this.settingsList = this.createSettingsListElement();
	this.qualityLevelsList = this.createQualityLevelsList();

	div.appendChild(this.settingsList);
	div.appendChild(this.qualityLevelsList);

	return div;
};

wikiaJWPlayerSettingsPlugin.prototype.createSettingsListElement = function () {
	var settingsList = document.createElement('ul');

	settingsList.classList.add('wikia-jw-settings__list');
	settingsList.appendChild(this.createQualityButton());

	if (this.config.showToggle) {
		settingsList.appendChild(this.createAutoplayToggle());
	}

	if ("test") {
		this.addCaptionListener();
	}

	return settingsList;
};

wikiaJWPlayerSettingsPlugin.prototype.createQualityButton = function () {
	var qualityButton = document.createElement('li');

	qualityButton.classList.add('wikia-jw-settings__quality-button');
	qualityButton.innerHTML = wikiaJWPlayerIcons.quality + ' Video Quality';
	qualityButton.addEventListener('click', this.showQualityLevelsList.bind(this));

	return qualityButton;
};

wikiaJWPlayerSettingsPlugin.prototype.createAutoplayToggle = function () {
	var playerInstance = this.player,
		autoplayToggle = createToggle({
			id: playerInstance.getContainer().id + '-videoAutoplayToggle',
			label: 'Autoplay Videos',
			checked: this.config.autoplay
		}),
		toggleLabel = autoplayToggle.querySelector('label');

	toggleLabel.addEventListener('click', function (event) {
		playerInstance.trigger('autoplayToggle', {
			enabled: !event.target.previousSibling.checked
		});
	});

	return autoplayToggle;
};

wikiaJWPlayerSettingsPlugin.prototype.isNotSmallPlayer = function () {
	var classList = this.player.getContainer().classList;
	return !(classList.contains('jw-breakpoint-0') || classList.contains('jw-breakpoint-1') || classList.contains('jw-breakpoint-2'));
};

wikiaJWPlayerSettingsPlugin.prototype.createQualityLevelsList = function () {
	var qualityLevelsList = document.createElement('ul'),
		backButton = document.createElement('li'),
		playerInstance = this.player,
		isActiveClass = 'is-active',
		isQualityListEmptyClass = 'is-quality-list-empty';

	qualityLevelsList.classList.add('wikia-jw-settings__quality-levels');
	backButton.classList.add('wikia-jw-settings__back');
	backButton.innerHTML = '<svg class="wikia-jw-settings__back-icon" width="18" height="18"' +
		' viewBox="0 0 18 18">' + wikiaJWPlayerIcons.back + '</svg> Back';
	backButton.addEventListener('click', this.showSettingsList.bind(this));
	qualityLevelsList.appendChild(backButton);

	playerInstance.on('levels', function (data) {
		// in Safari in data.levels array there is one element with label = '0'
		var isQualityListEmpty = !data.levels.length || (data.levels.length === 1 && data.levels[0].label === '0'),
			shouldShowSettingsButton = (!isQualityListEmpty || this.config.showToggle) && this.isNotSmallPlayer();

		this.wikiaSettingsElement.classList.toggle(isQualityListEmptyClass, isQualityListEmpty);

		if (shouldShowSettingsButton) {
			this.show();
		} else {
			this.hide();
		}

		this.updateQualityLevelsList(qualityLevelsList, data.levels, isActiveClass, backButton);
	}.bind(this));

	playerInstance.on('levelsChanged', this.updateCurrentQuality.bind(this, qualityLevelsList, isActiveClass));

	return qualityLevelsList;
};

wikiaJWPlayerSettingsPlugin.prototype.updateQualityLevelsList = function (qualityLevelsList, newLevels, isActiveClass, backButton) {
	var playerInstance = this.player;

	while (qualityLevelsList.childElementCount > 1) {
		qualityLevelsList.removeChild(qualityLevelsList.firstChild);
	}

	newLevels.forEach(function (level, index) {
		var qualityLevelItem = document.createElement('li');

		qualityLevelItem.addEventListener('click', function () {
			playerInstance.setCurrentQuality(index);
			this.close();
		}.bind(this));

		if (playerInstance.getCurrentQuality() === index) {
			qualityLevelItem.classList.add(isActiveClass);
		}

		qualityLevelItem.appendChild(document.createTextNode(level.label));
		qualityLevelsList.insertBefore(qualityLevelItem, backButton);
	}, this);
};

wikiaJWPlayerSettingsPlugin.prototype.updateCurrentQuality = function (qualityLevelsList, isActiveClass, data) {
	qualityLevelsList.childNodes.forEach(function (node, index) {
		if (data.currentQuality === index) {
			node.classList.add(isActiveClass);
		} else {
			node.classList.remove(isActiveClass);
		}
	});
};

wikiaJWPlayerSettingsPlugin.prototype.addCaptionListener = function () {
	this.player.once('captionsList', function (event) {
		// tracks have always "off" item
		if (event.tracks.length > 1) {
			console.log('#######', this.settingsList);
			
			this.settingsList.appendChild(this.createCaptionsButton(event.tracks));
		}
	}.bind(this));
};

wikiaJWPlayerSettingsPlugin.prototype.createCaptionsButton = function (captionTracks) {
	var captionsToggle = createToggle({
			id: this.player.getContainer().id + '-videoCaptionsToggle',
			label: 'Captions',
			checked: this.config.autoplay
		}),
		toggleLabel = captionsToggle.querySelector('label'),
		suitableCaptionsIndex = this.getSuitableCaptions(this.captionLangMap[this.getUserLang()], captionTracks);

	if (suitableCaptionsIndex) {
		toggleLabel.addEventListener('click', function () {
			if (this.areCaptionsOff(captionTracks[this.player.getCurrentCaptions()])) {
				this.player.setCurrentCaptions(suitableCaptionsIndex)
			} else {
				// "off" caption track is always the first one
				this.player.setCurrentCaptions(0);
			}
		}.bind(this));
	}

	if (this.config.autoplay) {
		this.player.setCurrentCaptions(suitableCaptionsIndex)
	}

	return captionsToggle;
};

wikiaJWPlayerSettingsPlugin.prototype.areCaptionsOff = function(captionObj) {
	return captionObj.id === 'off';
};

wikiaJWPlayerSettingsPlugin.prototype.getUserLang = function() {
	return window.navigator.language.slice(0, 2);
};

wikiaJWPlayerSettingsPlugin.prototype.getSuitableCaptions = function(userLang, captionTracks) {
	return captionTracks
		.map(function (track) {
			return track.label;
		})
		.indexOf(userLang);
};

wikiaJWPlayerSettingsPlugin.prototype.captionLangMap = {
	en: 'English',
	pl: 'Polski',
	fr: 'Français',
	de: 'Deutsch',
	it: 'Italiano',
	ja: '日本語',
	pt: 'Português',
	ru: 'Русский язык',
	es: 'Español',
	zh: '中文'
};

wikiaJWPlayerSettingsPlugin.register = function () {
	jwplayer().registerPlugin('wikiaSettings', '8.0.0', wikiaJWPlayerSettingsPlugin);
};

function createToggle(params) {
	var toggleWrapper = document.createElement('li'),
		toggleInput = document.createElement('input'),
		toggleLabel = document.createElement('label');

	toggleInput.setAttribute('type', 'checkbox');
	toggleInput.setAttribute('id', params.id);
	toggleInput.classList.add('wds-toggle__input');

	if (params.checked) {
		toggleInput.setAttribute('checked', '');
	}

	toggleLabel.setAttribute('for', params.id);
	toggleLabel.classList.add('wds-toggle__label');
	toggleLabel.appendChild(document.createTextNode(params.label));

	toggleWrapper.appendChild(toggleInput);
	toggleWrapper.appendChild(toggleLabel);

	return toggleWrapper;
}

