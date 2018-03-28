<template>
	<div id="audio-player">
		<div class="row">
			<div class="col-sm-9">
				<h3 class="pane-title">Audio Player</h3>
			</div>
		</div>
		<div class="d-flex flex-row align-items-start">
			<div>
				<audio-controls
					:title="currentTitle"
					:file="currentFile"
					:autoPlay="true"
					:onAudioEnded="onAudioEnded"
					:onNextClick="(!isLast) ? onNextClick : null"
					:onPrevClick="(!isFirst) ? onPrevClick : null"
					:onEmptyPlay="onEmptyPlay"
				/>
			</div>
			<div class="ml-auto">
				<b-btn v-if="tracks.length" v-on:click="onEmptyClick">empty playlist</b-btn>
			</div>
		</div>
		<playlist-helper v-if="!tracks.length" />
		<table class="table draggable-table">
			<draggable
				id="playlist"
				v-model="tracks"
				:element="'tbody'"
				:class="playlistClass"
				:options="{group: 'tracks',handle: '.handle'}"
				@start="drag=true"
				@end="drag=false"
				:move="onDragMove"
			>
				<tr
					v-for="(t, idx) in tracks"
					class="track"
					:class="(currentTrack && t.id === currentTrack.id) && 'active'"
				>
					<td>
						<audio v-if="shouldPreload(idx)" preload="auto" :src="t.file" style="display:none;" @canplaythrough="onAudioLoaded(t)" />
						<span class="title" v-on:click="onTrackClick(t)">{{t.title}}</span>
					</td>
					<td class="handle"><span class="fa fa-arrows"></span></td>
					<td>{{secondsFormatted(t.length)}}</td>
					<td>
						<b-btn variant="link" class="text-secondary" @click="onRemoveClick(t)">
							<span class="fa fa-minus"></span>
						</b-btn>
					</td>
					<td v-if="loggedIn">
						<checklist-checkbox
							:name="'check-track-' + t.id"
							:data-id="t.id"
							:initChecked="t.inList"
							:onClickCallback="addTrackToList"
							v-b-tooltip.hover title="save track to a list"
						/>
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
import PlaylistHelper from './PlaylistHelper.vue';
import ChecklistCheckbox from './ChecklistCheckbox';
import FavoriteCheckbox from './FavoriteCheckbox';

export default {
	components: {
		draggable,
		AudioTrack,
		AudioControls,
		PlaylistHelper,
		ChecklistCheckbox,
		FavoriteCheckbox
	},
	data: function () {
		return {
			currentTrack: null,
		}
	},
	computed: {
		
		...mapState({
			loggedIn: state => state.user.logged_in,
			track_ids: state => state.playlist.track_ids,
			tracks_by_id: state => state.playlist.tracks_by_id,
			listTracks: state => state.lists.trackIds,
		}),
		
		currentTitle: function() { return (this.currentTrack) ? this.currentTrack.title : null },
		
		currentFile: function() { return (this.currentTrack) ? this.currentTrack.file: null },
		
		isLast: function() {
			if (!this.currentTrack) return true;
			const idx = this.track_ids.indexOf(this.currentTrack.id);
			if (idx === (this.track_ids.length -1)) return true;
			return false;
		},
		
		isFirst: function() {
			if (!this.currentTrack) return true;
			const idx = this.track_ids.indexOf(this.currentTrack.id);
			if (idx === 0) return true;
			return false;
		},
		
		tracks: {
			get() {
				const tracks = this.track_ids.map((t) => Object.assign({},this.tracks_by_id[t]));
				if (this.loggedIn) {
					tracks.forEach((t) => {
						t.inList = (this.listTracks.indexOf(t.id) !== -1);
					});
					console.log('tracks with list check', tracks);
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
			this.$store.commit('EMPTY_PLAYLIST');
		},
		
		onTrackClick: function (t) {
			console.log('AudioPlayer::onTrackClick', t);
			
			this.currentTrack = t;
		},
		
		onNextClick: function() {
			if (!this.currentTrack) return;
			const curr_index = this.track_ids.indexOf(this.currentTrack.id);
			if ((curr_index + 1) <= (this.track_ids.length - 1)) {
				const next = this.tracks_by_id[this.track_ids[curr_index + 1]];
				this.currentTrack = next;
			}
		},
		
		onPrevClick: function() {
			if (!this.currentTrack) return;
			const curr_index = this.track_ids.indexOf(this.currentTrack.id);
			if (curr_index > 0) {
				const next = this.tracks_by_id[this.track_ids[curr_index - 1]];
				this.currentTrack = next;
			}
		},
		
		onRemoveClick: function (t) {
			console.log('AudioPlayer::onRemoveClick', t);
			
			if (this.currentTrack && t.id === this.currentTrack.id) {
				this.currentTrack = null;
			}
			this.$store.commit('REMOVE_TRACK', {track_id: t.id})
		},
		
		onAudioEnded: function (e) {
			console.log('AudioPlayer::onAudioEnded');
			
			if (!this.currentTrack) return;
			
			const curr_index = this.track_ids.indexOf(this.currentTrack.id);
			
			if ((curr_index + 1) <= (this.track_ids.length - 1)) {
				
				const next = this.tracks_by_id[this.track_ids[curr_index + 1]];
				this.currentTrack = next;
				
			} else {
				
				this.currentTrack = null;
			}
		},
		
		shouldPreload: function(idx) {
			if (process.env.NODE_ENV !== 'production') return false;
			
			if (!this.currentTrack) {
				if (idx < 2) return true;
				return false;
			}
			const curr_index = this.track_ids.indexOf(this.currentTrack.id);
			if (curr_index === idx) return false;
			if ((idx > curr_index) && (idx - curr_index < 3)) return true;
			return false;
		},
		
		onAudioLoaded: function(track) {
			console.log(track.title + ' : ' + track.id + ' loaded');
		},
		
		// prevent drag from playlist back to show
		onDragMove: function (evt) {
			if (evt.to.id !== 'playlist') return false;
		},
		
		addTrackToList: function(evt) {
			this.$store.dispatch('showModal', {
				modalType: 'ModalListAddCreate',
				modalProps: {
					mediaType: 'track',
					mediaId: parseInt(evt.target.getAttribute('data-id'))
				},
			});
		},
		
		onEmptyPlay: function() {
			console.log('AudioPlayer::onEmptyPlay', this.tracks.length, this.tracks_by_id);
			if (!this.tracks.length) return;
			this.onTrackClick(this.tracks_by_id[this.track_ids[0]]);
		},
	}
}
</script>

<style lang="scss">

</style>
