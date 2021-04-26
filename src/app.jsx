import React from 'react';
import Overview from './components/overview/Overview.jsx';
import axios from 'axios';
import _ from 'underscore';
import ls from 'local-storage';
import RatingAndReviews from './components/ratingAndReviewsComponents/RatingAndReviews.jsx';
import Related from './components/relatedProducts/Related.jsx';
import average from '../utils/average.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {relatedProducts: [],outfit: [], outfitIndex: {}, currentStyle: false,
      productId: null, productInfo: {faved: false}, relatedIndex: {}, expandedViewZoom: false, expandedView: false};
    this.handleRedirect = this.handleRedirect.bind(this);
    this.toggleOutfit = this.toggleOutfit.bind(this);
    this.getLocalOutfit.bind(this);
    this.setLocalOutfit.bind(this);
    this.getProduct = this.getProduct.bind(this);
    this.getRelatedProducts = this.getRelatedProducts.bind(this);
    this.setProduct = this.setProduct.bind(this);
    this.setCurrentStyle = this.setCurrentStyle.bind(this);

    this.clickTracker = this.clickTracker.bind(this);
    this.toggleExpandedView = this.toggleExpandedView.bind(this);
    this.toggleExpandedViewZoom = this.toggleExpandedViewZoom.bind(this);
  }
  componentDidMount() {
    var id = Number(window.location.search.split('?id=')[1]) || 1;
    this.setProduct(id);
  }
  setProduct(id) {
    this.setState({relatedProducts: [],outfit: [], outfitIndex: {}, currentStyle: false,
      productId: null, productInfo: {faved: false}, relatedIndex: {}});
    this.getProduct(id, (product, style) => {
      this.setState({productInfo: product, productId: id, currentStyle: style});
    });
    this.getRelatedProducts(id);
  }
  getProduct(id, cb) {
    axios.get(`http://3.21.164.220/products/${id}`)
      .then((results) => {
        var product = results.data;
        axios.get(`http://3.21.164.220/products/${id}/styles?product_id=${id}`)
        .then((styles) => {
          axios.get(`http://3.21.164.220/reviews/meta?product_id=${id}`)
            .then((ratings) => {
              product.average = average(ratings.data);
              product.styles = styles.data;
              product.faved = false; //true if product is in outfit

              cb(product, styles.data.results[0]);
            });
        });
      }).catch((e) => console.log('Invalid ID'));
  }
  getRelatedProducts(id) {
    var count = 0;
    axios.get(`http://3.21.164.220/products/${id}/related?product_id=${id}`)
      .then((results) => {
        var products = [];
        _.each(results.data, (id) => {
          this.getProduct(id, (product) => {
            products.push(product);
            var index = this.state.relatedIndex;
            index[id] = count;
            count++;
            if (count === results.data.length) {
              this.setState({relatedProducts: products, relatedIndex: index});
              this.getLocalOutfit();
            }
          });
        });
    });
  }
  handleRedirect(id) {
      if (id !== this.state.productId) {
        var newURL = window.location.href.split('?id=')[0].concat(`?id=${id}`);
        window.history.pushState({path: newURL}, '', newURL)
        this.setProduct(id);
      }
  }
  getLocalOutfit() {
    var local = ls.get('outfit') || [];
    if (local.length) {
      var outfit = [];
      var outsource = [];
      var index = {};
      var count = 0;
      var currentFaved = 0;
      var related = this.state.relatedProducts;
      var relatedIndex = this.state.relatedIndex;
      for (var i of local) {
        if (i === this.state.productId) {
          var current = this.state.productInfo;
          current.faved = true;
          this.setState({productInfo: current});
          currentFaved = 1;
        } else {
          if (relatedIndex[i] !== undefined) {
            related[relatedIndex[i]].faved = true;
            outfit.push(related[relatedIndex[i]]);
            index[i] = count;
            count++;
          } else {
            outsource.push(i);
          }
        }
      }
      if (outsource.length) {
        _.each(outsource, (id) => {
          this.getProduct(id, (product) => {
            outfit.push(product);
            index[id] = count;
            count++;
            if (count === local.length + currentFaved) {
              this.setState({outfit: outfit,
                outfitIndex: index, relatedProducts: related});
            }
          });
        });
      } else {
        this.setState({outfit: outfit,
          outfitIndex: index, relatedProducts: related});
      }
    }
  }
  setLocalOutfit() {
    var outfit = [];
    if (this.state.productInfo.faved) {
      outfit.push(this.state.productId);
    }
    var index = this.state.outfitIndex;
    for (var key in index) {
      if (index[key] >= 0) {
        outfit.push(Number(key));
      }
    }
    ls.set('outfit', outfit);
  }
  toggleOutfit(id) {

    var product, outfit, index;
    if (id === this.state.productId) {
      product = this.state.productInfo;
      product.faved = !product.faved;
      this.setState({productInfo: product});
    } else {
        outfit = this.state.outfit;
        index = this.state.outfitIndex;
        if (index[id] >= 0) {
          delete outfit[index[id]];
          index[id] = -1;
          this.setState({outfit: outfit, outfitIndex: index});
        } else {
          product = this.state.relatedProducts[this.state.relatedIndex[id]];
          index[id] = outfit.length;
          outfit.push(product);
          this.setState({outfit: outfit, outfitIndex: index});
      }
    }
    this.setLocalOutfit();
  }
  setCurrentStyle(newStyle, originalPrice, salePrice) {
    this.setState({
      currentStyle: newStyle,
      // original_price: originalPrice,
      // sale_price: salePrice
    })
  }
  toggleExpandedViewZoom() {
    this.setState((prevState) => ({
      expandedViewZoom: !prevState.expandedViewZoom
    }))
  }

  toggleExpandedView() {
    this.setState((prevState) => ({
      expandedView: !prevState.expandedView
    }))
  }

  clickTracker (e, module) {
    var date = new Date();
    var node = e.target;
    while (node.className.length === 0) {
      node = node.parentNode;
    }
    axios({method: 'post', url: '/clicks',
      data: {date: date, element: node.className, module: module}});
  }
  render() {
    return (
      <div>
        <div className="nav">
          <span className="logo">Donauwelle</span>
        </div>
          <div className="app">
          <div id = 'Overview' onClick={(e) => this.clickTracker(e, 'Overview')}>
          {this.state.currentStyle ? 
            <Overview 
              product={this.state.productInfo}
              currentStyle = {this.state.currentStyle} 
              toggleOutfit = {this.toggleOutfit}
              setCurrentStyle = {this.setCurrentStyle} 
              expandedView = {this.state.expandedView}
              expandedViewZoom = {this.state.expandedViewZoom} 
              toggleExpandedView = {this.toggleExpandedView}
              toggleExpandedViewZoom = {this.toggleExpandedViewZoom}
            /> : null} 
           </div>
          
        <div onClick={(e) => this.clickTracker(e, 'Related Products')}
          className="listies" style = {{display: this.state.expandedView || this.state.expandedViewZoom ? 'none' : null}}>
          <Related overview={this.state.productInfo} handleRedirect={this.handleRedirect}
          pyro={0} products={this.state.relatedProducts} toggleOutfit={this.toggleOutfit}/>
          <Related overview={this.state.productInfo} handleRedirect={this.handleRedirect}
          pyro={1} products={this.state.outfit} toggleOutfit={this.toggleOutfit}/>
        </div>
        {this.state.productId && this.state.productInfo ?
          <div id= "RatingAndReviews" style = {{display: this.state.expandedView || this.state.expandedViewZoom ? 'none' : null}}
            onClick={(e) => this.clickTracker(e, 'Ratings and Reviews')}>
            <RatingAndReviews
              productId={this.state.productId}
              product={this.state.productInfo.name}
            />
          </div>
        : null}
        </div>
      </div>
    )
  }
}

export default App;