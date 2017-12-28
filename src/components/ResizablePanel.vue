<template>
	<div class="resizable-panel">
		<button v-if="!left_open" class="pane-btn pane-open-btn left" v-on:click="openLeft">Open {{left_name}}</button>
		<button v-if="!right_open" class="pane-btn pane-open-btn right" v-on:click="openRight">Open {{right_name}}</button>
		<div class="pane-container">
			<div ref="left_pane" :class="[left_open ? 'open' : 'closed', 'pane', 'left-pane']" :style="style.left_pane">
				<button v-if="left_open" class="pane-btn pane-close-btn" v-on:click="closeLeft">
					<span class="fa fa-close" />
				</button>
				<div class="inner">
					<div class="container-fluid">
						<slot name="left-pane"></slot>
					</div>
				</div>
			</div>
			<div 
				v-if="resizable"
				ref="resizer"
				:class="resizer_class"
				:style="style.resizer"
				v-on:touchstart.stop.prevent="e=>false"
				v-on:touchmove="handleTouchMove"
				@mousedown.stop.prevent="handleDown"
			>
				<span class="handle pane-btn"/>
			</div>
			<div ref="right_pane" :class="[right_open ? 'open' : 'closed', 'pane', 'right-pane']" :style="style.right_pane">
				<button v-if="right_open" class="pane-btn pane-close-btn" v-on:click="closeRight">
					<span class="fa fa-close" />
				</button>
				<div class="inner">
					<div class="container-fluid">
						<slot name="right-pane"></slot>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'resizable-panel',
	components: {},
	props: {
		left_name: { type: String, default: 'Left'},
		right_name: { type: String, default: 'Right'},
	},
	data: function () {
		return {
			resizable: true,
			resizing: false,
			left_open: true,
			right_open: true,
			lp_width: .6,
			rp_width: .4,
			rszr_left: .6,
		}
	},
	computed: {
		style: function () {
			return {
				left_pane: {
					width: (this.lp_width * 100) + '%',
					left: 0,
				},
				right_pane: {
					width: (this.rp_width * 100) + '%',
					left: (this.lp_width * 100) + '%',
				},
				resizer: {
					left: (this.lp_width * 100) + '%',
				}
			}
		},
		resizer_class: function() {
			let c = 'resizer';
			if (this.resizing) c += ' active';
			return c;
		}
	},
	methods: {
		closeLeft: function() {
			this.resizable = this.left_open = false;
			this.lp_width = 0;
			if (this.right_open) this.rp_width = 1;
		},
		openLeft: function() {
			this.left_open = true;
			if (this.right_open) {
				this.resizable = true;
				this.lp_width = this.rp_width = .5;
			} else {
				this.lp_width = 1;
			}
		},
		closeRight: function() {
			this.resizable = this.right_open = false;
			if (this.left_open) this.lp_width = 1;
			this.rp_width = 0;
		},
		openRight: function() {
			this.right_open = true;
			if (this.left_open) {
				this.resizable = true;
				this.lp_width = this.rp_width = .5;
			} else {
				this.rp_width = 1;
			}
		},
		handleTouchMove: function(e) {
			//console.log('handleTouchMove', e);
			if(e.touches.length == 1) {
				const mouseX = e.touches[0].pageX; //e.pageX || e.clientX + document.documentElement.scrollLeft;
				const elX = this.$el.getBoundingClientRect().left;
				const elW = this.$el.offsetWidth || this.$el.clientWidth;
		
				let lw = (mouseX - elX) / elW;
		
				if (lw < .2) {
					lw = .2
				} else if (lw > .8) {
					lw = .8;
				}
		
				this.lp_width = lw;
				this.rp_width = 1 - lw;
			}
		},
		handleDown: function(evt) {
			console.log('handleDown');
			
			if (evt.stopPropagation) evt.stopPropagation()
			if (evt.preventDefault) evt.preventDefault()
			
			if (this.resizable) {
				this.resizing = true;
				document.documentElement.addEventListener('mousemove', this.handleMove, true);
				document.documentElement.addEventListener('mouseup', this.handleUp, true);
			}
		},
		handleMove: function(e) {
			console.log('handleMove');
			
			if (!this.resizing) return;
			
			const mouseX = e.pageX || e.clientX + document.documentElement.scrollLeft;
			const elX = this.$el.getBoundingClientRect().left;
			const elW = this.$el.offsetWidth || this.$el.clientWidth;
			
			let lw = (mouseX - elX) / elW;
			
			if (lw < .2) {
				lw = .2
			} else if (lw > .8) {
				lw = .8;
			}
			
			this.lp_width = lw;
			this.rp_width = 1 - lw;
			
			//console.log('mouseX: ' + mouseX + ' elX: ' + elX + ' elW: ' + elW);
		},
		handleUp: function(evt) {
			//console.log('handleUp');
			if (this.resizing) this.resizing = false;
			document.documentElement.removeEventListener('mousemove', this.handleMove, true)
			document.documentElement.removeEventListener('mouseup', this.handleUp, true)
		},
		resizerHeight: function() {
			let lh = (this.left_open) ? this.$refs.left_pane.offsetHeight : 0;
			let rh = (this.right_open) ? this.$refs.right_pane.offsetHeight : 0;
			let taller = (lh > rh) ? lh : rh;
			
			//console.log('resizerHeight lh: ' + lh + ' rh: ' + rh + ' taller: ' + taller);
			
			if (lh === taller) this.rp_height = lh;
			
			this.resizer_height = taller;
		}
	},
	created: function() {
		
	},
	mounted: function() {
		//document.documentElement.addEventListener('mousemove', this.handleMove, true);
		//document.documentElement.addEventListener('mouseup', this.handleUp, true);
		//setTimeout(this.resizerHeight, 200);
	},
	updated: function() {
		//setTimeout(this.resizerHeight, 200);
	},
	beforeDestroy: function () {
		document.documentElement.removeEventListener('mousemove', this.handleMove, true)
		document.documentElement.removeEventListener('mouseup', this.handleUp, true)
	},
}
</script>

<style lang="scss">

</style>
