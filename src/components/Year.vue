<template>
	<div class="year" ref="year">
		<h3 class="pane-title">{{$route.params.year}}</h3>
		<router-link class="d-block mb-2" to="/">back to years</router-link>
		<b-table ref="shows_table" responsive stacked="md" :fields="fields" :items="shows" @row-clicked="rowClick">
			<!--<template slot="title" slot-scope="data">
				<router-link :to="'/shows/' + data.item.id">{{data.item.title}}</router-link>
			</template>-->
			<template slot="checklist" slot-scope="data">
				<input type="checkbox" :name="data.item.id" :checked="data.item.is_checked" v-on:click="toggleShowChecklist">
			</template>
			<template slot="favorite" slot-scope="data">
				<input type="checkbox" :name="data.item.id" :checked="data.item.is_favorite" v-on:click="toggleShowFavorite">
			</template>
		</b-table>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
	data: function() {
		return {
		}
	},
	computed: {
		...mapState({
			user: 'user',
			showsForYear: state => state.shows.shows,
			show_stars: state => state.user.show_stars,
			show_checks: state => state.user.show_checks,
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
			if (this.user.logged_in) arr.push({ key: 'checklist', label: 'checklist'}, { key: 'favorite', label: 'favorite'},);
			return arr;
		},
		/**
		 * add favorite and checked props from user onto shows
		 */
		shows: function() {
			
			let shows = this.showsForYear.slice();
			
			if (this.user.logged_in) {
				shows.forEach((val) => {
					val.is_favorite = (this.show_stars.indexOf(val.id) !== -1);
					val.is_checked = (this.show_checks.indexOf(val.id) !== -1);
				});
			}
			return shows;
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
		
		toggleShowFavorite: function(evt) {
			this.$store.dispatch('set_favorite_show', parseInt(evt.target.name));
		},
		
		toggleShowChecklist: function(evt) {
			this.$store.dispatch('set_checklist_show', parseInt(evt.target.name));
		},
		
		rowClick: function(item, idx, evt) {
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
			}
			td {
				//padding-top: .6em;
				//padding-bottom: .4em;
			}
		}
	}
}
</style>
