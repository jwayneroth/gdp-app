<template>
	<div id="user-list-container">
		<div v-if="user.logged_in">
			<h4>{{listTitle}}</h4>
			<table v-if="media_type === 'track'" class="table draggable-table recording-tracks-table">
				<thead>
					<tr>
						<th>date</th><th>title</th><th>length</th><th>add</th>
					</tr>
				</thead>
				<draggable
					v-model="trackList"
					:element="'tbody'"
					:options="{group:'tracks'}"
					@start="drag=true"
					@end="drag=false"
					:move="onDragMove">
					<tr v-for="(t, idx) in list">
						<td><span>{{t.date}}</span></td>
						<td><span>{{t.title}}</span></td>
						<td>{{secondsFormatted(t.length)}}</td>
						<td>
							<b-btn class="add-btn" variant="link" v-on:click="onAddClick(t)">
								<span class="fa fa-plus"></span>
							</b-btn>
						</td>
					</tr>
				</draggable>
			</table>
			<b-table v-else responsive :fields="listFields" :items="list" @row-clicked="rowClick">
			</b-table>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import draggable from 'vuedraggable';

export default {
	components: {
		draggable
	},
	data: function () {
		return {
			media: null,
			media_type: '',
			list_type: '',
			list_ids: [],
		}
	},
	computed: {
		...mapState({
			user: 'user',
			show_stars: state => state.user.show_stars,
			show_checks: state => state.user.show_checks,
			recording_stars: state => state.user.recording_stars,
			recording_checks: state => state.user.recording_checks,
			track_stars: state => state.user.track_stars,
			track_checks: state => state.user.track_checks,
			list: state => state.shows.list,
		}),
		
		listTitle: function() {
			let t = (this.list_type === 'checklist') ? 'Saved ' : 'Favorite ';
			return t + this.media_type.charAt(0).toUpperCase() + this.media_type.slice(1) + 's';
		},
		
		trackList: {
			get() { return this.list; },
			// do nothing
			set(val) {},
		},
		
		listFields: function() {
			return [
				{ key: 'date', label: 'date', formatter: 'displayDate', sortable: true},
				{ key: 'title', label: 'title'},
			];
		}
	},
	methods: {
		secondsFormatted: function(secs) {
			const m = Math.floor(secs/60);
			const s = '0' + (secs - m * 60);
			return m + ':' + s.substr(s.length - 2);
		},
		
		displayDate: function(dd) {
			const t = dd.split('-');
			return t[1] + '/' + t[2] + '/' + t[0].substring(2);
		},
		
		onAddAllClick: function(e) {
			this.$store.commit('ADD_TRACKS', {tracks: this.list})
		},
		
		onAddClick: function(t) {
			this.$store.commit('ADD_TRACKS', {tracks: [t]})
		},
		
		onDragMove: function (evt) {
			const track_id = evt.draggedContext.element.id;
			if (this.$store.state.playlist.tracks_by_id.hasOwnProperty(track_id)) return false;
		},
		
		rowClick: function(item, idx) {
			console.log('UserList::rowClick', item);
			const path = '/shows/' + item.ShowId;
			this.$router.push(path);
		}
	},
	mounted: function() {
		console.log('UserList mounted', this.$route.path.split('/'));
		
		const params = this.$route.path.split('/');
		const list_type = params[2];
		const media_type = params[3];
		
		const list_key = media_type + '_' + ((list_type === 'checklist') ? 'checks' : 'stars');
		
		this.list_ids = this[list_key];
		this.list_type = list_type;
		this.media_type = media_type;
		
		this.$store.dispatch('getTeasers', {media_type, list_type, ids: this.list_ids});
	}
};
</script>
