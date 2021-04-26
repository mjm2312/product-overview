import React from 'react';
// import FB from 'fb';
// var FB = require('fb')

import Gallery from './Gallery'
import StyleSelector from './StyleSelector'
import Cart from './Cart'
import Stars from '../Stars.jsx';

import Tracker from './Tracker'

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // accum: 0,

      x: 0,
      y: 0,
      // nextImageWidth: 0,
      mainImageWidth: 0,
      // expandedViewOffset: 0,

      thumbnails: '',
      mainImage: 0,
      startIndex: 0,
      endIndex: 3,



      original_price: '',
      sale_price: '',


      
      styles: [],
      currentStyle: '',
    }
 
    this.slideThumbnailsDown = this.slideThumbnailsDown.bind(this);
    this.slideThumbnailsUp = this.slideThumbnailsUp.bind(this);
    this.updateMainImage = this.updateMainImage.bind(this);
    this.slideRight = this.slideRight.bind(this);
    this.slideLeft = this.slideLeft.bind(this);

    this.onMouseMove = this.onMouseMove.bind(this);
  }

  onMouseMove(e) {
    this.setState({ x: e.nativeEvent.offsetX,
                    y: e.nativeEvent.offsetY });
  }

  slideRight() {
  
    var mainIndex = this.state.mainImage + 1;

    if (mainIndex > this.state.endIndex) {
      var newStartIndex = this.state.startIndex > mainIndex - this.state.endIndex 
      ? this.state.startIndex : mainIndex - this.state.endIndex;
      
      this.setState({
        startIndex: newStartIndex
      })
    }

    this.setState({
      mainImage: mainIndex
    })
  }

  slideLeft() {
    var mainIndex = this.state.mainImage - 1;

    if (mainIndex < this.state.endIndex-1 && this.state.startIndex !== 0) {
      var newStartIndex = this.state.startIndex - 1
      this.setState({
        startIndex: newStartIndex
      })
    }

    this.setState({
      mainImage: mainIndex
    })
  }


  updateMainImage(index) {
    this.setState({
      mainImage: index
    })
  }

  slideThumbnailsDown() {
  
    if (this.state.startIndex >= this.state.thumbnails.length-this.state.endIndex-1) {
      return;
    }

    var newStart = this.state.startIndex + 1

    this.setState({
      startIndex: newStart
    })
  }

  slideThumbnailsUp() {
  
    if (this.state.startIndex <= 0) {
      return;
    }

    var newStart = this.state.startIndex - 1
    this.setState({
      startIndex: newStart
    })

  }


  componentDidMount() {
    // console.log('hi', this.props.currentStyle)
      this.setState({
        mainImageWidth: this.getImageWidth(0)
      })

    // this.incrementExpandedViewOffset = this.incrementExpandedViewOffset.bind(this);
    // this.decrementExpandedViewOffset = this.decrementExpandedViewOffset.bind(this);
  }
  
  
  getImageWidth(index) {

    if (this.props.currentStyle!== undefined) {

        var x = this.props.currentStyle.photos[index].url.indexOf('&w=')
        var y = this.props.currentStyle.photos[index].url.indexOf('&q')
        var width = this.props.currentStyle.photos[index].url.slice(x+3,y);
       
        return Number(width);
    }

  }

  componentDidUpdate(prevProps, prevState) {
   
    if (this.state.thumbnails === '' && this.props.currentStyle!=='') {

       this.setState({
       thumbnails: this.props.currentStyle.photos
      })
    }

    if (this.state.mainImage !== prevState.mainImage) {
     
      var x = this.props.currentStyle.photos[this.state.mainImage].url.indexOf('&w=')
      var y = this.props.currentStyle.photos[this.state.mainImage].url.indexOf('&q')
      var width = this.props.currentStyle.photos[this.state.mainImage].url.slice(x+3,y);
     
      this.setState({
        mainImageWidth: Number(width)
      })
      
    }

  }

  render() {
    
    if (!this.props.expandedView) {
      return (
        <Tracker
          render = { ({trackAction}) => {
            return (
              <div className = "overview-container">
                <div className="item grid-item1">            
                  <Gallery
                    trackAction = {trackAction}
                    moduleName = {'Gallery'} 
                    
                    currentStyle = {this.props.currentStyle} 
                    setCurrentStyle = {this.props.setCurrentStyle} 
                    toggleExpandedView = {this.props.toggleExpandedView}
                    updateMainImage = {this.updateMainImage} 
                    slideRight = {this.slideRight} 
                    slideLeft = {this.slideLeft}
                    slideThumbnailsDown = {this.slideThumbnailsDown} 
                    slideThumbnailsUp = {this.slideThumbnailsUp}
                    mainImage = {this.state.mainImage} 
                    thumbnails = {this.state.thumbnails}
                    startIndex = {this.state.startIndex} 
                    endIndex = {this.state.endIndex}
                  />   
                </div>
                <div className="item grid-item2"> 
                  <ProductInfo
                    trackAction = {trackAction}                                                        
                    moduleName = {'ProductInfo'} 
                    
                    category = {this.props.product.category} 
                    name = {this.props.product.name} 
                    default_price = {this.props.product.default_price} 
                    original_price = {this.props.currentStyle.original_price} 
                    sale_price = {this.props.currentStyle.sale_price} 
                    average_rating = {this.props.product.average}
                  />             
                </div>
                <div className="item grid-item3"> 
                  <StyleSelector 
                    moduleName = {'StyleSelector'} 
                    trackAction = {trackAction}
                    
                    styles = {this.props.product.styles} 
                    setCurrentStyle = {this.props.setCurrentStyle}
                    /> 
                </div>
                <div className="item grid-item4"> 
                  <Cart 
                    moduleName = {'Cart'} 
                    trackAction = {trackAction}

                    currentStyle = {this.props.currentStyle} 
                    toggleOutfit = {this.props.toggleOutfit} 
                    product = {this.props.product}
                  /> 
                </div>
                <div className="item grid-item5"> 
                  <ProductDescription 
                    moduleName = {'ProductDescription'} 
                    trackAction = {trackAction}
                                                                      
                    slogan = {this.props.product.slogan} 
                    description = {this.props.product.description}
                  />
                </div>
                <div className="item grid-item6"> 
                  <Features 
                    moduleName = {'Features'} 
                    trackAction = {trackAction} 
                                                            
                    features = {this.props.product.features}/> 
                </div>
              </div>
            )
          }}
      /> 
      )
    }
   
    else if (this.props.expandedView && !this.props.expandedViewZoom){
       return (

        <ExpandedView 
          expandedView = {this.props.expandedView}
          expandedViewZoom = {this.props.expandedViewZoom}
          
          // trackAction = {trackAction}
          // moduleName = {'ExpandedView'}

          mainImageWidth = {this.state.mainImageWidth}
          mainImage = {this.state.mainImage}
          currentStyle = {this.props.currentStyle}
          toggleExpandedViewZoom = {this.props.toggleExpandedViewZoom}
          slideLeft = {this.slideLeft}
          slideRight = {this.slideRight}
          updateMainImage = {this.updateMainImage}
          />
      )
    } else if (this.props.expandedViewZoom) {

      return (

      <ExpandedViewZoom 
          // trackAction = {trackAction}
          // moduleName = {moduleName}

          mainImageWidth = {this.state.mainImageWidth}
          currentStyle = {this.props.currentStyle}
          mainImage = {this.state.mainImage}
          onMouseMove = {this.onMouseMove}
          toggleExpandedView = {this.props.toggleExpandedView}
          toggleExpandedViewZoom = {this.props.toggleExpandedViewZoom}
          x = {this.state.x}
          y = {this.state.y}
        />
      )
    }
  }
}





let ExpandedView = ({expandedView, expandedViewZoom, trackAction, moduleName, 
  mainImageWidth, mainImage, currentStyle,toggleExpandedViewZoom, slideLeft, slideRight, updateMainImage}) => {

    return (
      // <div onClick = {(e) => trackAction(e, moduleName)}> REIMPLEMENT THIS WHEN YOU CAN WRAP all 3 conditional renders UNDER 1 TRACKER COMPONENT
      <div>
        <div className = "expandedView" style = {{width: Math.min(mainImageWidth, (window.innerWidth - 60)*.7)}}>
        <span className = {mainImage === 0 ? null : 'arrowIconWrapperLeftExpandedView'}>
              <i className={mainImage === 0 ? "arrow left hidden" : "arrow left active"} onClick = {slideLeft}></i> 
        </span>
        <span className = 'expandedViewIcons'>
              {currentStyle.photos.map((x, index) => {
                return (
                  <div key = {index} 
                       className = {mainImage === index ? 'expandedViewIconWrapperActive' : 'expandedViewIconWrapper'}
                       onClick = {() => updateMainImage(index)}
                  >
                    {/* <img className = 'expandedViewIcon' src = {x.thumbnail_url}
                         onClick = {() => updateMainImage(index)}>
                    </img> */}
                  </div>
                )
              })}
        </span>
          <img src = {currentStyle.photos[mainImage].url} id = 'expandedImage'onClick = {toggleExpandedViewZoom}/>
        <span className = {mainImage === currentStyle.photos.length-1 ? null : 'arrowIconWrapperRightExpandedView'}>
          <i className={mainImage === currentStyle.photos.length-1 ? "arrow right hidden" : "arrow right active"} onClick = {slideRight}></i> 
        </span>
      </div>
    </div>
    )
}

let ExpandedViewZoom = ({mainImageWidth, trackAction, moduleName, currentStyle, mainImage, 
  onMouseMove, toggleExpandedView, toggleExpandedViewZoom, x, y}) => {
    return (
      // <div onClick = {(e) => trackAction(e, moduleName)}>
      <div>
        <div className = "expandedViewZoom" style = {{width: Math.min(mainImageWidth, (window.innerWidth - 60)*.7)}}>
          <img src = {currentStyle.photos[mainImage].url}
            onMouseMove = {onMouseMove}
            onClick = {()=> {toggleExpandedView(); toggleExpandedViewZoom()}}
            id = 'expandedImageZoom'
            style = {{objectPosition: 
                Math.min(mainImageWidth, (window.innerWidth - 60)*.7) === mainImageWidth ?
                `-${(0)}px -${(y)/1.5}px`
                :
                `-${(x)/ (966/(mainImageWidth-((window.innerWidth - 60)*.7)))}px -${(y)/1.2}px`}}
            />  
          <h1>Mouse Coordinates: {x} {y} </h1>        
        </div>
      </div>
    )
}




let Features = ({features, trackAction, moduleName}) => {
  if (features === '') {
    return (
      <div> 
       null so far 
      </div>
    )
  } else {
    return (
      <div onClick = {(e) => trackAction(e, moduleName)}> 
        <div className = 'productFeaturesValuesOuterWrapper'>
          {features.map((x, index) => {
            return (
            <div key = {index} className = 'productFeaturesValuesInnerWrapper'>
              <span className = 'productFeatures'>{x.feature}{'   '}</span>
              <span className = 'productValues'>{x.value}</span>
            </div>
            )
          })}
        </div>
      </div>
    )
  }

}




let ProductDescription = ({slogan, description, trackAction, moduleName}) => {
  if (slogan === '') {
    return (
      <div> 
       null so far 
      </div>
    )
  } else {
    return (
      <div onClick = {(e) => trackAction(e, moduleName)}>
        <div id = 'slogan'> {slogan} </div>
        <div id = 'description'> {description} </div>

        <div id = 'social-media-wrapper'> 
          <div className = 'social-media-icon-wrapper'> 
            
            <a href="https://twitter.com/intent/tweet?text=Hello%20world">
              <img src = '../../../dist/images/twitter.png' className = 'social-media-icon'/>
            </a>
          </div>
          <div className = 'social-media-icon-wrapper'> 
            <div data-href={window.location.href}>
              <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2F127.0.0.1%3A5501%2Fdist%2Findex.html%3Fid%3D8&amp;src=sdkpreparse" className = "fb-xfbml-parse-ignore">
                <img src = '../../../dist/images/fb.png' className = 'social-media-icon'/>
              </a>
            </div>          
          </div>
          <div className = 'social-media-icon-wrapper'> 
            <a href="https://www.pinterest.com/pin/create/button/" data-pin-do="buttonBookmark">
              <img src = '../../../dist/images/pinterest.png' className = 'social-media-icon'/>
            </a>
          </div>
          <div className = 'social-media-icon-wrapper'> 
            <img src = '../../../dist/images/ig.png' className = 'social-media-icon'/>
          </div>
        
        </div>

      </div>
    )
  }

}



let ProductInfo = ({category, name, default_price, original_price, sale_price, average_rating, trackAction, moduleName}) => {


  if (original_price === '') {
    return (
      <div> 
        {/* {Stars(140, product.average || product.rating)} */}
        <div id = 'category'> {category} </div>
        <div id = 'expandedProductName'> {name} </div>
        <div id = 'price'> ${default_price}  </div>
      </div>
    )
  } else {

    return (
      <div onClick = {(e) => trackAction(e, moduleName)}>
        
        <div className = 'star-reviews-wrapper'> 
        {Stars(50, average_rating)}
        </div>
        <div id = 'read-all-reviews'
          onClick = {()=>{
            document.getElementById('RatingAndReviews').scrollIntoView()
          }
        }
        >
          Read All Reviews
        </div>
   
        <div id = 'category'> {category} </div>
        <div id = 'expandedProductName'> {name} </div>
        <div id = 'price'> {original_price - sale_price === 0 ? original_price : <span> 
                                                                                    <span style ={{color: 'red'}}>${sale_price} </span> 
                                                                                    <span style ={{textDecoration: 'line-through'}}>${original_price} </span>  
                                                                                  </span> }  
        </div>

      </div>
    )
  }

}

let Test = ({name, trackAction}) => {
 return (
   <div id="test" onClick = {(e)=>trackAction(e, name)}>
     Hi {name}
   </div>
 )
}





export default Overview;