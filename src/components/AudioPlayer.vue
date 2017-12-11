<template>
	<div id="audio-player">
		<audio ref="player" id="player" v-on:ended="onAudioEnded" controls></audio>
		<h3>Audio Player</h3>
		<div class="table">
			<div class="thead">
				<div class="tr">
					<div class="th">tracks</div>
					<div class="th"><button v-if="tracks.length" class="btn btn-link empty-btn" v-on:click="onEmptyClick">empty playlist</button></div>
				</div>
			</div>
		</div>
		<div v-if="!tracks.length">
			<p>add some tracks to the player to start listening!</p>
		</div>
		<draggable
			id="tracks-draggable"
			v-model="tracks"
			:element="'ul'"
			class="table"
			:options="{group: 'tracks'}"
			@start="drag=true"
			@end="drag=false"
			:move="onDragMove"
		>
			<li
				v-for="t in tracks"
				v-bind:class="{active: isActiveTrack(t)}"
				class="tr"
			>
				<div class="td"><span v-on:click="onTrackClick(t)">{{t.title}}</span></div>
				<div class="td"><button class="btn btn-default remove-btn" v-on:click="onRemoveClick(t)">-</button></div>
			</li>
		</draggable>
	</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex';
import draggable from 'vuedraggable';

export default {
	components: {
		draggable,
	},
	data: function () {
		return {
			currentTrackId: null,
			currentTrack: null
		}
	},
	computed: {
		...mapState({
			track_ids: state => state.playlist.track_ids,
			tracks_by_id: state => state.playlist.tracks_by_id,
		}),
		tracks: {
			get () {
				return this.track_ids.map((t) => this.tracks_by_id[t]);
			},
			set(val) {
				this.$store.commit('UPDATE_PLAYLIST', {tracks: val})
			}
		},
	},
	methods: {
		onEmptyClick: function() {
			this.$store.commit('EMPTY_PLAYLIST')
		},
		onTrackClick: function (t) {
			console.log('AudioPlayer::onTrackClick', t);
			
			const player = this.$refs.player;
			
			this.currentTrackId = t.id;
			
			player.src = t.file;
			player.play();
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
			
			const player = this.$refs.player;
			const curr_index = this.track_ids.indexOf(this.currentTrackId);
			
			console.log('curr_index: ' + (curr_index + 1) + ' of ' + this.track_ids.length);
			
			if ((curr_index + 1) <= (this.track_ids.length - 1)) {
				
				const next = this.tracks_by_id[this.track_ids[curr_index + 1]];
				
				console.log('next: ' + next.title);
				
				this.currentTrackId = next.id;
				
				player.src = next.file;
				player.play();
				
			} else {console.log('no more tracks');}
		},
		isActiveTrack: function (t) {
			return (t.id === this.currentTrackId);
		},
		// prevent drag from playlist back to show
		onDragMove: function (evt) {
			//console.log('AudioPlayer::onDragMove', evt);
			if (evt.to.id !== 'tracks-draggable') return false;
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
#audio-player {
	.tr {
		display: table-row;
		.th, .td {
			display: table-cell;
			padding: .75rem;
		}
	}
	#tracks-draggable {
		min-height: 250px;
		margin: 0;
		padding: 0;
		padding-bottom: 3em;
	}
	audio {
		display: none;
	}
}
</style>
