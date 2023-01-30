import React, { useMemo } from 'react'
import { IRedditPost } from './App.props'
import { FixedItemProps } from './ImageGrid.props'
import { Gallery, Item } from 'react-photoswipe-gallery'
import 'photoswipe/dist/photoswipe.css'

interface IProps {
	imagePosts: IRedditPost[]
	isShowCap: boolean
}

export default function ImageGrid(props: IProps) {
	const THUMB_SIZE = 140;

	const galleryItems: FixedItemProps[] = useMemo(() => {
		const landCssProps: React.CSSProperties = {
			cursor: 'pointer',
			objectFit: 'cover',
			maxWidth: '100%',
			height: '100%',
		}
		const showImages: FixedItemProps[] = []

		props.imagePosts.forEach((post) => {
			let imgPrevUrl = post.thumbnail
			let imgOrigUrl = post.url
			let imgW = THUMB_SIZE
			let imgH = THUMB_SIZE

			if (post?.preview?.images[0]?.source) {
				const source = post.preview.images[0].source
				imgW = source.width
				imgH = source.height
			}

			// TODO: do we need loading image? src: file.url || '/spinner750.png',

			showImages.push({
				id: post.id,
				caption: `${post.title} (${post.ups} upvotes)` || '(loading)',
				original: imgOrigUrl,
				thumbnail: imgPrevUrl,
				width: imgW,
				height: imgH,
				imgStyle: post.thumbnail_height < THUMB_SIZE ? landCssProps : { cursor: 'pointer' },
				cropped: false, // TODO: add option [[doesnt seem to do anything?]]
			})
		})

		return showImages
	}, [props.imagePosts])

	return galleryItems && galleryItems.length > 0 ? (
		<Gallery id="galleryItems" withCaption={props.isShowCap}>
			<div style={{ display: 'grid', gridGap: '1rem', gridTemplateColumns: `repeat(auto-fit, ${THUMB_SIZE}px)`, }}			>
				{galleryItems.map((item) => (<Item {...item} key={item.id}>
					{({ ref, open }) => (
						<img ref={ref as React.MutableRefObject<HTMLImageElement>}
							onClick={open}
							src={item.thumbnail}
							alt={item.alt}
							style={item.imgStyle}
						/>
					)}
				</Item>
				))}
			</div>
		</Gallery>
	) :
		(<div className='alter alert-info'>(no images to display)</div>)
}
