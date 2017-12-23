<template>
	<div class="bc" @click="onClick">{{text}}</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	data: function() {
		return {
		}
	},
	computed: {
		...mapState({
			filterKey: state => state.shows.filterKey,
			filter: state => state.shows.filter,
			filterVals: state => state.shows.filterVals,
		}),
		text: function() {
			const filterText = (this.filter) ? ' to ' + this.filter : '';
			return 'back' + filterText;
		}
	},
	watch: {
		/*'$route.params.year': function (year) {
			console.log('Year::route year change', year);
			this.$store.dispatch('getShowsForYear', this.$route.params.year);
		},*/
	},
	methods: {
		onClick: function(evt) {
			console.log('Breadcrumb::onClick');
			this.$router.back();
		},
	},
	/*mounted: function() {
		console.log('Breadcrumb::mounted',this.$route);
	}*/
}
</script>

<style lang="scss">


</style>
