<template>
	<div class="modal-content">
		<div class="modal-body">
			<div :class="'text-' + status" v-if="message"><p v-html="message"/></div>
			<h3>Are you sure you want to delete "{{listTitle}}"</h3> 
			<div class="alert alert-danger" v-if="error"><p v-html="error"></p></div>
			<div>
				<b-button type="submit" variant="primary" v-on:click="confirm">Confirm</b-button>
				<b-button variant="primary" @click="() => {$store.dispatch('hideModal')}">Cancel</b-button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'modal-list-delete',
	props: {
		status: { type: String, default: 'info' },
		message: { type: String, default: null },
		listTitle: { type: String, default: null },
		listId: { type: Number, default: null },
	},
	data: function() {
		return {
			error: '',
		};
	},
	methods: {
		
		confirm: function() {
			this.$store.dispatch('deleteList', this.listId)
			.then(() => {
				if (this.$router.currentRoute.path === '/list/' + this.listId) this.$router.replace('/user');
				this.$store.dispatch('hideModal');
			})
			.catch(err => {
				this.error = err;
			});
		},
	},
}
</script>
