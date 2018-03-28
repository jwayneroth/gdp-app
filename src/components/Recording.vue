<template>
	<div class="recording-root">
		<div v-if="recording" :id="'recording-' + recording.id">
			<h3>{{recording.title}}</h3>
			<div class="d-flex align-items-end mt-1 mb-2">
				<div>rating: {{recording.average_rating}} / {{recording.reviews_count}} reviews</div>
				<div v-if="loggedIn" class="mx-4" v-b-tooltip.hover title="save recording to a list">
					<checklist-checkbox
						:name="'check-recording-' + recording.id"
						:initChecked="inList"
						:onClickCallback="addRecordingToList"
					/>
				</div>
			</div>
			<div class="d-flex justify-content-between mb-3">
				<div class="">
					<b-btn v-b-toggle="'details-' + idx" variant="link">
						<span class="opened fa fa-caret-up"></span>
						<span class="closed fa fa-caret-down"></span>
						details
					</b-btn>
					<b-btn v-b-toggle="'description-' + idx" variant="link">
						<span class="opened fa fa-caret-up"></span>
						<span class="closed fa fa-caret-down"></span>
						description
					</b-btn>
				</div>
				<div class="">
					<b-btn v-b-toggle="'tracks-' + idx" variant="link">
						<span class="opened fa fa-caret-up"></span>
						<span class="closed fa fa-caret-down"></span>
						<span class="opened">hide</span>
						<span class="closed">show</span>
						tracks
					</b-btn>
					<b-btn class="add-all-btn" variant="primary" @click="onAddAllClick"><span class="fa fa-plus"></span>&nbsp;all tracks</b-btn>
				</div>
			</div>
			<b-collapse :id="'details-' + idx">
				<b-card class="mb-3">
					<dl class="row">
						<dt class="col-sm-3">archive id</dt>
						<dd class="col-sm-9">
							<a
								:href="'https://archive.org/details/' + recording.archive_identifier"
								target="_blank"
								v-b-tooltip.hover
								title="view recording on archive.org"
							>
								{{recording.archive_identifier}}
							</a>
						</dd>
						<dt class="col-sm-3">source</dt><dd class="col-sm-9">{{recording.source}}</dd>
						<dt class="col-sm-3">lineage</dt><dd class="col-sm-9">{{recording.lineage}}</dd>
						<dt class="col-sm-3">transferer</dt><dd class="col-sm-9">{{recording.transferer}}</dd>
						<dt class="col-sm-3">taper</dt><dd class="col-sm-9">{{recording.taper}}</dd>
					</dl>
				</b-card>
			</b-collapse>
			<b-collapse :id="'description-' + idx">
				<b-card class="mb-3">
					<div v-html="recording.description"></div>
				</b-card>
			</b-collapse>
			<b-collapse :id="'tracks-' + idx" :visible="startOpen">
				<table class="table draggable-table recording-tracks-table">
					<thead>
						<tr>
							<th>title</th><th></th><th>length</th><th>add</th>
							<th v-if="loggedIn">save</th>
						</tr>
					</thead>
					<draggable
						v-model="tracks"
						:element="'tbody'"
						:options="{
							group: 'tracks',
							handle: '.handle'
						}"
						@start="drag=true"
						@end="drag=false"
						:move="onDragMove">
						<tr v-for="(t, idx) in recording.Tracks">
							<td><span>{{t.title}}</span></td>
							<td class="handle"><span class="fa fa-arrows"></span></td>
							<td>{{secondsFormatted(t.length)}}</td>
							<td>
								<b-btn class="add-btn" variant="link" v-on:click="onAddClick(t)">
									<span class="fa fa-plus"></span>
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
			</b-collapse>
		</div>
	</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex';
import draggable from 'vuedraggable';

import ChecklistCheckbox from './ChecklistCheckbox';
import FavoriteCheckbox from './FavoriteCheckbox';

export default {
	props: [
		'recording',
		'idx',
		'startOpen',
		'inList'
	],
	components: {
		draggable,
		ChecklistCheckbox,
		FavoriteCheckbox,
	},
	computed: {
		
		...mapState({
			
			loggedIn: state => state.user.logged_in,
			
			listTracks: state => state.lists.trackIds,
		}),
		
		tracks: {
			get() {
				if (this.loggedIn) {
					this.recording.Tracks.forEach((t) => {
						t.inList = (this.listTracks.indexOf(t.id) !== -1);
					});
				}
				return this.recording.Tracks;
			},
			set(val) {
				// do nothing
			},
		},
	},
	methods: {
		secondsFormatted: function(secs) {
			const m = Math.floor(secs/60);
			const s = '0' + (secs - m * 60);
			return m + ':' + s.substr(s.length - 2);
		},
		
		onAddAllClick: function(e) {
			console.log('Recording::onAddAllClick', this.recording.Tracks);
			this.$store.commit('ADD_TRACKS', {tracks: this.recording.Tracks})
		},
		
		onAddClick: function(t) {
			console.log('Recording::onAddClick', t);
			this.$store.commit('ADD_TRACKS', {tracks: [t]})
		},
		
		// prevent adding duplicate to playlist
		onDragMove: function (evt) {
			const track_id = evt.draggedContext.element.id;
			if (this.$store.state.playlist.tracks_by_id.hasOwnProperty(track_id)) return false;
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
		
		addRecordingToList: function(evt) {
			this.$store.dispatch('showModal', {
				modalType: 'ModalListAddCreate',
				modalProps: {
					mediaType: 'recording',
					mediaId: parseInt(this.recording.id)
				},
			});
		},
	},
	/*mounted: function() {
		console.log('Recording::mounted title: ' + this.$props.recording.title + ' is_checked: ' + this.$props.is_checked + ' is_favorite: ' + this.$props.is_favorite);
	}*/
}
</script>

<style lang="scss">
.collapsed > .opened,
:not(.collapsed) > .closed {
  display: none;
}
</style>
