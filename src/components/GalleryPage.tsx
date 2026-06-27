'use client';
import { PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

type GalleryProp = {
  alt: string;
  src: string;
};

function GalleryPage({ alt, src }: GalleryProp) {
  return (
    <PhotoView src={src}>
      <img src={src} alt={alt} />
    </PhotoView>
  );
}
export default GalleryPage;
