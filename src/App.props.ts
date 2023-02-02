// gridGap: '1rem', MED (LG = 2rem, 0=0)

export const RedditSubs = {
	cityporn: 'CityPorn',
	dankmemes: 'DankMemes',
	itookapicture: 'ITookAPicture',
	memes: 'memes',
	pics: 'pics',
}

export const RedditSort = {
	controversial: 'controversial',
	hot: 'hot',
	new: 'new',
	rising: 'rising',
	top: 'top',
}

// ----------------------------------------------------------------------------

export interface IPageSize { title: string, size: number }
export const PageSizes: IPageSize[] = [
	{ title: '8 posts', size: 8 },
	{ title: '16 posts', size: 16 },
	{ title: '24 posts', size: 24 },
	{ title: '48 posts', size: 48 },
]

export interface IGridSize { title: string, css: string }
export const GridSizes: IGridSize[] = [
	{ title: '4 (sml)', css: '4rem' },
	{ title: '8 (med)', css: '8rem' },
	{ title: '12 (lg)', css: '12rem' },
	{ title: '16 (xl)', css: '16rem' },
]

// ----------------------------------------------------------------------------

export interface IRedditPreviewImage {
	/**
	 * IMPORTANT: preview links are not encoded correctly!! all the `&amp;` occurences must be replaced with just "&" or a 403 error will be thrown
	 * @example "https://preview.redd.it/h2h6v8vbkqb61.png?auto=webp&amp;s=57b083b51d7abd838b36829dfdedf136e9cb4c83"
	 * @note "preview.redd.it" can be interchanged with "i.redd.it" (only full size though, no params are accepted)
	 */
	url: string;
	/**
	 * @example 1800
	 */
	width: number;
	/**
	 * @example 1200
	 */
	height: number
}

export interface IRedditPost {
	subreddit: string // "politics"
	subreddit_subscribers: number
	title: string // "Discussion Thread: White House Coronavirus Task Force Briefing"
	selftext: string // "brief reporters at the White House on the latest developments and the administration’s response"
	permalink: string // "/r/politics/comments/fw07am/rudy_giuliani_attempts_to_position_himself_as/"
	link_flair_text: string // "serious replies only"
	/**
	 * thumbnail url
	 * @example "nsfw" (when `over_18`=true)
	 * @example "https://a.thumbs.redditmedia.com/nf-fkqLeJ53JAM94pCl7ZzklRzSU8eYoRoE4XYKbkG8.jpg"
	 */
	thumbnail: string
	thumbnail_height: number // 140
	thumbnail_width: number // 140
	/**
	 * url
	 * - image posts from "memes"
	 * @example "https://i.redd.it/t2pyhkzmrlea1.gif" // memes
	 * @example "https://www.businessinsider.com/some-news-story" // politics
	 */
	url: string
	id: string // ID36 article ID // "g7thtw"
	over_18: boolean
	num_comments: number
	ups: number
	downs: number
	score: number
	//all_awardings: [{giver_coin_reward,icon_url}]
	pinned: boolean
	author: string // "BobJones"
	/**
	 * @example 1675075853
	 */
	created: number
	/**
	 * @example 1675075853
	 */
	created_utc: number
	/**
	 * @example "2023-01-30T10:50:53.000Z"
	 */
	dateCreated: Date
	preview?: {
		images: [
			{
				source: IRedditPreviewImage
				/**
				 * image previews
				 * - anywhere from 3-6 of these will be provided by the API
				 * - the larger the image, the more previews it has (eg: 3000px W images will have previews of up 1000px, whereas smaller ones wont)
				 */
				resolutions: IRedditPreviewImage[]
			}
		]
	}
}

export interface IRedditImage extends IRedditPost {
	galleryThumbUrl: string
	galleryThumbW: number
	galleryThumbH: number
	galleryOrigUrl: string
	galleryOrigW: number
	galleryOrigH: number
}

export interface IRedditComment {
	all_awardings: []
	approved_at_utc: string
	approved_by: string
	archived: boolean
	associated_award: string
	author: string
	author_flair_text: string
	/*
	author_flair_background_color: string
	author_flair_css_class: string
	author_flair_richtext: []
	author_flair_template_id: "7be44c6e-be39-11e6-b398-0eae18c336b8"
	author_flair_text: ":flag-us: America"
	author_flair_text_color: "dark"
	author_flair_type: "richtext"
	author_fullname: "t2_50zb18iw"
	author_patreon_flair: boolean
	author_premium: boolean
	*/
	awarders: []
	banned_at_utc: string
	banned_by: string
	body: string
	body_html: string
	can_gild: boolean
	can_mod_post: boolean
	collapsed: boolean
	collapsed_because_crowd_control: string
	collapsed_reason: string
	controversiality: number
	created: number
	created_utc: number
	depth: number
	distinguished: string
	downs: number
	edited: boolean
	gilded: number
	gildings: {}
	id: string
	is_submitter: boolean
	likes: string
	link_id: string
	locked: boolean
	mod_note: string
	mod_reason_by: string
	mod_reason_title: string
	mod_reports: []
	name: string
	no_follow: boolean
	num_reports: string
	parent_id: string
	permalink: string
	removal_reason: string
	replies: { data: { children: { data: IRedditComment }[] } }
	/*
	replies: {kind: "Listing",…}
		data: {modhash: "", dist: null, children: [{kind: "t1",…}, {kind: "t1",…}, {kind: "t1",…}, {kind: "more",…}],…}
			children: [{kind: "t1",…}, {kind: "t1",…}, {kind: "t1",…}, {kind: "more",…}]
				data: {kind: "t1",…}
	*/
	report_reasons: string
	saved: boolean
	score: number
	score_hidden: boolean
	send_replies: boolean
	stickied: boolean
	subreddit: string
	subreddit_id: string
	subreddit_name_prefixed: string
	subreddit_type: string
	total_awards_received: number
	treatment_tags: []
	ups: number
	user_reports: []
}
