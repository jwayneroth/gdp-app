<template>
	<div class="recordings">
		<div class="d-flex align-items-end">
			<div class="mr-auto">
				<breadcrumb/>
			</div>
			<div v-if="loggedIn" class="mr-5">
				<div v-if="show">
					<checklist-checkbox
						:name="'check-show-' + show.id"
						:data-id="show.id"
						:initChecked="show.inList"
						:onClickCallback="addShowToList"
						v-b-tooltip.hover title="save show to a list"
					/>
				</div>
			</div>
		</div>
		<div v-for="(val, idx) in recordings">
			<recording
				v-if="idx === 0"
				:recording="val"
				:idx="idx"
				:start-open="true"
				:in-list="val.inList"
			/>
			<div v-else class="mb-2">
				<h3
					v-if="idx === 1"
					class="my-2"
				>
				{{recordings.length - 1}} additional recordings
				</h3>
				<hr/>
				<recording
					:recording="val"
					:idx="idx"
					:start-open="false"
					:in-list="val.inList"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex';

import ChecklistCheckbox from './ChecklistCheckbox';
import FavoriteCheckbox from './FavoriteCheckbox';
import Recording from './Recording';
import Breadcrumb from './Breadcrumb';

export default {
	components: {
		ChecklistCheckbox,
		FavoriteCheckbox,
		Recording,
		Breadcrumb,
	},
	computed: {
		
		...mapState({
			
			loggedIn: state => state.user.logged_in,
			
			show: state => {
				if (!state.shows.show) return null;
				const s = Object.assign({}, state.shows.show);
				if (state.user.logged_in) {
					s.inList = (state.lists.showIds.indexOf(s.id) !== -1);
				}
				return s;
			},
			
			recordings: state => {
				if (!state.shows.show) return [];
				let recs = state.shows.show.Recordings.slice();
				if (state.user.logged_in) {
					recs.forEach((rec) => {
						rec.inList = (state.lists.recordingIds.indexOf(rec.id) !== -1);
					});
				}
				return recs;
			},
		}),
	},
	methods: {
		
		addShowToList: function(evt) {
			this.$store.dispatch('showModal', {
				modalType: 'ModalListAddCreate',
				modalProps: {
					mediaType: 'show',
					mediaId: parseInt(this.show.id)
				},
			});
		},
	},
	created () {
		this.$store.dispatch('getFullShow', {id: this.$route.params.show_id});
	},
}
</script>

<style>
.collapsed > .opened,
:not(.collapsed) > .closed {
  display: none;
}
</style>
