import React, { useEffect, useMemo, useState } from 'react'
import { OPT_PAGESIZE, OPT_SORTBY, OPT_SORTDIR, Post, RedditSubs, SortType } from './App.props'
import ImageGrid from './ImageGrid'

export default function AppMain() {
	const [pagingSize, setPagingSize] = useState(12)
	const [pagingPage, setPagingPage] = useState(1)
	const [optSortBy, setOptSortBy] = useState(OPT_SORTBY.modDate)
	const [optSortDir, setOptSortDir] = useState(OPT_SORTDIR.desc)
	const [optPgeSize, setOptPgeSize] = useState(OPT_PAGESIZE.ps12)
	const [optSchWord, setOptSchWord] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	//
	//const [selDelaySecs, setSelDelaySecs] = useState<DelayTime | string>(DelayTime.secNo)
	const [selRedditSub, setSelRedditSub] = useState<string>(RedditSubs.memes)
	const [selSortType, setSelSortType] = useState<string>(SortType.top)
	const [posts, setPosts] = useState<Post[]>([])

	/** fetch subreddit images */
	useEffect(() => {
		interface SubJson { kind: string, data: Post }

		setIsLoading(true)

		// FYI: sortType is optional - omit it for default results
		fetch(`https://www.reddit.com/r/${optSchWord || selRedditSub}/${selSortType}.json`)
			.then((response) => response.json())
			.then((json) => {
				const posts: Post[] = []
				json.data.children
					.filter((child: SubJson) => child && child.data && child.data.preview && child.data.preview.images?.length > 0)
					.forEach((child: SubJson) => {
						posts.push({
							subreddit: child.data.subreddit,
							subreddit_subscribers: child.data.subreddit_subscribers,
							selftext: child.data.selftext,
							title: (child.data.title || '').replace(/&amp;/gi, '&'),
							permalink: child.data.permalink,
							link_flair_text: child.data.link_flair_text,
							thumbnail: child.data.thumbnail,
							url: child.data.url,
							id: child.data.id,
							num_comments: child.data.num_comments,
							ups: child.data.ups,
							downs: child.data.downs,
							over_18: child.data.over_18,
							score: child.data.score,
							pinned: child.data.pinned,
							preview: child.data.preview,
							created: child.data.created,
							created_utc: child.data.created_utc,
							dateCreated: new Date(child.data.created * 1000),
							author: child.data.author,
						})
					})
				setPosts(posts)
			})
			.catch((ex) => {
				console.error(ex)
			})
			.finally(() => {
				setIsLoading(false)
			})
		// TODO: rule below is only until we add useDelay hook (or whatever) to implement `optSchWord`!
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selRedditSub, selSortType, optPgeSize])

	useEffect(() => {
		if (optPgeSize === OPT_PAGESIZE.ps08) setPagingSize(8)
		else if (optPgeSize === OPT_PAGESIZE.ps12) setPagingSize(12)
		else if (optPgeSize === OPT_PAGESIZE.ps24) setPagingSize(24)
		else if (optPgeSize === OPT_PAGESIZE.ps48) setPagingSize(48)
	}, [optPgeSize])

	const showFiles = useMemo(() => {
		return posts
			//.filter((item)=>{ return !optSchWord || item.name.toLowerCase().indexOf(optSchWord.toLowerCase()) > -1 }) // FUTURE: suport searches
			.filter((_item, idx) => { return idx >= ((pagingPage - 1) * pagingSize) && idx <= ((pagingPage * pagingSize) - 1) })
	}, [posts, pagingPage, pagingSize])

	// --------------------------------------------------------------------------------------------

	function renderNavbar(): JSX.Element {
		function renderPrevNext(): JSX.Element {
			const isDisabledNext = showFiles.length === 0
			// TODO: disabled={pagingPage<(showFiles.length > (pagingSize+1))}

			return (<form className="d-flex me-0 me-lg-5">
				<button className="btn btn-info me-2" type="button" onClick={() => { setPagingPage(pagingPage > 1 ? pagingPage - 1 : 1) }} disabled={pagingPage < 2}>Prev</button>
				<button className="btn btn-info" type="button" onClick={() => { setPagingPage(pagingPage + 1) }} disabled={isDisabledNext}>Next</button>
			</form>)
		}

		return (
			<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
				<div className="container-fluid px-0">
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
								<a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Subreddit</a>
								<ul className="dropdown-menu">
									{Object.keys(RedditSubs).map((subName, idx) => {
										return (<li key={`sub${idx}`}>
											<button className="dropdown-item" disabled={selRedditSub === subName} onClick={() => setSelRedditSub(subName)}>{subName}</button>
										</li>)
									})}
								</ul>
							</li>
							<li className="nav-item dropdown" data-desc="opt-sortby">
								<a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Sorting</a>
								<ul className="dropdown-menu">
									{Object.keys(SortType).map((sortName, idx) => {
										return (<li key={`sort${idx}`}>
											<button className="dropdown-item" disabled={selSortType === sortName} onClick={() => setSelSortType(sortName)}>{sortName}</button>
										</li>)
									})}
								</ul>
							</li>
							<li className="nav-item dropdown" data-desc="opt-pagesize">
								<a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Paging</a>
								<ul className="dropdown-menu">
									<li><button className="dropdown-item" disabled={optPgeSize === OPT_PAGESIZE.ps08} onClick={() => setOptPgeSize(OPT_PAGESIZE.ps08)}>{OPT_PAGESIZE.ps08}</button></li>
									<li><button className="dropdown-item" disabled={optPgeSize === OPT_PAGESIZE.ps12} onClick={() => setOptPgeSize(OPT_PAGESIZE.ps12)}>{OPT_PAGESIZE.ps12}</button></li>
									<li><button className="dropdown-item" disabled={optPgeSize === OPT_PAGESIZE.ps24} onClick={() => setOptPgeSize(OPT_PAGESIZE.ps24)}>{OPT_PAGESIZE.ps24}</button></li>
									<li><button className="dropdown-item" disabled={optPgeSize === OPT_PAGESIZE.ps48} onClick={() => setOptPgeSize(OPT_PAGESIZE.ps48)}>{OPT_PAGESIZE.ps48}</button></li>
								</ul>
							</li>
						</ul>
						{document.location.hostname === 'localhost' &&
							<div className="d-flex d-none d-xl-block me-5" data-desc="debug-badges">
								<div className='badge text-bg-secondary'>Showing {showFiles.length} of {posts.length}</div>
							</div>
						}
						<div className='d-none d-lg-block'>{renderPrevNext()}</div>
						<form className="d-flex" role="search">
							<input className="form-control" type="search" placeholder="Search" aria-label="Search" onChange={(ev) => { setOptSchWord(ev.currentTarget.value) }} />
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
			<main>
				<div>
					{isLoading ?
						<section>
							<div className='text-center bg-dark p-3'>
								<div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
							</div>
						</section>
						:
						<ImageGrid showFiles={showFiles} />
					}
				</div>
			</main>
		</div>
	)
}
