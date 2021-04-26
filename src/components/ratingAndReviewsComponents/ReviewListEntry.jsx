import React from 'react';
import axios from 'axios';
import Stars from '../Stars.jsx';
import formatDate from '../../../utils/formatDate.js';
import validBody from '../../../utils/validBody.js';
import truncateText from '../../../utils/truncateText.js';

class ReviewListEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPhoto: false,
    };
    this.showPhoto = this.showPhoto.bind(this);
    this.hidePhoto = this.hidePhoto.bind(this);
    this.clickHelpfulHandler = this.clickHelpfulHandler.bind(this);
    this.clickReportHandler = this.clickReportHandler.bind(this);
    this.setLargeBody = this.setLargeBody.bind(this);
    this.handleShowMore = this.handleShowMore.bind(this);
  }

  componentDidMount() {
    this.setLargeBody();
  }

  componentDidUpdate(prevProps) {
    if (this.props.filter !== prevProps.filter || this.props.reviews !== prevProps.reviews) {
      this.setLargeBody();
    }
  }

  showPhoto(idx) {
    this.setState({
      showPhoto: true,
      idx: idx
    });
  }

  hidePhoto() {
    this.setState({
      showPhoto: false
    });
  }

  clickHelpfulHandler(review_id) {
    if (this.props.reviewIds.indexOf(review_id) === -1) {
      return axios
        .put(`http://3.21.164.220/reviews/${review_id}/helpful`, {
          params: { review_id: review_id }
        })
        .then(result1 => this.props.addClickedReviewId(review_id))
        .then(result2 => {
          if (this.props.filter) {
            this.props.getCurrentFiltered(review_id);
          } else {
            this.props.getCurrentReviews(this.props.sort);
          }
        })
        .then(result3 => {
          if (!this.props.moreReviews) {
            this.props.handleMoreReviewsClick(this.props.filter)}
          })
        .catch(err => console.log(err));
    }
  }

  clickReportHandler(review_id) {
    return axios
      .put(`http://3.21.164.220/reviews/${review_id}/report`, {
        params: { review_id: review_id }
      })
      .then(result1 => this.props.getCurrentReviews(this.props.sort))
      .then(result2 => {
        if (!this.props.moreReviews) {
          this.props.handleMoreReviewsClick(this.props.filter)}
        })
      .catch(err => console.log(err));
  }

  setLargeBody() {
    let largeBody = this.props.review.body.slice(0, 250);
    this.setState({
      largeBody: truncateText(largeBody),
      showButton: true
    });
  }

  handleShowMore() {
    this.setState({
      largeBody: this.props.review.body,
      showButton: false
    });
  }

  render() {
    const { review } = this.props;
    const largeBody = validBody(review.body, 251);

    return (
      <div>
        {/* {console.log(review)} */}
        {/* {console.log(this.state)} */}
        <div className="starRatingReviewerNameAndDate">
          <div>{Stars(70, review.rating)}</div>
          <div className="reviewerNameAndDate">
            {/* <span>Verified Purchaser </span> */}
            {review.reviewer_name}, {formatDate(review.date)}</div>
        </div>
        <div>
          <strong className="individualReviewSummary">{review.summary}</strong>
        </div>
        {largeBody ? <div>
          <p className="individualReviewBody">
            {this.state.largeBody}
          </p>
          {this.state.showButton ? <div
            className="showMoreBody"
            onClick={this.handleShowMore}
          >Show more</div> : null}
        </div> : <div><p className="individualReviewBody">{review.body}</p></div>}
        <div>
          {review.photos.map((photo, idx) => {
            return (<img
              onClick={() => this.showPhoto(idx)}
              className="reviewListEntryThumbnail"
              src={photo.url}
              key={idx}
            />);
          })}
        </div>
        {review.recommend ? <div>
          <div className="checkSymbol">&#10003;</div>
          <p className="recommendText">I recommend this product</p>
        </div> : null}
        {review.response ? <div className="reviewSellerResponse">
          <p className="reviewSellerText">Response from seller: </p>
          <p className="actualSellerResponse">{review.response}</p>
        </div> : null}
        <div className="reviewHelpfulAndReport">
          <p className="reviewHelpfulText">Was this review helpful?</p>
          <div
            className="reviewHelpfulLink"
            onClick={() => this.clickHelpfulHandler(review.review_id)}
          >Yes</div>
          <p className="reviewHelpfulYes">({review.helpfulness})</p>
          <p className="reviewHelpfulReportDivider">|</p>
          <div
            className="reviewReportLink"
            onClick={() => this.clickReportHandler(review.review_id)}
          >Report</div>
        </div>
        {this.state.showPhoto ? <img
          className="reviewsPhoto"
          src={review.photos[this.state.idx].url}
          onClick={this.hidePhoto}
        /> : null}
        <hr />
      </div>
    );
  }
};

export default ReviewListEntry;