<template>
	<div class="playlist-helper">
		<p v-html="helpText" />
	</div>
</template>

<script>

export default {
	name: 'playlist-helper',
	props: {
	},
	computed: {
		helpText: function() {
			
			const params = this.$route.params;
			
			let txt = 'find a show and add its tracks below to start listenting!';
			
			if (params.show_id) {
				txt = 'you can <b class="montserratbold">drag tracks</b> from the show here or use the <span class="fa fa-plus"></span>&nbsp;<b class="montserratbold">buttons</b> to fill your playlist.';
			} else if (params.year) {
				txt = 'choose a show to see its recordings and start listening!';
			} else {
				if (this.$route.path.indexOf('years') !== -1) {
					txt = 'choose a year on the left to see its list of archived shows';
				} else if (this.$route.path.indexOf('user') !== -1) {
					txt = '';
				}
			}
			return txt;
		},
	},
	data () {
		return {
		}
	},
	methods: {
	}
}
</script>

<style lang="scss">

</style>
