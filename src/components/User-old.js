import { mapState } from 'vuex';

export const User = {
	template: `
		<div id="user-container">
			<div v-if="user.logged_in">
				<h3 class="text-center">{{user.username}}</h3>
				<router-view></router-view>
			</div>
		</div>
	`,
	computed: {
		...mapState({
			user: 'user',
		}),
	},
};

const ListLink = {
	template: `
		<span>
			<router-link v-if="number" :to="path">{{number + ' ' + text}}</router-link>
			<span v-else>0 {{text}}</span>
		</span>
	`,
	props: ['number', 'path', 'text']
};

export const UserHome = {
	template: `
		<div id="user-container">
			<div v-if="user.logged_in">
				<b-card class="">
					<dl class="row">
						<dt class="col-sm-3">shows</dt>
						<dd class="col-sm-9">
							<p>
								<list-link :number="show_checks.length" path="/user/checklist/show" text="saved shows" />
								&nbsp;and&nbsp;
								<list-link :number="show_stars.length" path="/user/favorite/show" text="favorite shows" />
							</p>
						</dd>
						<dt class="col-sm-3">recordings</dt>
						<dd class="col-sm-9">
							<p>
								<list-link :number="recording_checks.length" path="/user/checklist/recording" text="saved recordings" />
								&nbsp;and&nbsp;
								<list-link :number="recording_stars.length" path="/user/favorite/recording" text="favorite recordings" />
							</p>
						</dd>
						<dt class="col-sm-3">tracks</dt>
						<dd class="col-sm-9">
							<p>
								<list-link :number="track_checks.length" path="/user/checklist/track" text="saved tracks" />
								&nbsp;and&nbsp;
								<list-link :number="track_stars.length" path="/user/favorite/track" text="favorite tracks" />
							</p>
						</dd>
					</dl>
				</b-card>
			</div>
			<div v-else>
				<p>log in to view your lists.</p>
			</div>
		</div>
	`,
	components: {ListLink},
	computed: {
		...mapState({
			user: 'user',
		}),
	},
}
