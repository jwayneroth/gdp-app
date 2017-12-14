<template>
	<div class="audio-controls-wrapper">
		<div class="inner">
			<b-btn-toolbar class="toolbar d-flex align-items-end">
				<b-button-group class="play-wrapper mx-2 mb-3">
					<b-btn @click="onPrevClick" :disabled="onPrevClick === null"><span :class="[ paused ? 'active' : '', 'fa-backward', 'fa']"/></b-btn>
					<b-btn @click="pause"><span :class="[paused ? 'fa-play' : 'fa-pause', 'fa']"/></b-btn>
					<b-btn @click="onNextClick" :disabled="onNextClick === null"><span :class="[ paused ? 'active' : '', 'fa-forward', 'fa']"/></b-btn>
				</b-button-group>
				<div class="progress-wrapper mx-2 mb-3">
					<div class="mb-1">
						<span class="track-title">{{title ? title : '&nbsp;'}}</span>
					</div>
					<b-btn @click="setPosition" class="playback-time-wrapper mb-1">
						<div :style="progressStyle" class="playback-time-indicator"></div>
					</b-btn>
					<div>
						<span class="time-current">{{currentTime}}</span>
						<span class="time-separator">:</span>
						<span class="time-total">{{duration}}</span>
					</div>
				</div>
				<b-button-group class="volume-wrapper mx-2 mb-3">
					<b-btn class="mute-btn" @click="toggleMute">
						<span :class="[isMuted ? 'fa-volume-off': 'fa-volume-up', 'fa']"/>
					</b-btn>
					<!--<a @click="download()" class="fa fa-download"></a>-->
					<div class="volume-bars"><span v-for="n in 5" @click="setVolume(n)" class=""/></div>
				</b-button-group>
			</b-btn-toolbar>
		</div>
		<audio v-bind:id="playerId" ref="audiofile" :src="file" preload="auto" style="display:none;"></audio>
	</div>
</template>

<script>

let audio, uuid;
const generateUUID = () => {
	return 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, function(c) {
		let v, r;
		r = Math.random() * 16 | 0; v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	})
};
const convertTimeHHMMSS = (val) => {
	let hhmmss = new Date(val * 1000).toISOString().substr(11, 8);
	return (hhmmss.indexOf('00:') === 0) ? hhmmss.substr(3) : hhmmss;
};

export default {
	name: 'audio-controls',
	props: {
		title: { type: String, default: null },
		file: { type: String, default: null },
		autoPlay: { type: Boolean, default: false },
		onAudioEnded: { type: Function, default: null },
		onPrevClick: { type: Function, default: null },
		onNextClick: { type: Function, default: null },
		onEmptyPlay: { type: Function, default: () => null },
	},
	computed: {
		duration: function() {
			return this.audio ? convertTimeHHMMSS(this.totalDuration) : ''
		},
		playerId: function() {
			return 'player-' + this.uuid
		},
	},
	data () {
		return {
			isMuted: false,
			loaded: false,
			playing: false,
			paused: true,
			progressStyle: '',
			currentTime: '00:00',
			uuid: '0',
			audio: undefined,
			volumeBars: null,
			totalDuration: 0,
			volumeDiv: 3,
		}
	},
	methods: {
		setPosition: function name (e) {
			const tag = e.target;
			if (!this.file) return;
			//if (this.paused) return;
			//if (e.target.tagName === 'SPAN') return;
			const pos = tag.getBoundingClientRect();
			const seekPos = (e.clientX - pos.left) / pos.width;
			this.audio.currentTime = parseInt(this.audio.duration * seekPos);
		},
		toggleMute: function() {
			this.isMuted = !this.isMuted;
			if (this.isMuted) {
				this.audio.volume = 0;
				this.updateVolumeBars(0);
			} else  {
				this.audio.volume = this.volumeDiv * 20 / 100;
				this.updateVolumeBars(this.volumeDiv);
			}
		},
		setVolume: function(div) {
			this.audio.volume = div * 20 / 100;
			this.volumeDiv = div;
			this.updateVolumeBars(div);
		},
		updateVolumeBars: function(div) {
			this.volumeBars.forEach((bar, idx) => {
				bar.className = (idx <= (div - 1)) ? 'active' : '';
			});
		},
		stop: function() {
			this.playing = false;
			this.paused = true;
			this.audio.pause();
			this.audio.currentTime = 0;
		},
		play: function(force = false) {
			console.log('AudioControls::play');
			if (this.playing && !force) return;
			this.paused = false;
			this.audio.play();
			this.playing = true;
		},
		pause: function() {
			console.log('AudioControls::pause');
			if (!this.file) {
				console.log('play called without file!');
				this.onEmptyPlay();
				return;
			}
			this.paused = !this.paused;
			(this.paused) ? this.audio.pause() : this.audio.play();
		},
		download: function() {
			this.stop();
			window.open(this.file, 'download');
		},
		_handleLoaded: function() {
			if (this.audio.readyState >= 2) {
				if (this.autoPlay) {
					this.play(true);
				}
				this.loaded = true
				this.totalDuration = parseInt(this.audio.duration)
			} else {
				throw new Error('Failed to load sound file')
			}
		},
		_handlePlayingUI: function(e) {
			let currTime = parseInt(this.audio.currentTime);
			let percentage = parseInt((currTime / this.totalDuration) * 100);
			this.progressStyle = `width:${percentage}%;`;
			this.currentTime = convertTimeHHMMSS(currTime);
		},
		_handlePlayPause: function(e) {
			if (e.type === 'pause' && this.playing === false) {
				this.progressStyle = `width:0%;`;
				this.currentTime = '00:00';
				this.paused = true;
			}
		},
		_handleEnded: function(e) {
			this.paused = true;
			this.playing = false;
			this.$props.onAudioEnded();
		},
		init: function() {
			this.audio.addEventListener('timeupdate', this._handlePlayingUI);
			this.audio.addEventListener('loadeddata', this._handleLoaded);
			this.audio.addEventListener('pause', this._handlePlayPause);
			this.audio.addEventListener('play', this._handlePlayPause);
			this.audio.addEventListener('ended', this._handleEnded);
		},
	},
	mounted: function() {
		console.log('AudioControls::mounted', this.file);
		this.uuid = generateUUID();
		this.audio = this.$el.querySelectorAll('audio')[0];
		this.volumeBars = this.$el.querySelectorAll('.volume-bars > span');
		this.setVolume(this.volumeDiv);
		this.init();
	},
	beforeDestroy: function() {
		this.audio.removeEventListener('timeupdate', this._handlePlayingUI);
		this.audio.removeEventListener('loadeddata', this._handleLoaded);
		this.audio.removeEventListener('pause', this._handlePlayPause);
		this.audio.removeEventListener('play', this._handlePlayPause);
	}
}
</script>

<style lang="scss">

@import "../assets/scss/variables.scss";

.audio-controls-wrapper {
	
	.toolbar {
		> div {}
		
		.btn {
			height: 36px;
			min-width: 32px;
			box-shadow: none !important;
			outline: none;
		}
		
		.progress-wrapper {
			width: 160px;
			overflow: hidden;
			font-size: .7rem;
			
			.track-title {
				max-width: 90px;
				white-space: nowrap;
			}
			
			.playback-time-wrapper {
				background: transparent;
				position: relative;
				left: 0; top: 0;
				width: 100%;
				display: inline-block;
				height: 3px;
				cursor: pointer;
		
				.playback-time-indicator {
					background: $blue;
					position: absolute;
					top: 0;
					left: 0;
					bottom: 0;
				}
			}
		}
		
		.volume-wrapper {
			.volume-bars {
				height: 36px;
				
				$bar_width: 8px;
				$bar_padding: 2px;
				
				background-color: #eeeeff;
				border: 1px solid $blue;
				border-radius: 0 .25rem .25rem 0;
				
				position: relative;
				left: 0; top: 0;
				width: ($bar_width + $bar_padding) * 5 + $bar_padding * 4;
				
				span {
					display: block;
					position: absolute;
					left: 0; bottom: 0;
					width: $bar_width;
					background-color: $blue;
					opacity: .3;
					cursor: pointer;
					
					&:hover,
					&.active {
						opacity: 1;
					}
					
					@for $i from 1 through 5 {
						&:nth-child(#{$i}) {
							height: $i * 6px;
							left: $i * ($bar_width + $bar_padding) - ($bar_width - $bar_padding);
						}
					}
				}
			}
		}
	}
}
</style>
