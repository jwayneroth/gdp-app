<template>
	<div class="year" ref="year">
		<h3 class="pane-title">{{$route.params.year}}</h3>
		<breadcrumb/>
		<b-table ref="shows_table" :fields="fields" :items="shows" @row-clicked="rowClick">
			<template slot="list" slot-scope="data">
				<checklist-checkbox
					:name="'check-show-' + data.item.id"
					:data-id="data.item.id"
					:initChecked="data.item.inList"
					:onClickCallback="addShowToList"
					v-b-tooltip.hover title="save show to a list"
				/>
			</template>
		</b-table>
	</div>
</template>

<script>
import { mapState } from 'vuex';

import Breadcrumb from './Breadcrumb.vue';
import ChecklistCheckbox from './ChecklistCheckbox';

export default {
	name: 'year',
	components: {
		ChecklistCheckbox,
		Breadcrumb,
	},
	data: function() {
		return {
		}
	},
	computed: {
		...mapState({
			user: 'user',
			shows: state => {
				let shows = state.shows.shows.slice();
				if (state.user.logged_in) {
					shows.forEach((val) => {
						val.inList = (state.lists.showIds.indexOf(val.id) !== -1);
					});
				}
				return shows;
			},
			//listShows: state => state.lists.showIds,
		}),
		
		fields: function() {
			let arr = [
				{ key: 'date', label: 'date', formatter: 'displayDate', sortable: true},
				{ key: 'title', label: 'venue'},
				{ key: 'recording_count', label: 'recordings', sortable: true},
				{ key: 'average_track_count', label: '~tracks', sortable: true},
				{ key: 'average_rating', label: '~rating', formatter: v => parseInt(v, 10), sortable: true},
				{ key: 'has_soundboard', label: 'sbd', formatter: v => (v) ? '<span class="fa fa-check"></span>' : ''},
			];
			if (this.user.logged_in) arr.push({ key: 'list', label: 'list'});
			return arr;
		},
	},
	watch: {
		'$route.params.year': function (year) {
			console.log('Year::route year change', year);
			this.$store.dispatch('getShowsForYear', this.$route.params.year);
		},
	},
	methods: {
		
		displayDate: function(dd) {
			const t = dd.split('-');
			return t[1] + '/' + t[2] + '/' + t[0].substring(2);
		},
		
		addShowToList: function(evt) {
			this.$store.dispatch('showModal', {
				modalType: 'ModalListAddCreate',
				modalProps: {
					mediaType: 'show',
					mediaId: parseInt(evt.target.getAttribute('data-id'))
				},
			});
		},
		
		rowClick: function(item, idx, evt) {
			if (evt.target.tagName === "INPUT") return false;
			this.$router.push('/shows/' + item.id);
		},
	},
	created: function() {
		console.log('Year::created', this.$route.params.year);
		
		this.$store.dispatch('getShowsForYear', this.$route.params.year);
	},
}
</script>

<style lang="scss">
.year {
	table {
		tbody {
			tr {
				cursor: pointer;
				
				th,
				td {
					text-align: center;
					
					&:nth-child(1),
					&:nth-child(2) {
						text-align: left;
					}
					
					.fa-check {
						font-size: .8em;
						color: #555;
					}
				}
			}
		}
	}
}
</style>
