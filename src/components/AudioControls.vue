<template>
	<div class="audio-controls-wrapper">
		<div class="inner">
			<b-btn-toolbar class="toolbar">
				<b-button-group class="play-wrapper mx-2">
					<!--<b-btn @click="stop()"><span class="fa fa-stop"/></b-btn>-->
					<b-btn @click="onPrevClick"><span :class="[ paused ? 'active' : '', 'fa-backward', 'fa']"/></b-btn>
					<b-btn @click="pause()"><span :class="[ paused ? 'fa-play' : 'fa-pause', 'fa']"/></b-btn>
					<b-btn @click="onNextClick"><span :class="[ paused ? 'active' : '', 'fa-forward', 'fa']"/></b-btn>
				</b-button-group>
				<div class="progress-wrapper mx-2">
					<div>
						<span v-if="track">{{track.title}}</span>&nbsp;<span class="time-current">{{currentTime}}</span><span class="time-separator">:</span><span class="time-total">{{duration}}</span>
					</div>
					<b-btn v-on:click="setPosition" class="playback-time-wrapper">
						<div v-bind:style="progressStyle" class="playback-time-indicator"></div>
					</b-btn>
				</div>
				<b-input-group class="vol-wrapper mx-2">
					<b-btn @click="mute()"><span :class="[isMuted ? 'fa-volume-off': 'fa-volume-up', 'fa']"/></b-btn>
					<!--<a @click="download()" class="fa fa-download"></a>-->
					<b-form-input type="range" v-model.lazy="volumeValue" v-on:change="updateVolume()" min="0" max="100" class="mx-1"/>
				</b-input-group>
			</b-btn-toolbar>
		</div>
		<audio v-bind:id="playerId" ref="audiofile" :src="file" preload="auto" style="display:none;"></audio>
	</div>
</template>

<script>

let audio, uuid;
const baseVolumeValue = 75;
const generateUUID = () => {
	return 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, function (c) {
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
		track: { type: Object, default: null },
		file: { type: String, default: null },
		autoPlay: { type: Boolean, default: false },
		onAudioEnded: { type: Function, default: null },
		onPrevClick: { type: Function, default: null },
		onNextClick: { type: Function, default: null },
	},
	computed: {
		duration: function () {
			return this.audio ? convertTimeHHMMSS(this.totalDuration) : ''
		},
		playerId: function () {
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
			totalDuration: 0,
			volumeValue: baseVolumeValue
		}
	},
	methods: {
		setPosition: function name (e) {
			let tag = e.target;
			if (this.paused) return;
			if (e.target.tagName === 'SPAN') return;
			const pos = tag.getBoundingClientRect();
			const seekPos = (e.clientX - pos.left) / pos.width;
			this.audio.currentTime = parseInt(this.audio.duration * seekPos);
		},
		updateVolume: function () {
			this.audio.volume = this.volumeValue / 100;
			if (this.volumeValue / 100 > 0) {
				this.isMuted = this.audio.muted = false;
			}
			if (this.volumeValue / 100 === 0) {
				this.isMuted = this.audio.muted = true;
			}
		},
		stop: function () {
			this.playing = false;
			this.paused = true;
			this.audio.pause();
			this.audio.currentTime = 0;
		},
		play: function (force = false) {
			if (this.playing && !force) return;
			this.paused = false;
			this.audio.play();
			this.playing = true;
		},
		pause: function () {
			this.paused = !this.paused;
			(this.paused) ? this.audio.pause() : this.audio.play();
		},
		download: function () {
			this.stop();
			window.open(this.file, 'download');
		},
		mute: function () {
			this.isMuted = !this.isMuted;
			this.audio.muted = this.isMuted;
			this.volumeValue = this.isMuted ? 0 : 75;
		},
		_handleLoaded: function () {
			if (this.audio.readyState >= 2) {
				if (this.autoPlay) {
					this.play(true);
					//this.audio.play()
				}
				this.loaded = true
				this.totalDuration = parseInt(this.audio.duration)
			} else {
				throw new Error('Failed to load sound file')
			}
		},
		_handlePlayingUI: function (e) {
			let currTime = parseInt(this.audio.currentTime);
			let percentage = parseInt((currTime / this.totalDuration) * 100);
			this.progressStyle = `width:${percentage}%;`;
			this.currentTime = convertTimeHHMMSS(currTime);
		},
		_handlePlayPause: function (e) {
			if (e.type === 'pause' && this.playing === false) {
				this.progressStyle = `width:0%;`;
				this.currentTime = '00:00';
				this.paused = true;
			}
		},
		init: function () {
			this.audio.addEventListener('timeupdate', this._handlePlayingUI);
			this.audio.addEventListener('loadeddata', this._handleLoaded);
			this.audio.addEventListener('pause', this._handlePlayPause);
			this.audio.addEventListener('play', this._handlePlayPause);
			this.audio.addEventListener('ended', this.$props.onAudioEnded);
		},
		getAudio: function () {
			return this.$el.querySelectorAll('audio')[0];
		}
	},
	mounted: function () {
		console.log('AudioControls::mounted');
		this.uuid = generateUUID();
		this.audio = this.getAudio();
		this.init();
	},
	beforeDestroy: function () {
		this.audio.removeEventListener('timeupdate', this._handlePlayingUI);
		this.audio.removeEventListener('loadeddata', this._handleLoaded);
		this.audio.removeEventListener('pause', this._handlePlayPause);
		this.audio.removeEventListener('play', this._handlePlayPause);
	}
}
</script>

<style lang="scss">
@import "../assets/scss/variables.scss";

/*.audio-controls-wrapper {
	.inner {
		height: 30px;
		line-height: 30px;
		
		a {
			cursor: pointer;
			display: inline-block;
			vertical-align: middle;
		}
		
		.extern-wrapper {
			display: inline-block;
			margin-left: 10px;

			> a {
				margin-right: 5px;
				vertical-align: 0;
			}

			.volume-toggle {
				position: relative;

				.volume-slider {
					cursor: pointer;
					position: absolute;
					top: 0;
					width: 80px;
					left: 24px;
				}
			}
		}
	}
}*/

.audio-controls-wrapper {
	
	.toolbar {
		> div {
		}
		
		.progress-wrapper {
			min-width: 200px;
		}
		
		.vol-wrapper {
			max-width: 150px;
		}
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
</style>
