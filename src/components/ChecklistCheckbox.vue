<template>
	<div :class="[initChecked && 'checked', 'checklist-checkbox']">
		<label>
			<input type="checkbox" :name="name" :data-id="dataId" :checked="initChecked" @click.stop="onClickCallback">
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
}
</script>

<style lang="scss">

</style>
