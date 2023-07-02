import React, {useEffect, useState} from 'react';
import {styled} from '@mui/system';

interface ThumbnailProps {
    src: string;
    alt: string;
    height: string;
    sx?: any;
}

interface ContainerProps {
    height: string;
    sx?: any;
}

const Img = styled('img')({
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    objectPosition: 'center',
});

const Container = styled('div')<ContainerProps>(({height, sx}) => ({
    width: '100%',
    overflow: 'hidden',
    display: "flex",
    alignItems: "center",
    height,
    ...sx
}));

const Thumbnail: React.FC<ThumbnailProps> = ({src, alt, height, sx = {}}) => {
    const [imgHeight, setImgHeight] = useState<number>(0);
    const imgRef = React.useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (imgRef.current) {
            setImgHeight(imgRef.current.offsetHeight);
        }
    }, [src]);

    return (
        <Container height={imgHeight > parseInt(height) ? height : `${imgHeight}px`} sx={sx}>
            <Img ref={imgRef} onLoad={() => setImgHeight(imgRef.current?.offsetHeight || 0)} src={src} alt={alt}/>
        </Container>
    );
};

export default Thumbnail;
