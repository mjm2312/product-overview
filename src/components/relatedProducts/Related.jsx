import React from 'react';
import axios from 'axios';
import _ from 'underscore';
import ProductItem from './ProductItem';

class Related extends React.Component {

    constructor(props) {
        super(props);
        this.state = {title: props.title, anim: '', shifted: true, length: 0, XY: [100, 100],
        unq: 0, scroll: 0, showR: false, showL: true, rolling: 'right', shifting: false,
        products: {}, comparingId: null, comparing: false, count: 0};
        this.shift = this.shift.bind(this);
        this.right = this.right.bind(this);
        this.left = this.left.bind(this);
        this.onAnimationEnd = this.onAnimationEnd.bind(this);
        this.onAnimationStart = this.onAnimationStart.bind(this);
        this.hoverHandler = this.hoverHandler.bind(this);
        this.comparison = this.comparison.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.Add = this.Add.bind(this);
    }
    componentDidUpdate() {
        var propLength = 0;
        if(this.props.pyro === 1) {
            for (var i of this.props.products) {
                if (i) {
                    propLength++;
                }
            }
        } else {
            propLength = this.props.products.length;
        }
        if (propLength !== this.state.length && this.state.count < 20) {
            var products = {};
            var length = propLength;
            for (var product of this.props.products) {
                if (product && product.id !== this.props.overview.id) {
                products[product.id] = product;
                }
            }
            var unq = Object.keys(products).length;
            this.setState({products: products, length: length,
                unq: unq, showL: unq > 4, count: this.state.count+1});
        }
    }
    shift(e) {
        if (this.state.shifted) {
            this.setState({anim: this.state.anim ? '' : `related-animation-${e.target.id}`,
                rolling: e.target.id, showR: true, showL: true, shifting: true});
        }
    }
    onAnimationStart () {
        if (this.state.shifting) {
        this.setState({shifted: false});
        }
    }
    onAnimationEnd () {
        if (this.state.shifting) {
        this.setState({
            shifted: true, anim: '', shifting: false,
            showL: !(this.state.scroll === this.state.unq - (this.props.pyro === 0 ? 5 : 4) 
                && this.state.rolling === 'right'),
            showR: !(this.state.scroll === 1 && this.state.rolling === 'left'),
            scroll: this.state.scroll + (this.state.rolling === 'right' ? 1 : -1)
        });
        }
    }
    right() {
        if (this.state.showR) {
            return <div id="left" className="arrowdiv-right" onClick={this.shift}>
                <img id="left" className="related-right" onClick={this.shift}
                    src="./images/left.png"/>
                </div>;
        }
    }
    left() {
        if (this.state.showL) {
            return <div id="right" className="arrowdiv-left" onClick={this.shift}>
                <img id="right" className="related-left" onClick={this.shift}
                src="./images/right.png"/>
                </div>;
        }
    }
    hoverHandler(on, id = 0) {
        if (id >= 0) {
            this.setState({comparing: on, comparingId: id || this.state.comparingId});
        }
    }
    handleClick(e) {
        this.setState({comparing: false});
        if (e.target.className === 'related-item-star') {
            if (Number(e.target.id) !== this.props.overview.id) {
                var products = this.state.products;
                products[e.target.id].faved = !products[e.target.id].faved;
                this.setState({products: products});
                this.props.toggleOutfit(Number(e.target.id));
            } else {
                this.props.toggleOutfit(this.props.overview.id)
            }
        } else if (e.target.id === '-1') {
            this.props.toggleOutfit(this.props.overview.id)
        } else {
            var node = e.target;
            while (!(node.className === 'related-item' || node.className === 'related-item related-shadow')) {
                node = node.parentNode;
            }
            this.props.handleRedirect(Number(node.id));
        }
    }
    comparison() {
        var max = 20;
        var detail = (vals) => {
            return (
                <div key={vals[2]} className="comparison-detail"
                    style={{top: 50 + vals[3]*25, width: 135 + 10*max}}>
                        <a className="comparison-value">
                            {vals[0]}
                        </a>
                        <a className="comparison-center" style={{width: 140 + 10*max}}>
                            {vals[2]}
                        </a>
                        <a className="comparison-value comparison-right">
                            {vals[1]}
                        </a>
                    </div>
            );
        }
        if (this.state.comparing && this.props.pyro === 0 &&
                this.state.products[this.state.comparingId].styles) {
            var item = [this.props.overview,
                this.state.products[this.state.comparingId]];
            var details = [];
            details.push([item[0].styles.results.length,
                item[1].styles.results.length, 'Styles', 0]);
            for (var i of item[0].features) {
                for (var j of item[1].features) {
                    if (i.feature === j.feature) {
                        max = i.value.length > max ? i.value.length :
                            j.value.length > max ? j.value.length : max; 
                        details.push([i.value, j.value, i.feature, details.length]);
                    }
                }
            }
            var dims = [50 + 25 * details.length, 150 + 10 * max];
        return (
            <div className="comparison" onMouseEnter={() => this.hoverHandler(true)}
                onMouseLeave={() => this.hoverHandler(false)}
                style={{height: dims[0], width: dims[1],
                left: this.state.XY[1] - dims[1] / 2,
                marginTop: this.state.XY[0] > window.innerHeight / 2 + 50 ? 20 - dims[0] : 0}}>
                <div className="related-item-category">
                COMPARING
                <div className="comparison-detail" style={{top: 20, width: 135 + 10*max}}>
                    <a className="related-item-name">
                        {item[0].name}
                    </a>
                    <a className="related-item-name comparison-right">
                        {item[1].name}
                    </a>
                </div>
                    {_.map(details, detail)}
                </div>
            </div>
            );
        }
    }
    Add() {
        return (
            <li key="outfit" style={{float: 'left'}}>
                <div id={-1} className="related-item">
                    &nbsp;&nbsp;&nbsp;Add to Outfit
                    <img id={-1} className="related-plus" src="./images/plus.png"/>
                </div>
            </li>
            );
    }

    render() {
        var title = ['RELATED PRODUCTS', 'YOUR OUTFIT'];
        var index = 0;
        var add = this.props.pyro === 0 ? [] : this.props.overview.faved ?
            [this.props.overview] : ['add'];
        return (
            <div className="related-container">
            {this.state.XY[0] > window.innerHeight / 2  + 50 ? this.comparison() : null}
            <div className="related">
                <div className="related-title">{title[this.props.pyro]}</div>
                <div className={`related-item-container ${this.state.anim}`}
                    onAnimationStart={this.onAnimationStart}
                    onAnimationEnd={this.onAnimationEnd}>
                <ul className="related-list" onClick={this.handleClick}>
                {_.map(add.concat(Object.values(this.state.products)).slice(this.state.scroll, this.state.scroll + 
                        (this.state.rolling === 'right' || this.state.shifted ? 5 : 4)), 
                    (product) => {
                        if (product === 'add') {
                            return this.Add();
                        }
                        index++;
                        var srcs = [];
                        for (var set of product.styles.results) {
                            srcs = srcs.concat(set.photos || '');
                        }
                        if (!srcs.length) {
                            srcs = ['','','','',''];
                        }
                        var anim = false;
                        var shadow = '';
                        if (this.state.comparing && this.state.comparingId === product.id) {
                            anim = true;
                            shadow = ' related-shadow';
                        }
                        return <li key={index} style={{float: 'left'}}
                            onMouseEnter={(e) => {
                                this.setState({XY: [e.clientY, e.clientX]});
                                this.hoverHandler(true, product.id);
                            }}
                            onMouseLeave={() => this.hoverHandler(false)}>
                            <ProductItem product={product} pyro={this.props.pyro}
                                faveX={this.faveX} image={srcs} anim={anim} shadow={shadow}/>
                            </li>;
                })}
                </ul>
                </div>
                {this.right()}
                {this.left()}
            </div>
                {this.state.XY[0] < window.innerHeight / 2 + 50 ? this.comparison() : null}
            </div>

        );
    }
}

export default Related;