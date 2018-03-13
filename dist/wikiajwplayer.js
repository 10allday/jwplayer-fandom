!function(e){function t(e){var t=document.createElement("li"),i=document.createElement("input"),a=document.createElement("label");return t.className="wikia-jw-settings__toggle",i.className="wds-toggle__input",i.id=e.id,i.type="checkbox",i.checked=e.checked,a.className="wds-toggle__label",a.setAttribute("for",e.id),a.appendChild(document.createTextNode(e.label)),t.appendChild(i),t.appendChild(a),t}function i(e){var t=n(w.back);return"left"===e?t.classList.add("wikia-jw-settings__back-icon"):t.classList.add("wikia-jw-settings__right-arrow-icon"),t}function a(e){if(e)for(;e.childElementCount>1;)e.removeChild(e.firstChild)}function n(e){return x.parseFromString(e,"image/svg+xml").documentElement}function s(e){e&&(e.style.display="block")}function o(e){e&&(e.style.display="none")}function l(e){e.on("playerStart",function(){var t=document.querySelector(".jw-autostart-mute");t&&(e.getContainer().classList.remove("jw-flag-autostart"),t.style.display="none")})}function r(e,t,i){function a(){return{wasFirstQuartileTriggered:!1,wasMidPointTriggered:!1,wasThirdQuartileTriggered:!1,progress:{durationWatched:0,percentWatched:0}}}function n(t,a){var n=Math.floor(a.position),o=Math.floor(100*n/a.duration),l=e.getPlaylistItem();o>100&&l&&(a.mediaId=l.mediaid,i.error("played-percentage",a)),n>s[t].progress.durationWatched&&n%5==0&&(e.trigger(t+"SecondsPlayed",{value:n}),s[t].progress.durationWatched=n),o>=25&&!s[t].wasFirstQuartileTriggered&&(e.trigger(t+"FirstQuartile"),s[t].wasFirstQuartileTriggered=!0),o>=50&&!s[t].wasMidPointTriggered&&(e.trigger(t+"MidPoint"),s[t].wasMidPointTriggered=!0),o>=75&&!s[t].wasThirdQuartileTriggered&&(e.trigger(t+"ThirdQuartile"),s[t].wasThirdQuartileTriggered=!0),o>s[t].progress.percentWatched&&o%10==0&&(e.trigger(t+"PercentPlayed",{value:o}),s[t].progress.percentWatched=o)}var s={ad:a(),video:a()},o=!1,l=0,r={ad:"ad",video:"video"},c=!1;i.info("before ready"),e.once("ready",function(){i.info("player ready");var t=e.getPlugin("related");t.on("open",function(){i.info("related plugin open"),e.trigger("relatedVideoImpression"),s[r.video]=a()}),t.on("play",function(t){i.info("related plugin play"),l++,e.trigger("relatedVideoPlay",{auto:t.auto,item:t.item,position:t.position,depth:l})})}),e.on("play",function(t){c&&(e.trigger("videoResumed",t),i.info("videoResumed triggered")),c=!1}),e.on("pause",function(){c=!0}),e.on("firstFrame",function(){0===l&&(e.trigger("playerStart",{auto:t}),i.info("playerStart triggered")),e.trigger("videoStart"),i.info("videoStart triggered")}),e.on("mute",function(){e.getMute()||o||(e.trigger("firstUnmute"),o=!0)}),e.on("time",function(e){n(r.video,e)}),e.on("adTime",function(e){n(r.ad,e)}),e.on("adRequest",function(){s[r.ad]=a()})}function c(e,t){function i(e){var t=Math.floor(e/60),i=e%60;return i<10&&(i="0"+i),t<10&&(t="0"+t),t+":"+i}e.on("ready",function(){var a=e.id,n=document.getElementById(a),s=n.querySelector(".jw-title"),o=n.querySelector(".jw-title-primary"),l=document.createElement("div"),r=document.createElement("span"),c=document.createElement("span");l.className="wikia-jw-title-duration",r.className="wikia-jw-title-duration-watch",c.className="wikia-jw-title-duration-time",r.innerText=t.watch,c.innerText=i(e.getDuration()),l.appendChild(r),l.appendChild(c),s.insertBefore(l,o)})}function d(e){function t(e,t){var i=new XMLHttpRequest,s={name:n+" "+e};t&&(s.description="string"==typeof t?t:JSON.stringify(t)),r&&(s.client=r),c&&(s.client_version=c),i.open("POST",a,!0),i.setRequestHeader("Content-type","application/json"),i.send(JSON.stringify(s))}function i(e,i){l<=s.error&&(console.error(n,e,i),t(e,i))}var a="https://"+(e.servicesDomain||"services.wikia.com")+"/event-logger/error",n="JWPlayer",s={info:1,warn:2,error:3,off:4},o=e.logger||{},l=o.logLevel?s[o.logLevel]:s.error,r=o.clientName,c=o.clientVersion;return{info:function(e,t){l<=s.info&&console.info(n,e,t)},warn:function(e,t){l<=s.warn&&console.warn(n,e,t)},error:i,subscribeToPlayerErrors:function(e){e.on("setupError",function(e){i("setupError",e)}),e.on("error",function(e){i("error",e)})}}}function u(e){function t(e,t){if(e){var i=a.parseFromString(t,"image/svg+xml").documentElement;i.setAttribute("class",e.getAttribute("class")),e.parentNode.replaceChild(i,e)}}function i(e){var i=e.querySelector(".jw-controlbar"),a=e.querySelector(".jw-display");[{selector:".jw-svg-icon-play",iconName:"play"},{selector:".jw-svg-icon-pause",iconName:"pause"},{selector:".jw-svg-icon-fullscreen-on",iconName:"fullScreenOn"},{selector:".jw-svg-icon-fullscreen-off",iconName:"fullScreenOff"},{selector:".jw-svg-icon-settings",iconName:"settings"},{selector:".jw-svg-icon-volume-0",iconName:"volumeOff"},{selector:".jw-svg-icon-volume-50",iconName:"volumeOn"},{selector:".jw-svg-icon-volume-100",iconName:"volumeOn"}].forEach(function(e){t(i.querySelector(e.selector),w[e.iconName])}),[{selector:".jw-svg-icon-play",iconName:"displayPlay"},{selector:".jw-svg-icon-pause",iconName:"pause"}].forEach(function(e){t(a.querySelector(e.selector),w[e.iconName])})}var a=new DOMParser;e.on("ready",function(){i(e.getContainer())})}function p(e,t,i){this.player=e,this.container=i,this.wikiaSettingsElement=document.createElement("div"),this.buttonID="wikiaSettings",this.config=t,this.documentClickHandler=this.documentClickHandler.bind(this),this.container.classList.add("wikia-jw-settings__plugin"),this.wikiaSettingsElement.classList.add("wikia-jw-settings"),this.addSettingsContent(this.wikiaSettingsElement),this.container.appendChild(this.wikiaSettingsElement),this.player.on("levels",this.onQualityLevelsChange.bind(this)),this.player.on("relatedVideoPlay",this.onCaptionsChange.bind(this)),this.player.once("ready",this.onCaptionsChange.bind(this)),document.addEventListener("click",this.documentClickHandler),document.addEventListener("touchend",this.documentClickHandler)}function h(e,t,i){this.player=e,this.container=i,this.config=t,this.muteIcon=n(w.volumeOff),this.playIcon=n(w.play),this.pauseIcon=n(w.pause),this.container.classList.add("wikia-jw-small-player-controls-plugin"),this.wikiaControlsElement=document.createElement("div"),this.wikiaControlsElement.appendChild(this.muteIcon),this.wikiaControlsElement.appendChild(this.pauseIcon),this.unmuteHandler=this.unmuteHandler.bind(this),this.playHandler=this.playHandler.bind(this),this.pauseHandler=this.pauseHandler.bind(this),this.readyHandler=this.readyHandler.bind(this),this.resizeHandler=this.resizeHandler.bind(this),this.muteIcon.addEventListener("click",this.unmuteHandler),this.pauseIcon.addEventListener("click",this.pauseHandler),this.playIcon.addEventListener("click",this.playHandler),this.player.on("resize",this.resizeHandler),this.player.on("ready",this.readyHandler)}function g(e){e.on("relatedVideoPlay",function(t){t.auto||e.setMute(!1)})}function m(e,t){function i(t){return!document.hidden&&t&&(-1===["playing","paused","complete"].indexOf(e.getState())||a)}var a=!1;document.addEventListener("visibilitychange",function(){i(t)&&(e.play(!0),a=!1)},!1),e.on("relatedVideoPlay",function(){document.hidden&&(e.pause(),a=!0)})}function y(e,t,i){function a(e){"function"==typeof i.setCustomDimension&&(i.setCustomDimension(34,e.mediaid),i.setCustomDimension(35,e.title),i.setCustomDimension(36,e.tags))}function n(e,t){var i=document.getElementById(e);i&&i.parentElement.removeChild(i);var a=document.createElement("img");a.src=t,a.id=e,document.body.appendChild(a)}function s(){if(i.comscore){n("comscoreVideoMetrixTrack","http://b.scorecardresearch.com/p?C1=1&C2=6177433&C5=04")}}function o(e){e&&n("wikiaJWPlayerCustomPixel",e)}function l(t){if(!t.label)throw new Error("No tracking label provided");var a={action:t.action||"click",category:c,label:t.label,value:Number(e.getMute()),eventName:r,videoId:e.getPlaylistItem().mediaid,player:"jwplayer",onScroll:d,trackingMethod:"analytics"};i.track(a)}var r="videoplayerevent",c=i.category||"featured-video",d=!1,u=0;"function"==typeof i.setCustomDimension&&i.setCustomDimension(37,t?"Yes":"No"),e.once("ready",function(){a(e.getPlaylistItem()),l({label:"load",action:"impression"})}),e.on("relatedVideoImpression",function(){l({label:"recommended-video",action:"impression"})}),e.on("relatedVideoPlay",function(e){a(e.item),l({label:e.auto?"recommended-video-autoplay":"recommended-video-select-"+e.position,action:"impression"}),l({label:"recommended-video-depth-"+e.depth,action:"impression"}),s(),o(e.item.pixel)}),e.on("videoResumed",function(e){"interaction"===e.playReason&&l({label:"play-resumed"})}),e.on("playerStart",function(e){l(e.auto?{label:"autoplay-start",action:"impression"}:{label:"user-start"}),s(),o(i.pixel)}),e.on("pause",function(e){"interaction"===e.pauseReason&&l({label:"paused"})}),e.on("firstUnmute",function(){l({label:"unmuted"})}),e.on("videoPercentPlayed",function(e){l({label:"played-percentage-"+(u=e.value),action:"view"})}),e.on("complete",function(){l({label:"completed",action:"impression"})}),e.on("onScrollStateChanged",function(e){"closed"===e.state&&l({label:"played-percentage-"+u,action:"close"}),d="active"===e.state,i.setCustomDimension(38,d?"Yes":"No")}),e.on("videoFeedbackImpression",function(){l({label:"feedback",action:"impression"})}),e.on("videoFeedbackThumbUp",function(){l({label:"feedback-thumb-up",action:"click"})}),e.on("videoFeedbackThumbDown",function(){l({label:"feedback-thumb-down",action:"click"})}),e.on("videoFeedbackClosed",function(){l({label:"feedback",action:"close"})}),e.on("autoplayToggle",function(e){l({label:"autoplay-"+(e.enabled?"enabled":"disabled")})}),e.on("captionsSelected",function(e){l({label:"language-selected-"+e.selectedLang.toLowerCase()})}),e.on("watermarkClicked",function(e){l({label:"watermark-fandom"})})}function v(e,t,i){this.player=e,this.container=i,this.config=t,this.watermarkElement=this.getWatermarkElement(),this.watermarkElement.addEventListener("click",function(){e.trigger("watermarkClicked")}),this.container.classList.add("wikia-watermark-container"),this.container.appendChild(this.watermarkElement),this.isEnabled=!!this.player.getPlaylistItem(0).watermark,this.player.on("play",this.update.bind(this)),this.player.on("pause",this.update.bind(this)),this.player.on("idle",this.update.bind(this)),this.player.on("relatedVideoPlay",this.onVideoChange.bind(this))}var f={de:{admessage:"Die Werbung endet in xx Sekunden",autoplayVideos:"Automatische Wiedergabe",back:"Zurück",captions:"Untertitel",close:"Schließen",cuetext:"Werbung",fullscreen:"Vollbild",next:"Nächstes",nextUp:"Als nächstes",nextUpInSeconds:"Als nächstes in xx Sekunden",pause:"Pause",play:"Abspielen",playback:"Wiedergabe starten",player:"Video-Player",prev:"Vorheriges",replay:"Erneut abspielen",settings:"Einstellungen",skipmessage:"Werbung überspringen in xx Sekunden",skiptext:"Überspringen",videoQuality:"Video-Qualität",volume:"Lautstärke",watch:"ansehen"},en:{admessage:"The ad will end in xx seconds",autoplayVideos:"Autoplay Videos",back:"Back",captions:"Captions",close:"Close",cuetext:"Advertisement",fullscreen:"Fullscreen",next:"Next",nextUp:"Next Up",nextUpInSeconds:"Next up in xx",pause:"Pause",play:"Play",playback:"Start playback",player:"Video Player",prev:"Previous",replay:"Replay",settings:"Settings",skipmessage:"Skip ad in xx",skiptext:"Skip",videoQuality:"Video Quality",volume:"Volume",watch:"watch"},es:{admessage:"El anuncio termina en xx segundos",autoplayVideos:"Videos autoreproducidos",back:"Atrás",captions:"Subtítulos",close:"Cerrar",cuetext:"Anuncio",fullscreen:"Pantalla completa",next:"Siguiente",nextUp:"Siguiente",nextUpInSeconds:"Siguiente en xx",pause:"Pausa",play:"Play",playback:"Iniciar la reproducción",player:"Reproductor de video",prev:"Anterior",replay:"Replay",settings:"Configuración",skipmessage:"Pasar anuncio en xx",skiptext:"Pasar",videoQuality:"Calidad de video",volume:"Volumen",watch:"mirar"},fr:{admessage:"Fin de la publicité dans xx secondes",autoplayVideos:"Lecture automatique des vidéos",back:"Retour",captions:"Sous-titres",close:"Fermer",cuetext:"Publicité",fullscreen:"Plein écran",next:"Suivante",nextUp:"À suivre",nextUpInSeconds:"À suivre dans xx",pause:"Pause",play:"Lecture",playback:"Démarrer la lecture",player:"Lecteur vidéo",prev:"Précédente",replay:"Revoir",settings:"Paramètres",skipmessage:"Ignorer la publicité dans xx",skiptext:"Ignorer",videoQuality:"Qualité vidéo",volume:"Volume",watch:"regarder"},it:{admessage:"L'annuncio terminerà in xx secondi",autoplayVideos:"Riproduzione automatica",back:"Indietro",captions:"Didascalie",close:"Chiudi",cuetext:"Pubblicità",fullscreen:"Schermo intero",next:"Successivo",nextUp:"Prossimo",nextUpInSeconds:"Prossimo in xx",pause:"Pausa",play:"Riproduci",playback:"Avvia la riproduzione",player:"Lettore video",prev:"Precedente",replay:"Replay",settings:"Impostazioni",skipmessage:"Salta annuncio in xx",skiptext:"Salta",videoQuality:"Qualità video",volume:"Volume",watch:"guarda"},ja:{admessage:"広告はxx秒後に終了します",autoplayVideos:"動画を自動再生",back:"戻る",captions:"字幕",close:"閉じる",cuetext:"広告",fullscreen:"全画面",next:"次へ",nextUp:"次の動画",nextUpInSeconds:"次の動画まであとxx秒",pause:"一時停止",play:"再生",playback:"再生をスタート",player:"動画プレーヤー",prev:"前へ",replay:"もう一回見る",settings:"設定",skipmessage:"xx秒後に広告をスキップ",skiptext:"スキップ",videoQuality:"動画の品質",volume:"音量",watch:"再生時間"},pl:{admessage:"Reklama skończy się za xx sek.",autoplayVideos:"Odtwarzaj automatycznie",back:"Wstecz",captions:"Napisy",close:"Zamknij",cuetext:"Reklama",fullscreen:"Pełny ekran",next:"Następny",nextUp:"Następny",nextUpInSeconds:"Następny za xx",pause:"Wstrzymaj",play:"Odtwarzaj",playback:"Rozpocznij odtwarzanie",player:"Odtwarzacz wideo",prev:"Poprzedni",replay:"Odtwarzaj ponownie",settings:"Ustawienia",skipmessage:"Pomiń reklamę za xx",skiptext:"Pomiń",videoQuality:"Jakość obrazu",volume:"Głośność",watch:"obejrzyj"},pt:{admessage:"O anúncio vai acabar em xx segundos",autoplayVideos:"Vídeos AutoPlay",back:"Voltar",captions:"Legendas",close:"Fechar",cuetext:"Anúncio",fullscreen:"Tela cheia",next:"Próximo",nextUp:"Próximo",nextUpInSeconds:"Próximo em xx",pause:"Pausa",play:"Tocar",playback:"Iniciar a reprodução",player:"Player de vídeo",prev:"Anterior",replay:"Repetição",settings:"Configurações",skipmessage:"Pular anúncio em xx",skiptext:"Pular",videoQuality:"Qualidade de vídeo",volume:"Volume",watch:"assistir"},ru:{admessage:"Реклама закончится через xx секунд(ы)",autoplayVideos:"Автовоспроизведение",back:"Назад",captions:"Описания",close:"Закрыть",cuetext:"Реклама",fullscreen:"Во весь экран",next:"Далее",nextUp:"Следующее",nextUpInSeconds:"Следующее видео через xx сек.",pause:"Пауза",play:"Воспроизвести",playback:"Начать",player:"Видеоплеер",prev:"Предыдущее",replay:"Повторить",settings:"Настройки",skipmessage:"Пропустить рекламу через xx",skiptext:"Пропустить",videoQuality:"Качество видео",volume:"Громкость",watch:"длительность"},zh:{admessage:"广告将在xx秒结束",autoplayVideos:"自动播放视频",back:"返回",captions:"标题",close:"关闭",cuetext:"广告",fullscreen:"全屏",next:"下一个",nextUp:"即将播放",nextUpInSeconds:"等待xx秒即将播放",pause:"暂停",play:"播放",playback:"重新播放",player:"视频播放器",prev:"上一个",replay:"重播",settings:"设置",skipmessage:"等待xx秒跳过广告",skiptext:"跳过",videoQuality:"视频质量",volume:"音量",watch:"观看"},"zh-hant":{admessage:"廣告將在xx秒後結束",autoplayVideos:"自動播放影片",back:"返回",captions:"標題",close:"關閉",cuetext:"廣告",fullscreen:"全螢幕",next:"下一個",nextUp:"即將播放",nextUpInSeconds:"等待xx秒即將播放",pause:"暫停",play:"播放",playback:"重新播放",player:"影片播放器",prev:"上一個",replay:"重新播放",settings:"設置",skipmessage:"在xx中跳過廣告",skiptext:"跳過",videoQuality:"影片品質",volume:"音量",watch:"觀看"}},w={displayPlay:'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 180 180"><defs><rect id="b" width="150" height="150" rx="75"/><filter id="a" width="130%" height="130%" x="-15%" y="-15%" filterUnits="objectBoundingBox"><feOffset in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="7.5"/><feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/></filter></defs><g fill="none" fill-rule="evenodd"><g opacity=".9" transform="rotate(90 75 90)"><use fill="#000" filter="url(#a)" xlink:href="#b"/><use fill="#FFF" xlink:href="#b"/></g><path fill="#00D6D6" fill-rule="nonzero" d="M80.87 58.006l34.32 25.523c3.052 2.27 3.722 6.632 1.496 9.745a6.91 6.91 0 0 1-1.497 1.527l-34.32 25.523c-3.054 2.27-7.33 1.586-9.56-1.527A7.07 7.07 0 0 1 70 114.69V63.643c0-3.854 3.063-6.977 6.84-6.977 1.45 0 2.86.47 4.03 1.34z"/></g></svg>',play:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M14.767 9.437L3.858 16.903a.553.553 0 0 1-.565.037.531.531 0 0 1-.293-.473V1.533c0-.199.113-.381.293-.473a.557.557 0 0 1 .565.036l10.91 7.467A.53.53 0 0 1 15 9a.53.53 0 0 1-.233.437z" fill-rule="evenodd"/></svg>',pause:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><rect width="5" height="16" rx="1" x="2" y="1"/><rect x="11" width="5" height="16" rx="1" y="1"/></g></svg>',fullScreenOn:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M3.249 7H1V2h5v2.25H3.249zm11.502 0H17V2h-5v2.25h2.751zM3.249 11H1v5h5v-2.25H3.249zm11.502 0H17v5h-5v-2.25h2.751z" fill-rule="evenodd"/></svg>',fullScreenOff:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M3.751 2H6v5H1V4.75h2.751zm10.498 0H12v5h5V4.75h-2.751zM3.751 16H6v-5H1v2.25h2.751zm10.498 0H12v-5h5v2.25h-2.751z" fill-rule="evenodd"/></svg>',settings:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M9 7.09a1.909 1.909 0 1 1 0 3.819A1.909 1.909 0 0 1 9 7.09m-4.702-.03a1.07 1.07 0 0 1-.99.667h-.672A.637.637 0 0 0 2 8.364v1.272c0 .352.285.637.636.637h.672c.436 0 .824.264.99.667l.006.013c.167.403.08.864-.229 1.172L3.6 12.6a.636.636 0 0 0 0 .9l.9.9a.636.636 0 0 0 .9 0l.475-.475a1.072 1.072 0 0 1 1.185-.223c.403.166.667.554.667.99v.672c0 .35.285.636.637.636h1.272a.637.637 0 0 0 .637-.636v-.672c0-.436.264-.824.667-.99l.013-.006a1.07 1.07 0 0 1 1.172.229l.475.475a.636.636 0 0 0 .9 0l.9-.9a.636.636 0 0 0 0-.9l-.475-.475a1.072 1.072 0 0 1-.229-1.172l.006-.013a1.07 1.07 0 0 1 .99-.667h.672A.637.637 0 0 0 16 9.636V8.364a.637.637 0 0 0-.636-.637h-.672a1.07 1.07 0 0 1-.996-.68 1.072 1.072 0 0 1 .229-1.172L14.4 5.4a.636.636 0 0 0 0-.9l-.9-.9a.636.636 0 0 0-.9 0l-.475.475c-.308.308-.77.396-1.172.229l-.013-.006a1.07 1.07 0 0 1-.667-.99v-.672A.637.637 0 0 0 9.636 2H8.364a.637.637 0 0 0-.637.636v.672a1.07 1.07 0 0 1-.68.996 1.07 1.07 0 0 1-1.172-.229L5.4 3.6a.636.636 0 0 0-.9 0l-.9.9a.636.636 0 0 0 0 .9l.475.475a1.072 1.072 0 0 1 .223 1.185" fill-rule="evenodd"/></svg>',volumeOff:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M8.45 2.17L4.664 6.28H1.036C.256 6.28 0 6.739 0 7.175v3.522c0 .436.256.985 1.036.985h3.646l3.785 4.176a1.1 1.1 0 0 0 .533.143.964.964 0 0 0 .5-.137c.33-.185.5-.526.5-.897V3.013c0-.37-.17-.713-.5-.898-.33-.186-.72-.13-1.05.054zm7.192 7.33l2.121-2.122a.807.807 0 1 0-1.142-1.141l-2.122 2.12-2.12-2.12a.808.808 0 0 0-1.142 1.141L13.358 9.5l-2.121 2.121a.807.807 0 1 0 1.142 1.142l2.12-2.12 2.122 2.12a.805.805 0 0 0 1.142 0 .807.807 0 0 0 0-1.142L15.642 9.5z" fill-rule="evenodd"/></svg>',volumeOn:'<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><path d="M8.45 2.17L4.664 6.28H1.036C.256 6.28 0 6.739 0 7.175v3.522c0 .436.256.985 1.036.985h3.646l3.785 4.176a1.1 1.1 0 0 0 .533.143.964.964 0 0 0 .5-.137c.33-.185.5-.526.5-.897V3.013c0-.37-.17-.713-.5-.898-.33-.186-.72-.13-1.05.054zm4.95 10.156a4.393 4.393 0 0 0 0-6.19.708.708 0 0 0-1.004 1 2.978 2.978 0 0 1 0 4.192.707.707 0 1 0 1.003.998z"/><path d="M17.515 9.231A6.186 6.186 0 0 0 15.7 4.84a.707.707 0 1 0-1.003.998A4.777 4.777 0 0 1 16.1 9.231a4.778 4.778 0 0 1-1.4 3.394.708.708 0 1 0 1.002.999 6.186 6.186 0 0 0 1.814-4.393z"/></g></svg>',back:'<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M6.003 10.002a.997.997 0 0 1-.707-.293L.293 4.707a.999.999 0 1 1 1.414-1.414l4.296 4.295 4.293-4.293A.999.999 0 1 1 11.71 4.71l-5 5a.997.997 0 0 1-.707.293" fill-rule="evenodd"/></svg>',quality:'<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-quality-100" viewBox="0 0 240 240"><path d="M55,200H35c-3,0-5-2-5-4c0,0,0,0,0-1v-30c0-3,2-5,4-5c0,0,0,0,1,0h20c3,0,5,2,5,4c0,0,0,0,0,1v30C60,198,58,200,55,200L55,200z M110,195v-70c0-3-2-5-4-5c0,0,0,0-1,0H85c-3,0-5,2-5,4c0,0,0,0,0,1v70c0,3,2,5,4,5c0,0,0,0,1,0h20C108,200,110,198,110,195L110,195z M160,195V85c0-3-2-5-4-5c0,0,0,0-1,0h-20c-3,0-5,2-5,4c0,0,0,0,0,1v110c0,3,2,5,4,5c0,0,0,0,1,0h20C158,200,160,198,160,195L160,195z M210,195V45c0-3-2-5-4-5c0,0,0,0-1,0h-20c-3,0-5,2-5,4c0,0,0,0,0,1v150c0,3,2,5,4,5c0,0,0,0,1,0h20C208,200,210,198,210,195L210,195z"></path></svg>',fandomLogo:'<svg width="164" height="35" viewBox="0 0 164 35" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M32.003 16.524c0 .288-.115.564-.32.768L18.3 30.712c-.226.224-.454.324-.738.324-.292 0-.55-.11-.77-.325l-.943-.886a.41.41 0 0 1-.01-.59l15.45-15.46c.262-.263.716-.078.716.29v2.46zm-17.167 10.12l-.766.685a.642.642 0 0 1-.872-.02L3.01 17.362c-.257-.25-.4-.593-.4-.95v-1.858c0-.67.816-1.007 1.298-.536l10.814 10.56c.188.187.505.57.505 1.033 0 .296-.068.715-.39 1.035zM5.73 7.395L9.236 3.93a.421.421 0 0 1 .592 0l11.736 11.603a3.158 3.158 0 0 1 0 4.5l-3.503 3.462a.423.423 0 0 1-.59 0L5.732 11.89a3.132 3.132 0 0 1-.937-2.25c0-.85.332-1.65.935-2.246zm13.89 1.982l3.662-3.62a3.232 3.232 0 0 1 2.737-.897c.722.098 1.378.47 1.893.978l3.708 3.667a.41.41 0 0 1 0 .585l-5.64 5.576a.419.419 0 0 1-.59 0l-5.77-5.704a.411.411 0 0 1 0-.585zm14.56-.687L26.014.475a.869.869 0 0 0-1.228-.002L18.307 6.94c-.5.5-1.316.5-1.82.004l-6.48-6.4A.87.87 0 0 0 8.793.542L.447 8.67C.16 8.95 0 9.33 0 9.727v7.7c0 .392.158.77.44 1.048l16.263 16.072a.87.87 0 0 0 1.22 0l16.25-16.073c.28-.278.438-.655.438-1.048V9.73c0-.39-.153-.763-.43-1.04z" fill="#ccc"/><path d="M62.852 20.51l2.58-6.716a.468.468 0 0 1 .87 0l2.58 6.717h-6.03zm5.856-12.428c-.184-.48-.65-.8-1.17-.8h-3.342c-.52 0-.986.32-1.17.8l-7.083 18.5c-.21.552.2 1.14.796 1.14h2.753c.353 0 .67-.215.796-.542l.738-1.922a.849.849 0 0 1 .795-.542h8.088a.85.85 0 0 1 .796.542l.74 1.922c.125.327.44.543.795.543h2.754a.843.843 0 0 0 .796-1.14l-7.082-18.5zm93.504-.8h-2.715a1.86 1.86 0 0 0-1.677 1.047l-5.393 11.162-5.393-11.163a1.858 1.858 0 0 0-1.677-1.047h-2.715a.889.889 0 0 0-.893.883V26.84c0 .487.4.883.892.883h2.608a.889.889 0 0 0 .893-.883v-9.686l4.945 10.072c.15.304.46.497.803.497h1.073a.893.893 0 0 0 .803-.497l4.945-10.072v9.686c0 .487.4.883.894.883h2.608a.889.889 0 0 0 .893-.883V8.166c0-.487-.4-.883-.893-.883zm-106.972 8.8h-8.63V11.49h10.918a.88.88 0 0 0 .83-.578l.888-2.464a.872.872 0 0 0-.83-1.163h-15.18c-.486 0-.88.39-.88.87v18.7c0 .48.394.87.88.87h2.492c.486 0 .88-.39.88-.87V20.29h7.743a.88.88 0 0 0 .83-.578l.89-2.464a.872.872 0 0 0-.83-1.163zm51.76 7.61h-3.615V11.315H107c3.828 0 6.41 2.517 6.41 6.188 0 3.672-2.582 6.19-6.41 6.19zm-.124-16.41h-7.128c-.486 0-.88.39-.88.872v18.698c0 .48.394.87.88.87h7.128c6.453 0 10.912-4.44 10.912-10.16v-.117c0-5.72-4.46-10.162-10.912-10.162zm-11.947.03h-2.642a.87.87 0 0 0-.876.866v12.36l-8.755-12.72a1.242 1.242 0 0 0-1.023-.535H78.32a.873.873 0 0 0-.876.867v18.706c0 .48.393.867.877.867h2.64a.872.872 0 0 0 .878-.867V14.71l8.608 12.478c.23.334.613.535 1.022.535h3.46a.872.872 0 0 0 .877-.867V8.178a.87.87 0 0 0-.876-.867zm40.71 10.3c0 3.323-2.712 6.016-6.056 6.016-3.345 0-6.056-2.693-6.056-6.015v-.22c0-3.322 2.71-6.015 6.056-6.015 3.344 0 6.055 2.693 6.055 6.015v.22zm-6.056-10.44c-5.694 0-10.31 4.576-10.31 10.22v.22c0 5.646 4.616 10.22 10.31 10.22 5.693 0 10.308-4.574 10.308-10.22v-.22c0-5.644-4.615-10.22-10.308-10.22z" fill="#ccc"/></g></svg>'};window.wikiaJWPlayerIdleScreen=c;var k=[];window.wikiaJWPlayer=function(e,t,i){function a(e,i){var a=document.createElement("script"),n=document.getElementById(e);a.onload=function(){p.register(),t.showSmallPlayerControls&&h.register(),k.forEach(function(e){e()})},a.async=!0,a.src=i||"https://content.jwplatform.com/libraries/VXc5h4Tf.js",n.parentNode.insertBefore(a,n.nextSibling)}function n(e,t,i,a,n){var s=jwplayer(e),o=t.videoDetails.playlist[0].mediaid,l=t.autoplay,r=a.substr(0,2),c={advertising:{autoplayadsmuted:l,client:"googima",vpaidcontrols:!0,admessage:n.admessage,cuetext:n.cuetext,skipmessage:n.skipmessage,skiptext:n.skiptext,setLocale:r},autostart:l&&!document.hidden,description:t.videoDetails.description,image:"//content.jwplatform.com/thumbs/"+o+"-640.jpg",mute:t.mute,playlist:t.videoDetails.playlist,title:t.videoDetails.title,localization:n,repeat:t.repeat};return c.plugins={},t.settings&&(c.plugins.wikiaSettings={showAutoplayToggle:t.settings.showAutoplayToggle,showQuality:t.settings.showQuality,showCaptions:t.settings.showCaptions,autoplay:t.autoplay,selectedCaptionsLanguage:t.selectedCaptionsLanguage,i18n:n}),t.related&&(c.related={autoplaytimer:t.related.time||3,file:"//cdn.jwplayer.com/v2/playlists/"+t.related.playlistId+"?related_media_id="+o,oncomplete:t.related.autoplay?"autoplay":"show",autoplaymessage:n.nextUpInSeconds}),!1!==t.watermark&&(c.plugins.wikiaWatermark={}),t.showSmallPlayerControls&&(c.plugins.smallPlayerControls={}),i.info("setupPlayer"),s.setup(c),i.info("after setup"),i.subscribeToPlayerErrors(s),s}!function(e,t,i){"undefined"!=typeof jwplayer?i():(k.push(i),1===k.length&&a(e,t))}(e,t.playerURL,function(){var a=d(t),s=t.lang||"en",o=f[s]||f.en,p=n(e,t,a,s,o);c(p,o),u(p),r(p,t.autoplay,a),t.related&&g(p),t.tracking&&(t.tracking.pixel=t.videoDetails.playlist[0].pixel,y(p,t.autoplay,t.tracking)),m(p,t.autoplay),l(p),!1!==t.watermark&&v.register(),i&&i(p)})};var x=new DOMParser;p.prototype.isSettingsMenuOrSettingsButton=function(e){var t=this.getSettingsButtonElement();return t&&(t===e||t.contains(e)||this.wikiaSettingsElement===e||this.wikiaSettingsElement.contains(e))},p.prototype.getSettingsButtonElement=function(){return this.player.getContainer().querySelector("[button="+this.buttonID+"]")},p.prototype.documentClickHandler=function(e){!this.isSettingsMenuOrSettingsButton(e.target)&&this.container.style.display&&this.close()},p.prototype.addButton=function(){var e=n(w.settings);e.classList.add("jw-svg-icon"),e.classList.add("jw-svg-icon-wikia-settings"),this.player.addButton(e.outerHTML,this.config.i18n.settings,function(){this.wikiaSettingsElement.style.display?this.close():this.open()}.bind(this),this.buttonID,"wikia-jw-settings-button")},p.prototype.removeButton=function(){this.player.removeButton(this.buttonID)},p.prototype.close=function(){this.showSettingsList(),this.container.style.display=null,this.player.getContainer().classList.remove("wikia-jw-settings-open")},p.prototype.open=function(){s(this.container),this.player.getContainer().classList.add("wikia-jw-settings-open")},p.prototype.hide=function(){this.close(),this.removeButton()},p.prototype.show=function(){this.getSettingsButtonElement()||this.addButton()},p.prototype.showSettingsList=function(){s(this.settingsList),o(this.qualityLevelsList),o(this.captionsList)},p.prototype.addSettingsContent=function(e){return e.classList.add("wikia-jw-settings"),e.classList.remove("jw-reset"),e.classList.remove("jw-plugin"),this.settingsList=this.createSettingsListElement(),e.appendChild(this.settingsList),this.config.showQuality&&(this.createQualityLevelsList(),e.appendChild(this.qualityLevelsList)),this.config.showCaptions&&(this.createCaptionsList(),e.appendChild(this.captionsList)),e},p.prototype.createSettingsListElement=function(){var e=document.createElement("ul");return e.className="wikia-jw-settings__list wds-list",this.config.showQuality&&e.appendChild(this.createQualityButton()),this.config.showCaptions&&e.appendChild(this.createCaptionsButton()),this.config.showAutoplayToggle&&(e.appendChild(this.createAutoplayToggle()),this.show()),e},p.prototype.createSubmenuWrapper=function(){var e=document.createElement("li"),t=document.createElement("ul");return e.className="wikia-jw-settings__back",e.innerHTML=i("left").outerHTML+" "+this.config.i18n.back,e.addEventListener("click",this.showSettingsList.bind(this)),t.className="wikia-jw-settings__submenu wds-list",t.appendChild(e),t},p.prototype.createAutoplayToggle=function(){var e=t({id:this.player.getContainer().id+"-videoAutoplayToggle",label:this.config.i18n.autoplayVideos,checked:this.config.autoplay});return e.querySelector("label").addEventListener("click",function(e){this.player.trigger("autoplayToggle",{enabled:!e.target.previousSibling.checked})}.bind(this)),e},p.prototype.createQualityButton=function(){var e=document.createElement("li");return e.className="wikia-jw-settings__quality-button",e.innerHTML=this.config.i18n.videoQuality+i("right").outerHTML,e.addEventListener("click",function(){o(this.settingsList),s(this.qualityLevelsList)}.bind(this)),e},p.prototype.createQualityLevelsList=function(){this.qualityLevelsList=this.createSubmenuWrapper(),this.player.on("levelsChanged",this.updateCurrentQuality.bind(this))},p.prototype.onQualityLevelsChange=function(e){var t=!e.levels.length||1===e.levels.length&&"0"===e.levels[0].label,i=!t&&this.config.showQuality||this.config.showAutoplayToggle;t?this.wikiaSettingsElement.classList.add("is-quality-list-empty"):this.wikiaSettingsElement.classList.remove("is-quality-list-empty"),i&&this.show(),this.qualityLevelsList&&this.updateQualityLevelsList(e.levels)},p.prototype.updateQualityLevelsList=function(e){a(this.qualityLevelsList),e.forEach(function(e,t){var i=document.createElement("li");i.addEventListener("click",function(){this.player.setCurrentQuality(t),this.close()}.bind(this)),this.player.getCurrentQuality()===t&&i.classList.add("is-active"),i.appendChild(document.createTextNode(e.label)),this.qualityLevelsList.insertBefore(i,this.qualityLevelsList.lastElementChild)},this)},p.prototype.updateCurrentQuality=function(e){for(var t=0;t<this.qualityLevelsList.childNodes.length;t++){var i=this.qualityLevelsList.childNodes[t];e.currentQuality===t?i.classList.add("is-active"):i.classList.remove("is-active")}},p.prototype.onCaptionsChange=function(){var e=this.player.getCaptionsList(),t=this.getSuitableCaptionsIndex(this.config.selectedCaptionsLanguage||this.captionLangMap[this.getUserLang()],e);a(this.captionsList),this.captionsList&&e.length>1?(e.forEach(this.createCaptionsListItem,this),this.wikiaSettingsElement.classList.remove("are-captions-empty"),this.show(),!1!==this.config.selectedCaptionsLanguage&&-1!==t?this.player.setCurrentCaptions(t):this.player.setCurrentCaptions(0)):this.wikiaSettingsElement.classList.add("are-captions-empty")},p.prototype.createCaptionsList=function(){this.captionsList=this.createSubmenuWrapper(),this.player.on("captionsChanged",this.updateCurrentCaptions.bind(this))},p.prototype.createCaptionsListItem=function(e,t){var i=document.createElement("li"),a="Off"===e.label?"No captions":e.label;i.dataset.track=t,i.addEventListener("click",function(){this.player.setCurrentCaptions(t),this.close(),this.player.trigger("captionsSelected",{selectedLang:e.label})}.bind(this)),i.appendChild(document.createTextNode(a)),this.captionsList.insertBefore(i,this.captionsList.firstElementChild)},p.prototype.createCaptionsButton=function(){var e=document.createElement("li");return e.className="wikia-jw-settings__captions-button",e.innerHTML=this.config.i18n.captions+i("right").outerHTML,e.addEventListener("click",function(){o(this.settingsList),s(this.captionsList)}.bind(this)),e},p.prototype.getUserLang=function(){return(window.navigator.userLanguage||window.navigator.language).slice(0,2)},p.prototype.getSuitableCaptionsIndex=function(e,t){return t.map(function(e){return e.label}).indexOf(e)},p.prototype.updateCurrentCaptions=function(e){for(var t=0;t<this.captionsList.childNodes.length;t++)this.captionsList.childNodes[t].classList.remove("is-active");this.captionsList.querySelector('[data-track="'+e.track+'"]').classList.add("is-active")},p.prototype.captionLangMap={en:"English",pl:"Polish",fr:"French",de:"German",it:"Italian",ja:"Japanese",pt:"Portuguese",ru:"Russian",es:"Spanish",zh:"Chinese"},p.register=function(){jwplayer().registerPlugin("wikiaSettings","8.0.0",p)},h.prototype.readyHandler=function(){this.player.getWidth()<=250&&(this.player.getContainer().classList.add("wikia-jw-small-player-controls"),this.container.appendChild(this.wikiaControlsElement))},h.prototype.unmuteHandler=function(){this.player.setMute(!1)},h.prototype.pauseHandler=function(){var e=this.container.firstChild.childNodes[1];e.parentNode.replaceChild(this.playIcon,e),this.player.pause()},h.prototype.playHandler=function(){var e=this.container.firstChild.childNodes[1];e.parentNode.replaceChild(this.pauseIcon,e),this.player.play()},h.prototype.resizeHandler=function(e){e.width>250&&this.player.getContainer().classList.remove("wikia-jw-small-player-controls")},h.register=function(){jwplayer().registerPlugin("smallPlayerControls","8.0.0",h)},v.prototype.getWatermarkElement=function(){var e=w.fandomLogo,t=document.createElement("a");return t.classList.add("wikia-watermark"),t.innerHTML=e,t.href="https://fandom.com",t},v.prototype.update=function(){this.isEnabled&&"playing"===this.player.getState()?this.container.style.display="block":this.container.style.display=""},v.prototype.onVideoChange=function(e){this.isEnabled=!!e.item.watermark,this.update()},v.register=function(){jwplayer().registerPlugin("wikiaWatermark","8.0.0",v)}}("undefined"==typeof wikiaJWPlayer?wikiaJWPlayer={}:wikiaJWPlayer);