!function(t){function e(t){t.on("playerStart",function(){var e=document.querySelector(".jw-autostart-mute");e&&(t.getContainer().classList.remove("jw-flag-autostart"),e.style.display="none")})}function i(t,e,i){function n(){return{wasFirstQuartileTriggered:!1,wasMidPointTriggered:!1,wasThirdQuartileTriggered:!1,progress:{durationWatched:0,percentWatched:0}}}function s(e,i){var n=Math.floor(i.position),s=Math.floor(100*n/i.duration);n>o[e].progress.durationWatched&&n%5==0&&(t.trigger(e+"SecondsPlayed",{value:n}),o[e].progress.durationWatched=n),s>=25&&!o[e].wasFirstQuartileTriggered&&(t.trigger(e+"FirstQuartile"),o[e].wasFirstQuartileTriggered=!0),s>=50&&!o[e].wasMidPointTriggered&&(t.trigger(e+"MidPoint"),o[e].wasMidPointTriggered=!0),s>=75&&!o[e].wasThirdQuartileTriggered&&(t.trigger(e+"ThirdQuartile"),o[e].wasThirdQuartileTriggered=!0),s>o[e].progress.percentWatched&&s%10==0&&(t.trigger(e+"PercentPlayed",{value:s}),o[e].progress.percentWatched=s)}var o={ad:n(),video:n()},a=!1,l=0,r={ad:"ad",video:"video"},c=!1;i.info("before ready"),t.once("ready",function(){i.info("player ready");var e=t.getPlugin("related");e.on("open",function(){i.info("related plugin open"),t.trigger("relatedVideoImpression"),o[r.video]=n()}),e.on("play",function(e){i.info("related plugin play"),l++,t.trigger("relatedVideoPlay",{auto:e.auto,item:e.item,position:e.position,depth:l})})}),t.on("play",function(e){c&&(t.trigger("videoResumed"),i.info("videoResumed triggered")),c=!1}),t.on("pause",function(){c=!0}),t.on("firstFrame",function(){0===l&&(t.trigger("playerStart",{auto:e}),i.info("playerStart triggered")),t.trigger("videoStart"),i.info("videoStart triggered")}),t.on("mute",function(){t.getMute()||a||(t.trigger("firstUnmute"),a=!0)}),t.on("time",function(t){s(r.video,t)}),t.on("adTime",function(t){s(r.ad,t)}),t.on("adRequest",function(){o[r.ad]=n()})}function n(t){function e(t,e){var i=new XMLHttpRequest,o={name:s+" "+t};e&&(o.description="string"==typeof e?e:JSON.stringify(e)),r&&(o.client=r),i.open("POST",n,!0),i.setRequestHeader("Content-type","application/json"),i.send(JSON.stringify(o))}function i(t,i){l<=o.error&&(console.error(s,t,i),e(t,i))}var n="https://"+(t.servicesDomain||"services.wikia.com")+"/event-logger/error",s="JWPlayer",o={info:1,warn:2,error:3,off:4},a=t.logger||{},l=a.logLevel?o[a.logLevel]:o.error,r=a.clientName;return{info:function(t,e){l<=o.info&&console.info(s,t,e)},warn:function(t,e){l<=o.warn&&console.warn(s,t,e)},error:i,subscribeToPlayerErrors:function(t){t.on("setupError",function(t){i("setupError",t)}),t.on("error",function(t){i("error",t)})}}}function s(t){function e(t,e){if(t){var i=n.parseFromString(e,"image/svg+xml").documentElement;i.setAttribute("class",t.getAttribute("class")),t.parentNode.replaceChild(i,t)}}function i(t){var i=t.querySelector(".jw-controlbar"),n=t.querySelector(".jw-display");[{selector:".jw-svg-icon-play",iconName:"play"},{selector:".jw-svg-icon-pause",iconName:"pause"},{selector:".jw-svg-icon-fullscreen-on",iconName:"fullScreenOn"},{selector:".jw-svg-icon-fullscreen-off",iconName:"fullScreenOff"},{selector:".jw-svg-icon-settings",iconName:"settings"},{selector:".jw-svg-icon-volume-0",iconName:"volumeOff"},{selector:".jw-svg-icon-volume-50",iconName:"volumeOn"},{selector:".jw-svg-icon-volume-100",iconName:"volumeOn"}].forEach(function(t){e(i.querySelector(t.selector),d[t.iconName])}),[{selector:".jw-svg-icon-play",iconName:"play"},{selector:".jw-svg-icon-pause",iconName:"pause"}].forEach(function(t){e(n.querySelector(t.selector),d[t.iconName])})}var n=new DOMParser;t.on("ready",function(){i(t.getContainer())})}function o(t,e,i){this.player=t,this.container=i,this.wikiaSettingsElement=document.createElement("div"),this.buttonID="wikiaSettings",this.config=e,this.documentClickHandler=this.documentClickHandler.bind(this),this.container.classList.add("wikia-jw-settings__plugin"),this.wikiaSettingsElement.classList.add("wikia-jw-settings"),this.addSettingsContent(this.wikiaSettingsElement),this.container.appendChild(this.wikiaSettingsElement),this.player.on("levels",this.onQualityLevelsChange.bind(this)),document.addEventListener("click",this.documentClickHandler),document.addEventListener("touchend",this.documentClickHandler)}function a(t){var e=document.createElement("li"),i=document.createElement("input"),n=document.createElement("label");return e.className="wikia-jw-settings__toggle",i.setAttribute("type","checkbox"),i.setAttribute("id",t.id),i.className="wds-toggle__input",t.checked&&(i.checked=!0),n.setAttribute("for",t.id),n.className="wds-toggle__label",n.appendChild(document.createTextNode(t.label)),e.appendChild(i),e.appendChild(n),e}function l(t){t.on("relatedVideoPlay",function(e){e.auto||t.setMute(!1)})}function r(t,e){function i(e){return!document.hidden&&e&&(-1===["playing","paused","complete"].indexOf(t.getState())||n)}var n=!1;document.addEventListener("visibilitychange",function(){i(e)&&(t.play(!0),n=!1)},!1),t.on("relatedVideoPlay",function(){document.hidden&&(t.pause(),n=!0)})}function c(t,e,i){function n(t){"function"==typeof i.setCustomDimension&&(i.setCustomDimension(34,t.mediaid),i.setCustomDimension(35,t.title),i.setCustomDimension(36,t.tags))}function s(t,e){var i=document.getElementById(t);i&&i.parentElement.removeChild(i);var n=document.createElement("img");n.src=e,n.id=t,document.body.appendChild(n)}function o(){if(i.comscore){s("comscoreVideoMetrixTrack","http://b.scorecardresearch.com/p?C1=1&C2=6177433&C5=04")}}function a(t){t&&s("wikiaJWPlayerCustomPixel",t)}function l(e){if(!e.label)throw new Error("No tracking label provided");var n={action:e.action||"click",category:c,label:e.label,value:Number(t.getMute()),eventName:r,videoId:t.getPlaylistItem().mediaid,player:"jwplayer",trackingMethod:"analytics"};i.track(n)}var r="videoplayerevent",c=i.category||"featured-video";"function"==typeof i.setCustomDimension&&i.setCustomDimension(37,e?"Yes":"No"),t.once("ready",function(){n(t.getPlaylistItem()),l({label:"load",action:"impression"})}),t.on("relatedVideoImpression",function(){l({label:"recommended-video",action:"impression"})}),t.on("relatedVideoPlay",function(t){n(t.item),l({label:(t.auto?"recommended-video-autoplay-":"recommended-video-select-")+t.position,action:"impression"}),l({label:"recommended-video-depth-"+t.depth,action:"impression"}),o(),a(t.item.pixel)}),t.on("videoResumed",function(){l({label:"play-resumed"})}),t.on("playerStart",function(t){l(t.auto?{label:"autoplay-start",action:"impression"}:{label:"user-start"}),o(),a(i.pixel)}),t.on("pause",function(){l({label:"paused"})}),t.on("firstUnmute",function(){l({label:"unmuted"})}),t.on("videoPercentPlayed",function(t){l({label:"played-percentage-"+t.value,action:"view"})}),t.on("complete",function(){l({label:"completed",action:"impression"})}),t.on("onScrollClosed",function(){l({label:"collapsed",action:"close"})}),t.on("videoFeedbackImpression",function(){l({label:"feedback",action:"impression"})}),t.on("videoFeedbackThumbUp",function(){l({label:"feedback-thumb-up",action:"click"})}),t.on("videoFeedbackThumbDown",function(){l({label:"feedback-thumb-down",action:"click"})}),t.on("videoFeedbackClosed",function(){l({label:"feedback",action:"close"})}),t.on("autoplayToggle",function(t){l({label:"autoplay-"+(t.enabled?"enabled":"disabled")})})}var d={play:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M14.767 9.437L3.858 16.903a.553.553 0 0 1-.565.037.531.531 0 0 1-.293-.473V1.533c0-.199.113-.381.293-.473a.557.557 0 0 1 .565.036l10.91 7.467A.53.53 0 0 1 15 9a.53.53 0 0 1-.233.437z" fill-rule="evenodd"/></svg>',pause:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><rect width="5" height="16" rx="1" x="2" y="1"/><rect x="11" width="5" height="16" rx="1" y="1"/></g></svg>',fullScreenOn:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M3.249 7H1V2h5v2.25H3.249zm11.502 0H17V2h-5v2.25h2.751zM3.249 11H1v5h5v-2.25H3.249zm11.502 0H17v5h-5v-2.25h2.751z" fill-rule="evenodd"/></svg>',fullScreenOff:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M3.751 2H6v5H1V4.75h2.751zm10.498 0H12v5h5V4.75h-2.751zM3.751 16H6v-5H1v2.25h2.751zm10.498 0H12v-5h5v2.25h-2.751z" fill-rule="evenodd"/></svg>',settings:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M9 7.09a1.909 1.909 0 1 1 0 3.819A1.909 1.909 0 0 1 9 7.09m-4.702-.03a1.07 1.07 0 0 1-.99.667h-.672A.637.637 0 0 0 2 8.364v1.272c0 .352.285.637.636.637h.672c.436 0 .824.264.99.667l.006.013c.167.403.08.864-.229 1.172L3.6 12.6a.636.636 0 0 0 0 .9l.9.9a.636.636 0 0 0 .9 0l.475-.475a1.072 1.072 0 0 1 1.185-.223c.403.166.667.554.667.99v.672c0 .35.285.636.637.636h1.272a.637.637 0 0 0 .637-.636v-.672c0-.436.264-.824.667-.99l.013-.006a1.07 1.07 0 0 1 1.172.229l.475.475a.636.636 0 0 0 .9 0l.9-.9a.636.636 0 0 0 0-.9l-.475-.475a1.072 1.072 0 0 1-.229-1.172l.006-.013a1.07 1.07 0 0 1 .99-.667h.672A.637.637 0 0 0 16 9.636V8.364a.637.637 0 0 0-.636-.637h-.672a1.07 1.07 0 0 1-.996-.68 1.072 1.072 0 0 1 .229-1.172L14.4 5.4a.636.636 0 0 0 0-.9l-.9-.9a.636.636 0 0 0-.9 0l-.475.475c-.308.308-.77.396-1.172.229l-.013-.006a1.07 1.07 0 0 1-.667-.99v-.672A.637.637 0 0 0 9.636 2H8.364a.637.637 0 0 0-.637.636v.672a1.07 1.07 0 0 1-.68.996 1.07 1.07 0 0 1-1.172-.229L5.4 3.6a.636.636 0 0 0-.9 0l-.9.9a.636.636 0 0 0 0 .9l.475.475a1.072 1.072 0 0 1 .223 1.185" fill-rule="evenodd"/></svg>',volumeOff:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M8.45 2.17L4.664 6.28H1.036C.256 6.28 0 6.739 0 7.175v3.522c0 .436.256.985 1.036.985h3.646l3.785 4.176a1.1 1.1 0 0 0 .533.143.964.964 0 0 0 .5-.137c.33-.185.5-.526.5-.897V3.013c0-.37-.17-.713-.5-.898-.33-.186-.72-.13-1.05.054zm7.192 7.33l2.121-2.122a.807.807 0 1 0-1.142-1.141l-2.122 2.12-2.12-2.12a.808.808 0 0 0-1.142 1.141L13.358 9.5l-2.121 2.121a.807.807 0 1 0 1.142 1.142l2.12-2.12 2.122 2.12a.805.805 0 0 0 1.142 0 .807.807 0 0 0 0-1.142L15.642 9.5z" fill-rule="evenodd"/></svg>',volumeOn:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><path d="M8.45 2.17L4.664 6.28H1.036C.256 6.28 0 6.739 0 7.175v3.522c0 .436.256.985 1.036.985h3.646l3.785 4.176a1.1 1.1 0 0 0 .533.143.964.964 0 0 0 .5-.137c.33-.185.5-.526.5-.897V3.013c0-.37-.17-.713-.5-.898-.33-.186-.72-.13-1.05.054zm4.95 10.156a4.393 4.393 0 0 0 0-6.19.708.708 0 0 0-1.004 1 2.978 2.978 0 0 1 0 4.192.707.707 0 1 0 1.003.998z"/><path d="M17.515 9.231A6.186 6.186 0 0 0 15.7 4.84a.707.707 0 1 0-1.003.998A4.777 4.777 0 0 1 16.1 9.231a4.778 4.778 0 0 1-1.4 3.394.708.708 0 1 0 1.002.999 6.186 6.186 0 0 0 1.814-4.393z"/></g></svg>',back:'<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M6.003 10.002a.997.997 0 0 1-.707-.293L.293 4.707a.999.999 0 1 1 1.414-1.414l4.296 4.295 4.293-4.293A.999.999 0 1 1 11.71 4.71l-5 5a.997.997 0 0 1-.707.293" fill-rule="evenodd"/></svg>',quality:'<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-quality-100" viewBox="0 0 240 240"><path d="M55,200H35c-3,0-5-2-5-4c0,0,0,0,0-1v-30c0-3,2-5,4-5c0,0,0,0,1,0h20c3,0,5,2,5,4c0,0,0,0,0,1v30C60,198,58,200,55,200L55,200z M110,195v-70c0-3-2-5-4-5c0,0,0,0-1,0H85c-3,0-5,2-5,4c0,0,0,0,0,1v70c0,3,2,5,4,5c0,0,0,0,1,0h20C108,200,110,198,110,195L110,195z M160,195V85c0-3-2-5-4-5c0,0,0,0-1,0h-20c-3,0-5,2-5,4c0,0,0,0,0,1v110c0,3,2,5,4,5c0,0,0,0,1,0h20C158,200,160,198,160,195L160,195z M210,195V45c0-3-2-5-4-5c0,0,0,0-1,0h-20c-3,0-5,2-5,4c0,0,0,0,0,1v150c0,3,2,5,4,5c0,0,0,0,1,0h20C208,200,210,198,210,195L210,195z"></path></svg>'},u=[];window.wikiaJWPlayer=function(t,a,d){function p(t,e){var i=document.createElement("script"),n=document.getElementById(t);i.onload=function(){o.register(),u.forEach(function(t){t()})},i.async=!0,i.src=e||"https://content.jwplatform.com/libraries/VXc5h4Tf.js",n.parentNode.insertBefore(i,n.nextSibling)}function g(t,e,i){var n=jwplayer(t),s=e.videoDetails.playlist[0].mediaid,o=e.autoplay,a={advertising:{autoplayadsmuted:o,client:"googima",vpaidcontrols:!0},autostart:o&&!document.hidden,description:e.videoDetails.description,image:"//content.jwplatform.com/thumbs/"+s+"-640.jpg",mute:e.mute,playlist:e.videoDetails.playlist,title:e.videoDetails.title,captions:{backgroundColor:"#1a1a1a",backgroundOpacity:50,fontSize:16}};return e.settings&&(a.plugins={wikiaSettings:{showAutoplayToggle:e.settings.showAutoplayToggle,showQuality:e.settings.showQuality,showCaptionsToggle:e.settings.showCaptionsToggle,autoplay:e.autoplay,captions:e.captions}}),e.related&&(a.related={autoplaytimer:e.related.time||3,file:"//cdn.jwplayer.com/v2/playlists/"+e.related.playlistId+"?related_media_id="+s,oncomplete:e.related.autoplay?"autoplay":"show"}),i.info("setupPlayer"),n.setup(a),i.info("after setup"),i.subscribeToPlayerErrors(n),n}!function(t,e,i){"undefined"!=typeof jwplayer?i():(u.push(i),1===u.length&&p(t,e))}(t,a.playerURL,function(){var o=n(a),u=g(t,a,o);s(u),i(u,a.autoplay,o),a.related&&l(u),a.tracking&&(a.tracking.pixel=a.videoDetails.playlist[0].pixel,c(u,a.autoplay,a.tracking)),r(u,a.autoplay),e(u),d&&d(u)})};var p=new DOMParser;o.prototype.isSettingsMenuOrSettingsButton=function(t){var e=this.getSettingsButtonElement();return e&&(e===t||e.contains(t)||this.wikiaSettingsElement===t||this.wikiaSettingsElement.contains(t))},o.prototype.documentClickHandler=function(t){!this.isSettingsMenuOrSettingsButton(t.target)&&this.container.style.display&&this.close()},o.prototype.addButton=function(){var t=this.createSVG(d.settings);t.classList.add("jw-svg-icon"),t.classList.add("jw-svg-icon-wikia-settings"),this.player.addButton(t.outerHTML,"Settings",function(){this.wikiaSettingsElement.style.display?this.close():this.open()}.bind(this),this.buttonID,"wikia-jw-settings-button")},o.prototype.removeButton=function(){this.player.removeButton(this.buttonID)},o.prototype.close=function(){this.showSettingsList(),this.container.style.display=null,this.player.getContainer().classList.remove("wikia-jw-settings-open")},o.prototype.open=function(){this.container.style.display="block",this.player.getContainer().classList.add("wikia-jw-settings-open")},o.prototype.hide=function(){this.close(),this.removeButton()},o.prototype.show=function(){this.getSettingsButtonElement()||this.addButton()},o.prototype.showQualityLevelsList=function(){this.settingsList.style.display="none",this.qualityLevelsList&&(this.qualityLevelsList.style.display="block")},o.prototype.showSettingsList=function(){this.settingsList.style.display="block",this.qualityLevelsList&&(this.qualityLevelsList.style.display="none")},o.prototype.addSettingsContent=function(t){return t.classList.add("wikia-jw-settings"),t.classList.remove("jw-reset"),t.classList.remove("jw-plugin"),this.settingsList=this.createSettingsListElement(),t.appendChild(this.settingsList),this.config.showQuality&&(this.createQualityLevelsList(),t.appendChild(this.qualityLevelsList)),t},o.prototype.createSettingsListElement=function(){var t=document.createElement("ul");return t.classList.add("wikia-jw-settings__list"),t.classList.add("wds-list"),this.config.showQuality&&t.appendChild(this.createQualityButton()),this.config.showAutoplayToggle&&(t.appendChild(this.createAutoplayToggle()),this.show()),this.config.showCaptionsToggle&&(t.appendChild(this.createCaptionsButton()),this.addCaptionListener()),t},o.prototype.createSVG=function(t){return p.parseFromString(t,"image/svg+xml").documentElement},o.prototype.createQualityButton=function(){var t=this.createSVG(d.back),e=document.createElement("li");return t.classList.add("wikia-jw-settings__right-arrow-icon"),e.classList.add("wikia-jw-settings__quality-button"),e.innerHTML="Video Quality"+t.outerHTML,e.addEventListener("click",this.showQualityLevelsList.bind(this)),e},o.prototype.createAutoplayToggle=function(){var t=a({id:this.player.getContainer().id+"-videoAutoplayToggle",label:"Autoplay Videos",checked:this.config.autoplay});return this.getLabelElement(t).addEventListener("click",function(t){this.player.trigger("autoplayToggle",{enabled:!t.target.previousSibling.checked})}.bind(this)),t},o.prototype.createQualityLevelsList=function(){var t=this.player,e=this.createSVG(d.back);e.classList.add("wikia-jw-settings__back-icon"),this.backButton=document.createElement("li"),this.qualityLevelsList=document.createElement("ul"),this.qualityLevelsList.classList.add("wikia-jw-settings__quality-levels"),this.qualityLevelsList.classList.add("wds-list"),this.backButton.classList.add("wikia-jw-settings__back"),this.backButton.innerHTML=e.outerHTML+" Back",this.backButton.addEventListener("click",this.showSettingsList.bind(this)),this.qualityLevelsList.appendChild(this.backButton),t.on("levelsChanged",this.updateCurrentQuality.bind(this))},o.prototype.onQualityLevelsChange=function(t){var e=!t.levels.length||1===t.levels.length&&"0"===t.levels[0].label,i=!e&&this.config.showQuality||this.config.showAutoplayToggle;e?this.wikiaSettingsElement.classList.add("is-quality-list-empty"):this.wikiaSettingsElement.classList.remove("is-quality-list-empty"),i&&this.show(),this.qualityLevelsList&&this.updateQualityLevelsList(t.levels)},o.prototype.updateQualityLevelsList=function(t){for(var e=this.player;this.qualityLevelsList.childElementCount>1;)this.qualityLevelsList.removeChild(this.qualityLevelsList.firstChild);t.forEach(function(t,i){var n=document.createElement("li");n.addEventListener("click",function(){e.setCurrentQuality(i),this.close()}.bind(this)),e.getCurrentQuality()===i&&n.classList.add("is-active"),n.appendChild(document.createTextNode(t.label)),this.qualityLevelsList.insertBefore(n,this.backButton)},this)},o.prototype.updateCurrentQuality=function(t){for(var e=0;e<this.qualityLevelsList.childNodes.length;e++){var i=this.qualityLevelsList.childNodes[e];t.currentQuality===e?i.classList.add("is-active"):i.classList.remove("is-active")}},o.prototype.addCaptionListener=function(){var t=this.captionsClickHandler.bind(this);this.player.on("captionsList",function(e){e.tracks.length>1?(this.currentlySelectedCaptions=this.getSuitableCaptionsIndex(this.captionLangMap[this.getUserLang()],e.tracks),this.getLabelElement(this.captionsToggle).addEventListener("click",t),this.wikiaSettingsElement.classList.remove("are-captions-empty"),this.show(),this.config.captions.enabled&&this.player.setCurrentCaptions(this.currentlySelectedCaptions),this.config.captions.styles&&Object.keys(this.config.captions.styles).length&&this.player.setCaptions(this.config.captions.styles)):(this.getLabelElement(this.captionsToggle).removeEventListener("click",t),this.wikiaSettingsElement.classList.add("are-captions-empty"))}.bind(this))},o.prototype.createCaptionsButton=function(){return this.captionsToggle=a({id:this.player.getContainer().id+"-videoCaptionsToggle",label:"Captions",checked:this.config.captions.enabled}),this.captionsToggle.classList.add("wikia-jw-settings__captions-button"),this.captionsToggle},o.prototype.captionsClickHandler=function(){var t=this.areCaptionsOff(this.player.getCurrentCaptions())?this.currentlySelectedCaptions:0;this.player.setCurrentCaptions(t),this.player.trigger("captionsSelected",{enabled:t})},o.prototype.areCaptionsOff=function(t){return 0===t},o.prototype.getUserLang=function(){return(window.navigator.userLanguage||window.navigator.language).slice(0,2)},o.prototype.getSuitableCaptionsIndex=function(t,e){return e.map(function(t){return t.label}).indexOf(t)},o.prototype.captionLangMap={en:"English",pl:"Polski",fr:"Français",de:"Deutsch",it:"Italiano",ja:"日本語",pt:"Português",ru:"Русский язык",es:"Español",zh:"中文"},o.prototype.getLabelElement=function(t){return t.querySelector("label")},o.prototype.getSettingsButtonElement=function(){return this.player.getContainer().querySelector("[button="+this.buttonID+"]")},o.register=function(){jwplayer().registerPlugin("wikiaSettings","8.0.0",o)}}("undefined"==typeof wikiaJWPlayer?wikiaJWPlayer={}:wikiaJWPlayer);