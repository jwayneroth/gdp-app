<template>
	<div id="modal-root" :style="rootStyle" data-iframe-height>
		<hc-modal
			id="gdp-modal"
			:class="modalType && 'type-' + modalType"
			:visible="showModal"
			:hide-header="true"
			:hide-footer="true"
			@show="onModalShow"
			@shown="onModalShown"
			@hide="onModalHide"
			@hidden="onModalHidden"
		>
			<component :is="modalType" v-bind="modalProps" data-iframe-height />
		</hc-modal>
	</div>
</template>

<script>
import {mapState} from 'vuex';

import HcModal from './HcModal';
import ModalListAddCreate from './ModalListForm.vue';

export default {
	name: 'modal-root',
	components: {
		HcModal,
		ModalListAddCreate,
	},
	computed: {
		
		...mapState({
			ui: 'ui',
			modalType: state => state.modal.modalType,
			modalProps: state => state.modal.modalProps,
		}),
		
		showModal: function() {
			return (this.modalType !== null) ;
		},
		
		rootStyle: function() {
			return {
				minHeight: (this.showModal) ? '1000px' : 0,
				height: (this.showModal) ? '100%' : 0,
			};
		},
	},
	methods: {
		
		onModalShow(evt) {
			console.log('ModalRoot::onModalShow');
		},
		
		onModalShown(evt) {
		},
		
		onModalHide(evt) {
			console.log('ModalRoot::onModalHide');
		},
		
		onModalHidden(evt) {
			this.$store.dispatch('hideModal');
		},
	},
}
</script>
