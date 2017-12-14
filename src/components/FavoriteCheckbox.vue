<template>
	<div :class="[(this.checked) ? 'checked' : '', 'favorite-checkbox']">
		<label>
			<input type="checkbox" :name="name" :checked="checked" v-on:click="onClick">
		</label>
	</div>
</template>

<script>

export default {
	name: 'favorite-checkbox',
	props: ['name', 'initChecked', 'onClickCallback'],
	computed: {
	},
	data () {
		return {
			checked: false,
		}
	},
	methods: {
		onClick: function(evt) {
			this.onClickCallback(evt);
			this.checked = !this.checked;
			this.$el.className = (this.checked) ? 'favorite-checkbox, checked' : 'favorite-checkbox';
		}
	},
	created: function() {
		if (this.$props.initChecked) this.checked = true;
	}
}
</script>

<style lang="scss">

</style>
