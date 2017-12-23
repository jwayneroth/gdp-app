<template>
	<div id="user-list-container">
		<div v-if="user.logged_in">
			<router-link to="/user" class="d-block mb-2">back</router-link>
			<div class="d-flex justify-content-between mb-3">
				<h4>{{listTitle}}</h4>
				<b-btn v-if="media_type === 'track'" class="add-all-btn" variant="primary" @click="onAddAllClick">
					<span class="fa fa-plus"></span>
					&nbsp;all tracks
				</b-btn>
			</div>
			<div v-if="media_type === 'track'">
				<table class="table draggable-table">
					<thead>
						<tr><th>date</th><th>title</th><th>length</th><th>add</th><th>checklist</th><th>favorite</th></tr>
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
							<td>
								<checklist-checkbox :name="'check-track-' + t.id" :data-id="t.id" :initChecked="t.is_checked" :onClickCallback="toggleChecklist" />
							</td>
							<td>
								<favorite-checkbox :name="'favorite-track-' + t.id" :data-id="t.id" :initChecked="t.is_favorite" :onClickCallback="toggleFavorite" />
							</td>
						</tr>
					</draggable>
				</table>
			</div>
			<div v-else>
				<b-table :fields="listFields" :items="list" @row-clicked="rowClick"></b-table>
			</div>
		</div>
		<div v-else>
			<p>you must be logged in to view this page. return <router-link to="/">home</router-link></p>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import draggable from 'vuedraggable';

import ChecklistCheckbox from './ChecklistCheckbox';
import FavoriteCheckbox from './FavoriteCheckbox';

export default {
	components: {
		draggable,
		ChecklistCheckbox,
		FavoriteCheckbox,
	},
	data: function () {
		return {
			media: null,
			media_type: '',
			list_type: '',
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
			list: state => {
				let list = state.shows.list.slice();
				if (state.user.logged_in) {
					list.forEach((val) => {
						val.is_favorite = (state.user.track_stars.indexOf(val.id) !== -1);
						val.is_checked = (state.user.track_checks.indexOf(val.id) !== -1);
					});
				}
				console.log('get list', list.map(v=>v.is_favorite));
				return list;
			},
		}),
		
		listTitle: function() {
			let t = (this.list_type === 'checklist') ? 'Saved ' : 'Favorite ';
			return t + this.media_type.charAt(0).toUpperCase() + this.media_type.slice(1) + 's';
		},
		
		trackList: {
			get() {
				/*console.log('get trackList', this.list.map(v=>v.id), this.track_stars);
				if (this.user.logged_in) {
					this.list.forEach((val) => {
						val.is_favorite = (this.track_stars.indexOf(val.id) !== -1);
						val.is_checked = (this.track_checks.indexOf(val.id) !== -1);
					});
				}
				console.log(this.list.map(v=>v.is_favorite));*/
				return this.list;
			},
			// do nothing
			set(val) {
				return this.list;
			},
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
			console.log('UserList::onAddAllClick', this.list);
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
		},
		
		toggleFavorite(evt) {
			this.$store.dispatch('set_user_choice', {
				list_type: 'favorite',
				media_type: 'track',
				media_id: parseInt(evt.target.getAttribute('data-id'))
			});
		},
		
		toggleChecklist(evt) {
			this.$store.dispatch('set_user_choice', {
				list_type: 'checklist',
				media_type: 'track',
				media_id: parseInt(evt.target.getAttribute('data-id'))
			});
		},
	},
	mounted: function() {
		console.log('UserList mounted');
		
		const params = this.$route.path.split('/');
		const list_type = params[2];
		const media_type = params[3];
		
		const list_key = media_type + '_' + ((list_type === 'checklist') ? 'checks' : 'stars');
		const list_ids = this[list_key];
		
		this.list_type = list_type;
		this.media_type = media_type;
		
		console.log('list_key: ' + list_key + ' list_ids length: ' + list_ids.length);
		
		this.$store.dispatch('getTeasers', {media_type, list_type, ids: list_ids});
	},
};
</script>
