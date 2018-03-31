<template>
	<div id="user-wrapper" v-if="user.logged_in">
		<breadcrumb/>
		<h2 class="text-center mb-4">{{user.username}}</h2>
		<h4>Registered Since: </h4>
		<p>{{registerDate}}</p>
		<div class="d-flex flex-row justify-content-between align-items-end mb-4">
			<h4 class="m-0">Your Lists</h4>
			<b-btn v-b-toggle.newListCollapse variant="primary" @click="">add a new list <span class="fa fa-plus"></span></b-btn>
		</div>
		<b-collapse id="newListCollapse" class="mt-2">
			<b-card>
				<div class="alert alert-danger" v-if="error"><p v-html="error"></p></div>
				<div class="d-flex flex-row justify-content-between align-items-baseline">
					<input style="flex-grow: 2;" class="mr-3 pl-2"  id="newListTitle" type="text" placeholder="List Title" v-model="formValues.newTitle">
					<b-button type="submit" variant="primary" v-on:click="newList">Create</b-button>
				</div>
			</b-card>
		</b-collapse>
		<b-table ref="lists-table" :fields="fields" :items="listsForTable" @row-clicked="rowClick">
			<template slot="delete" slot-scope="data">
				<b-btn variant="link" @click.stop="deleteListClick(data.item)">
					<span class="fa fa-minus"></span>
				</b-btn>
			</template>
		</b-table>
	</div>
</template>

<script>
var moment = require('moment');
import { mapState } from 'vuex';

import Breadcrumb from './Breadcrumb.vue';
import ChecklistCheckbox from './ChecklistCheckbox';

export default {
	components: {
		ChecklistCheckbox,
		Breadcrumb,
	},
	data: function() {
		return {
			error: '',
			formValues: {
				newTitle: '',
			}
		}
	},
	computed: {
		...mapState({
			user: 'user',
			listIds: state => state.lists.ids,
			listsById: state => state.lists.byId,
		}),
		
		registerDate: function() {
			return moment(this.user.registered).format('dddd, MMMM Do YYYY, h:mm:ss a');
		},
		
		listsForTable: function() {
			const l = this.listIds.map(list => this.listsById[list]);
			console.log('listsForTable', l);
			return l;
		},
		
		fields: function() {
			let arr = [
				{ key: 'title', label: 'title' },
				{ key: 'showIds', label: 'shows', formatter: v => v.length },
				{ key: 'recordingIds', label: 'recordings', formatter: v => v.length },
				{ key: 'trackIds', label: 'tracks', formatter: v => v.length },
				{ key: 'createAt', label: 'created', formatter: v => moment(v).format('MM/DD/YY') },
				{ key: 'delete', label: 'delete'},
			];
			return arr;
		},
	},
	methods: {
		
		displayDate: function(dd) {
			const t = dd.split('-');
			return t[1] + '/' + t[2] + '/' + t[0].substring(2);
		},
		
		addShowToList: function(evt) {
			this.$store.dispatch('showModal', {
				modalType: 'ModalListAddCreate',
				modalProps: {
					mediaType: 'show',
					mediaId: parseInt(evt.target.getAttribute('data-id'))
				},
			});
		},
		
		rowClick: function(item, idx, evt) {
			console.log('User::rowClick', item, idx, evt);
			this.$router.push('/list/' + item.id);
		},
		
		deleteListClick: function(list) {
			this.$store.dispatch('showModal', {
				modalType: 'modalListDelete',
				modalProps: { listId: list.id, listTitle: list.title }
			})
		},
		
		newList: function() {
			const title = this.formValues.newTitle;
			
			if (!title) {
				this.error = 'You must create a title for the new list.'
				return;
			}
			
			this.error = '';
			
			this.$store.dispatch('createList', {title})
			.then(() => {
				this.formValues.newTitle = '';
			})
			.catch(err => {
				this.error = err;
			});
		},
	},
}
</script>

<style lang="scss">
#user-wrapper {
	table {
		tbody {
			tr {
				cursor: pointer;
				
				th,
				td {
					text-align: center;
					
					&:nth-child(1),
					&:nth-child(2) {
						text-align: left;
					}
					
					.btn {
						cursor: pointer;
					}
					
					.fa-check {
						font-size: .8em;
						color: #555;
					}
				}
			}
		}
	}
}
</style>
