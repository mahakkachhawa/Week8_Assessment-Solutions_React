import React from "react";

const STARS = [1, 2, 3, 4, 5];

// CLASS COMPONENT: state is managed with this.state / this.setState
class StarRating extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rating: 0,
      submitted: false,
      error: "",
    };

    // Bind class event handlers so `this` points to the component
    this.handleStarClick = this.handleStarClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleStarClick(event) {
    this.setState({
      rating: Number(event.target.value),
      submitted: false,
      error: "",
    });
  }

  handleSubmit() {
    if (this.state.rating === 0) {
      this.setState({ error: "Please select a rating", submitted: false });
    } else {
      this.setState({ submitted: true, error: "" });
    }
  }

  handleClear() {
    this.setState({ rating: 0, submitted: false, error: "" });
  }

  render() {
    const { rating, submitted, error } = this.state;

    return (
      <section className="section">
        <p id="classLabel" className="badge badge-class">Class Component (this.state)</p>

        <h2 className="section-heading">Rate your experience</h2>

        <div className="stars">
          {STARS.map((star) => (
            <button
              key={star}
              id={`star${star}`}
              type="button"
              value={star}
              className={star <= rating ? "star-btn star-filled" : "star-btn"}
              onClick={this.handleStarClick}
            >
              ★
            </button>
          ))}
        </div>

        <p id="ratingText" className="rating-text">{`You rated: ${rating} / 5`}</p>

        <div className="button-row">
          <button id="submitRatingBtn" className="primary-btn" onClick={this.handleSubmit}>
            Submit Rating
          </button>
          <button id="clearRatingBtn" className="secondary-btn" onClick={this.handleClear}>
            Clear
          </button>
        </div>

        {error && <p id="ratingError" className="message message-error">{error}</p>}
        {submitted && (
          <p id="thanksMessage" className="message message-ok">
            {`Thanks for rating ${rating} star${rating === 1 ? "" : "s"}!`}
          </p>
        )}
      </section>
    );
  }
}

export default StarRating;