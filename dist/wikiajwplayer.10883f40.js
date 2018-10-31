// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"wikiajwplayer.js":[function(require,module,exports) {
(function (exports) {
  function createToggle(params) {
    var toggleWrapper = document.createElement("li"),
        toggleInput = document.createElement("input"),
        toggleLabel = document.createElement("label");
    toggleWrapper.className = "wikia-jw-settings__toggle";
    toggleInput.className = "wds-toggle__input";
    toggleInput.id = params.id;
    toggleInput.type = "checkbox";
    toggleInput.checked = params.checked;
    toggleLabel.className = "wds-toggle__label";
    toggleLabel.setAttribute("for", params.id);
    toggleLabel.appendChild(document.createTextNode(params.label));
    toggleWrapper.appendChild(toggleInput);
    toggleWrapper.appendChild(toggleLabel);
    return toggleWrapper;
  }

  function createArrowIcon(direction) {
    var arrowIcon = createSVG(wikiaJWPlayerIcons.back);

    if (direction === "left") {
      arrowIcon.classList.add("wikia-jw-settings__back-icon");
    } else {
      arrowIcon.classList.add("wikia-jw-settings__right-arrow-icon");
    }

    return arrowIcon;
  }

  function clearListElement(element) {
    if (element) {
      while (element.childElementCount > 1) {
        element.removeChild(element.firstChild);
      }
    }
  }

  function createSVG(svgHtml) {
    return domParser.parseFromString(svgHtml, "image/svg+xml").documentElement;
  }

  function showElement(element) {
    if (element) {
      element.style.display = "block";
    }
  }

  function hideElement(element) {
    if (element) {
      element.style.display = "none";
    }
  }

  function wikiaJWPlayerAllowControllOnTouchDevices(playerInstance) {
    playerInstance.on("playerStart", function () {
      var unmuteIcon = document.querySelector(".jw-autostart-mute");

      if (unmuteIcon) {
        playerInstance.getContainer().classList.remove("jw-flag-autostart");
        unmuteIcon.style.display = "none";
      }
    });
  }

  function wikiaJWPlayerEvents(playerInstance, willAutoplay, logger) {
    var state = getNewState(),
        wasAlreadyUnmuted = false,
        depth = 0,
        prefixes = {
      ad: "ad",
      video: "video"
    },
        isPlayerPaused = false;

    function getDefaultState() {
      return {
        wasFirstQuartileTriggered: false,
        wasMidPointTriggered: false,
        wasThirdQuartileTriggered: false,
        progress: {
          durationWatched: 0,
          percentWatched: 0
        }
      };
    }

    function getNewState() {
      return {
        ad: getDefaultState(),
        video: getDefaultState()
      };
    }

    function handleTime(prefix, data) {
      var positionFloor = Math.floor(data.position),
          percentPlayed = Math.floor(positionFloor * 100 / data.duration),
          playlistItem = playerInstance.getPlaylistItem();

      if (percentPlayed > 100 && playlistItem) {
        data.mediaId = playlistItem.mediaid;
        logger.error("played-percentage", data);
      }

      if (positionFloor > state[prefix].progress.durationWatched && positionFloor % 5 === 0) {
        playerInstance.trigger(prefix + "SecondsPlayed", {
          value: positionFloor
        });
        state[prefix].progress.durationWatched = positionFloor;
      }

      if (percentPlayed >= 25 && !state[prefix].wasFirstQuartileTriggered) {
        playerInstance.trigger(prefix + "FirstQuartile");
        state[prefix].wasFirstQuartileTriggered = true;
      }

      if (percentPlayed >= 50 && !state[prefix].wasMidPointTriggered) {
        playerInstance.trigger(prefix + "MidPoint");
        state[prefix].wasMidPointTriggered = true;
      }

      if (percentPlayed >= 75 && !state[prefix].wasThirdQuartileTriggered) {
        playerInstance.trigger(prefix + "ThirdQuartile");
        state[prefix].wasThirdQuartileTriggered = true;
      }

      if (percentPlayed > state[prefix].progress.percentWatched && percentPlayed % 10 === 0) {
        playerInstance.trigger(prefix + "PercentPlayed", {
          value: percentPlayed
        });
        state[prefix].progress.percentWatched = percentPlayed;
      }
    }

    logger.info("before ready");
    playerInstance.once("ready", function () {
      logger.info("player ready");
      var relatedPlugin = playerInstance.getPlugin("related");
      relatedPlugin.on("open", function () {
        logger.info("related plugin open");
        playerInstance.trigger("relatedVideoImpression");
        state[prefixes.video] = getDefaultState();
      });
      relatedPlugin.on("play", function (data) {
        logger.info("related plugin play");
        depth++;
        playerInstance.trigger("relatedVideoPlay", {
          auto: data.auto,
          item: data.item,
          position: data.position,
          depth: depth
        });
      });
    });
    playerInstance.on("play", function (data) {
      if (isPlayerPaused) {
        playerInstance.trigger("videoResumed", data);
        logger.info("videoResumed triggered");
      }

      isPlayerPaused = false;
    });
    playerInstance.on("pause", function () {
      isPlayerPaused = true;
    });
    playerInstance.on("firstFrame", function () {
      if (depth === 0) {
        playerInstance.trigger("playerStart", {
          auto: willAutoplay
        });
        logger.info("playerStart triggered");
      }

      playerInstance.trigger("videoStart");
      logger.info("videoStart triggered");
    });
    playerInstance.on("mute", function () {
      if (!playerInstance.getMute() && !wasAlreadyUnmuted) {
        playerInstance.trigger("firstUnmute");
        wasAlreadyUnmuted = true;
      }
    });
    playerInstance.on("time", function (data) {
      handleTime(prefixes.video, data);
    });
    playerInstance.on("adTime", function (data) {
      handleTime(prefixes.ad, data);
    });
    playerInstance.on("adRequest", function () {
      state[prefixes.ad] = getDefaultState();
    });
  }

  var wikiaJWPlayeri18n = {
    de: {
      admessage: "Die Werbung endet in xx Sekunden",
      autoplayVideos: "Automatische Wiedergabe",
      back: "Zurück",
      captions: "Untertitel",
      close: "Schließen",
      cuetext: "Werbung",
      fullscreen: "Vollbild",
      next: "Nächstes",
      nextUp: "Als nächstes",
      nextUpInSeconds: "Als nächstes in xx Sekunden",
      pause: "Pause",
      play: "Abspielen",
      playback: "Wiedergabe starten",
      player: "Video-Player",
      prev: "Vorheriges",
      replay: "Erneut abspielen",
      settings: "Einstellungen",
      skipmessage: "Werbung überspringen in xx Sekunden",
      skiptext: "Überspringen",
      videoQuality: "Video-Qualität",
      volume: "Lautstärke",
      watch: "ansehen"
    },
    en: {
      admessage: "The ad will end in xx seconds",
      autoplayVideos: "Autoplay Videos",
      back: "Back",
      captions: "Captions",
      close: "Close",
      cuetext: "Advertisement",
      fullscreen: "Fullscreen",
      next: "Next",
      nextUp: "Next Up",
      nextUpInSeconds: "Next up in xx",
      pause: "Pause",
      play: "Play",
      playback: "Start playback",
      player: "Video Player",
      prev: "Previous",
      replay: "Replay",
      settings: "Settings",
      skipmessage: "Skip ad in xx",
      sharing: "Sharing",
      skiptext: "Skip",
      videoQuality: "Video Quality",
      volume: "Volume",
      watch: "watch"
    },
    es: {
      admessage: "El anuncio termina en xx segundos",
      autoplayVideos: "Videos autoreproducidos",
      back: "Atrás",
      captions: "Subtítulos",
      close: "Cerrar",
      cuetext: "Anuncio",
      fullscreen: "Pantalla completa",
      next: "Siguiente",
      nextUp: "Siguiente",
      nextUpInSeconds: "Siguiente en xx",
      pause: "Pausa",
      play: "Play",
      playback: "Iniciar la reproducción",
      player: "Reproductor de video",
      prev: "Anterior",
      replay: "Replay",
      settings: "Configuración",
      sharing: "Sharing",
      skipmessage: "Pasar anuncio en xx",
      skiptext: "Pasar",
      videoQuality: "Calidad de video",
      volume: "Volumen",
      watch: "mirar"
    },
    fr: {
      admessage: "Fin de la publicité dans xx secondes",
      autoplayVideos: "Lecture automatique des vidéos",
      back: "Retour",
      captions: "Sous-titres",
      close: "Fermer",
      cuetext: "Publicité",
      fullscreen: "Plein écran",
      next: "Suivante",
      nextUp: "À suivre",
      nextUpInSeconds: "À suivre dans xx",
      pause: "Pause",
      play: "Lecture",
      playback: "Démarrer la lecture",
      player: "Lecteur vidéo",
      prev: "Précédente",
      replay: "Revoir",
      settings: "Paramètres",
      sharing: "Sharing",
      skipmessage: "Ignorer la publicité dans xx",
      skiptext: "Ignorer",
      videoQuality: "Qualité vidéo",
      volume: "Volume",
      watch: "regarder"
    },
    it: {
      admessage: "L'annuncio terminerà in xx secondi",
      autoplayVideos: "Riproduzione automatica",
      back: "Indietro",
      captions: "Didascalie",
      close: "Chiudi",
      cuetext: "Pubblicità",
      fullscreen: "Schermo intero",
      next: "Successivo",
      nextUp: "Prossimo",
      nextUpInSeconds: "Prossimo in xx",
      pause: "Pausa",
      play: "Riproduci",
      playback: "Avvia la riproduzione",
      player: "Lettore video",
      prev: "Precedente",
      replay: "Replay",
      settings: "Impostazioni",
      sharing: "Sharing",
      skipmessage: "Salta annuncio in xx",
      skiptext: "Salta",
      videoQuality: "Qualità video",
      volume: "Volume",
      watch: "guarda"
    },
    ja: {
      admessage: "広告はxx秒後に終了します",
      autoplayVideos: "動画を自動再生",
      back: "戻る",
      captions: "字幕",
      close: "閉じる",
      cuetext: "広告",
      fullscreen: "全画面",
      next: "次へ",
      nextUp: "次の動画",
      nextUpInSeconds: "次の動画まであとxx秒",
      pause: "一時停止",
      play: "再生",
      playback: "再生をスタート",
      player: "動画プレーヤー",
      prev: "前へ",
      replay: "もう一回見る",
      settings: "設定",
      sharing: "Sharing",
      skipmessage: "xx秒後に広告をスキップ",
      skiptext: "スキップ",
      videoQuality: "動画の品質",
      volume: "音量",
      watch: "再生時間"
    },
    pl: {
      admessage: "Reklama skończy się za xx sek.",
      autoplayVideos: "Odtwarzaj automatycznie",
      back: "Wstecz",
      captions: "Napisy",
      close: "Zamknij",
      cuetext: "Reklama",
      fullscreen: "Pełny ekran",
      next: "Następny",
      nextUp: "Następny",
      nextUpInSeconds: "Następny za xx",
      pause: "Wstrzymaj",
      play: "Odtwarzaj",
      playback: "Rozpocznij odtwarzanie",
      player: "Odtwarzacz wideo",
      prev: "Poprzedni",
      replay: "Odtwarzaj ponownie",
      settings: "Ustawienia",
      sharing: "Sharing",
      skipmessage: "Pomiń reklamę za xx",
      skiptext: "Pomiń",
      videoQuality: "Jakość obrazu",
      volume: "Głośność",
      watch: "obejrzyj"
    },
    pt: {
      admessage: "O anúncio vai acabar em xx segundos",
      autoplayVideos: "Vídeos AutoPlay",
      back: "Voltar",
      captions: "Legendas",
      close: "Fechar",
      cuetext: "Anúncio",
      fullscreen: "Tela cheia",
      next: "Próximo",
      nextUp: "Próximo",
      nextUpInSeconds: "Próximo em xx",
      pause: "Pausa",
      play: "Tocar",
      playback: "Iniciar a reprodução",
      player: "Player de vídeo",
      prev: "Anterior",
      replay: "Repetição",
      settings: "Configurações",
      sharing: "Sharing",
      skipmessage: "Pular anúncio em xx",
      skiptext: "Pular",
      videoQuality: "Qualidade de vídeo",
      volume: "Volume",
      watch: "assistir"
    },
    ru: {
      admessage: "Реклама закончится через xx секунд(ы)",
      autoplayVideos: "Автовоспроизведение",
      back: "Назад",
      captions: "Описания",
      close: "Закрыть",
      cuetext: "Реклама",
      fullscreen: "Во весь экран",
      next: "Далее",
      nextUp: "Следующее",
      nextUpInSeconds: "Следующее видео через xx сек.",
      pause: "Пауза",
      play: "Воспроизвести",
      playback: "Начать",
      player: "Видеоплеер",
      prev: "Предыдущее",
      replay: "Повторить",
      settings: "Настройки",
      sharing: "Sharing",
      skipmessage: "Пропустить рекламу через xx",
      skiptext: "Пропустить",
      videoQuality: "Качество видео",
      volume: "Громкость",
      watch: "длительность"
    },
    zh: {
      admessage: "广告将在xx秒结束",
      autoplayVideos: "自动播放视频",
      back: "返回",
      captions: "标题",
      close: "关闭",
      cuetext: "广告",
      fullscreen: "全屏",
      next: "下一个",
      nextUp: "即将播放",
      nextUpInSeconds: "等待xx秒即将播放",
      pause: "暂停",
      play: "播放",
      playback: "重新播放",
      player: "视频播放器",
      prev: "上一个",
      replay: "重播",
      settings: "设置",
      sharing: "Sharing",
      skipmessage: "等待xx秒跳过广告",
      skiptext: "跳过",
      videoQuality: "视频质量",
      volume: "音量",
      watch: "观看"
    },
    "zh-hant": {
      admessage: "廣告將在xx秒後結束",
      autoplayVideos: "自動播放影片",
      back: "返回",
      captions: "標題",
      close: "關閉",
      cuetext: "廣告",
      fullscreen: "全螢幕",
      next: "下一個",
      nextUp: "即將播放",
      nextUpInSeconds: "等待xx秒即將播放",
      pause: "暫停",
      play: "播放",
      playback: "重新播放",
      player: "影片播放器",
      prev: "上一個",
      replay: "重新播放",
      settings: "設置",
      sharing: "Sharing",
      skipmessage: "在xx中跳過廣告",
      skiptext: "跳過",
      videoQuality: "影片品質",
      volume: "音量",
      watch: "觀看"
    }
  };
  var wikiaJWPlayerIcons = {
    displayPlay: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 180 180"><defs><rect id="b" width="150" height="150" rx="75"/><filter id="a" width="130%" height="130%" x="-15%" y="-15%" filterUnits="objectBoundingBox"><feOffset in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="7.5"/><feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/></filter></defs><g fill="none" fill-rule="evenodd"><g opacity=".9" transform="rotate(90 75 90)"><use fill="#000" filter="url(#a)" xlink:href="#b"/><use fill="#FFF" xlink:href="#b"/></g><path fill="#00D6D6" fill-rule="nonzero" d="M80.87 58.006l34.32 25.523c3.052 2.27 3.722 6.632 1.496 9.745a6.91 6.91 0 0 1-1.497 1.527l-34.32 25.523c-3.054 2.27-7.33 1.586-9.56-1.527A7.07 7.07 0 0 1 70 114.69V63.643c0-3.854 3.063-6.977 6.84-6.977 1.45 0 2.86.47 4.03 1.34z"/></g></svg>',
    play: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M14.767 9.437L3.858 16.903a.553.553 0 0 1-.565.037.531.531 0 0 1-.293-.473V1.533c0-.199.113-.381.293-.473a.557.557 0 0 1 .565.036l10.91 7.467A.53.53 0 0 1 15 9a.53.53 0 0 1-.233.437z" fill-rule="evenodd"/></svg>',
    pause: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><rect width="5" height="16" rx="1" x="2" y="1"/><rect x="11" width="5" height="16" rx="1" y="1"/></g></svg>',
    fullScreenOn: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M3.249 7H1V2h5v2.25H3.249zm11.502 0H17V2h-5v2.25h2.751zM3.249 11H1v5h5v-2.25H3.249zm11.502 0H17v5h-5v-2.25h2.751z" fill-rule="evenodd"/></svg>',
    fullScreenOff: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M3.751 2H6v5H1V4.75h2.751zm10.498 0H12v5h5V4.75h-2.751zM3.751 16H6v-5H1v2.25h2.751zm10.498 0H12v-5h5v2.25h-2.751z" fill-rule="evenodd"/></svg>',
    settings: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M9 7.09a1.909 1.909 0 1 1 0 3.819A1.909 1.909 0 0 1 9 7.09m-4.702-.03a1.07 1.07 0 0 1-.99.667h-.672A.637.637 0 0 0 2 8.364v1.272c0 .352.285.637.636.637h.672c.436 0 .824.264.99.667l.006.013c.167.403.08.864-.229 1.172L3.6 12.6a.636.636 0 0 0 0 .9l.9.9a.636.636 0 0 0 .9 0l.475-.475a1.072 1.072 0 0 1 1.185-.223c.403.166.667.554.667.99v.672c0 .35.285.636.637.636h1.272a.637.637 0 0 0 .637-.636v-.672c0-.436.264-.824.667-.99l.013-.006a1.07 1.07 0 0 1 1.172.229l.475.475a.636.636 0 0 0 .9 0l.9-.9a.636.636 0 0 0 0-.9l-.475-.475a1.072 1.072 0 0 1-.229-1.172l.006-.013a1.07 1.07 0 0 1 .99-.667h.672A.637.637 0 0 0 16 9.636V8.364a.637.637 0 0 0-.636-.637h-.672a1.07 1.07 0 0 1-.996-.68 1.072 1.072 0 0 1 .229-1.172L14.4 5.4a.636.636 0 0 0 0-.9l-.9-.9a.636.636 0 0 0-.9 0l-.475.475c-.308.308-.77.396-1.172.229l-.013-.006a1.07 1.07 0 0 1-.667-.99v-.672A.637.637 0 0 0 9.636 2H8.364a.637.637 0 0 0-.637.636v.672a1.07 1.07 0 0 1-.68.996 1.07 1.07 0 0 1-1.172-.229L5.4 3.6a.636.636 0 0 0-.9 0l-.9.9a.636.636 0 0 0 0 .9l.475.475a1.072 1.072 0 0 1 .223 1.185" fill-rule="evenodd"/></svg>',
    volumeOff: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><path d="M8.45 2.17L4.664 6.28H1.036C.256 6.28 0 6.739 0 7.175v3.522c0 .436.256.985 1.036.985h3.646l3.785 4.176a1.1 1.1 0 0 0 .533.143.964.964 0 0 0 .5-.137c.33-.185.5-.526.5-.897V3.013c0-.37-.17-.713-.5-.898-.33-.186-.72-.13-1.05.054zm7.192 7.33l2.121-2.122a.807.807 0 1 0-1.142-1.141l-2.122 2.12-2.12-2.12a.808.808 0 0 0-1.142 1.141L13.358 9.5l-2.121 2.121a.807.807 0 1 0 1.142 1.142l2.12-2.12 2.122 2.12a.805.805 0 0 0 1.142 0 .807.807 0 0 0 0-1.142L15.642 9.5z" fill-rule="evenodd"/></svg>',
    volumeOn: '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><path d="M8.45 2.17L4.664 6.28H1.036C.256 6.28 0 6.739 0 7.175v3.522c0 .436.256.985 1.036.985h3.646l3.785 4.176a1.1 1.1 0 0 0 .533.143.964.964 0 0 0 .5-.137c.33-.185.5-.526.5-.897V3.013c0-.37-.17-.713-.5-.898-.33-.186-.72-.13-1.05.054zm4.95 10.156a4.393 4.393 0 0 0 0-6.19.708.708 0 0 0-1.004 1 2.978 2.978 0 0 1 0 4.192.707.707 0 1 0 1.003.998z"/><path d="M17.515 9.231A6.186 6.186 0 0 0 15.7 4.84a.707.707 0 1 0-1.003.998A4.777 4.777 0 0 1 16.1 9.231a4.778 4.778 0 0 1-1.4 3.394.708.708 0 1 0 1.002.999 6.186 6.186 0 0 0 1.814-4.393z"/></g></svg>',
    back: '<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M6.003 10.002a.997.997 0 0 1-.707-.293L.293 4.707a.999.999 0 1 1 1.414-1.414l4.296 4.295 4.293-4.293A.999.999 0 1 1 11.71 4.71l-5 5a.997.997 0 0 1-.707.293" fill-rule="evenodd"/></svg>',
    quality: '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-quality-100" viewBox="0 0 240 240"><path d="M55,200H35c-3,0-5-2-5-4c0,0,0,0,0-1v-30c0-3,2-5,4-5c0,0,0,0,1,0h20c3,0,5,2,5,4c0,0,0,0,0,1v30C60,198,58,200,55,200L55,200z M110,195v-70c0-3-2-5-4-5c0,0,0,0-1,0H85c-3,0-5,2-5,4c0,0,0,0,0,1v70c0,3,2,5,4,5c0,0,0,0,1,0h20C108,200,110,198,110,195L110,195z M160,195V85c0-3-2-5-4-5c0,0,0,0-1,0h-20c-3,0-5,2-5,4c0,0,0,0,0,1v110c0,3,2,5,4,5c0,0,0,0,1,0h20C158,200,160,198,160,195L160,195z M210,195V45c0-3-2-5-4-5c0,0,0,0-1,0h-20c-3,0-5,2-5,4c0,0,0,0,0,1v150c0,3,2,5,4,5c0,0,0,0,1,0h20C208,200,210,198,210,195L210,195z"></path></svg>',
    fandomLogo: '<svg width="164" height="35" viewBox="0 0 164 35" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M32.003 16.524c0 .288-.115.564-.32.768L18.3 30.712c-.226.224-.454.324-.738.324-.292 0-.55-.11-.77-.325l-.943-.886a.41.41 0 0 1-.01-.59l15.45-15.46c.262-.263.716-.078.716.29v2.46zm-17.167 10.12l-.766.685a.642.642 0 0 1-.872-.02L3.01 17.362c-.257-.25-.4-.593-.4-.95v-1.858c0-.67.816-1.007 1.298-.536l10.814 10.56c.188.187.505.57.505 1.033 0 .296-.068.715-.39 1.035zM5.73 7.395L9.236 3.93a.421.421 0 0 1 .592 0l11.736 11.603a3.158 3.158 0 0 1 0 4.5l-3.503 3.462a.423.423 0 0 1-.59 0L5.732 11.89a3.132 3.132 0 0 1-.937-2.25c0-.85.332-1.65.935-2.246zm13.89 1.982l3.662-3.62a3.232 3.232 0 0 1 2.737-.897c.722.098 1.378.47 1.893.978l3.708 3.667a.41.41 0 0 1 0 .585l-5.64 5.576a.419.419 0 0 1-.59 0l-5.77-5.704a.411.411 0 0 1 0-.585zm14.56-.687L26.014.475a.869.869 0 0 0-1.228-.002L18.307 6.94c-.5.5-1.316.5-1.82.004l-6.48-6.4A.87.87 0 0 0 8.793.542L.447 8.67C.16 8.95 0 9.33 0 9.727v7.7c0 .392.158.77.44 1.048l16.263 16.072a.87.87 0 0 0 1.22 0l16.25-16.073c.28-.278.438-.655.438-1.048V9.73c0-.39-.153-.763-.43-1.04z" fill="#ccc"/><path d="M62.852 20.51l2.58-6.716a.468.468 0 0 1 .87 0l2.58 6.717h-6.03zm5.856-12.428c-.184-.48-.65-.8-1.17-.8h-3.342c-.52 0-.986.32-1.17.8l-7.083 18.5c-.21.552.2 1.14.796 1.14h2.753c.353 0 .67-.215.796-.542l.738-1.922a.849.849 0 0 1 .795-.542h8.088a.85.85 0 0 1 .796.542l.74 1.922c.125.327.44.543.795.543h2.754a.843.843 0 0 0 .796-1.14l-7.082-18.5zm93.504-.8h-2.715a1.86 1.86 0 0 0-1.677 1.047l-5.393 11.162-5.393-11.163a1.858 1.858 0 0 0-1.677-1.047h-2.715a.889.889 0 0 0-.893.883V26.84c0 .487.4.883.892.883h2.608a.889.889 0 0 0 .893-.883v-9.686l4.945 10.072c.15.304.46.497.803.497h1.073a.893.893 0 0 0 .803-.497l4.945-10.072v9.686c0 .487.4.883.894.883h2.608a.889.889 0 0 0 .893-.883V8.166c0-.487-.4-.883-.893-.883zm-106.972 8.8h-8.63V11.49h10.918a.88.88 0 0 0 .83-.578l.888-2.464a.872.872 0 0 0-.83-1.163h-15.18c-.486 0-.88.39-.88.87v18.7c0 .48.394.87.88.87h2.492c.486 0 .88-.39.88-.87V20.29h7.743a.88.88 0 0 0 .83-.578l.89-2.464a.872.872 0 0 0-.83-1.163zm51.76 7.61h-3.615V11.315H107c3.828 0 6.41 2.517 6.41 6.188 0 3.672-2.582 6.19-6.41 6.19zm-.124-16.41h-7.128c-.486 0-.88.39-.88.872v18.698c0 .48.394.87.88.87h7.128c6.453 0 10.912-4.44 10.912-10.16v-.117c0-5.72-4.46-10.162-10.912-10.162zm-11.947.03h-2.642a.87.87 0 0 0-.876.866v12.36l-8.755-12.72a1.242 1.242 0 0 0-1.023-.535H78.32a.873.873 0 0 0-.876.867v18.706c0 .48.393.867.877.867h2.64a.872.872 0 0 0 .878-.867V14.71l8.608 12.478c.23.334.613.535 1.022.535h3.46a.872.872 0 0 0 .877-.867V8.178a.87.87 0 0 0-.876-.867zm40.71 10.3c0 3.323-2.712 6.016-6.056 6.016-3.345 0-6.056-2.693-6.056-6.015v-.22c0-3.322 2.71-6.015 6.056-6.015 3.344 0 6.055 2.693 6.055 6.015v.22zm-6.056-10.44c-5.694 0-10.31 4.576-10.31 10.22v.22c0 5.646 4.616 10.22 10.31 10.22 5.693 0 10.308-4.574 10.308-10.22v-.22c0-5.644-4.615-10.22-10.308-10.22z" fill="#ccc"/></g></svg>',
    sharing: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M4.545 11.667c.714 0 1.358-.312 1.821-.809l4.642 2.779a2.76 2.76 0 0 0-.099.696c0 1.471 1.142 2.667 2.546 2.667C14.858 17 16 15.804 16 14.333c0-1.47-1.142-2.666-2.545-2.666-.714 0-1.358.311-1.821.808L6.992 9.697A2.76 2.76 0 0 0 7.091 9a2.76 2.76 0 0 0-.1-.697l4.643-2.778a2.481 2.481 0 0 0 1.82.808C14.859 6.333 16 5.137 16 3.667 16 2.196 14.858 1 13.455 1c-1.404 0-2.546 1.196-2.546 2.667 0 .242.041.473.1.696L6.365 7.142a2.481 2.481 0 0 0-1.82-.809C3.141 6.333 2 7.53 2 9c0 1.47 1.142 2.667 2.545 2.667"/></svg>',
    facebook: '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.762 5.432h-1.786c-1.428 0-1.666.71-1.666 1.657v2.248h3.452l-.357 3.55h-2.857V22H9.976v-9.112H7v-3.55h2.976V6.733C9.976 3.775 11.762 2 14.381 2c1.19 0 2.262.118 2.619.118v3.314h-.238z"/></svg>',
    twitter: '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.681 7.328v.577c0 5.915-4.486 12.695-12.735 12.695-2.605 0-4.92-.721-6.946-2.02.434 0 .724.145 1.158.145 2.026 0 4.052-.722 5.644-1.876-1.882 0-3.618-1.298-4.197-3.174.29 0 .579.145.868.145.434 0 .434 0 1.013-.145-2.17-.432-4.052-2.308-4.052-4.472 0 .433 1.592.433 2.316.577-1.158-.865-1.882-2.164-1.882-3.75 0-.866.29-1.587.724-2.309 2.17 2.741 5.644 4.472 9.261 4.761-.144-.433-.144-.721-.144-1.01C11.709 5.02 13.735 3 16.195 3c1.302 0 2.46.433 3.328 1.443 1.013-.289 1.882-.577 2.75-1.154-.434 1.154-1.158 1.875-1.881 2.452a13.73 13.73 0 0 0 2.604-.721c-.723.865-1.447 1.73-2.315 2.308z"/></svg>',
    tumblr: '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M13.987 20.999c-3.79.067-5.226-2.794-5.226-4.807V10.31H7V7.985c2.64-.984 3.275-3.447 3.423-4.85.01-.097.083-.135.126-.135h2.549v4.585h3.48v2.725h-3.494v5.603c.013.763.282 1.814 1.675 1.775.461-.012 1.08-.152 1.403-.31L17 19.944c-.315.477-1.734 1.03-3.013 1.054"/></svg>',
    reddit: '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.334 12.023c.359-.283.538-.671.538-1.166 0-.354-.112-.663-.342-.928a1.111 1.111 0 0 0-.882-.398 1.17 1.17 0 0 0-.734.268 5.004 5.004 0 0 1 1.42 2.224m-2.572-9.275a.97.97 0 0 0-.222.638c0 .247.076.458.222.635a.697.697 0 0 0 .562.265c.23 0 .426-.088.59-.265a.904.904 0 0 0 .244-.635.908.908 0 0 0-.244-.638.773.773 0 0 0-.59-.264.697.697 0 0 0-.562.264M14.156 14.09c.31.319.677.477 1.102.477.424 0 .793-.158 1.102-.477.311-.319.466-.724.466-1.219 0-.46-.146-.848-.44-1.167-.294-.316-.67-.476-1.128-.476-.458 0-.832.16-1.127.476-.295.32-.44.708-.44 1.167 0 .495.153.9.465 1.219m-2.18 4.716c1.568 0 2.84-.529 3.822-1.589l-.638-.635c-.815.848-1.878 1.27-3.184 1.27a4.38 4.38 0 0 1-1.666-.319c-.523-.21-.9-.422-1.128-.635l-.343-.316-.637.635c.98 1.06 2.237 1.59 3.774 1.59M7.221 12.87c0 .495.157.9.467 1.219.309.319.677.477 1.102.477a1.49 1.49 0 0 0 1.104-.477c.308-.319.463-.724.463-1.219 0-.46-.145-.848-.44-1.167-.293-.316-.67-.476-1.127-.476-.457 0-.832.16-1.128.476-.292.32-.44.708-.44 1.167m-4.556-.9c.262-.814.734-1.537 1.42-2.172a1.167 1.167 0 0 0-.734-.268c-.326 0-.613.133-.858.398a1.316 1.316 0 0 0-.367.928c0 .53.18.902.539 1.114M23 10.911c0 1.094-.44 1.89-1.324 2.383.034.179.05.425.05.744 0 2.013-.955 3.735-2.866 5.167-1.91 1.43-4.206 2.145-6.884 2.145s-4.965-.708-6.86-2.121c-1.896-1.412-2.843-3.125-2.843-5.14 0-.352.017-.616.05-.795C1.44 12.801 1 12.004 1 10.91c0-.74.245-1.37.733-1.88.492-.513 1.063-.77 1.717-.77.588 0 1.127.229 1.616.69C6.864 7.607 8.97 6.884 11.39 6.778h.096l1.52-5.459 4.409.952C17.87 1.423 18.509 1 19.324 1h.05c.621 0 1.135.231 1.543.69.408.459.613 1.024.613 1.696 0 .67-.205 1.236-.613 1.696a1.975 1.975 0 0 1-1.542.687h-.05c-.555 0-1.046-.203-1.47-.608a2.186 2.186 0 0 1-.686-1.51l-3.283-.743-1.078 3.921c2.484.177 4.524.885 6.126 2.121.488-.461 1.045-.69 1.665-.69.653 0 1.218.257 1.69.77.474.51.711 1.14.711 1.88"/></svg>',
    line: '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.727 10.908c0-4.37-4.428-7.925-9.87-7.925-5.441 0-9.869 3.555-9.869 7.925 0 3.918 3.511 7.2 8.254 7.82.321.068.759.21.87.481.1.247.065.633.031.883l-.14.836c-.043.247-.199.966.855.527 1.053-.44 5.683-3.312 7.753-5.67 1.43-1.553 2.116-3.128 2.116-4.877zm-13.732 2.6H6.033a.515.515 0 0 1-.517-.512V9.115c0-.282.232-.512.517-.512.286 0 .518.23.518.512v3.369h1.444c.285 0 .517.23.517.512a.515.515 0 0 1-.517.512zm2.028-.512a.515.515 0 0 1-.518.512.515.515 0 0 1-.517-.512V9.115c0-.282.232-.512.517-.512.286 0 .518.23.518.512v3.88zm4.72 0a.51.51 0 0 1-.518.512.523.523 0 0 1-.414-.205l-2.01-2.708v2.4a.515.515 0 0 1-.517.513.515.515 0 0 1-.517-.512V9.115a.512.512 0 0 1 .518-.512.52.52 0 0 1 .413.205l2.01 2.708V9.115c0-.282.232-.512.518-.512.285 0 .517.23.517.512v3.88zm3.173-2.453c.285 0 .518.23.518.513a.516.516 0 0 1-.518.512h-1.443v.916h1.443c.285 0 .518.23.518.512a.516.516 0 0 1-.518.512h-1.961a.516.516 0 0 1-.517-.512V9.115c0-.282.232-.512.517-.512h1.961c.285 0 .518.23.518.512a.515.515 0 0 1-.518.512h-1.443v.916h1.443z"/></svg>',
    wykop: '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M6.76 20.985a9.543 9.543 0 0 1-2.192-.45c-2.005-.646-2.991-2.095-3.251-3.988a34.21 34.21 0 0 1-.081-8.58c.308-2.687 2.073-4.3 4.983-4.635 3.068-.353 6.147-.287 9.223-.17a19.45 19.45 0 0 1 3.321.41c2.425.52 3.734 2.024 3.981 4.351.26 2.447.35 4.898.157 7.35-.093 1.183-.247 2.37-.935 3.412-.927 1.405-2.37 2.057-4.039 2.22-1.942.19-9.402.211-11.167.08zm7.421-2.064c1.314-.076 2.63-.154 3.933-.313.836-.102 1.547-.53 1.87-1.295.262-.622.516-1.291.548-1.95.093-1.902.101-3.81.08-5.715-.008-.658-.153-1.325-.322-1.967-.314-1.19-1.13-1.917-2.448-2.077-.743-.09-1.491-.189-2.24-.202a175.972 175.972 0 0 0-5.531-.018c-1.19.016-2.381.071-3.565.176-1.546.136-2.424.863-2.808 2.222a5.68 5.68 0 0 0-.126.546c-.345 1.919-.274 3.854-.204 5.784.028.78.155 1.565.317 2.333.23 1.096.928 1.842 2.101 2.132.41.101.833.182 1.253.203 1.656.083 6.422.182 7.142.14zm.995-12.884L12.6 7.227l3.196 6.103-1.269.6-3.248-6.091L8.66 9.048l3.204 6.117-1.269.6L7.34 9.66l-2.563 1.184 3.87 7.369 10.368-4.835-3.838-7.34"/></svg>',
    nk: '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3.852 9.339c.573-.25 1.12-.505 1.68-.727 1.016-.403 2.066-.691 3.17-.714.331-.007.675.04.994.126.992.271 1.496.99 1.602 1.93.082.723.044 1.467-.01 2.197-.118 1.585-.278 3.167-.423 4.75-.09.976-.185 1.952-.268 2.93-.015.173-.082.236-.258.235-.877-.005-1.755-.008-2.632.002-.245.003-.275-.114-.256-.305.083-.86.161-1.718.24-2.577l.37-3.989c.047-.515.086-1.031.142-1.546.077-.7-.21-.987-.932-.911-.7.073-1.332.336-1.947.65-.421.214-.845.426-1.254.662a.467.467 0 0 0-.207.308c-.121 1.165-.226 2.332-.333 3.499-.12 1.293-.242 2.586-.352 3.88-.022.248-.115.337-.38.332-.803-.017-1.605-.006-2.408-.006-.356 0-.366-.002-.337-.337.14-1.61.285-3.22.428-4.83.119-1.34.24-2.678.354-4.017.032-.382.02-.383-.365-.385-.49-.003-.483-.002-.436-.478.053-.533.1-1.067.13-1.602.011-.22.091-.303.32-.299.578.011 1.157.003 1.735.004.982 0 1.362.28 1.633 1.218m9.826-3.941h-.861c0-.182-.012-.342.002-.5.049-.552.113-1.101.158-1.653.014-.176.089-.229.263-.228.83.007 1.661-.006 2.491.008.677.01 1.26.625 1.206 1.281-.12 1.455-.26 2.909-.389 4.363-.1 1.13-.193 2.26-.295 3.388-.103 1.138-.217 2.275-.32 3.413-.103 1.13-.196 2.26-.296 3.388-.031.353-.062.705-.113 1.055-.01.07-.112.181-.172.182-.97.01-1.94.004-2.91 0-.025 0-.05-.021-.113-.05l1.349-14.647m9.079 14.69c-.148.008-.238.017-.328.017-.905.001-1.81-.004-2.716.004-.2.002-.319-.054-.416-.236a942.803 942.803 0 0 0-3.025-5.618c-.08-.149-.078-.255.014-.395 1.215-1.842 2.422-3.687 3.64-5.527.06-.09.197-.182.3-.183 1.138-.013 2.276-.008 3.415-.007.044 0 .089.01.177.022-.072.112-.125.202-.186.287-1.297 1.799-2.592 3.599-3.897 5.393-.125.172-.137.296-.035.485.969 1.8 1.926 3.607 2.886 5.412.051.096.096.194.171.346"/></svg>',
    meneame: '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.494 7.792c-1.427 1.37-4.004 1.33-4.962 3.181-.818 2.195 1.107 5.702 1.911 7.702.545 1.033-4.253 2.03-3.666 2.285 3.385-.036 4.83-1.206 4.423-2.641-.389-1.373-2.144-4.114-2.144-6.305.05-1.654 2.004-2.162 3.263-2.836 1.463-.62 2.831-2.006 2.453-3.63-.016-.574-1.07-2.482-.64-1.003.235 1.092.347 2.44-.638 3.247"/><path d="M16.091 5.326c-1.842-.9-3.89-1.444-6.032-.97-1.151.201-2.507.797-3.279 1.794-1.011 1.144-1.05 2.807-.387 4.115.515 1.007 1.299 2.128 2.569 2.296 1.092.155 2.292.015 3.22-.582-1.103.18-2.381.55-3.372-.147-1.66-1.005-2.467-3.287-1.46-4.952.81-1.452 2.441-1.86 4.167-1.932 2.301-.096 4.507 1.147 5.353 1.45.815.242 1.985.55 2.565-.27.339-.38.203-1.429-.072-1.526.08.735-.49 1.659-1.376 1.418-.662-.148-1.27-.449-1.896-.694M3.742 11.824c-1.067 1.592-2.042 3.457-1.67 5.398.342 2.03 2.416 3.46 4.478 3.715 2.117.234 4.23.174 6.352.03.358-.328-1.732-.319-2.612-.439-2.008-.215-4.186-.255-5.907-1.383-1.604-1.136-1.814-3.365-1.045-5.007.644-1.55 1.607-3.048 2.619-4.343-.79.621-1.519 1.084-2.215 2.029"/><path d="M9.014 16.833c1.251.091 3.326-.029 4.301.616.35.497-.3 3.247-.076 3.564.498.139 1.067-3.222.752-4.057-.239-.637-4.479-.298-4.977-.123"/></svg>',
    odnoklassniki: '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14.289 16.068c.33.319.618.598.909.875.644.613 1.296 1.22 1.934 1.84.67.65.694 1.557.071 2.176-.629.624-1.624.635-2.294-.01-.934-.9-1.844-1.823-2.794-2.764-.16.145-.26.23-.353.32-.812.778-1.625 1.554-2.432 2.337-.39.378-.837.626-1.408.576-.645-.056-1.113-.372-1.354-.953-.248-.598-.13-1.153.33-1.61.673-.672 1.372-1.318 2.061-1.974.267-.254.538-.503.863-.806-.214-.065-.356-.095-.486-.15-.806-.334-1.635-.629-2.407-1.024-.876-.449-1.114-1.383-.634-2.14.466-.734 1.412-.933 2.247-.475 2.342 1.285 4.684 1.284 7.025-.006.828-.456 1.78-.247 2.243.49.468.747.235 1.677-.618 2.116-.772.398-1.598.697-2.403 1.034-.135.057-.283.085-.5.148zM6.695 7.176c.01-2.858 2.419-5.131 5.422-5.118 2.925.013 5.31 2.344 5.29 5.171-.021 2.865-2.414 5.103-5.441 5.089-2.913-.013-5.282-2.325-5.271-5.142zm5.364-2.03c-1.191-.003-2.158.901-2.175 2.035-.017 1.114 1.009 2.1 2.177 2.093 1.164-.009 2.148-.957 2.154-2.077.005-1.123-.967-2.048-2.156-2.051z"/></svg>',
    vkontakte: '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8.169 7.816a1.17 1.17 0 0 1 .792-.65 5.11 5.11 0 0 1 1.037-.175 27.89 27.89 0 0 1 1.925-.025c.329.006.662.048.984.117.591.126.88.45.924 1.062.03.439.013.882-.003 1.322-.018.462-.064.924-.089 1.386a13.41 13.41 0 0 0-.024.981c.007.384.044.77.285 1.09.233.31.279.34.621.132.189-.115.348-.294.487-.472.964-1.23 1.699-2.59 2.26-4.052.054-.138.124-.27.179-.407.182-.446.528-.631.983-.633.414-.001.829.022 1.244.024.62.002 1.24-.012 1.861-.004.267.005.538.024.797.082.353.078.477.305.41.666-.094.508-.315.965-.567 1.407-.464.812-1.043 1.54-1.612 2.275a68.25 68.25 0 0 0-1.066 1.42 1.933 1.933 0 0 0-.191.345c-.229.504-.158.905.252 1.32.419.422.855.828 1.276 1.248.62.62 1.19 1.284 1.655 2.031.117.187.205.402.259.615.068.273-.05.5-.278.658-.265.187-.575.248-.884.251-.645.008-1.292-.013-1.937-.02-.326-.004-.653-.011-.976.067-.09.023-.2-.01-.296-.033-.618-.148-1.127-.489-1.587-.916-.454-.422-.833-.91-1.221-1.39-.14-.173-.3-.334-.478-.466a.989.989 0 0 0-.443-.189c-.321-.046-.577.107-.678.423-.083.263-.116.543-.155.82-.036.272-.037.55-.077.824-.075.517-.227.743-.878.859-.536.094-1.072.047-1.607-.001-.74-.069-1.468-.207-2.166-.472-1.063-.401-1.96-1.049-2.739-1.874-.822-.873-1.521-1.845-2.186-2.841-1-1.5-1.835-3.091-2.607-4.719-.217-.458-.452-.91-.565-1.41-.04-.178-.06-.36-.091-.539-.018-.107.016-.19.115-.223.21-.069.421-.17.634-.18.528-.026 1.057-.006 1.586-.01.44-.004.88-.019 1.319-.022.1-.001.2.02.3.034a.732.732 0 0 1 .572.41c.124.25.254.497.363.754a20.133 20.133 0 0 0 1.94 3.517c.16.233.32.47.503.684.1.118.237.217.376.285.23.113.435.048.54-.184a2.32 2.32 0 0 0 .204-.662c.13-.972.145-1.95.053-2.925a4.61 4.61 0 0 0-.126-.662c-.077-.312-.278-.525-.568-.652a38.53 38.53 0 0 1-.494-.222c-.05-.021-.095-.051-.147-.08"/></svg>',
    google: '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21.146 11.163V8.564h-1.844v2.6h-2.655v1.856h2.655v2.673h1.844V13.02h2.58v-1.857h-2.58zm-13.422-.148v2.97s2.862-.004 4.027-.004c-.631 1.926-1.612 2.974-4.027 2.974-2.444 0-4.35-1.994-4.35-4.455 0-2.46 1.906-4.455 4.35-4.455 1.292 0 2.127.457 2.892 1.094.613-.617.561-.705 2.12-2.187A7.393 7.393 0 0 0 7.724 5C3.611 5 .276 8.358.276 12.5c0 4.142 3.335 7.5 7.448 7.5 6.149 0 7.652-5.391 7.153-8.985H7.724z"/></svg>',
    weibo: '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16.562 11.618c-.273-.081-.46-.137-.318-.493.31-.775.342-1.443.006-1.92-.63-.894-2.353-.845-4.328-.024 0 0-.62.27-.461-.219.303-.97.258-1.783-.215-2.253-1.072-1.065-3.921.04-6.365 2.468-1.83 1.819-2.893 3.746-2.893 5.413 0 3.188 4.115 5.126 8.14 5.126 5.275 0 8.785-3.047 8.785-5.465 0-1.46-1.238-2.29-2.351-2.633m-6.424 6.955c-3.211.315-5.984-1.127-6.192-3.223-.209-2.095 2.226-4.049 5.437-4.364 3.212-.316 5.985 1.127 6.193 3.221.208 2.096-2.226 4.05-5.438 4.366m9.927-12.789a5.155 5.155 0 0 0-4.888-1.572.738.738 0 1 0 .31 1.444c1.234-.26 2.57.12 3.476 1.117a3.611 3.611 0 0 1 .763 3.55.744.744 0 0 0 1.414.455v-.003a5.076 5.076 0 0 0-1.075-4.991"/><path d="M18.109 7.539a2.51 2.51 0 0 0-2.381-.765.635.635 0 1 0 .266 1.242 1.23 1.23 0 0 1 1.165.374c.303.334.385.79.255 1.19a.635.635 0 0 0 .411.8.64.64 0 0 0 .805-.41 2.47 2.47 0 0 0-.521-2.431m-7.649 5.059c-1.53-.395-3.257.362-3.92 1.7-.676 1.365-.023 2.88 1.521 3.375 1.6.513 3.485-.273 4.14-1.746.647-1.44-.16-2.922-1.742-3.329m-1.167 3.486c-.31.492-.976.708-1.477.48-.494-.223-.64-.795-.329-1.275.307-.478.95-.691 1.447-.484.503.213.664.781.359 1.279m1.023-1.306c-.112.191-.36.283-.555.204-.191-.079-.251-.292-.142-.48.112-.186.35-.277.541-.202.194.07.264.286.156.478"/></svg>'
  };

  function wikiaJWPlayerIdleScreen(playerInstance, i18n) {
    function showDuration() {
      var id = playerInstance.id,
          playerElement = document.getElementById(id),
          title = playerElement.querySelector(".jw-title"),
          titlePrimary = playerElement.querySelector(".jw-title-primary"),
          durationElement = document.createElement("div"),
          durationWatchElement = document.createElement("span"),
          durationTimeElement = document.createElement("span");
      durationElement.className = "wikia-jw-title-duration";
      durationWatchElement.className = "wikia-jw-title-duration-watch";
      durationTimeElement.className = "wikia-jw-title-duration-time";
      durationWatchElement.innerText = i18n.watch;
      durationTimeElement.innerText = getUserFriendlyDuration(playerInstance.getDuration());
      durationElement.appendChild(durationWatchElement);
      durationElement.appendChild(durationTimeElement);
      title.insertBefore(durationElement, titlePrimary);
    }

    function getUserFriendlyDuration(duration) {
      var minutes = Math.floor(duration / 60),
          seconds = duration % 60;

      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      if (minutes < 10) {
        minutes = "0" + minutes;
      }

      return minutes + ":" + seconds;
    }

    playerInstance.on("ready", showDuration);
  }

  window.wikiaJWPlayerIdleScreen = wikiaJWPlayerIdleScreen;
  var loadCallbacks = [];

  window.wikiaJWPlayer = function (elementId, options, callback) {
    function createScriptTag(elementId, playerURL) {
      var script = document.createElement("script"),
          playerElement = document.getElementById(elementId);

      script.onload = function () {
        wikiaJWPlayerSettingsPlugin.register();

        if (options.sharing) {
          wikiaJWPlayerSharingPlugin.register();
        }

        if (options.showSmallPlayerControls) {
          wikiaJWPlayerSmallPlayerControls.register();
        }

        loadCallbacks.forEach(function (callback) {
          callback();
        });
      };

      script.async = true;
      script.src = playerURL || "https://content.jwplatform.com/libraries/VXc5h4Tf.js";
      playerElement.parentNode.insertBefore(script, playerElement.nextSibling);
    }

    function loadJWPlayerScript(elementId, playerURL, callback) {
      if (typeof jwplayer !== "undefined") {
        callback();
      } else {
        loadCallbacks.push(callback);

        if (loadCallbacks.length === 1) {
          createScriptTag(elementId, playerURL);
        }
      }
    }

    function setupPlayer(elementId, options, logger, lang, i18n) {
      var playerInstance = jwplayer(elementId),
          videoId = options.videoDetails.playlist[0].mediaid,
          willAutoplay = options.autoplay,
          langForAds = lang.substr(0, 2),
          playerSetup = {
        advertising: {
          autoplayadsmuted: willAutoplay,
          client: "googima",
          vpaidcontrols: true,
          admessage: i18n.admessage,
          cuetext: i18n.cuetext,
          skipmessage: i18n.skipmessage,
          skiptext: i18n.skiptext,
          setLocale: langForAds
        },
        autostart: willAutoplay && !document.hidden,
        description: options.videoDetails.description,
        image: "//content.jwplatform.com/thumbs/" + videoId + "-640.jpg",
        mute: options.mute,
        playlist: options.videoDetails.playlist,
        title: options.videoDetails.title,
        localization: i18n,
        repeat: options.repeat
      };
      playerSetup.plugins = {};

      if (options.settings) {
        playerSetup.plugins["wikiaSettings"] = {
          showAutoplayToggle: options.settings.showAutoplayToggle,
          showQuality: options.settings.showQuality,
          showCaptions: options.settings.showCaptions,
          autoplay: options.autoplay,
          selectedCaptionsLanguage: options.selectedCaptionsLanguage,
          i18n: i18n
        };
      }

      if (options.sharing) {
        playerSetup.plugins["wikiaSharing"] = {
          i18n: i18n
        };
      }

      if (options.related) {
        playerSetup.related = {
          autoplaytimer: options.related.time || 3,
          file: "//cdn.jwplayer.com/v2/playlists/" + options.related.playlistId + "?related_media_id=" + videoId,
          oncomplete: options.related.autoplay ? "autoplay" : "show",
          autoplaymessage: i18n.nextUpInSeconds
        };
      }

      if (options.watermark !== false) {
        playerSetup.plugins["wikiaWatermark"] = {};
      }

      if (options.showSmallPlayerControls) {
        playerSetup.plugins["smallPlayerControls"] = {};
      }

      logger.info("setupPlayer");
      playerInstance.setup(playerSetup);
      logger.info("after setup");
      logger.subscribeToPlayerErrors(playerInstance);
      return playerInstance;
    }

    loadJWPlayerScript(elementId, options.playerURL, function () {
      var logger = wikiaJWPlayerLogger(options),
          lang = options.lang || "en",
          i18n = wikiaJWPlayeri18n[lang] || wikiaJWPlayeri18n["en"],
          playerInstance = setupPlayer(elementId, options, logger, lang, i18n);
      wikiaJWPlayerIdleScreen(playerInstance, i18n);
      wikiaJWPlayerReplaceIcons(playerInstance);
      wikiaJWPlayerEvents(playerInstance, options.autoplay, logger);

      if (options.related) {
        wikiaJWPlayerRelatedVideoSound(playerInstance);
      }

      if (options.tracking) {
        options.tracking.pixel = options.videoDetails.playlist[0].pixel;
        wikiaJWPlayerTracking(playerInstance, options.autoplay, options.tracking);
      }

      wikiaJWPlayerHandleTabNotActive(playerInstance, options.autoplay);
      wikiaJWPlayerAllowControllOnTouchDevices(playerInstance);

      if (options.watermark !== false) {
        WikiaJWPlayerWatermarkPlugin.register();
      }

      if (callback) {
        callback(playerInstance);
      }
    });
  };

  function wikiaJWPlayerLogger(options) {
    var servicesDomain = options.servicesDomain || "services.wikia.com",
        loggerPath = "/event-logger/",
        loggerUrl = "https://" + servicesDomain + loggerPath,
        prefix = "JWPlayer",
        logLevels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
      off: 4
    },
        loggerOptions = options.logger || {},
        logLevel = loggerOptions.logLevel ? logLevels[loggerOptions.logLevel] : logLevels["error"],
        logDebugToService = loggerOptions.logDebugToService,
        clientName = loggerOptions.clientName,
        clientVersion = loggerOptions.clientVersion;

    function logToService(resource, name, description) {
      var request = new XMLHttpRequest(),
          data = {
        name: prefix + " " + name
      };

      if (description) {
        data.description = typeof description === "string" ? description : JSON.stringify(description);
      }

      if (clientName) {
        data.client = clientName;
      }

      if (clientVersion) {
        data.client_version = clientVersion;
      }

      request.open("POST", loggerUrl + resource, true);
      request.setRequestHeader("Content-type", "application/json");
      request.send(JSON.stringify(data));
    }

    function debug(name, description) {
      if (logLevel <= logLevels["debug"]) {
        console.log(prefix, name, description);
      }

      if (logDebugToService) {
        logToService("debug", name, description);
      }
    }

    function info(name, description) {
      if (logLevel <= logLevels["info"]) {
        console.info(prefix, name, description);
      }
    }

    function warn(name, description) {
      if (logLevel <= logLevels["warn"]) {
        console.warn(prefix, name, description);
      }
    }

    function error(name, description) {
      if (logLevel <= logLevels["error"]) {
        console.error(prefix, name, description);
        logToService("error", name, description);
      }
    }

    function subscribeToPlayerErrors(playerInstance) {
      playerInstance.on("setupError", function (err) {
        error("setupError", err);
      });
      playerInstance.on("error", function (err) {
        error("error", err);
      });
    }

    return {
      debug: debug,
      info: info,
      warn: warn,
      error: error,
      subscribeToPlayerErrors: subscribeToPlayerErrors
    };
  }

  function wikiaJWPlayerReplaceIcons(playerInstance) {
    var parser = new DOMParser();

    function replaceJWIconWithCustom(icon, iconHtml) {
      if (icon) {
        var newIcon = parser.parseFromString(iconHtml, "image/svg+xml").documentElement;
        newIcon.setAttribute("class", icon.getAttribute("class"));
        icon.parentNode.replaceChild(newIcon, icon);
      }
    }

    function replaceIcons(videoPlayerElement) {
      var controlBar = videoPlayerElement.querySelector(".jw-controlbar"),
          displayControls = videoPlayerElement.querySelector(".jw-display"),
          controlBarIcons = [{
        selector: ".jw-svg-icon-play",
        iconName: "play"
      }, {
        selector: ".jw-svg-icon-pause",
        iconName: "pause"
      }, {
        selector: ".jw-svg-icon-fullscreen-on",
        iconName: "fullScreenOn"
      }, {
        selector: ".jw-svg-icon-fullscreen-off",
        iconName: "fullScreenOff"
      }, {
        selector: ".jw-svg-icon-settings",
        iconName: "settings"
      }, {
        selector: ".jw-svg-icon-volume-0",
        iconName: "volumeOff"
      }, {
        selector: ".jw-svg-icon-volume-50",
        iconName: "volumeOn"
      }, {
        selector: ".jw-svg-icon-volume-100",
        iconName: "volumeOn"
      }],
          displayControlsIcons = [{
        selector: ".jw-svg-icon-play",
        iconName: "displayPlay"
      }, {
        selector: ".jw-svg-icon-pause",
        iconName: "pause"
      }];
      controlBarIcons.forEach(function (iconData) {
        replaceJWIconWithCustom(controlBar.querySelector(iconData.selector), wikiaJWPlayerIcons[iconData.iconName]);
      });
      displayControlsIcons.forEach(function (iconData) {
        replaceJWIconWithCustom(displayControls.querySelector(iconData.selector), wikiaJWPlayerIcons[iconData.iconName]);
      });
    }

    playerInstance.on("ready", function () {
      replaceIcons(playerInstance.getContainer());
    });
  }

  var isActiveClass = "is-active",
      domParser = new DOMParser();

  function wikiaJWPlayerSettingsPlugin(player, config, div) {
    this.player = player;
    this.container = div;
    this.wikiaSettingsElement = document.createElement("div");
    this.buttonID = "wikiaSettings";
    this.config = config;
    this.documentClickHandler = this.documentClickHandler.bind(this);
    this.isDocumentHandlerMounted = false;
    this.container.classList.add("wikia-jw__plugin");
    this.wikiaSettingsElement.classList.add("wikia-jw-settings");
    this.wikiaSettingsElement.classList.add("wikia-jw");
    this.addSettingsContent(this.wikiaSettingsElement);
    this.container.appendChild(this.wikiaSettingsElement);
    this.player.on("levels", this.onQualityLevelsChange.bind(this));
    this.player.on("relatedVideoPlay", this.onCaptionsChange.bind(this));
    this.player.once("ready", this.onCaptionsChange.bind(this));
  }

  wikiaJWPlayerSettingsPlugin.prototype.isSettingsMenuOrSettingsButton = function (element) {
    var button = this.getSettingsButtonElement();
    return button && (button === element || button.contains(element) || this.wikiaSettingsElement === element || this.wikiaSettingsElement.contains(element));
  };

  wikiaJWPlayerSettingsPlugin.prototype.getSettingsButtonElement = function () {
    return this.player.getContainer().querySelector("[button=" + this.buttonID + "]");
  };

  wikiaJWPlayerSettingsPlugin.prototype.documentClickHandler = function (event) {
    if (!this.isSettingsMenuOrSettingsButton(event.target) && this.container.style.display && this.isDocumentHandlerMounted) {
      document.removeEventListener("click", this.documentClickHandler);
      document.removeEventListener("touchend", this.documentClickHandler);
      this.isDocumentHandlerMounted = false;
      this.close();
    }
  };

  wikiaJWPlayerSettingsPlugin.prototype.addButton = function () {
    var settingsIcon = createSVG(wikiaJWPlayerIcons.settings);
    settingsIcon.classList.add("jw-svg-icon");
    settingsIcon.classList.add("jw-svg-icon-wikia-settings");
    this.player.addButton(settingsIcon.outerHTML, this.config.i18n.settings, function (evt) {
      if (!this.wikiaSettingsElement.style.display) {
        this.open(evt.currentTarget);
        setTimeout(function () {
          if (!this.isDocumentHandlerMounted) {
            document.addEventListener("click", this.documentClickHandler);
            document.addEventListener("touchend", this.documentClickHandler);
            this.isDocumentHandlerMounted = true;
          }
        }.bind(this), 0);
      }
    }.bind(this), this.buttonID, "wikia-jw-button");
  };

  wikiaJWPlayerSettingsPlugin.prototype.removeButton = function () {
    this.player.removeButton(this.buttonID);
  };

  wikiaJWPlayerSettingsPlugin.prototype.close = function () {
    var playerContainer = this.player.getContainer();
    this.showSettingsList();
    this.container.style.display = null;
    playerContainer.classList.remove("wikia-jw-open");
    playerContainer.querySelector(".wikia-jw-button__open").classList.remove("wikia-jw-button__open");
  };

  wikiaJWPlayerSettingsPlugin.prototype.open = function (button) {
    showElement(this.container);
    this.player.getContainer().classList.add("wikia-jw-open");
    button.classList.add("wikia-jw-button__open");
  };

  wikiaJWPlayerSettingsPlugin.prototype.hide = function () {
    this.close();
    this.removeButton();
  };

  wikiaJWPlayerSettingsPlugin.prototype.show = function () {
    if (!this.getSettingsButtonElement()) {
      this.addButton();
    }
  };

  wikiaJWPlayerSettingsPlugin.prototype.showSettingsList = function () {
    showElement(this.settingsList);
    hideElement(this.qualityLevelsList);
    hideElement(this.captionsList);
  };

  wikiaJWPlayerSettingsPlugin.prototype.addSettingsContent = function (div) {
    div.classList.add("wikia-jw");
    div.classList.add("wikia-jw-settings");
    div.classList.remove("jw-reset");
    div.classList.remove("jw-plugin");
    this.settingsList = this.createSettingsListElement();
    div.appendChild(this.settingsList);

    if (this.config.showQuality) {
      this.createQualityLevelsList();
      div.appendChild(this.qualityLevelsList);
    }

    if (this.config.showCaptions) {
      this.createCaptionsList();
      div.appendChild(this.captionsList);
    }

    return div;
  };

  wikiaJWPlayerSettingsPlugin.prototype.createSettingsListElement = function () {
    var settingsList = document.createElement("ul");
    settingsList.className = "wikia-jw__list wds-list";

    if (this.config.showQuality) {
      settingsList.appendChild(this.createQualityButton());
    }

    if (this.config.showCaptions) {
      settingsList.appendChild(this.createCaptionsButton());
    }

    if (this.config.showAutoplayToggle) {
      settingsList.appendChild(this.createAutoplayToggle());
      this.show();
    }

    return settingsList;
  };

  wikiaJWPlayerSettingsPlugin.prototype.createSubmenuWrapper = function () {
    var backElement = document.createElement("li"),
        submenuWrapper = document.createElement("ul");
    backElement.className = "wikia-jw-settings__back";
    backElement.innerHTML = createArrowIcon("left").outerHTML + " " + this.config.i18n.back;
    backElement.addEventListener("click", this.showSettingsList.bind(this));
    submenuWrapper.className = "wikia-jw-settings__submenu wds-list";
    submenuWrapper.appendChild(backElement);
    return submenuWrapper;
  };

  wikiaJWPlayerSettingsPlugin.prototype.createAutoplayToggle = function () {
    var autoplayToggle = createToggle({
      id: this.player.getContainer().id + "-videoAutoplayToggle",
      label: this.config.i18n.autoplayVideos,
      checked: this.config.autoplay
    });
    autoplayToggle.querySelector("label").addEventListener("click", function (event) {
      this.player.trigger("autoplayToggle", {
        enabled: !event.target.previousSibling.checked
      });
    }.bind(this));
    return autoplayToggle;
  };

  wikiaJWPlayerSettingsPlugin.prototype.createQualityButton = function () {
    var qualityElement = document.createElement("li");
    qualityElement.className = "wikia-jw-settings__quality-button";
    qualityElement.innerHTML = this.config.i18n.videoQuality + createArrowIcon("right").outerHTML;
    qualityElement.addEventListener("click", function () {
      hideElement(this.settingsList);
      showElement(this.qualityLevelsList);
    }.bind(this));
    return qualityElement;
  };

  wikiaJWPlayerSettingsPlugin.prototype.createQualityLevelsList = function () {
    this.qualityLevelsList = this.createSubmenuWrapper();
    this.player.on("levelsChanged", this.updateCurrentQuality.bind(this));
  };

  wikiaJWPlayerSettingsPlugin.prototype.onQualityLevelsChange = function (data) {
    var isQualityListEmpty = !data.levels.length || data.levels.length === 1 && data.levels[0].label === "0",
        shouldShowSettingsButton = !isQualityListEmpty && this.config.showQuality || this.config.showAutoplayToggle,
        isQualityListEmptyClass = "is-quality-list-empty";

    if (isQualityListEmpty) {
      this.wikiaSettingsElement.classList.add(isQualityListEmptyClass);
    } else {
      this.wikiaSettingsElement.classList.remove(isQualityListEmptyClass);
    }

    if (shouldShowSettingsButton) {
      this.show();
    }

    if (this.qualityLevelsList) {
      this.updateQualityLevelsList(data.levels);
    }
  };

  wikiaJWPlayerSettingsPlugin.prototype.updateQualityLevelsList = function (newLevels) {
    clearListElement(this.qualityLevelsList);
    newLevels.forEach(function (level, index) {
      var qualityLevelItem = document.createElement("li");
      qualityLevelItem.addEventListener("click", function () {
        this.player.setCurrentQuality(index);
        this.close();
      }.bind(this));

      if (this.player.getCurrentQuality() === index) {
        qualityLevelItem.classList.add(isActiveClass);
      }

      qualityLevelItem.appendChild(document.createTextNode(level.label));
      this.qualityLevelsList.insertBefore(qualityLevelItem, this.qualityLevelsList.lastElementChild);
    }, this);
  };

  wikiaJWPlayerSettingsPlugin.prototype.updateCurrentQuality = function (data) {
    for (var i = 0; i < this.qualityLevelsList.childNodes.length; i++) {
      var node = this.qualityLevelsList.childNodes[i];

      if (data.currentQuality === i) {
        node.classList.add(isActiveClass);
      } else {
        node.classList.remove(isActiveClass);
      }
    }
  };

  wikiaJWPlayerSettingsPlugin.prototype.onCaptionsChange = function () {
    var emptyCaptionsClass = "are-captions-empty",
        captions = this.player.getCaptionsList(),
        suitableCaptionsTrack = this.getSuitableCaptionsIndex(this.config.selectedCaptionsLanguage || this.captionLangMap[this.getUserLang()], captions);
    clearListElement(this.captionsList);

    if (this.captionsList && captions.length > 1) {
      captions.forEach(this.createCaptionsListItem, this);
      this.wikiaSettingsElement.classList.remove(emptyCaptionsClass);
      this.show();

      if (this.config.selectedCaptionsLanguage !== false && suitableCaptionsTrack !== -1) {
        this.player.setCurrentCaptions(suitableCaptionsTrack);
      } else {
        this.player.setCurrentCaptions(0);
      }
    } else {
      this.wikiaSettingsElement.classList.add(emptyCaptionsClass);
    }
  };

  wikiaJWPlayerSettingsPlugin.prototype.createCaptionsList = function () {
    this.captionsList = this.createSubmenuWrapper();
    this.player.on("captionsChanged", this.updateCurrentCaptions.bind(this));
  };

  wikiaJWPlayerSettingsPlugin.prototype.createCaptionsListItem = function (track, index) {
    var captionItem = document.createElement("li"),
        normalizedLabel = track.label === "Off" ? "No captions" : track.label;
    captionItem.dataset.track = index;
    captionItem.addEventListener("click", function () {
      this.player.setCurrentCaptions(index);
      this.close();
      this.player.trigger("captionsSelected", {
        selectedLang: track.label
      });
    }.bind(this));
    captionItem.appendChild(document.createTextNode(normalizedLabel));
    this.captionsList.insertBefore(captionItem, this.captionsList.firstElementChild);
  };

  wikiaJWPlayerSettingsPlugin.prototype.createCaptionsButton = function () {
    var captionsButton = document.createElement("li");
    captionsButton.className = "wikia-jw-settings__captions-button";
    captionsButton.innerHTML = this.config.i18n.captions + createArrowIcon("right").outerHTML;
    captionsButton.addEventListener("click", function () {
      hideElement(this.settingsList);
      showElement(this.captionsList);
    }.bind(this));
    return captionsButton;
  };

  wikiaJWPlayerSettingsPlugin.prototype.getUserLang = function () {
    return (window.navigator.userLanguage || window.navigator.language).slice(0, 2);
  };

  wikiaJWPlayerSettingsPlugin.prototype.getSuitableCaptionsIndex = function (userLang, captionTracks) {
    return captionTracks.map(function (track) {
      return track.label;
    }).indexOf(userLang);
  };

  wikiaJWPlayerSettingsPlugin.prototype.updateCurrentCaptions = function (data) {
    for (var i = 0; i < this.captionsList.childNodes.length; i++) {
      this.captionsList.childNodes[i].classList.remove(isActiveClass);
    }

    this.captionsList.querySelector('[data-track="' + data.track + '"]').classList.add(isActiveClass);
  };

  wikiaJWPlayerSettingsPlugin.prototype.captionLangMap = {
    en: "English",
    pl: "Polish",
    fr: "French",
    de: "German",
    it: "Italian",
    ja: "Japanese",
    pt: "Portuguese",
    ru: "Russian",
    es: "Spanish",
    zh: "Chinese"
  };

  wikiaJWPlayerSettingsPlugin.register = function () {
    jwplayer().registerPlugin("wikiaSettings", "8.0.0", wikiaJWPlayerSettingsPlugin);
  };

  function wikiaJWPlayerSmallPlayerControls(player, config, div) {
    this.player = player;
    this.container = div;
    this.config = config;
    this.muteIcon = createSVG(wikiaJWPlayerIcons.volumeOff);
    this.playIcon = createSVG(wikiaJWPlayerIcons.play);
    this.pauseIcon = createSVG(wikiaJWPlayerIcons.pause);
    this.container.classList.add("wikia-jw-small-player-controls-plugin");
    this.wikiaControlsElement = document.createElement("div");
    this.wikiaControlsElement.appendChild(this.muteIcon);
    this.wikiaControlsElement.appendChild(this.pauseIcon);
    this.unmuteHandler = this.unmuteHandler.bind(this);
    this.playHandler = this.playHandler.bind(this);
    this.pauseHandler = this.pauseHandler.bind(this);
    this.readyHandler = this.readyHandler.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);
    this.container.addEventListener("click", this.unmuteHandler);
    this.pauseIcon.addEventListener("click", this.pauseHandler);
    this.playIcon.addEventListener("click", this.playHandler);
    this.player.on("resize", this.resizeHandler);
    this.player.on("ready", this.readyHandler);
  }

  wikiaJWPlayerSmallPlayerControls.prototype.readyHandler = function () {
    if (this.player.getWidth() <= 250) {
      this.player.getContainer().classList.add("wikia-jw-small-player-controls");
      this.container.appendChild(this.wikiaControlsElement);
    }
  };

  wikiaJWPlayerSmallPlayerControls.prototype.unmuteHandler = function (event) {
    if (event.currentTarget.contains(event.target)) {
      this.player.setMute(false);
    }
  };

  wikiaJWPlayerSmallPlayerControls.prototype.pauseHandler = function () {
    var icon = this.container.firstChild.childNodes[1];
    icon.parentNode.replaceChild(this.playIcon, icon);
    this.player.pause();
  };

  wikiaJWPlayerSmallPlayerControls.prototype.playHandler = function () {
    var icon = this.container.firstChild.childNodes[1];
    icon.parentNode.replaceChild(this.pauseIcon, icon);
    this.player.play();
  };

  wikiaJWPlayerSmallPlayerControls.prototype.resizeHandler = function (playerDimensions) {
    if (playerDimensions.width > 250) {
      this.player.getContainer().classList.remove("wikia-jw-small-player-controls");
    }
  };

  wikiaJWPlayerSmallPlayerControls.register = function () {
    jwplayer().registerPlugin("smallPlayerControls", "8.0.0", wikiaJWPlayerSmallPlayerControls);
  };

  function wikiaJWPlayerRelatedVideoSound(playerInstance) {
    playerInstance.on("relatedVideoPlay", function (data) {
      if (!data.auto) {
        playerInstance.setMute(false);
      }
    });
  }

  function wikiaJWPlayerHandleTabNotActive(playerInstance) {
    var isPausedByBrowserTabSwitch = false;

    function onBrowserTabFocus() {
      if (isPausedByBrowserTabSwitch) {
        isPausedByBrowserTabSwitch = false;
        playerInstance.play();
        playerInstance.trigger("playerResumedByBrowserTabSwitch");
      }
    }

    function onBrowserTabBlur() {
      if (playerInstance.getState() === "playing") {
        isPausedByBrowserTabSwitch = true;
        playerInstance.pause();
        playerInstance.trigger("playerPausedByBrowserTabSwitch");
      }
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        onBrowserTabBlur();
      } else {
        onBrowserTabFocus();
      }
    });
  }

  function wikiaJWPlayerTracking(playerInstance, willAutoplay, tracker) {
    var eventName = "videoplayerevent",
        gaCategory = tracker.category || "featured-video",
        onScroll = false,
        percentPlayed = 0;

    function updateVideoCustomDimensions(currentVideo) {
      if (typeof tracker.setCustomDimension !== "function") {
        return;
      }

      tracker.setCustomDimension(34, currentVideo.mediaid);
      tracker.setCustomDimension(35, currentVideo.title);
      tracker.setCustomDimension(36, currentVideo.tags);
    }

    function addTrackingPixel(id, url) {
      var mountedPixel = document.getElementById(id);

      if (mountedPixel) {
        mountedPixel.parentElement.removeChild(mountedPixel);
      }

      var img = document.createElement("img");
      img.src = url;
      img.id = id;
      document.body.appendChild(img);
    }

    function trackComscoreVideoMetrix() {
      if (!tracker.comscore) {
        return;
      }

      var pixelID = "comscoreVideoMetrixTrack",
          url = "https://sb.scorecardresearch.com/p?C1=1&C2=6177433&C5=04";
      addTrackingPixel(pixelID, url);
    }

    function trackCustomPixel(pixelURL) {
      if (pixelURL) {
        addTrackingPixel("wikiaJWPlayerCustomPixel", pixelURL);
      }
    }

    function track(gaData) {
      if (!gaData.label) {
        throw new Error("No tracking label provided");
      }

      var trackingData = {
        action: gaData.action || "click",
        category: gaCategory,
        label: gaData.label,
        value: Number(playerInstance.getMute()),
        eventName: eventName,
        videoId: playerInstance.getPlaylistItem().mediaid,
        player: "jwplayer",
        onScroll: onScroll,
        trackingMethod: "analytics"
      };
      tracker.track(trackingData);
    }

    if (typeof tracker.setCustomDimension === "function") {
      tracker.setCustomDimension(37, willAutoplay ? "Yes" : "No");
    }

    playerInstance.once("ready", function () {
      updateVideoCustomDimensions(playerInstance.getPlaylistItem());
      track({
        label: "load",
        action: "impression"
      });
    });
    playerInstance.on("relatedVideoImpression", function () {
      track({
        label: "recommended-video",
        action: "impression"
      });
    });
    playerInstance.on("relatedVideoPlay", function (data) {
      updateVideoCustomDimensions(data.item);
      var labelPrefix = data.auto ? "recommended-video-autoplay" : "recommended-video-select-" + data.position;
      track({
        label: labelPrefix,
        action: "impression"
      });
      track({
        label: "recommended-video-depth-" + data.depth,
        action: "impression"
      });
      trackComscoreVideoMetrix();
      trackCustomPixel(data.item.pixel);
    });
    playerInstance.on("videoResumed", function (data) {
      if (data.playReason === "interaction") {
        track({
          label: "play-resumed"
        });
      }
    });
    playerInstance.on("playerStart", function (data) {
      var gaData = data.auto ? {
        label: "autoplay-start",
        action: "impression"
      } : {
        label: "user-start"
      };
      track(gaData);
      trackComscoreVideoMetrix();
      trackCustomPixel(tracker.pixel);
    });
    playerInstance.on("pause", function (data) {
      if (data.pauseReason === "interaction") {
        track({
          label: "paused"
        });
      }
    });
    playerInstance.on("firstUnmute", function () {
      track({
        label: "unmuted"
      });
    });
    playerInstance.on("videoPercentPlayed", function (data) {
      percentPlayed = data.value;
      track({
        label: "played-percentage-" + percentPlayed,
        action: "view"
      });
    });
    playerInstance.on("complete", function () {
      track({
        label: "completed",
        action: "impression"
      });
    });
    playerInstance.on("onScrollStateChanged", function (data) {
      if (data.state === "closed") {
        track({
          label: "played-percentage-" + percentPlayed,
          action: "close"
        });
      }

      onScroll = data.state === "active";
      tracker.setCustomDimension(38, onScroll ? "Yes" : "No");
    });
    playerInstance.on("videoFeedbackImpression", function () {
      track({
        label: "feedback",
        action: "impression"
      });
    });
    playerInstance.on("videoFeedbackThumbUp", function () {
      track({
        label: "feedback-thumb-up",
        action: "click"
      });
    });
    playerInstance.on("videoFeedbackThumbDown", function () {
      track({
        label: "feedback-thumb-down",
        action: "click"
      });
    });
    playerInstance.on("videoFeedbackClosed", function () {
      track({
        label: "feedback",
        action: "close"
      });
    });
    playerInstance.on("autoplayToggle", function (data) {
      track({
        label: "autoplay-" + (data.enabled ? "enabled" : "disabled")
      });
    });
    playerInstance.on("captionsSelected", function (data) {
      track({
        label: "language-selected-" + data.selectedLang.toLowerCase()
      });
    });
    playerInstance.on("watermarkClicked", function (data) {
      track({
        label: "watermark-fandom"
      });
    });
    playerInstance.on("wikiaShareMenuExpanded", function (data) {
      track({
        label: "share"
      });
    });
    playerInstance.on("socialNetworkClicked", function (data) {
      track({
        action: "share",
        label: data.socialNetwork
      });
    });
    playerInstance.on("playerResumedByBrowserTabSwitch", function () {
      track({
        action: "view",
        label: "player-resumed-by-browser-tab-switch"
      });
    });
    playerInstance.on("playerPausedByBrowserTabSwitch", function () {
      track({
        action: "view",
        label: "player-paused-by-browser-tab-switch"
      });
    });
  }

  function WikiaJWPlayerWatermarkPlugin(player, config, div) {
    this.player = player;
    this.container = div;
    this.config = config;
    this.watermarkElement = this.getWatermarkElement();
    this.watermarkElement.addEventListener("click", function () {
      player.trigger("watermarkClicked");
    });
    this.container.classList.add("wikia-watermark-container");
    this.container.appendChild(this.watermarkElement);
    this.isEnabled = !!this.player.getPlaylistItem(0).watermark;
    this.player.on("play", this.update.bind(this));
    this.player.on("pause", this.update.bind(this));
    this.player.on("idle", this.update.bind(this));
    this.player.on("relatedVideoPlay", this.onVideoChange.bind(this));
  }

  WikiaJWPlayerWatermarkPlugin.prototype.getWatermarkElement = function () {
    var watermarkImage = wikiaJWPlayerIcons["fandomLogo"];
    var watermarkElement = document.createElement("a");
    watermarkElement.classList.add("wikia-watermark");
    watermarkElement.innerHTML = watermarkImage;
    watermarkElement.href = "https://fandom.com";
    return watermarkElement;
  };

  WikiaJWPlayerWatermarkPlugin.prototype.update = function () {
    if (this.isEnabled && this.player.getState() === "playing") {
      this.container.style.display = "block";
    } else {
      this.container.style.display = "";
    }
  };

  WikiaJWPlayerWatermarkPlugin.prototype.onVideoChange = function (data) {
    this.isEnabled = !!data.item.watermark;
    this.update();
  };

  WikiaJWPlayerWatermarkPlugin.register = function () {
    jwplayer().registerPlugin("wikiaWatermark", "8.0.0", WikiaJWPlayerWatermarkPlugin);
  };

  function wikiaJWPlayerSharingPlugin(player, config, div) {
    this.player = player;
    this.container = div;
    this.wikiaSharingElement = document.createElement("div");
    this.buttonID = "wikiaSharing";
    this.config = config;
    this.documentClickHandler = this.documentClickHandler.bind(this);
    this.isDocumentHandlerMounted = false;
    this.container.classList.add("wikia-jw__plugin");
    this.wikiaSharingElement.classList.add("wikia-jw");
    this.wikiaSharingElement.classList.add("wikia-jw-sharing");
    this.addSharingContent(this.wikiaSharingElement);
    this.container.appendChild(this.wikiaSharingElement);
  }

  wikiaJWPlayerSharingPlugin.prototype.isSharingMenuOrSharingButton = function (element) {
    var button = this.getSharingButtonElement();
    return button && (button === element || button.contains(element) || this.wikiaSharingElement === element || this.wikiaSharingElement.contains(element));
  };

  wikiaJWPlayerSharingPlugin.prototype.getSharingButtonElement = function () {
    return this.player.getContainer().querySelector("[button=" + this.buttonID + "]");
  };

  wikiaJWPlayerSharingPlugin.prototype.documentClickHandler = function (event) {
    if (!this.isSharingMenuOrSharingButton(event.target) && this.container.style.display && this.isDocumentHandlerMounted) {
      document.removeEventListener("click", this.documentClickHandler);
      document.removeEventListener("touchend", this.documentClickHandler);
      this.isDocumentHandlerMounted = false;
      this.close();
    }
  };

  wikiaJWPlayerSharingPlugin.prototype.addButton = function () {
    var sharingIcon = createSVG(wikiaJWPlayerIcons.sharing);
    sharingIcon.classList.add("jw-svg-icon");
    sharingIcon.classList.add("jw-svg-icon-wikia-sharing");
    this.player.addButton(sharingIcon.outerHTML, this.config.i18n.sharing, function (evt) {
      if (!this.wikiaSharingElement.style.display) {
        this.open(evt.currentTarget);
        setTimeout(function () {
          if (!this.isDocumentHandlerMounted) {
            document.addEventListener("click", this.documentClickHandler);
            document.addEventListener("touchend", this.documentClickHandler);
            this.isDocumentHandlerMounted = true;
          }
        }.bind(this), 0);
      }
    }.bind(this), this.buttonID, "wikia-jw-button");
  };

  wikiaJWPlayerSharingPlugin.prototype.removeButton = function () {
    this.player.removeButton(this.buttonID);
  };

  wikiaJWPlayerSharingPlugin.prototype.close = function () {
    var playerContainer = this.player.getContainer();
    this.container.style.display = null;
    playerContainer.classList.remove("wikia-jw-open");
    playerContainer.querySelector(".wikia-jw-button__open").classList.remove("wikia-jw-button__open");
  };

  wikiaJWPlayerSharingPlugin.prototype.open = function (button) {
    this.wikiaSharingElement.innerHTML = "";
    this.wikiaSharingElement.appendChild(this.createSharingListElement());
    showElement(this.container);
    this.player.trigger("wikiaShareMenuExpanded");
    this.player.getContainer().classList.add("wikia-jw-open");
    button.classList.add("wikia-jw-button__open");
  };

  wikiaJWPlayerSharingPlugin.prototype.hide = function () {
    this.close();
    this.removeButton();
  };

  wikiaJWPlayerSharingPlugin.prototype.show = function () {
    if (!this.getSharingButtonElement()) {
      this.addButton();
    }
  };

  wikiaJWPlayerSharingPlugin.prototype.addSharingContent = function (div) {
    div.classList.add("wikia-jw");
    div.classList.add("wikia-jw-sharing");
    div.classList.remove("jw-reset");
    div.classList.remove("jw-plugin");
    this.show();
  };

  wikiaJWPlayerSharingPlugin.prototype.createSharingListElement = function () {
    var sharingList = document.createElement("ul");
    sharingList.className = "wikia-jw__list wds-list";
    var userLang = this.getUserLang(),
        socialNetworks = this.socialNetworks[userLang];

    if (socialNetworks) {
      socialNetworks.forEach(function (socialNetwork) {
        sharingList.appendChild(this.getSocialNetworkButton(socialNetwork));
      }.bind(this));
    }

    return sharingList;
  };

  wikiaJWPlayerSharingPlugin.prototype.getSocialNetworkButton = function (socialNetwork) {
    var button = document.createElement("button");
    button.className = "wds-is-square wds-is-" + socialNetwork + "-color wds-button";
    button.appendChild(createSVG(wikiaJWPlayerIcons[socialNetwork]));
    button.addEventListener("click", function () {
      this.player.trigger("socialNetworkClicked", {
        socialNetwork: socialNetwork
      });
      window.open(this[socialNetwork]());
    }.bind(this));
    return button;
  };

  wikiaJWPlayerSharingPlugin.prototype.getUserLang = function () {
    return (window.navigator.userLanguage || window.navigator.language).slice(0, 2);
  };

  wikiaJWPlayerSharingPlugin.prototype.socialNetworks = {
    en: ["facebook", "twitter", "reddit", "tumblr"],
    ja: ["facebook", "twitter", "google", "line"],
    "pt-br": ["facebook", "twitter", "reddit", "tumblr"],
    zh: ["facebook", "weibo"],
    de: ["facebook", "twitter", "tumblr"],
    fr: ["facebook", "twitter"],
    es: ["facebook", "twitter", "meneame", "tumblr"],
    ru: ["vkontakte", "facebook", "odnoklassniki", "twitter"],
    pl: ["facebook", "twitter", "nk", "wykop"]
  };

  wikiaJWPlayerSharingPlugin.prototype.getVideoPageUrl = function () {
    console.log(this.player.getPlaylistItem());
    return "https://fandom.wikia.com/video/" + this.player.getPlaylistItem().mediaid;
  };

  wikiaJWPlayerSharingPlugin.prototype.getVideoTitle = function () {
    return this.player.getPlaylistItem().title;
  };

  wikiaJWPlayerSharingPlugin.prototype.line = function () {
    return "http://line.me/R/msg/text/?" + encodeURIComponent(this.getVideoTitle() + " " + this.getVideoPageUrl());
  };

  wikiaJWPlayerSharingPlugin.prototype.facebook = function () {
    return "http://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(this.getVideoPageUrl());
  };

  wikiaJWPlayerSharingPlugin.prototype.twitter = function () {
    return "https://twitter.com/share?url=" + encodeURIComponent(this.getVideoPageUrl());
  };

  wikiaJWPlayerSharingPlugin.prototype.google = function () {
    return "https://plus.google.com/share?url=" + encodeURIComponent(this.getVideoPageUrl());
  };

  wikiaJWPlayerSharingPlugin.prototype.reddit = function () {
    return "http://www.reddit.com/submit?url=" + encodeURIComponent(this.getVideoPageUrl()) + "&title=" + encodeURIComponent(this.getVideoTitle());
  };

  wikiaJWPlayerSharingPlugin.prototype.tumblr = function () {
    return "http://www.tumblr.com/share/link?url=" + encodeURIComponent(this.getVideoPageUrl()) + "&name=" + encodeURIComponent(this.getVideoTitle());
  };

  wikiaJWPlayerSharingPlugin.prototype.weibo = function () {
    return "http://service.weibo.com/share/share.php?url=" + encodeURIComponent(this.getVideoPageUrl()) + "&title=" + encodeURIComponent(this.getVideoTitle());
  };

  wikiaJWPlayerSharingPlugin.prototype.vkontakte = function () {
    return "http://vk.com/share.php?url=" + encodeURIComponent(this.getVideoPageUrl()) + "&title=" + encodeURIComponent(this.getVideoTitle());
  };

  wikiaJWPlayerSharingPlugin.prototype.odnoklassniki = function () {
    return "http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1&st._surl=" + encodeURIComponent(this.getVideoPageUrl());
  };

  wikiaJWPlayerSharingPlugin.prototype.nk = function () {
    return "http://nk.pl/sledzik?shout=" + encodeURIComponent(this.getVideoPageUrl());
  };

  wikiaJWPlayerSharingPlugin.prototype.wykop = function () {
    return "http://www.wykop.pl/dodaj/link/" + "?url=" + encodeURIComponent(this.getVideoPageUrl()) + "&title=" + encodeURIComponent(this.getVideoTitle());
  };

  wikiaJWPlayerSharingPlugin.prototype.meneame = function () {
    return "https://www.meneame.net/submit.php?url=" + encodeURIComponent(this.getVideoPageUrl());
  };

  wikiaJWPlayerSharingPlugin.register = function () {
    jwplayer().registerPlugin("wikiaSharing", "8.0.0", wikiaJWPlayerSharingPlugin);
  };
})(typeof wikiaJWPlayer == "undefined" ? wikiaJWPlayer = {} : wikiaJWPlayer);
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62747" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","wikiajwplayer.js"], null)
//# sourceMappingURL=/wikiajwplayer.10883f40.map