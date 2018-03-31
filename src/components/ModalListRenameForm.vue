<template>
	<div id="form-list" class="modal-content">
		<div class="modal-body">
			<div :class="'text-' + status" v-if="message"><p v-html="message"/></div>
			<h3>Rename "{{listTitle}}"</h3>
			<div class="alert alert-danger" v-if="error"><p v-html="error"></p></div>
			<div class="form-group">
				<input id="newName" type="text" class="form-control" placeholder="List Title" v-model="newName">
			</div>
			<div>
				<b-button type="submit" variant="primary" v-on:click="confirm">Submit</b-button>
				<b-button variant="primary" @click="() => {$store.dispatch('hideModal')}">Cancel</b-button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'modal-list-rename',
	props: {
		status: { type: String, default: 'info' },
		message: { type: String, default: null },
		listTitle: { type: String, default: null },
		listId: { type: Number, default: null },
	},
	data: function() {
		return {
			newName: '',
			error: '',
		};
	},
	methods: {
		
		confirm: function() {
			if (!this.newName || this.newName === '') {
				this.error = 'You must provide a new title.';
				return;
			}
			this.error ='';
			
			this.$store.dispatch('renameList', {id: this.listId, title: this.newName})
			.then(() => {
				this.$store.dispatch('hideModal');
			})
			.catch(err => {
				this.error = err;
			});
		},
	},
}
</script>
