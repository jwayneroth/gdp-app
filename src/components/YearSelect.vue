<template>
	<select class="form-control" v-model="selectedYear" v-on:change="optionSelected">
		<option value="undefined">choose a year</option>
		<option v-for="y in years">{{y.year}}</option>
	</select>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	data() {
		return {
			// selectedYear tracks route year param
			selectedYear: this.$router.currentRoute.params.year,
		};
	},
	watch: {
		'$route.params.year': function (year) {
			this.selectedYear = year;
		}
	},
	computed: {
		...mapGetters({
			years: 'allYears'
		}),
	},
	methods: {
		optionSelected: function(evt) {
			console.log('optionSelected', evt.target.value);
			const val = evt.target.value;
			if (val === 'undefined') return this.$router.push('/');
			if (val) this.$router.push('/year/' + val);
		},
		...mapActions([
		//	'addToCart'
		]),
	},
	created () {
		console.log('YearList::created', this.$router.currentRoute.params.year);
		
		this.$store.dispatch('getYears');
	}
}
</script>

<style>

</style>
