
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd');

const player = $('.player')
const playlist = $('.playlist')
const playbtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Money Trees",
            singer: "Kendrick Lamar",
            path: "./assets/music/song1.mp3",
            image: "./assets/img/song1.png",
        },
        {
            name: "See you again",
            singer: "Tyler the Creator",
            path: "./assets/music/song2.mp3",
            image: "./assets/img/song2.png",
        },
        {
            name: "Quicksand",
            singer: "Morray",
            path: "./assets/music/song3.mp3",
            image: "./assets/img/song3.png",
        },
        {
            name: "The Hills",
            singer: "The Weeknd",
            path: "./assets/music/song4.mp3",
            image: "./assets/img/song4.png",
        },
        {
            name: "The Hills",
            singer: "The Weeknd",
            path: "./assets/music/song4.mp3",
            image: "./assets/img/song4.png",
        },
        {
            name: "The Hills",
            singer: "The Weeknd",
            path: "./assets/music/song4.mp3",
            image: "./assets/img/song4.png",
        },
        {
            name: "The Hills",
            singer: "The Weeknd",
            path: "./assets/music/song4.mp3",
            image: "./assets/img/song4.png",
        },
    ],

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div
            class="thumb"
            style="
                background-image: url('${song.image}');
            "
            ></div>
            <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
            </div>
            <div class="option">
            <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>`;
        })
        playlist.innerHTML = htmls.join('\n')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvent: function () {
        const cdWidth = cd.offsetWidth;
        const _this = this

        document.onscroll = function () {
            const scrollTop = window.screenY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý CD rotate
        const cdAnimationRotate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdAnimationRotate.pause();

        // Xử lí khi play/pause
        playbtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdAnimationRotate.play();

        }
        // Khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdAnimationRotate.pause();

        }

        // Xử lí tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent
            }
        }

        // Xử lí khi tua bài hát
        progress.onchange = function (e) {
            const seekTime = (audio.duration / 100 * audio.currentTime);
            audio.currentTime = seekTime;
        }
        // next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {

                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();

        }

        //random song mode  
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        //repeat song
        repeatBtn.onclick = function () {
            _this.repeatBtn = !_this.repeatBtn;
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // next song when audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // xử lí hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadcurrentSong();
                    audio.play();
                    _this.render();
                }
            }
        }

    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }, 300)
    },
    loadcurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadcurrentSong();
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex <= 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadcurrentSong();
    },

    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadcurrentSong();
    },


    start: function () {
        //Định nghĩa lại các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe và xử lý các sự kiện (DOM event)
        this.handleEvent();

        //Tải thông tin bài hát đầu tiên lên UI khi chạy ứng dụng
        this.loadcurrentSong();

        // Render playlist
        this.render();
    },
};
app.start();
