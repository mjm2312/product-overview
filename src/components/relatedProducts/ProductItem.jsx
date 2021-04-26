import React from 'react';
import Stars from '../Stars.jsx';

const ProductItem = ({product, pyro, image, anim, shadow}) => {
    return (
        <div id={product.id} className={`related-item${shadow}`}>
            <div className="related-flipper">
                <div className={anim ? 'related-image-animation' : ''}>
                    <img className="related-item-image" src={image[0].thumbnail_url}/>
                    <img className="related-item-image" src={image[1].thumbnail_url} style={{left:150}}/>
                    <img className="related-item-image" src={image[2].thumbnail_url} style={{left:300}}/>
                    <img className="related-item-image" src={image[3].thumbnail_url} style={{left:450}}/>
                    <img className="related-item-image" src={image[0].thumbnail_url} style={{left:600}}/>
                </div>
            <div className="related-item-faveX">
                <img id={product.id} className="related-item-star"
                    src={`./images/${pyro === 0 ?
                        product.faved ? 'full-star' : 'gray-star' : 'x'}.png`}/>
                </div>
                </div>
            <div className="related-item-info">
                <div className="related-item-category">{product.category}</div>
                    <div className="related-item-name">{product.name}</div>
                    <div className="related-item-category">${product.default_price}</div>
                <div className="related-item-name">
                    {Stars(140, product.average || product.rating)}
                    </div>
            </div>
        </div>
    );
};

export default ProductItem;