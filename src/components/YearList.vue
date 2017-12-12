<template>
	<div id="year-list">
		<table class="table">
			<thead>
				<tr><th>year</th><th>shows</th><th>recordings</th></tr>
			</thead>
			<tbody>
				<tr v-for="y in years" @click="onRowClick(y.year)">
					<td><span>{{y.year}}</span></td>
					<td><span>{{y.show_count}}</span></td>
					<td><span>{{y.recording_count}}</span></td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
	computed: {
		...mapState({
			user: 'user',
			years: state => state.shows.filterVals,
		}),
	},
	methods: {
		onRowClick: function(year) {
			console.log('YearList::onRowClick ' + year);
			
			this.$router.push('/years/' + year);
		},
	},
	created () {
		console.log('YearList::created');
		
		this.$store.dispatch('getYears');
	}
}
</script>

<style lang="scss">
#year-list {
	table {
		th, td {
			padding-top: .4em;
			padding-bottom: .3em;
		}
		tbody {
			tr {
				cursor: pointer;
				
				&:hover {
					background-color: #ffeeee;
				}
			}
		}
	}
}
</style>
