<template>
	<div class="recording-root">
		<div v-if="recording" :id="'recording-' + recording.id">
			<div class="row">
				<div class="col-sm-9">
					<h3>{{recording.title}}</h3>
				</div>
				<div class="col-sm-3">
					<b-form v-if="user.logged_in">
						<div class="form-check">
							<label class="form-check-label">
								<input type="checkbox" class="form-check-input" :name="'check-' + recording.id" :checked="recording.is_checked" v-on:click="toggleShowChecklist">
								checklist
							</label>
						</div>
						<div class="form-check">
							<label class="form-check-label">
								<input type="checkbox" class="form-check-input" :name="'favorite-' + recording.id" :checked="recording.is_favorite" v-on:click="toggleShowFavorite">
								favorite
							</label>
						</div>
					</b-form>
				</div>
			</div>
			<p>rating: {{recording.average_rating}} / {{recording.reviews_count}} reviews</p>
			<div class="row mb-3">
				<div class="col-sm-6">
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
				<div class="col-sm-6">
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
						<dt class="col-sm-3">archive id</dt><dd class="col-sm-9">{{recording.archive_identifier}}</dd>
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
							<th>title</th><th>length</th><th>add</th>
							<th v-if="user.logged_in">checklist</th>
							<th v-if="user.logged_in">favorite</th>
						</tr>
					</thead>
					<draggable
						v-model="tracks"
						:element="'tbody'"
						:options="{group:'tracks'}"
						@start="drag=true"
						@end="drag=false"
						:move="onDragMove">
						<tr v-for="(t, idx) in recording.Tracks">
							<td><span>{{t.title}}</span></td>
							<td>{{secondsFormatted(t.length)}}</td>
							<td>
								<b-btn class="add-btn" variant="link" v-on:click="onAddClick(t)">
									<span class="fa fa-plus"></span>
								</b-btn>
							</td>
							<td v-if="user.logged_in">
								<input type="checkbox" :name="t.id" :checked="t.is_checked" v-on:click="toggleChecklist">
							</td>
							<td v-if="user.logged_in">
								<favorite-checkbox :name="t.id" :initChecked="t.is_favorite" :onClickCallback="toggleFavorite" />
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

import FavoriteCheckbox from './FavoriteCheckbox';

export default {
	props: ['recording', 'idx', 'startOpen'],
	components: {
		draggable,
		FavoriteCheckbox,
	},
	data: function () {
		return {}
	},
	computed: {
		...mapState({
			user: 'user',
			track_stars: state => state.user.track_stars,
			track_checks: state => state.user.track_checks,
		}),
		tracks: {
			// add favorite and checked props from user onto tracks
			get() {
				if (this.user.logged_in) {
					this.recording.Tracks.forEach((val) => {
						val.is_favorite = (this.track_stars.indexOf(val.id) !== -1);
						val.is_checked = (this.track_checks.indexOf(val.id) !== -1);
					});
				}
				return this.recording.Tracks;
			},
			// do nothing
			set(val) {},
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
			//console.log('onDragMove', evt);
			
			const track_id = evt.draggedContext.element.id;
			
			if (this.$store.state.playlist.tracks_by_id.hasOwnProperty(track_id)) return false;
			
		},
		
		toggleFavorite(evt) {
			console.log('toggleFavorite', evt.target.name);
			this.$store.dispatch('set_favorite_track', parseInt(evt.target.name));
		},
		
		toggleChecklist(evt) {
			console.log('toggleChecklist', evt.target.name);
			this.$store.dispatch('set_checklist_track', parseInt(evt.target.name));
		},
		
		toggleShowFavorite(evt) {
			this.$store.dispatch('set_favorite_show', parseInt(this.show.id));
		},
		
		toggleShowChecklist(evt) {
			this.$store.dispatch('set_checklist_show', parseInt(this.show.id));
		},
	},
	created () {
		console.log('Recording::created', this.$props.recording.id, this.$props.idx);
	},
	mounted: function() {
		//console.log('Recording::mounted $el: ', this.$el);
	}
}
</script>

<style lang="scss">
.collapsed > .opened,
:not(.collapsed) > .closed {
  display: none;
}
</style>
