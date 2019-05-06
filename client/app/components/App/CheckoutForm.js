import React, { Component } from 'react';
import {
  CardElement,
  StripProvider,
  injectStripe
} from "react-stripe-elements";

class CheckoutForm extends Component {
  handleSubmit = (ev) => {
    ev.preventDefault();
    if (this.props.stripe) {
      this.props.stripe
        .createSource({
          type: 'card',
          owner: {
            name: ev.target.name.value,
            email: ev.target.email.value,
            address: {
              line1: ev.target.address_line1.value,
              line2: ev.target.address_line2.value,
              city: ev.target.address_city.value,
              state: ev.target.address_state.value,
              postal_code: ev.target.address_postal_code.value,
              country: ev.target.address_country.value
            },
            phone: ev.target.phone.value
          },
          mandate: {
            notification_method: 'email',
          },
        })
        .then((payload) => console.log('[source --> ]', payload));
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name
          <input name="name" type="text" placeholder="Jane Doeeee" required />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            placeholder="jane.doe@example.com"
            required
          />
        </label>
        <label>
          Phone
          <input name="phone" type="text" placeholder="000-000-0000" required />
        </label>
        <label>
          Address
          <input name="address_line1" type="text" placeholder="185 Berry St" required />
          <input name="address_line2" type="text" placeholder="Apt 101" />
          <input name="address_city" type="text" placeholder="San Francisco" required />
          <input name="address_state" type="text" placeholder="California" required />
          <input name="address_postal_code" type="text" placeholder="12345" required />
          <input name="address_country" type="text" placeholder="US" required />
        </label>
        <label>
          Card details
          <CardElement
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={handleFocus}
            onReady={handleReady}
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <button>Pay</button>
      </form>
    );
  }
}

export default injectStripe(CheckoutForm);
