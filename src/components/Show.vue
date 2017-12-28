<template>
	<div class="recordings">
		<div class="d-flex align-items-end" v-if="user.logged_in">
			<div class="mr-auto">
				<router-link v-if="activeShow" :to="'/years/' + activeShow.year">back to {{activeShow.year}}</router-link>
				<!--<breadcrumb/>-->
			</div>
			<div v-if="show" class="mx-4" v-b-tooltip.hover title="add show to checklist">
				<checklist-checkbox :name="'check-show-' + show.id" :initChecked="show.is_checked" :onClickCallback="toggleChecklist" />
			</div>
			<div v-if="show" class="mr-5" v-b-tooltip.hover title="favorite show">
				<favorite-checkbox :name="'favorite-show-' + show.id" :initChecked="show.is_favorite" :onClickCallback="toggleFavorite" />
			</div>
		</div>
		<div v-for="(val, idx) in recordings">
			<recording v-if="idx === 0" :recording="val" :idx="idx" :start-open="true" :is_checked="val.is_checked" :is_favorite="val.is_favorite" />
			<div v-else class="mb-2">
				<h3 v-if="idx === 1" class="my-2">{{recordings.length - 1}} additional recordings</h3>
				<hr/>
				<recording :recording="val" :idx="idx" :start-open="false" :is_checked="val.is_checked" :is_favorite="val.is_favorite" />
			</div>
		</div>
	</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex';

import ChecklistCheckbox from './ChecklistCheckbox';
import FavoriteCheckbox from './FavoriteCheckbox';
import Recording from './Recording.vue';
import Breadcrumb from './Breadcrumb.vue';

export default {
	components: {
		ChecklistCheckbox,
		FavoriteCheckbox,
		Recording,
		Breadcrumb
	},
	data: function () {
		return {}
	},
	computed: {
		...mapState({
			user: 'user',
			activeShow: state => state.shows.show,
			showRecordings: state => (state.shows.show) ? state.shows.show.Recordings : [],
			recording_stars: state => state.user.recording_stars,
			recording_checks: state => state.user.recording_checks,
			show_stars: state => state.user.show_stars,
			show_checks: state => state.user.show_checks,
		}),
		show: function() {
			if (!this.activeShow) return null;
			let s = {
				id: this.activeShow.id,
				toggleFavorite: this.toggleFavorite,
				toggleChecklist: this.toggleChecklist
			};
			if (this.user.logged_in) {
				s.is_favorite = (this.show_stars.indexOf(this.activeShow.id) !== -1);
				s.is_checked = (this.show_checks.indexOf(this.activeShow.id) !== -1);
			}
			return s;
		},
		recordings: function() {
			let recs = this.showRecordings.slice();
			// add favorite and checked props from user onto shows
			if (this.user.logged_in) {
				recs.forEach((val) => {
					val.is_favorite = (this.recording_stars.indexOf(val.id) !== -1);
					val.is_checked = (this.recording_checks.indexOf(val.id) !== -1);
				});
			}
			console.log('Show::get recordings', recs);
			return recs;
		},
	},
	methods: {
		toggleFavorite(evt) {
			this.$store.dispatch('set_user_choice', {
				list_type: 'favorite',
				media_type: 'show',
				media_id: parseInt(this.show.id)
			});
		},
		
		toggleChecklist(evt) {
			this.$store.dispatch('set_user_choice', {
				list_type: 'checklist',
				media_type: 'show',
				media_id: parseInt(this.show.id)
			});
		},
	},
	created () {
		console.log('Show::created');
		this.$store.dispatch('getFullShow', {id: this.$route.params.show_id});
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
