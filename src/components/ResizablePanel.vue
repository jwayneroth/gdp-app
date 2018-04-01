<template>
	<div class="resizable-panel">
		<button v-if="!leftOpen" class="pane-btn pane-open-btn left" v-on:click="openLeft">Open {{left_name}}</button>
		<button v-if="!rightOpen" class="pane-btn pane-open-btn right" v-on:click="openRight">Open {{right_name}}</button>
		<div class="pane-container">
			<div ref="leftPane" class="pane left-pane" :class="leftOpen ? 'open' : 'closed'" :style="style.leftPane">
				<button v-if="leftOpen" class="pane-btn pane-close-btn" v-on:click="closeLeft">
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
				:class="resizerClass"
				:style="style.resizer"
				v-on:touchstart.stop.prevent="e=>false"
				v-on:touchmove="handleTouchMove"
				@mousedown.stop.prevent="handleDown"
			>
				<span class="handle pane-btn"/>
			</div>
			<div ref="rightPane" class="pane right-pane" :class="rightOpen ? 'open' : 'closed'" :style="style.rightPane">
				<button v-if="rightOpen" class="pane-btn pane-close-btn" v-on:click="closeRight">
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
import {mapState} from 'vuex';

export default {
	name: 'resizable-panel',
	components: {},
	props: {
		left_name: { type: String, default: 'Left'},
		right_name: { type: String, default: 'Right'},
	},
	data: function () {
		return {
			resizing: false,
		}
	},
	computed: {
		
		...mapState({
			leftOpen: state => state.ui.leftOpen,
			rightOpen: state => state.ui.rightOpen,
			leftWidth: state => state.ui.leftWidth,
			rightWidth: state => state.ui.rightWidth,
		}),
		
		style: function () {
			return {
				leftPane: {
					width: (this.leftWidth * 100) + '%',
					left: 0,
				},
				rightPane: {
					width: (this.rightWidth * 100) + '%',
					left: (this.leftWidth * 100) + '%',
				},
				resizer: {
					left: (this.leftWidth * 100) + '%',
				}
			}
		},
		
		resizable: function() {
			return (this.leftOpen && this.rightOpen) ? true : false;
		},
		
		resizerClass: function() {
			let c = 'resizer';
			if (this.resizing) c += ' active';
			return c;
		}
	},
	methods: {
		
		closeLeft: function() { this.$store.commit('CLOSE_PANE', 'left'); },
		closeRight: function() { this.$store.commit('CLOSE_PANE', 'right');},
		openLeft: function() { this.$store.commit('OPEN_PANE', 'left'); },
		openRight: function() { this.$store.commit('OPEN_PANE', 'right'); },
		
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
				this.$store.commit('RESIZE_PANES', lw);
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
			this.$store.commit('RESIZE_PANES', lw);
			//console.log('mouseX: ' + mouseX + ' elX: ' + elX + ' elW: ' + elW);
		},
		
		handleUp: function(evt) {
			//console.log('handleUp');
			if (this.resizing) this.resizing = false;
			document.documentElement.removeEventListener('mousemove', this.handleMove, true)
			document.documentElement.removeEventListener('mouseup', this.handleUp, true)
		},
		
		resizerHeight: function() {
			let lh = (this.leftOpen) ? this.$refs.leftPane.offsetHeight : 0;
			let rh = (this.rightOpen) ? this.$refs.rightPane.offsetHeight : 0;
			let taller = (lh > rh) ? lh : rh;
			//console.log('resizerHeight lh: ' + lh + ' rh: ' + rh + ' taller: ' + taller);
			if (lh === taller) this.rp_height = lh;
			this.resizer_height = taller;
		}
	},
	beforeDestroy: function () {
		document.documentElement.removeEventListener('mousemove', this.handleMove, true)
		document.documentElement.removeEventListener('mouseup', this.handleUp, true)
	},
}
</script>
