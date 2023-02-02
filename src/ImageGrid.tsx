import React, { useMemo } from 'react'
import { IRedditImage, IGridSize } from './App.props'
import { FixedItemProps } from './ImageGrid.props'
import { Gallery, Item } from 'react-photoswipe-gallery'
import 'photoswipe/dist/photoswipe.css'
import './css/ImageGrid.css'

interface IProps {
	imagePosts: IRedditImage[]
	isShowCap: boolean
	selGridSize: IGridSize
}

export default function ImageGrid(props: IProps) {
	const galleryItems: FixedItemProps[] = useMemo(() => {
		const showImages: FixedItemProps[] = []

		props.imagePosts.forEach((post) => {
			showImages.push({
				id: post.id,
				caption: `${post.title} (${post.ups} upvotes)` || '(loading)',
				original: post.galleryOrigUrl,
				thumbnail: post.galleryThumbUrl,
				width: post.galleryOrigW,
				height: post.galleryOrigH,
				cropped: false, // TODO: add option [[doesnt seem to do anything?]]
			})
		})

		return showImages
	}, [props.imagePosts])

	return galleryItems && galleryItems.length > 0 ? (
		<Gallery id="galleryItems" withCaption={props.isShowCap}>
			<div className="grid" style={{ gridTemplateColumns: `repeat(auto-fill, minMax(${props.selGridSize.css}, 1fr)` }}>
				{galleryItems.map((item) => (<Item {...item} key={item.id}>
					{({ ref, open }) => (
						<figure className={item.width > item.height ? 'landscape' : ''}>
							<img ref={ref as React.MutableRefObject<HTMLImageElement>} onClick={open} src={item.thumbnail} alt={item.alt} />
							{props.isShowCap && <figcaption>{item.caption}</figcaption>}
						</figure>
					)}
				</Item>
				))}
			</div>
		</Gallery>
	) :
		(<div className='alter alert-info'>(no images to display)</div>)
}
