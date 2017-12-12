<template>
	<audio
		class="audio-track"
		ref="audio"
		preload="auto"
		@ended="onAudioEnded"
		@canplaythrough="onAudioLoaded"
	/>
</template>

<script>

export default {
	name: 'audio-track',
	props: ['track', 'onAudioEnded'],
	components: {},
	data: function() {
		return {
		}
	},
	computed: {
		
	},
	watch: {
		
	},
	methods: {
		onAudioLoaded: function(evt) {
			console.log('track ' + this.$props.track.id + ' loaded');
		}
	},
	created: function() {
		console.log('AudioTrack::created', this.$props.track.id);
	},
	mounted: function() {
		console.log('AudioTrack::mounted', this.$props.track.id);
		this.$refs.audio.src = this.$props.track.file;
		//if (this.$props.preload) this.pl = 
	}
}
</script>

<style lang="scss">
</style>
