<template>
	<div class="recordings">
		<!--<router-link class="" to="/">back to years</router-link> / <router-link class="" :to="'/years/' + show.year">{{show.year}}</router-link>-->
		<div v-for="r in recordings">
			<recording :recording="r"></recording>
		</div>
	</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex';

import Recording from './Recording.vue';

export default {
	components: {
		Recording
	},
	data: function () {
		return {}
	},
	computed: {
		...mapState({
			user: 'user',
			recordings: state => (state.shows.show) ? state.shows.show.Recordings : [],
			show_stars: state => state.user.show_stars,
			show_checks: state => state.user.show_checks,
		}),
		shows: function() {
			let shows = this.recordings.slice();show
			// add favorite and checked props from user onto shows
			if (this.user.logged_in) {
				shows.forEach((val) => {
					val.is_favorite = (this.show_stars.indexOf(val.id) !== -1);
					val.is_checked = (this.show_checks.indexOf(val.id) !== -1);
				});
			}
			return shows;
		},
	},
	methods: {
	},
	created () {
		console.log('Show::created');
		this.$store.dispatch('getFullShow', {id: this.$route.params.id});
	},
	mounted: function() {
		console.log('Show::mounted $el: ', this.$el);
	}
}
</script>

<style>
.collapsed > .opened,
:not(.collapsed) > .closed {
  display: none;
}
</style>
