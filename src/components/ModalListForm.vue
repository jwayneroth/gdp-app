<template>
	<div id="form-list" class="modal-content">
		<header class="modal-header">
			<h3>Add {{typeLabel}} to...</h3>
			<b-button variant="primary" @click="() => {$store.dispatch('hideModal')}">close</b-button>
		</header>
		<div class="modal-body">
			<div :class="'text-' + status" v-if="message"><p v-html="message"/></div>
			<div class="alert alert-danger" v-if="error"><p v-html="error"></p></div>
			<div class="form-group">
				<h4>A New List</h4>
				<input id="newListTitle" type="text" class="form-control" placeholder="List Title" v-model="formValues.newTitle">
			</div>
			<div class="mb-4">
				<b-button type="submit" variant="primary" v-on:click="addToNew">Create List</b-button>
			</div>
			<div v-if="listIds.length" class="form-group">
				<h4>An Existing List</h4>
				<div v-if="currentListIds.length">
					<p>the {{$props.mediaType}} is currently in list(s):<span v-for="id in currentListIds"> "{{currentListsById[id].title}}"</span></p>
				</div>
				<!--<select class="form-control" v-model="formValues.existingId" id="existingListSelect">
					<option v-for="opt in listOptions" :key="opt.id" :val="opt.id">{{opt.title}}</option>
				</select>-->
				<b-form-select multiple :select-size="4" v-model="formValues.existingSelected" :options="listOptions" class="mb-3"/>
			</div>
			<div class="">
				<b-button type="submit" variant="primary" v-on:click="addToExisting">Add To List</b-button>
			</div>
		</div>
	</div>
</template>

<script>
import {mapState} from 'vuex';

import {getMediaLists} from '../api/lists';
import {flattenObjectArray, arrayToObject} from '../lib/utils';

export default {
	name: 'modal-list-add-create',
	props: {
		status: { type: String, default: 'info' },
		message: { type: String, default: null },
		mediaType: { type: String, default: null },
		mediaId: { type: Number, default: null },
	},
	components: {
	},
	data: function() {
		return {
			formValues: {
				newTitle: null,
				//existingId: null,
				existingSelected: [],
			},
			error: '',
			currentListIds: [],
			currentListsById: {},
		}
	},
	computed: {
		
		...mapState({
			listIds: state => state.lists.ids,
			listsById: state => state.lists.byId,
			showIds: state => state.lists.showIds,
			recordingIds: state => state.lists.recordingIds,
			trackIds: state => state.lists.trackIds,
		}),
		
		typeLabel: function() {
			return this.$props.mediaType.charAt(0).toUpperCase() + this.$props.mediaType.slice(1)
		},
		
		listOptions: function() {
			const opts = this.listIds.reduce((res, value) => {
				const opt = {value, text: this.listsById[value].title};
				if (this.currentListIds.indexOf(value) !== -1) opt.disabled = true;
				res.push(opt);
				return res;
			}, []);
			return opts;
		},
	},
	methods: {
		
		addToNew: function() {
			
			const title = this.formValues.newTitle;
			
			if (!title) {
				this.error = 'You must create a title for the new list.'
				return;
			}
			
			this.error = '';
			
			const media = {type: this.mediaType, id: this.mediaId};
			
			this.$store.dispatch('createList', {title, media})
			.then(() => {
				console.log('ModalListForm createList success');
				this.$store.dispatch('hideModal');
			})
			.catch(err => {
				console.log('ModalListForm createList error');
				this.error = err;
			});
		},
		
		addToExisting: function() {
			
			if (!this.formValues.existingSelected.length) {
				this.error = 'You must select one or more lists.'
				return;
			}
			
			this.error = '';
			
			const media = {type: this.mediaType, id: this.mediaId};
			
			this.$store.dispatch('addMediaToList', {listIds: this.formValues.existingSelected, media})
			.then(() => {
				console.log('ModalListForm addToExisting success');
				this.$store.dispatch('hideModal');
			})
			.catch(err => {
				console.log('ModalListForm addToExisting error');
				this.error = err;
			});
		},
	},
	
	/**
	 * if the selected media item is in a list(s)
	 * query the db to find which and remove them from the select options
	 */
	mounted: function() {
		console.log('ModalListForm::mounted ' +  this.$props.mediaType);
		
		const {mediaType, mediaId} = this.$props;
		
		const mediaInLists = this[mediaType + "Ids"];
		
		if (mediaInLists.indexOf(mediaId) !== -1) {
			getMediaLists(mediaType, mediaId)
			.then(lists => {
				this.currentListIds = flattenObjectArray(lists, 'id');
				this.currentListsById = arrayToObject(lists, 'id');
			})
			.catch(err => { console.error(err) });
		}
	}
}
</script>
