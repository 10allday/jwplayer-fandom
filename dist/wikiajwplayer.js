!function(e){function t(e,t,i){function a(){return{wasFirstQuartileTriggered:!1,wasMidPointTriggered:!1,wasThirdQuartileTriggered:!1,progress:{durationWatched:0,percentWatched:0}}}function s(t,i){var a=Math.floor(i.position),s=Math.floor(100*a/i.duration);a>n[t].progress.durationWatched&&a%5==0&&(e.trigger(t+"SecondsPlayed",{value:a}),n[t].progress.durationWatched=a),s>=25&&!n[t].wasFirstQuartileTriggered&&(e.trigger(t+"FirstQuartile"),n[t].wasFirstQuartileTriggered=!0),s>=50&&!n[t].wasMidPointTriggered&&(e.trigger(t+"MidPoint"),n[t].wasMidPointTriggered=!0),s>=75&&!n[t].wasThirdQuartileTriggered&&(e.trigger(t+"ThirdQuartile"),n[t].wasThirdQuartileTriggered=!0),s>n[t].progress.percentWatched&&s%10==0&&(e.trigger(t+"PercentPlayed",{value:s}),n[t].progress.percentWatched=s)}var n={ad:a(),video:a()},o=!1,l=0,r={ad:"ad",video:"video"},c=!1;i.info("before ready"),e.once("ready",function(){i.info("player ready");var t=e.getPlugin("related");t.on("open",function(){i.info("related plugin open"),e.trigger("relatedVideoImpression"),n[r.video]=a()}),t.on("play",function(t){i.info("related plugin play"),l++,e.trigger("relatedVideoPlay",{auto:t.auto,item:t.item,position:t.position,depth:l})})}),e.on("play",function(t){c&&(e.trigger("videoResumed"),i.info("videoResumed triggered")),c=!1}),e.on("pause",function(){c=!0}),e.on("firstFrame",function(){0===l&&(e.trigger("playerStart",{auto:t}),i.info("playerStart triggered")),e.trigger("videoStart"),i.info("videoStart triggered")}),e.on("mute",function(){e.getMute()||o||(e.trigger("firstUnmute"),o=!0)}),e.on("time",function(e){s(r.video,e)}),e.on("adTime",function(e){s(r.ad,e)}),e.on("adRequest",function(){n[r.ad]=a()})}function i(e){function t(e,t){var i=new XMLHttpRequest,n={name:s+" "+e};t&&(n.description="string"==typeof t?t:JSON.stringify(t)),r&&(n.client=r),i.open("POST",a,!0),i.setRequestHeader("Content-type","application/json"),i.send(JSON.stringify(n))}function i(e,i){l<=n.error&&(console.error(s,e,i),t(e,i))}var a="https://"+(e.servicesDomain||"services.wikia.com")+"/event-logger/error",s="JWPlayer",n={info:1,warn:2,error:3,off:4},o=e.logger||{},l=o.logLevel?n[o.logLevel]:n.error,r=o.clientName;return{info:function(e,t){l<=n.info&&console.info(s,e,t)},warn:function(e,t){l<=n.warn&&console.warn(s,e,t)},error:i,subscribeToPlayerErrors:function(e){e.on("setupError",function(e){i("setupError",e)}),e.on("error",function(e){i("error",e)})}}}function a(e){function t(e,t){if(e){var i=a.parseFromString(t,"image/svg+xml").documentElement;i.setAttribute("class",e.getAttribute("class")),e.parentNode.replaceChild(i,e)}}function i(e){var i=e.querySelector(".jw-controlbar"),a=e.querySelector(".jw-display");[{selector:".jw-svg-icon-play",iconName:"play"},{selector:".jw-svg-icon-pause",iconName:"pause"},{selector:".jw-svg-icon-fullscreen-on",iconName:"fullScreenOn"},{selector:".jw-svg-icon-fullscreen-off",iconName:"fullScreenOff"},{selector:".jw-svg-icon-settings",iconName:"settings"},{selector:".jw-svg-icon-volume-0",iconName:"volumeOff"},{selector:".jw-svg-icon-volume-50",iconName:"volumeOn"},{selector:".jw-svg-icon-volume-100",iconName:"volumeOn"}].forEach(function(e){t(i.querySelector(e.selector),d[e.iconName])}),[{selector:".jw-svg-icon-play",iconName:"play"},{selector:".jw-svg-icon-pause",iconName:"pause"}].forEach(function(e){t(a.querySelector(e.selector),d[e.iconName])})}var a=new DOMParser;e.on("ready",function(){i(e.getContainer())})}function s(e,t,i){this.player=e,this.container=i,this.wikiaSettingsElement=document.createElement("div"),this.buttonID="wikiaSettings",this.config=t,this.documentClickHandler=this.documentClickHandler.bind(this),this.container.classList.add("wikia-jw-settings__plugin"),this.wikiaSettingsElement.classList.add("wikia-jw-settings"),this.addSettingsContent(this.wikiaSettingsElement),this.container.appendChild(this.wikiaSettingsElement),this.player.on("levels",this.onQualityLevelsChange.bind(this)),document.addEventListener("click",this.documentClickHandler),document.addEventListener("touchend",this.documentClickHandler)}function n(e){var t=document.createElement("li"),i=document.createElement("input"),a=document.createElement("label");return t.className="wikia-jw-settings__toggle",i.setAttribute("type","checkbox"),i.setAttribute("id",e.id),i.className="wds-toggle__input",e.checked&&(i.checked=!0),a.setAttribute("for",e.id),a.className="wds-toggle__label",a.appendChild(document.createTextNode(e.label)),t.appendChild(i),t.appendChild(a),t}function o(e){e.on("relatedVideoPlay",function(t){t.auto||e.setMute(!1)})}function l(e,t){function i(t){return!document.hidden&&t&&(-1===["playing","paused","complete"].indexOf(e.getState())||a)}var a=!1;document.addEventListener("visibilitychange",function(){i(t)&&(e.play(!0),a=!1)},!1),e.on("relatedVideoPlay",function(){document.hidden&&(e.pause(),a=!0)})}function r(e,t,i){function a(e){i.setCustomDimension(34,e.mediaid),i.setCustomDimension(35,e.title),i.setCustomDimension(36,e.tags)}function s(e,t){var i=document.getElementById(e);i&&i.parentElement.removeChild(i);var a=document.createElement("img");a.src=t,a.id=e,document.body.appendChild(a)}function n(){if(i.comscore){s("comscoreVideoMetrixTrack","http://b.scorecardresearch.com/p?C1=1&C2=6177433&C5=04")}}function o(e){e&&s("wikiaJWPlayerCustomPixel",e)}function l(t){if(!t.label)throw new Error("No tracking label provided");var a={action:t.action||"click",category:c,label:t.label,value:Number(e.getMute()),eventName:r,videoId:e.getPlaylistItem().mediaid,player:"jwplayer",trackingMethod:"analytics"};i.track(a)}var r="videoplayerevent",c=i.category||"featured-video";i.setCustomDimension(37,t?"Yes":"No"),e.once("ready",function(){a(e.getPlaylistItem()),l({label:"load",action:"impression"})}),e.on("relatedVideoImpression",function(){l({label:"recommended-video",action:"impression"})}),e.on("relatedVideoPlay",function(e){a(e.item),l({label:(e.auto?"recommended-video-autoplay-":"recommended-video-select-")+e.position,action:"impression"}),l({label:"recommended-video-depth-"+e.depth,action:"impression"}),n(),o(e.item.pixel)}),e.on("videoResumed",function(){l({label:"play-resumed"})}),e.on("playerStart",function(e){l(e.auto?{label:"autoplay-start",action:"impression"}:{label:"user-start"}),n(),o(i.pixel)}),e.on("pause",function(){l({label:"paused"})}),e.on("firstUnmute",function(){l({label:"unmuted"})}),e.on("videoSecondsPlayed",function(e){l({label:"played-seconds-"+e.value,action:"view"})}),e.on("videoPercentPlayed",function(e){l({label:"played-percentage-"+e.value,action:"view"})}),e.on("complete",function(){l({label:"completed",action:"impression"})}),e.on("onScrollClosed",function(){l({label:"collapsed",action:"close"})}),e.on("videoFeedbackImpression",function(){l({label:"feedback",action:"impression"})}),e.on("videoFeedbackThumbUp",function(){l({label:"feedback-thumb-up",action:"click"})}),e.on("videoFeedbackThumbDown",function(){l({label:"feedback-thumb-down",action:"click"})}),e.on("videoFeedbackClosed",function(){l({label:"feedback",action:"close"})}),e.on("autoplayToggle",function(e){l({label:"autoplay-"+(e.enabled?"enabled":"disabled")})})}var c={de:{admessage:"The ad will end in xx seconds",autoplayVideos:"Autoplay Videos",back:"Back",close:"Close",cuetext:"Advertisement",fullscreen:"Fullscreen",next:"Next",nextUp:"Next Up",nextUpInSeconds:"Next up in xx",pause:"Pause",play:"Play",playback:"Start playback",player:"Video Player",prev:"Previous",replay:"Replay",settings:"Settings",skipmessage:"Skip ad in xx",skiptext:"Skip",videoQuality:"Video Quality",volume:"Volume"},en:{admessage:"The ad will end in xx seconds",autoplayVideos:"Autoplay Videos",back:"Back",close:"Close",cuetext:"Advertisement",fullscreen:"Fullscreen",next:"Next",nextUp:"Next Up",nextUpInSeconds:"Next up in xx",pause:"Pause",play:"Play",playback:"Start playback",player:"Video Player",prev:"Previous",replay:"Replay",settings:"Settings",skipmessage:"Skip ad in xx",skiptext:"Skip",videoQuality:"Video Quality",volume:"Volume"},es:{admessage:"The ad will end in xx seconds",autoplayVideos:"Autoplay Videos",back:"Back",close:"Close",cuetext:"Advertisement",fullscreen:"Fullscreen",next:"Next",nextUp:"Next Up",nextUpInSeconds:"Next up in xx",pause:"Pause",play:"Play",playback:"Start playback",player:"Video Player",prev:"Previous",replay:"Replay",settings:"Settings",skipmessage:"Skip ad in xx",skiptext:"Skip",videoQuality:"Video Quality",volume:"Volume"},fr:{admessage:"The ad will end in xx seconds",autoplayVideos:"Autoplay Videos",back:"Back",close:"Close",cuetext:"Advertisement",fullscreen:"Fullscreen",next:"Next",nextUp:"Next Up",nextUpInSeconds:"Next up in xx",pause:"Pause",play:"Play",playback:"Start playback",player:"Video Player",prev:"Previous",replay:"Replay",settings:"Settings",skipmessage:"Skip ad in xx",skiptext:"Skip",videoQuality:"Video Quality",volume:"Volume"},it:{admessage:"The ad will end in xx seconds",autoplayVideos:"Autoplay Videos",back:"Back",close:"Close",cuetext:"Advertisement",fullscreen:"Fullscreen",next:"Next",nextUp:"Next Up",nextUpInSeconds:"Next up in xx",pause:"Pause",play:"Play",playback:"Start playback",player:"Video Player",prev:"Previous",replay:"Replay",settings:"Settings",skipmessage:"Skip ad in xx",skiptext:"Skip",videoQuality:"Video Quality",volume:"Volume"},ja:{admessage:"The ad will end in xx seconds",autoplayVideos:"Autoplay Videos",back:"Back",close:"Close",cuetext:"Advertisement",fullscreen:"Fullscreen",next:"Next",nextUp:"Next Up",nextUpInSeconds:"Next up in xx",pause:"Pause",play:"Play",playback:"Start playback",player:"Video Player",prev:"Previous",replay:"Replay",settings:"Settings",skipmessage:"Skip ad in xx",skiptext:"Skip",videoQuality:"Video Quality",volume:"Volume"},pl:{admessage:"PL The ad will end in xx seconds",autoplayVideos:"PL Autoplay Videos",back:"PL Back",close:"PL Close",cuetext:"PL Advertisement",fullscreen:"PL Fullscreen",next:"PL Next",nextUp:"PL Next Up",nextUpInSeconds:"PL Next up in xx",pause:"PL Pause",play:"PL Play",playback:"PL Start playback",player:"PL Video Player",prev:"PL Previous",replay:"PL Replay",settings:"PL Settings",skipmessage:"PL Skip ad in xx",skiptext:"PL Skip",videoQuality:"PL Video Quality",volume:"PL Volume"},pt:{admessage:"The ad will end in xx seconds",autoplayVideos:"Autoplay Videos",back:"Back",close:"Close",cuetext:"Advertisement",fullscreen:"Fullscreen",next:"Next",nextUp:"Next Up",nextUpInSeconds:"Next up in xx",pause:"Pause",play:"Play",playback:"Start playback",player:"Video Player",prev:"Previous",replay:"Replay",settings:"Settings",skipmessage:"Skip ad in xx",skiptext:"Skip",videoQuality:"Video Quality",volume:"Volume"},ru:{admessage:"The ad will end in xx seconds",autoplayVideos:"Autoplay Videos",back:"Back",close:"Close",cuetext:"Advertisement",fullscreen:"Fullscreen",next:"Next",nextUp:"Next Up",nextUpInSeconds:"Next up in xx",pause:"Pause",play:"Play",playback:"Start playback",player:"Video Player",prev:"Previous",replay:"Replay",settings:"Settings",skipmessage:"Skip ad in xx",skiptext:"Skip",videoQuality:"Video Quality",volume:"Volume"},"zh-hans":{admessage:"ZH-HANS The ad will end in xx seconds",autoplayVideos:"ZH-HANS Autoplay Videos",back:"ZH-HANS Back",close:"ZH-HANS Close",cuetext:"ZH-HANS Advertisement",fullscreen:"ZH-HANS Fullscreen",next:"ZH-HANS Next",nextUp:"ZH-HANS Next Up",nextUpInSeconds:"ZH-HANS Next up in xx",pause:"ZH-HANS Pause",play:"ZH-HANS Play",playback:"ZH-HANS Start playback",player:"ZH-HANS Video Player",prev:"ZH-HANS Previous",replay:"ZH-HANS Replay",settings:"ZH-HANS Settings",skipmessage:"ZH-HANS Skip ad in xx",skiptext:"ZH-HANS Skip",videoQuality:"ZH-HANS Video Quality",volume:"ZH-HANS Volume"},"zh-hant":{admessage:"The ad will end in xx seconds",autoplayVideos:"Autoplay Videos",back:"Back",close:"Close",cuetext:"Advertisement",fullscreen:"Fullscreen",next:"Next",nextUp:"Next Up",nextUpInSeconds:"Next up in xx",pause:"Pause",play:"Play",playback:"Start playback",player:"Video Player",prev:"Previous",replay:"Replay",settings:"Settings",skipmessage:"Skip ad in xx",skiptext:"Skip",videoQuality:"Video Quality",volume:"Volume"}},d={play:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M14.767 9.437L3.858 16.903a.553.553 0 0 1-.565.037.531.531 0 0 1-.293-.473V1.533c0-.199.113-.381.293-.473a.557.557 0 0 1 .565.036l10.91 7.467A.53.53 0 0 1 15 9a.53.53 0 0 1-.233.437z" fill-rule="evenodd"/></svg>',pause:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><rect width="5" height="16" rx="1" x="2" y="1"/><rect x="11" width="5" height="16" rx="1" y="1"/></g></svg>',fullScreenOn:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M3.249 7H1V2h5v2.25H3.249zm11.502 0H17V2h-5v2.25h2.751zM3.249 11H1v5h5v-2.25H3.249zm11.502 0H17v5h-5v-2.25h2.751z" fill-rule="evenodd"/></svg>',fullScreenOff:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M3.751 2H6v5H1V4.75h2.751zm10.498 0H12v5h5V4.75h-2.751zM3.751 16H6v-5H1v2.25h2.751zm10.498 0H12v-5h5v2.25h-2.751z" fill-rule="evenodd"/></svg>',settings:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M9 7.09a1.909 1.909 0 1 1 0 3.819A1.909 1.909 0 0 1 9 7.09m-4.702-.03a1.07 1.07 0 0 1-.99.667h-.672A.637.637 0 0 0 2 8.364v1.272c0 .352.285.637.636.637h.672c.436 0 .824.264.99.667l.006.013c.167.403.08.864-.229 1.172L3.6 12.6a.636.636 0 0 0 0 .9l.9.9a.636.636 0 0 0 .9 0l.475-.475a1.072 1.072 0 0 1 1.185-.223c.403.166.667.554.667.99v.672c0 .35.285.636.637.636h1.272a.637.637 0 0 0 .637-.636v-.672c0-.436.264-.824.667-.99l.013-.006a1.07 1.07 0 0 1 1.172.229l.475.475a.636.636 0 0 0 .9 0l.9-.9a.636.636 0 0 0 0-.9l-.475-.475a1.072 1.072 0 0 1-.229-1.172l.006-.013a1.07 1.07 0 0 1 .99-.667h.672A.637.637 0 0 0 16 9.636V8.364a.637.637 0 0 0-.636-.637h-.672a1.07 1.07 0 0 1-.996-.68 1.072 1.072 0 0 1 .229-1.172L14.4 5.4a.636.636 0 0 0 0-.9l-.9-.9a.636.636 0 0 0-.9 0l-.475.475c-.308.308-.77.396-1.172.229l-.013-.006a1.07 1.07 0 0 1-.667-.99v-.672A.637.637 0 0 0 9.636 2H8.364a.637.637 0 0 0-.637.636v.672a1.07 1.07 0 0 1-.68.996 1.07 1.07 0 0 1-1.172-.229L5.4 3.6a.636.636 0 0 0-.9 0l-.9.9a.636.636 0 0 0 0 .9l.475.475a1.072 1.072 0 0 1 .223 1.185" fill-rule="evenodd"/></svg>',volumeOff:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M8.45 2.17L4.664 6.28H1.036C.256 6.28 0 6.739 0 7.175v3.522c0 .436.256.985 1.036.985h3.646l3.785 4.176a1.1 1.1 0 0 0 .533.143.964.964 0 0 0 .5-.137c.33-.185.5-.526.5-.897V3.013c0-.37-.17-.713-.5-.898-.33-.186-.72-.13-1.05.054zm7.192 7.33l2.121-2.122a.807.807 0 1 0-1.142-1.141l-2.122 2.12-2.12-2.12a.808.808 0 0 0-1.142 1.141L13.358 9.5l-2.121 2.121a.807.807 0 1 0 1.142 1.142l2.12-2.12 2.122 2.12a.805.805 0 0 0 1.142 0 .807.807 0 0 0 0-1.142L15.642 9.5z" fill-rule="evenodd"/></svg>',volumeOn:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><path d="M8.45 2.17L4.664 6.28H1.036C.256 6.28 0 6.739 0 7.175v3.522c0 .436.256.985 1.036.985h3.646l3.785 4.176a1.1 1.1 0 0 0 .533.143.964.964 0 0 0 .5-.137c.33-.185.5-.526.5-.897V3.013c0-.37-.17-.713-.5-.898-.33-.186-.72-.13-1.05.054zm4.95 10.156a4.393 4.393 0 0 0 0-6.19.708.708 0 0 0-1.004 1 2.978 2.978 0 0 1 0 4.192.707.707 0 1 0 1.003.998z"/><path d="M17.515 9.231A6.186 6.186 0 0 0 15.7 4.84a.707.707 0 1 0-1.003.998A4.777 4.777 0 0 1 16.1 9.231a4.778 4.778 0 0 1-1.4 3.394.708.708 0 1 0 1.002.999 6.186 6.186 0 0 0 1.814-4.393z"/></g></svg>',back:'<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M6.003 10.002a.997.997 0 0 1-.707-.293L.293 4.707a.999.999 0 1 1 1.414-1.414l4.296 4.295 4.293-4.293A.999.999 0 1 1 11.71 4.71l-5 5a.997.997 0 0 1-.707.293" fill-rule="evenodd"/></svg>',quality:'<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-quality-100" viewBox="0 0 240 240"><path d="M55,200H35c-3,0-5-2-5-4c0,0,0,0,0-1v-30c0-3,2-5,4-5c0,0,0,0,1,0h20c3,0,5,2,5,4c0,0,0,0,0,1v30C60,198,58,200,55,200L55,200z M110,195v-70c0-3-2-5-4-5c0,0,0,0-1,0H85c-3,0-5,2-5,4c0,0,0,0,0,1v70c0,3,2,5,4,5c0,0,0,0,1,0h20C108,200,110,198,110,195L110,195z M160,195V85c0-3-2-5-4-5c0,0,0,0-1,0h-20c-3,0-5,2-5,4c0,0,0,0,0,1v110c0,3,2,5,4,5c0,0,0,0,1,0h20C158,200,160,198,160,195L160,195z M210,195V45c0-3-2-5-4-5c0,0,0,0-1,0h-20c-3,0-5,2-5,4c0,0,0,0,0,1v150c0,3,2,5,4,5c0,0,0,0,1,0h20C208,200,210,198,210,195L210,195z"></path></svg>'},u=[];window.wikiaJWPlayer=function(e,n,d){function p(e,t){var i=document.createElement("script"),a=document.getElementById(e);i.onload=function(){s.register(),u.forEach(function(e){e()})},i.async=!0,i.src=t||"https://content.jwplatform.com/libraries/VXc5h4Tf.js",a.parentNode.insertBefore(i,a.nextSibling)}function g(e,t,i){var a=jwplayer(e),s=t.videoDetails.playlist[0].mediaid,n=t.autoplay,o=t.lang||"en",l=o.substr(0,2),r=c[o]||c.en,d={advertising:{autoplayadsmuted:n,client:"googima",vpaidcontrols:!0,admessage:r.admessage,cuetext:r.cuetext,skipmessage:r.skipmessage,skiptext:r.skiptext,setLocale:l},autostart:n&&!document.hidden,description:t.videoDetails.description,image:"//content.jwplatform.com/thumbs/"+s+"-640.jpg",mute:t.mute,playlist:t.videoDetails.playlist,title:t.videoDetails.title,localization:r,captions:{backgroundColor:"#1a1a1a",backgroundOpacity:50,fontSize:16}};return t.settings&&(d.plugins={wikiaSettings:{showAutoplayToggle:t.settings.showAutoplayToggle,showQuality:t.settings.showQuality,showCaptionsToggle:t.settings.showCaptionsToggle,autoplay:t.autoplay,captions:t.captions,i18n:r}}),t.related&&(d.related={autoplaytimer:t.related.time||3,file:"//cdn.jwplayer.com/v2/playlists/"+t.related.playlistId+"?related_media_id="+s,oncomplete:t.related.autoplay?"autoplay":"show",autoplaymessage:r.nextUpInSeconds}),i.info("setupPlayer"),a.setup(d),i.info("after setup"),i.subscribeToPlayerErrors(a),a}!function(e,t,i){"undefined"!=typeof jwplayer?i():(u.push(i),1===u.length&&p(e,t))}(e,n.playerURL,function(){var s=i(n),c=g(e,n,s);a(c),t(c,n.autoplay,s),n.related&&o(c),n.tracking&&(n.tracking.pixel=n.videoDetails.playlist[0].pixel,r(c,n.autoplay,n.tracking)),l(c,n.autoplay),d&&d(c)})};var p=new DOMParser;s.prototype.isSettingsMenuOrSettingsButton=function(e){var t=this.getSettingsButtonElement();return t===e||t.contains(e)||this.wikiaSettingsElement===e||this.wikiaSettingsElement.contains(e)},s.prototype.documentClickHandler=function(e){!this.isSettingsMenuOrSettingsButton(e.target)&&this.container.style.display&&this.close()},s.prototype.addButton=function(){var e=this.createSVG(d.settings);e.classList.add("jw-svg-icon"),e.classList.add("jw-svg-icon-wikia-settings"),this.player.addButton(e.outerHTML,this.config.i18n.settings,function(){this.wikiaSettingsElement.style.display?this.close():this.open()}.bind(this),this.buttonID,"wikia-jw-settings-button")},s.prototype.removeButton=function(){this.player.removeButton(this.buttonID)},s.prototype.close=function(){this.showSettingsList(),this.container.style.display=null,this.player.getContainer().classList.remove("wikia-jw-settings-open")},s.prototype.open=function(){this.container.style.display="block",this.player.getContainer().classList.add("wikia-jw-settings-open")},s.prototype.hide=function(){this.close(),this.removeButton()},s.prototype.show=function(){this.getSettingsButtonElement()||this.addButton()},s.prototype.showQualityLevelsList=function(){this.settingsList.style.display="none",this.qualityLevelsList&&(this.qualityLevelsList.style.display="block")},s.prototype.showSettingsList=function(){this.settingsList.style.display="block",this.qualityLevelsList&&(this.qualityLevelsList.style.display="none")},s.prototype.addSettingsContent=function(e){return e.classList.add("wikia-jw-settings"),e.classList.remove("jw-reset"),e.classList.remove("jw-plugin"),this.settingsList=this.createSettingsListElement(),e.appendChild(this.settingsList),this.config.showQuality&&(this.createQualityLevelsList(),e.appendChild(this.qualityLevelsList)),e},s.prototype.createSettingsListElement=function(){var e=document.createElement("ul");return e.classList.add("wikia-jw-settings__list"),e.classList.add("wds-list"),this.config.showQuality&&e.appendChild(this.createQualityButton()),this.config.showAutoplayToggle&&(e.appendChild(this.createAutoplayToggle()),this.show()),this.config.showCaptionsToggle&&(e.appendChild(this.createCaptionsButton()),this.addCaptionListener()),e},s.prototype.createSVG=function(e){return p.parseFromString(e,"image/svg+xml").documentElement},s.prototype.createQualityButton=function(){var e=this.createSVG(d.back),t=document.createElement("li");return e.classList.add("wikia-jw-settings__right-arrow-icon"),t.classList.add("wikia-jw-settings__quality-button"),t.innerHTML=this.config.i18n.videoQuality+e.outerHTML,t.addEventListener("click",this.showQualityLevelsList.bind(this)),t},s.prototype.createAutoplayToggle=function(){var e=n({id:this.player.getContainer().id+"-videoAutoplayToggle",label:this.config.i18n.autoplayVideos,checked:this.config.autoplay});return this.getLabelElement(e).addEventListener("click",function(e){this.player.trigger("autoplayToggle",{enabled:!e.target.previousSibling.checked})}.bind(this)),e},s.prototype.createQualityLevelsList=function(){var e=this.player,t=this.createSVG(d.back);t.classList.add("wikia-jw-settings__back-icon"),this.backButton=document.createElement("li"),this.qualityLevelsList=document.createElement("ul"),this.qualityLevelsList.classList.add("wikia-jw-settings__quality-levels"),this.qualityLevelsList.classList.add("wds-list"),this.backButton.classList.add("wikia-jw-settings__back"),this.backButton.innerHTML=t.outerHTML+" "+this.config.i18n.back,this.backButton.addEventListener("click",this.showSettingsList.bind(this)),this.qualityLevelsList.appendChild(this.backButton),e.on("levelsChanged",this.updateCurrentQuality.bind(this))},s.prototype.onQualityLevelsChange=function(e){var t=!e.levels.length||1===e.levels.length&&"0"===e.levels[0].label,i=!t&&this.config.showQuality||this.config.showAutoplayToggle;t?this.wikiaSettingsElement.classList.add("is-quality-list-empty"):this.wikiaSettingsElement.classList.remove("is-quality-list-empty"),i&&this.show(),this.qualityLevelsList&&this.updateQualityLevelsList(e.levels)},s.prototype.updateQualityLevelsList=function(e){for(var t=this.player;this.qualityLevelsList.childElementCount>1;)this.qualityLevelsList.removeChild(this.qualityLevelsList.firstChild);e.forEach(function(e,i){var a=document.createElement("li");a.addEventListener("click",function(){t.setCurrentQuality(i),this.close()}.bind(this)),t.getCurrentQuality()===i&&a.classList.add("is-active"),a.appendChild(document.createTextNode(e.label)),this.qualityLevelsList.insertBefore(a,this.backButton)},this)},s.prototype.updateCurrentQuality=function(e){for(var t=0;t<this.qualityLevelsList.childNodes.length;t++){var i=this.qualityLevelsList.childNodes[t];e.currentQuality===t?i.classList.add("is-active"):i.classList.remove("is-active")}},s.prototype.addCaptionListener=function(){var e=this.captionsClickHandler.bind(this);this.player.on("captionsList",function(t){t.tracks.length>1?(this.currentlySelectedCaptions=this.getSuitableCaptionsIndex(this.captionLangMap[this.getUserLang()],t.tracks),this.getLabelElement(this.captionsToggle).addEventListener("click",e),this.wikiaSettingsElement.classList.remove("are-captions-empty"),this.show(),this.config.captions.enabled&&this.player.setCurrentCaptions(this.currentlySelectedCaptions),this.config.captions.styles&&Object.keys(this.config.captions.styles).length&&this.player.setCaptions(this.config.captions.styles)):(this.getLabelElement(this.captionsToggle).removeEventListener("click",e),this.wikiaSettingsElement.classList.add("are-captions-empty"))}.bind(this))},s.prototype.createCaptionsButton=function(){return this.captionsToggle=n({id:this.player.getContainer().id+"-videoCaptionsToggle",label:"Captions",checked:this.config.captions.enabled}),this.captionsToggle.classList.add("wikia-jw-settings__captions-button"),this.captionsToggle},s.prototype.captionsClickHandler=function(){var e=this.areCaptionsOff(this.player.getCurrentCaptions())?this.currentlySelectedCaptions:0;this.player.setCurrentCaptions(e),this.player.trigger("captionsSelected",{enabled:e})},s.prototype.areCaptionsOff=function(e){return 0===e},s.prototype.getUserLang=function(){return(window.navigator.userLanguage||window.navigator.language).slice(0,2)},s.prototype.getSuitableCaptionsIndex=function(e,t){return t.map(function(e){return e.label}).indexOf(e)},s.prototype.captionLangMap={en:"English",pl:"Polski",fr:"Français",de:"Deutsch",it:"Italiano",ja:"日本語",pt:"Português",ru:"Русский язык",es:"Español",zh:"中文"},s.prototype.getLabelElement=function(e){return e.querySelector("label")},s.prototype.getSettingsButtonElement=function(){return this.player.getContainer().querySelector("[button="+this.buttonID+"]")},s.register=function(){jwplayer().registerPlugin("wikiaSettings","8.0.0",s)}}("undefined"==typeof wikiaJWPlayer?wikiaJWPlayer={}:wikiaJWPlayer);