<template>
	<div :class="[(this.checked) ? 'checked' : '', 'checklist-checkbox']">
		<label>
			<input type="checkbox" :name="name" :data-id="dataId" :checked="checked" v-on:click="onClick">
			{{label && label}}
		</label>
	</div>
</template>

<script>

export default {
	name: 'checklist-checkbox',
	props: {
		dataId: { type: Number, default: 0 },
		name: String,
		initChecked: Boolean,
		onClickCallback: Function,
		label: String
	},
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
			this.$el.className = (this.checked) ? 'checklist-checkbox, checked' : 'checklist-checkbox';
		}
	},
	created: function() {
		if (this.$props.initChecked) this.checked = true;
	}
}
</script>

<style lang="scss">

</style>
