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
				<label for="newListTitle">A New List</label>
				<input id="newListTitle" type="text" class="form-control" placeholder="List Title" v-model="formValues.newTitle">
			</div>
			<div class="mb-4">
				<b-button type="submit" variant="primary" v-on:click="addToNew">Create List</b-button>
			</div>
			<div v-if="listIds.length" class="form-group">
				<label for="existingListSelect">An Existing List</label>
				<select class="form-control" v-model="formValues.existingId" id="existingListSelect">
					<option v-for="id in listIds" :key="id">{{listsById[id].title}}</option>
				</select>
			</div>
			<div class="">
				<b-button type="submit" variant="primary" v-on:click="addToExisting">Add To List</b-button>
			</div>
		</div>
	</div>
</template>

<script>
import {mapState} from 'vuex';

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
				existingId: null, 
			},
			error: '',
		}
	},
	computed: {
		
		...mapState({
			listIds: state => state.lists.list_ids,
			listsById: state => state.lists.lists_by_id,
		}),
		
		typeLabel: function() { return this.$props.mediaType.charAt(0).toUpperCase() + this.$props.mediaType.slice(1) },
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
			
		},
	},
}
</script>
