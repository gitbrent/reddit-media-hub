/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useMemo, useState } from 'react'
import { OPT_PAGESIZE, IRedditPost, RedditSubs, SortType, IRedditImage } from './App.props'
import ImageGrid from './ImageGrid'

export default function AppMain() {
	//const thumbSizes = {  } // TODO: we need to pass to ImageGrid for css max etc
	const [pagingSize, setPagingSize] = useState(12)
	const [pagingPage, setPagingPage] = useState(1)
	const [optPgeSize, setOptPgeSize] = useState(OPT_PAGESIZE.ps16)
	const [optSchWord, setOptSchWord] = useState('')
	const [optShowCap, setOptShowCap] = useState(false)
	const [optThumbSize, setOptThumbSize] = useState(1)
	const [isLoading, setIsLoading] = useState(false)
	const [showDataDebug, setShowDataDebug] = useState(false)
	//
	//const [selDelaySecs, setSelDelaySecs] = useState<DelayTime | string>(DelayTime.secNo)
	const [selRedditSub, setSelRedditSub] = useState<string>(RedditSubs.memes)
	const [selSortType, setSelSortType] = useState<string>(SortType.top)
	const [redditImages, setRedditImages] = useState<IRedditImage[]>([])

	/** fetch subreddit images */
	useEffect(() => {
		interface SubJson { kind: string, data: IRedditPost }

		setIsLoading(true)

		/**
		 * @note paging/result sets
		 * http://www.reddit.com/r/pics/.json?limit=100
		 * If you want more than that, look at the after parameter in the JSON that comes back, and call it again with that, like this:
		 * http://www.reddit.com/r/pics/.json?limit=100&after=t3_abcde
		 *
		 * @note `sortType` is optional (omit it for default sort [top])
		 */
		fetch(`https://www.reddit.com/r/${selRedditSub}/${selSortType}.json?limit=50`)
			.then((response) => response.json())
			.then((json) => {
				const posts: IRedditImage[] = []

				json.data.children
					.filter((child: SubJson) => child && child.data && child.data.preview && child.data.preview.images?.length > 0)
					.filter((child: SubJson) => child.data.url.indexOf('https://v.redd.it') !== 0)
					.forEach((child: SubJson) => {
						const redditPost = child.data
						let thumbUrl = redditPost.thumbnail === "nsfw" ? redditPost.url : redditPost.thumbnail
						let thumbHeight = redditPost.thumbnail_height
						let thumbWidth = redditPost.thumbnail_width
						let origUrl = redditPost.url
						let origHeight = redditPost.thumbnail_height
						let origWidth = redditPost.thumbnail_width

						if (redditPost.preview?.images[0]?.source) {
							origWidth = redditPost.preview.images[0].source.width
							origHeight = redditPost.preview.images[0].source.height
						}

						posts.push({
							subreddit: redditPost.subreddit,
							subreddit_subscribers: redditPost.subreddit_subscribers,
							selftext: redditPost.selftext,
							title: (redditPost.title || '').replace(/&amp;/gi, '&'),
							permalink: redditPost.permalink,
							link_flair_text: redditPost.link_flair_text,
							thumbnail: thumbUrl,
							thumbnail_height: thumbHeight,
							thumbnail_width: thumbWidth,
							url: redditPost.url,
							id: redditPost.id,
							num_comments: redditPost.num_comments,
							ups: redditPost.ups,
							downs: redditPost.downs,
							over_18: redditPost.over_18,
							score: redditPost.score,
							pinned: redditPost.pinned,
							preview: redditPost.preview,
							created: redditPost.created,
							created_utc: redditPost.created_utc,
							dateCreated: new Date(redditPost.created * 1000),
							author: redditPost.author,
							//
							galleryThumbUrl: thumbUrl,
							galleryThumbW: thumbWidth,
							galleryThumbH: thumbHeight,
							galleryOrigUrl: origUrl,
							galleryOrigW: origWidth,
							galleryOrigH: origHeight,
						})

						console.log('thumbWidth', thumbWidth);

					})
				setRedditImages(posts)
			})
			.catch((ex) => {
				console.error(ex)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [selRedditSub, selSortType])

	useEffect(() => {
		if (optPgeSize === OPT_PAGESIZE.ps08) setPagingSize(8)
		else if (optPgeSize === OPT_PAGESIZE.ps16) setPagingSize(16)
		else if (optPgeSize === OPT_PAGESIZE.ps24) setPagingSize(24)
		else if (optPgeSize === OPT_PAGESIZE.ps48) setPagingSize(48)
	}, [optPgeSize])

	const showFiles = useMemo(() => {
		return redditImages
			//.filter((item)=>{ return !optSchWord || item.name.toLowerCase().indexOf(optSchWord.toLowerCase()) > -1 }) // FUTURE: suport searches
			.filter((_item, idx) => { return idx >= ((pagingPage - 1) * pagingSize) && idx <= ((pagingPage * pagingSize) - 1) })
			.map((item) => {
				if (item.preview?.images[0]?.resolutions) {
					if (item.preview.images[0].resolutions.length >= optThumbSize) {
						const resLevel = item.preview.images[0].resolutions[optThumbSize]
						item.galleryThumbUrl = resLevel.url.replace(/&amp;/gi, '&')
						item.galleryThumbH = resLevel.height
						item.galleryThumbW = resLevel.width
					}
				}
				return item
			})
	}, [redditImages, pagingPage, pagingSize, optThumbSize])

	// --------------------------------------------------------------------------------------------

	function renderNavbar(): JSX.Element {
		function renderPrevNext(): JSX.Element {
			const isDisabledNext = showFiles.length === 0
			// TODO: disabled={pagingPage<(showFiles.length > (pagingSize+1))}

			return (<form className="d-flex me-0 me-lg-5">
				<button className="btn btn-primary me-2" type="button" onClick={() => { setPagingPage(pagingPage > 1 ? pagingPage - 1 : 1) }} disabled={pagingPage < 2}>Prev</button>
				<button className="btn btn-primary me-0" type="button" onClick={() => { setPagingPage(pagingPage + 1) }} disabled={isDisabledNext}>Next</button>
			</form>)
		}

		return (
			<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
				<div className="container-fluid">
					<a className="navbar-brand" href="/">
						<img src="/reddit.png" alt="Google Drive Media Hub" width="32" height="32" />
					</a>
					<div className='d-lg-none'>{renderPrevNext()}</div>
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						<ul className="navbar-nav me-auto mb-2 mb-lg-0" data-desc="option-dropdowns">
							<li className="nav-item">
								<a className="nav-link active" aria-current="page" href="/">Home</a>
							</li>
							<li className="nav-item dropdown" data-desc="opt-subreddit">
								<a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">r/{selRedditSub}</a>
								<ul className="dropdown-menu">
									{Object.keys(RedditSubs).map((subName, idx) => {
										return (<li key={`sub${idx}`}>
											<button className="dropdown-item" disabled={selRedditSub === subName} onClick={() => setSelRedditSub(subName)}>r/{subName}</button>
										</li>)
									})}
								</ul>
							</li>
							<li className="nav-item dropdown" data-desc="opt-sortby">
								<a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">{selSortType}</a>
								<ul className="dropdown-menu">
									{Object.keys(SortType).map((sortName, idx) => {
										return (<li key={`sort${idx}`}>
											<button className="dropdown-item" disabled={selSortType === sortName} onClick={() => setSelSortType(sortName)}>{sortName}</button>
										</li>)
									})}
								</ul>
							</li>
							<li className="nav-item dropdown" data-desc="opt-pagesize">
								<a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">{optPgeSize}</a>
								<ul className="dropdown-menu">
									<li><button className="dropdown-item" disabled={optPgeSize === OPT_PAGESIZE.ps08} onClick={() => setOptPgeSize(OPT_PAGESIZE.ps08)}>{OPT_PAGESIZE.ps08}</button></li>
									<li><button className="dropdown-item" disabled={optPgeSize === OPT_PAGESIZE.ps16} onClick={() => setOptPgeSize(OPT_PAGESIZE.ps16)}>{OPT_PAGESIZE.ps16}</button></li>
									<li><button className="dropdown-item" disabled={optPgeSize === OPT_PAGESIZE.ps24} onClick={() => setOptPgeSize(OPT_PAGESIZE.ps24)}>{OPT_PAGESIZE.ps24}</button></li>
									<li><button className="dropdown-item" disabled={optPgeSize === OPT_PAGESIZE.ps48} onClick={() => setOptPgeSize(OPT_PAGESIZE.ps48)}>{OPT_PAGESIZE.ps48}</button></li>
								</ul>
							</li>
							{document.location.hostname === 'localhost' &&
								<li className="nav-item dropdown" data-desc="opt-debug">
									<a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">DEBUG</a>
									<ul className="dropdown-menu">
										<li><h6 className="dropdown-header">Reddit API</h6></li>
										<li><button className="dropdown-item" disabled={true}>Total Posts: {redditImages.length}</button></li>
										<li><hr className="dropdown-divider" /></li>
										<li><h6 className="dropdown-header">App Data</h6></li>
										<li><button className="dropdown-item" disabled={true}>Showing (pagesize): {showFiles.length}</button></li>
										<li><hr className="dropdown-divider" /></li>
										<li><button className="dropdown-item" onClick={() => setShowDataDebug(true)}>Show Data</button></li>
									</ul>
								</li>
							}
						</ul>
						<div className='d-none d-lg-block'>{renderPrevNext()}</div>
						<form className="d-flex" role="search">
							<input className="form-control" type="search" placeholder="Search" aria-label="Search" onChange={(ev) => { setOptSchWord(ev.currentTarget.value) }} />
							<button type="button" className="btn btn-secondary ms-1" onClick={() => setSelRedditSub(optSchWord)}>GO!</button>
						</form>
						<ul className="navbar-nav flex-row flex-wrap ms-md-auto">
							<li className="nav-item d-none d-lg-block col-6 col-lg-auto">
								<a className="nav-link py-2 px-0 px-lg-2" href="https://github.com/gitbrent" target="_blank" rel="noreferrer">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="navbar-nav-svg" viewBox="0 0 512 499.36" role="img">
										<title>GitHub</title>
										<path fill="currentColor" fillRule='evenodd' d="M256 0C114.64 0 0 114.61 0 256c0 113.09 73.34 209 175.08 242.9 12.8 2.35 17.47-5.56 17.47-12.34 0-6.08-.22-22.18-.35-43.54-71.2 15.49-86.2-34.34-86.2-34.34-11.64-29.57-28.42-37.45-28.42-37.45-23.27-15.84 1.73-15.55 1.73-15.55 25.69 1.81 39.21 26.38 39.21 26.38 22.84 39.12 59.92 27.82 74.5 21.27 2.33-16.54 8.94-27.82 16.25-34.22-56.84-6.43-116.6-28.43-116.6-126.49 0-27.95 10-50.8 26.35-68.69-2.63-6.48-11.42-32.5 2.51-67.75 0 0 21.49-6.88 70.4 26.24a242.65 242.65 0 0 1 128.18 0c48.87-33.13 70.33-26.24 70.33-26.24 14 35.25 5.18 61.27 2.55 67.75 16.41 17.9 26.31 40.75 26.31 68.69 0 98.35-59.85 120-116.88 126.32 9.19 7.9 17.38 23.53 17.38 47.41 0 34.22-.31 61.83-.31 70.23 0 6.85 4.61 14.81 17.6 12.31C438.72 464.97 512 369.08 512 256.02 512 114.62 397.37 0 256 0z"></path>
									</svg>
									<small className="d-lg-none ms-2">GitHub</small>
								</a>
							</li>
							<li className="nav-item d-none d-lg-block py-1 col-12 col-lg-auto">
								<div className="vr d-none d-lg-flex h-100 mx-lg-2 text-white"></div>
								<hr className="d-lg-none text-white-50" />
							</li>
							<li className="nav-item dropdown">
								<button type="button" className="btn btn-link nav-link py-2 px-0 px-lg-2 dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" data-bs-display="static">
									<span className='me-1'>User</span>
								</button>
								<ul className="dropdown-menu dropdown-menu-end">
									<li>
										<h6 className="dropdown-header">Logged In As</h6>
									</li>
									<li>
										<button className="dropdown-item disabled">{'(no user)'}</button>
									</li>
									<li>
										<hr className="dropdown-divider" />
									</li>
									<li>
										<button className="dropdown-item" disabled={true} onClick={() => console.log('SIGNOUTCLICK')}>Sign Out</button>
									</li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		)
	}

	return (
		<div className="container-fluid">
			<header>
				{renderNavbar()}
			</header>
			<main className='mt-3'>
				<section>
					{isLoading ?
						<div className='text-center bg-dark p-3'>
							<div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
						</div>
						:
						<div>
							<ImageGrid imagePosts={showFiles} isShowCap={optShowCap} />
							{showDataDebug && <section className='p-4'>
								<div className='row align-items-center mb-3 p-3 bg-dark'>
									<div className='col'><h6 className='mb-0'>reddit post object</h6></div>
									<div className='col-auto'>Item#0</div>
									<div className='col-auto'><button className='btn btn-sm btn-secondary' onClick={() => setShowDataDebug(false)}>X</button></div>
								</div>
								<pre className='bg-dark p-4' style={{ fontSize: '.7rem' }}><code>{JSON.stringify(redditImages && redditImages[0] ? redditImages[0] : '', null, 2)}</code></pre>
							</section>}
						</div>
					}
				</section>
			</main>
		</div>
	)
}
