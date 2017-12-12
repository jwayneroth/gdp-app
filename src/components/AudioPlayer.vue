<template>
	<div id="audio-player">
		<div class="row">
			<div class="col-sm-9">
				<h3>Audio Player</h3>
			</div>
			<div class="col-sm-3">
				<b-btn v-if="tracks.length" v-on:click="onEmptyClick">empty playlist</b-btn>
			</div>
		</div>
		<audio-controls :file="currentFile" :autoPlay="true" :onAudioEnded="onAudioEnded" />
		<p v-if="!tracks.length">add some tracks below to start listening!</p>
		<table class="table draggable-table">
			<draggable
				id="playlist"
				v-model="tracks"
				:element="'tbody'"
				:class="playlistClass"
				:options="{group: 'tracks'}"
				@start="drag=true"
				@end="drag=false"
				:move="onDragMove">
				<tr v-for="(t, idx) in tracks" :class="[(t.id === currentTrackId) ? 'active' : '', 'track']">
					<td>
						<audio preload="auto" :src="t.file" style="display: none;" @canplaythrough="onAudioLoaded(t)" />
						<span class="title" v-on:click="onTrackClick(t)">{{t.title}}</span>
					</td>
					<td>{{secondsFormatted(t.length)}}</td>
					<td><b-btn @click="onRemoveClick(t)"><span class="fa fa-minus"></span></b-btn></td>
					<td v-if="user.logged_in">
						<input type="checkbox" :name="t.id" :checked="t.is_checked" v-on:click="toggleChecklist">
					</td>
					<td v-if="user.logged_in">
						<input type="checkbox" :name="t.id" :checked="t.is_favorite" v-on:click="toggleFavorite">
					</td>
				</tr>
			</draggable>
		</table>
	</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex';
import draggable from 'vuedraggable';

import AudioTrack from './AudioTrack.vue';
import AudioControls from './AudioControls.vue';

export default {
	components: {
		draggable,
		AudioTrack,
		AudioControls
	},
	data: function () {
		return {
			currentTrackId: null,
			currentTrack: null,
			currentFile: null,
			//playFile: false,
		}
	},
	computed: {
		...mapState({
			user: 'user',
			track_stars: state => state.user.track_stars,
			track_checks: state => state.user.track_checks,
			track_ids: state => state.playlist.track_ids,
			tracks_by_id: state => state.playlist.tracks_by_id,
		}),
		tracks: {
			get() {
				let tracks = this.track_ids.map((t) => Object.assign({},this.tracks_by_id[t]));
				if (this.user.logged_in) {
					tracks.forEach((val) => {
						val.is_favorite = (this.track_stars.indexOf(val.id) !== -1);
						val.is_checked = (this.track_checks.indexOf(val.id) !== -1);
					});
				}
				return tracks;
			},
			set(val) {
				this.$store.commit('UPDATE_PLAYLIST', {tracks: val})
			}
		},
		playlistClass: function() {
			let c = '';
			if (!this.tracks.length) c += ' empty';
			return c;
		},
	},
	methods: {
		secondsFormatted: function(secs) {
			const m = Math.floor(secs/60);
			const s = '0' + (secs - m * 60);
			return m + ':' + s.substr(s.length - 2);
		},
		
		onEmptyClick: function() {
			this.$store.commit('EMPTY_PLAYLIST')
		},
		
		onTrackClick: function (t) {
			console.log('AudioPlayer::onTrackClick', t);
			
			//const player = this.$refs.player;
			
			this.currentTrackId = t.id;
			//this.playFile = true;
			this.currentFile = t.file;
			
			//player.src = t.file;
			//player.play();
		},
		
		onRemoveClick: function (t) {
			console.log('AudioPlayer::onRemoveClick', t);
			
			if (t.id === this.currentTrackId) {
				this.$refs.player.pause();
				this.currentTrackId = null;
			}
			this.$store.commit('REMOVE_TRACK', {track_id: t.id})
		},
		
		onAudioEnded: function (e) {
			console.log('AudioPlayer::onAudioEnded'); //, this.track_ids);
			
			//const player = this.$refs.player;
			const curr_index = this.track_ids.indexOf(this.currentTrackId);
			
			console.log('curr_index: ' + (curr_index + 1) + ' of ' + this.track_ids.length);
			
			if ((curr_index + 1) <= (this.track_ids.length - 1)) {
				
				const next = this.tracks_by_id[this.track_ids[curr_index + 1]];
				
				console.log('next: ' + next.title);
				
				this.currentTrackId = next.id;
				this.currentFile = next.file;
				
				//player.src = next.file;
				//player.play();
				
			} else {
				console.log('no more tracks');
				this.currentTrackId = null;
				this.currentFile = null;
			}
		},
		
		onAudioLoaded: function(t) {
			console.log('track ' + t.id + ' loaded')
		},
		
		// prevent drag from playlist back to show
		onDragMove: function (evt) {
			//console.log('AudioPlayer::onDragMove', evt);
			if (evt.to.id !== 'playlist') return false;
		},
		
		toggleFavorite(evt) {
			console.log('toggleFavorite', evt.target.name);
			this.$store.dispatch('set_favorite_track', parseInt(evt.target.name));
		},
		
		toggleChecklist(evt) {
			console.log('toggleChecklist', evt.target.name);
			this.$store.dispatch('set_checklist_track', parseInt(evt.target.name));
		},
	},
	watch: {
		'tracks': function (new_tracks, old_tracks) {
			console.log('AudioPlayer tracks change');
		
		},
	},
	created: function () {
		console.log('AudioPlayer::created', this.track_ids);
	},
}
</script>

<style lang="scss">
@import "compass/css3";
@import "../assets/scss/variables.scss";

#audio-player {}

#playlist {
	min-height: 250px;
	margin: 0;
	padding: 0;
	padding-bottom: 3em;
	position: relative;
	left: 0; top: 0;
	
	&:after {
		content: '';
		display: table-row;
		height: 50px;
	}
	
	&.empty {
		&:after {
			display: table-row;
			height: 200px;
		}
	}
	
	.track {
		
		.title {
			display: block;
			cursor: pointer;
		}
		
		&.active {
			.title {
				color: $blue;
			}
		}
	}
}
</style>
