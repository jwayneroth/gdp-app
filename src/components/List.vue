<template>
	<div id="list-wrapper">
		<breadcrumb/>
		<div v-if="loggedIn">
			<h2>{{list.title}}</h2>
			<p><span class="montserratmedium">created: </span>{{createdFormatted(list.createdAt)}}</p>
			<p>
				<button class="btn btn-link" @click="renameListClick">rename</button>
				<button class="btn btn-link" @click="deleteListClick">delete</button>
			</p>
			<div v-if="list.showIds.length">
				<h4>Shows</h4>
				<div>
					<b-table class="showsTable" :fields="showFields" :items="showsForTable" @row-clicked="showClick">
						<template slot="remove" slot-scope="data">
							<b-btn v-b-tooltip.hover title="remove show from the list" class="remove-btn" variant="link" @click.stop="onRemoveClick('show', data.item.id)">
								<span class="fa fa-minus"></span>
							</b-btn>
						</template>
					</b-table>
				</div>
			</div>
			<div v-if="list.recordingIds.length">
				<h4>Recordings</h4>
				<div>
					<b-table class="recordingsTable" :fields="recordingFields" :items="recordingsForTable" @row-clicked="recordingClick">
						<template slot="remove" slot-scope="data">
							<b-btn v-b-tooltip.hover title="remove recording from the list" class="remove-btn" variant="link" @click.stop="onRemoveClick('recording', data.item.id)">
								<span class="fa fa-minus"></span>
							</b-btn>
						</template>
					</b-table>
				</div>
			</div>
			<div v-if="list.trackIds.length">
				<div class="d-flex justify-content-between mb-3">
					<h4>Tracks</h4>
					<b-btn class="add-all-btn" variant="primary" @click="onAddAllClick">
						<span class="fa fa-plus"></span>
						&nbsp;all tracks
					</b-btn>
				</div>
				<div>
					<table class="table draggable-table">
						<thead>
							<tr>
								<th>remove</th>
								<th>show</th>
								<th>title</th>
								<th></th>
								<th>length</th>
								<th>add</th>
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
							:move="onDragMove"
						>
							<tr v-for="(t, idx) in tracksForTable">
								<td>
									<b-btn v-b-tooltip.hover title="remove track from the list" class="remove-btn" variant="link" v-on:click="onRemoveClick('track', t.id)">
										<span class="fa fa-minus"></span>
									</b-btn>
								</td>
								<td>
									<router-link :to="'/shows/' + t.showId">
										<span>{{displayDate(t.recordingDate)}}</span>
									</router-link>
								</td>
								<td><span>{{t.title}}</span></td>
								<td class="handle"><span class="fa fa-arrows"></span></td>
								<td>{{secondsFormatted(t.length)}}</td>
								<td>
									<b-btn class="add-btn" variant="link" v-on:click="onAddClick(t)">
										<span class="fa fa-plus"></span>
									</b-btn>
								</td>
							</tr>
						</draggable>
					</table>
				</div>
			</div>
		</div>
		<div v-else>
			<p>you must be logged in to view this page. return <router-link to="/">home</router-link></p>
		</div>
	</div>
</template>

<script>
var moment = require('moment');

import { mapState } from 'vuex';
import draggable from 'vuedraggable';

import ChecklistCheckbox from './ChecklistCheckbox';
import Breadcrumb from './Breadcrumb.vue';

export default {
	components: {
		draggable,
		ChecklistCheckbox,
		Breadcrumb,
	},
	data: function () {
		return {
		}
	},
	computed: {
		
		...mapState({
			loggedIn: state => state.user.logged_in,
			list: state => state.lists.activeList,
		}),
		
		showsForTable: function() { return this.list.showIds.map(id => this.list.showsById[id]); },
		recordingsForTable: function() { return this.list.recordingIds.map(id => this.list.recordingsById[id]); },
		tracksForTable: function() { return this.list.trackIds.map(id => this.list.tracksById[id]); },
		
		showFields: function() {
			return [
				{ key: 'remove', label: 'remove' },
				{ key: 'date', label: 'date', formatter: 'displayDate', sortable: true},
				{ key: 'title', label: 'title'},
			];
		},
		
		recordingFields: function() {
			return [
				{ key: 'remove', label: 'remove' },
				{ key: 'date', label: 'date', formatter: 'displayDate', sortable: true},
				{ key: 'title', label: 'title'},
			];
		},
		
		tracks: {
			get() {
				return this.tracksForTable;
			},
			set(val) {
				// do nothing
			},
		},
	},
	methods: {
		
		createdFormatted: function(date) {
			return moment(date).format('dddd, MMMM Do YYYY, h:mm:ss a');
		},
		
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
			this.$store.commit('ADD_TRACKS', {tracks: this.tracksForTable})
		},
		
		onAddClick: function(t) {
			this.$store.commit('ADD_TRACKS', {tracks: [t]})
		},
		
		onRemoveClick: function(type, id) {
			const media = {type, id, delete: true};
			
			this.$store.dispatch('removeMediaFromList', {listId: this.list.id, media})
			.then(() => {
			})
			.catch(err => {
			});
		},
		
		onDragMove: function (evt) {
			const track_id = evt.draggedContext.element.id;
			if (this.$store.state.playlist.tracks_by_id.hasOwnProperty(track_id)) return false;
		},
		
		showClick: function(item, idx) {
			console.log('List::showClick', item);
			const path = '/shows/' + item.id;
			this.$router.push(path);
		},
		
		recordingClick: function(item, idx) {
			console.log('List::recordingClick', item);
			const path = '/shows/' + item.ShowId;
			this.$router.push(path);
		},
		
		renameListClick: function() {
			this.$store.dispatch('showModal', {
				modalType: 'modalListRename',
				modalProps: { listId: this.list.id, listTitle: this.list.title }
			});
		},
		
		deleteListClick: function() {
			this.$store.dispatch('showModal', {
				modalType: 'modalListDelete',
				modalProps: { listId: this.list.id, listTitle: this.list.title }
			});
		},
	},
	mounted: function() {
		console.log('List::mounted ' + this.$route.params.id);
		
		const listId = this.$route.params.id;
		
		this.$store.dispatch('getFullList', listId)
		.then(() => {
			
		})
		.catch(err => {
			this.$router.back();
		});
	},
};
</script>

<style lang="scss">
.showsTable,
.recordingsTable {
	tr td {
		cursor: pointer;
	}
}
</style>
