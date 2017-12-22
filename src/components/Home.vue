<template>
	<div class="home">
		<div v-if="$route.name === '404'">
			404
		</div>
		<year-list></year-list>
	</div>
</template>

<script>
import YearList from './YearList.vue';

export default {
	components: {
		YearList
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
