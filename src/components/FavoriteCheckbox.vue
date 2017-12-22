<template>
	<div :class="[initChecked && 'checked', 'favorite-checkbox']">
		<label>
			<input type="checkbox" :name="name" :data-id="dataId" :checked="initChecked" v-on:click="onClickCallback">
			{{label && 'favorite'}}
		</label>
	</div>
</template>

<script>

export default {
	name: 'favorite-checkbox',
	props: {
		dataId: { type: Number, default: 0 },
		name: String,
		initChecked: Boolean,
		onClickCallback: Function,
		label: String
	},
}
</script>
