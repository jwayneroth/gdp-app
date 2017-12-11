<template>
	<div class="recording">
		<div v-if="recording">
			<h3>{{recording.title}}</h3>
			<!--<p>{{recording.archive_identifier}}</p>-->
			<b-btn v-b-toggle="recording.id + '-description'" class="btn btn-link">
				<span class="opened">hide</span>
				<span class="closed">show</span>
				description
			</b-btn>
			<div v-if="user.logged_in">
				<input type="checkbox" :name="'favorite-' + recording.id" :checked="recording.is_favorite" v-on:click="toggleShowFavorite">favorite recording
				<input type="checkbox" :name="'check-' + recording.id" :checked="recording.is_checked" v-on:click="toggleShowChecklist">add recording to checklist
			</div>
			<b-collapse :id="recording.id + '-description'">
				<b-card>
					<div v-html="recording.description"></div>
				</b-card>
			</b-collapse>
			<table class="table">
				<thead>
					<tr>
						<th>tracks</th>
						<th><button class="btn btn-default add-all-btn" v-on:click="onAddAllClick">add all tracks</button></th>
						<th v-if="user.logged_in">add to checklist</th>
						<th v-if="user.logged_in">add to favorites</th>
					</tr>
				</thead>
				<draggable
					v-model="tracks"
					:element="'tbody'"
					:options="{group:'tracks'}"
					@start="drag=true"
					@end="drag=false"
					:move="onDragMove"
					>
					<tr v-for="(t, idx) in recording.Tracks">
						<td><span>{{t.title}}</span></td>
						<td><button class="btn btn-default add-btn" v-on:click="onAddClick(t)">+</button></td>
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
	</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex';
import draggable from 'vuedraggable';

export default {
	props: {
		recording: {
			type: Object
		}
	},
	components: {
		draggable,
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
		console.log('Recording::created', this.$props.recording);
	},
	mounted: function() {
		console.log('Recording::mounted $el: ', this.$el);
	}
}
</script>

<style>
.collapsed > .opened,
:not(.collapsed) > .closed {
  display: none;
}
</style>
