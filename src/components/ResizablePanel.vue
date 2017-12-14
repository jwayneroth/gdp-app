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
			<div v-if="resizable" ref="resizer" :class="resizer_class" :style="style.resizer" @mousedown.stop.prevent="handleDown">
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
			lp_width: .5,
			rp_width: .5,
			rszr_left: .5,
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
		handleDown: function(evt) {
			//console.log('handleDown');
			
			if (evt.stopPropagation) evt.stopPropagation()
			if (evt.preventDefault) evt.preventDefault()
			
			if (this.resizable) {
				this.resizing = true;
				document.documentElement.addEventListener('mousemove', this.handleMove, true);
				document.documentElement.addEventListener('mouseup', this.handleUp, true);
			}
		},
		handleMove: function(e) {
			
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
@import "compass/css3";
@import "../assets/scss/variables.scss";

$resizer-width: 15;

.resizable-panel {
	height: 100%;
	
	.controls-container {
		
	}
	
	.pane-btn {
		display: block;
		position: absolute;
		left: 0; top: 0;
		background-color: rgba(0,0,0,.7);
		color: #ffffff;
		z-index: 10;
		border: none;
		
		&.pane-open-btn {
			top: 30px;
			
			&.left {
				@include transform-origin(0,0);
				@include transform(rotate(270deg) translateX(-120%));
			}
			&.right {
				left: auto; right: 0;
				@include transform-origin(100%,100%);
				@include rotate(-90deg);
			}
		}
		
		&.pane-close-btn {
			left: auto;
			right: 18px;
			
			&:hover {
				background-color: rgba(0,0,0,1);
			}
		}
	}
	
	.pane-container {
		position: relative;
		left: 0; top: 0;
		height: 100%;
		background-image: url(/static/img/bg-logo.png);
		background-repeat: no-repeat;
		background-position: 50% 15%;
		background-size: auto 75%;
	}
	
	.pane {
		position: absolute;
		width: 50%;
		height: 100%;
		left: 50%;
		top: 0;
		background-color: #ffffff;
		overflow: hidden;
		
		&.right-pane > .inner { padding-left: ($resizer-width + 12) + px; }
		
		&.open {}
		&.closed {}
		
		.pane-close-btn {
		
		}
		
		&.left-pane {
			z-index: 3;
		}
		
		&.right-pane {
			z-index: 1;
		}
		
		> .inner {
			height: 100%;
			padding: 1em;
			overflow: auto;
		}
	}
	
	.resizer {
		cursor: ew-resize;
		position: absolute;
		left: 0; top: 0;
		width: $resizer-width + px;
		height: 100%;
		z-index: 2;
		@include box-shadow(inset 4px 0px 4px -4px rgba(0,0,0,.6));
		
		.handle {
			top: 50%;
			width: 30px;
			height: 43px;
			background: white url(/static/img/bolt.svg) no-repeat 85% 50%;
			background-size: 75%;
			border: 1px solid rgba(0,0,0,.3);
			border-left: none;
			border-radius: 0 4px 4px 0;
			@include translateX(-5px);
			cursor: ew-resize;
		}
		
		&.active,
		&:hover {
			@include box-shadow(inset 20px 0px 20px -20px rgba(0,0,0,.8));
			
			.handle {
				background-color: rgba(0,0,0,.1);
				@include translateX(0px);
			}
		}
	}
}
</style>
