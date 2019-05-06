import React, { Component } from 'react'
import StripeCheckout from 'react-stripe-checkout';
import {
  CardElement,
  Elements,
  StripeProvider,
  injectStripe
} from "react-stripe-elements";

const createOptions = (fontSize: string, padding: ?string) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
        ...(padding ? {padding} : {}),
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};

class _MyPaymentCheckoutForm extends Component {

  constructor() {
    super();
    this.state = {
      elementFontSize: window.innerWidth < 450 ? '14px' : '18px',
    };
    window.addEventListener('resize', () => {
      if (window.innerWidth < 450 && this.state.elementFontSize !== '14px') {
        this.setState({elementFontSize: '14px'});
      } else if (
        window.innerWidth >= 450 &&
        this.state.elementFontSize !== '18px'
      ) {
        this.setState({elementFontSize: '18px'});
      }
    });
  }

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
        .then((payload) => {
          console.log('[Source --> ]', payload);
          this.submitPayload(payload);
        });
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };

  submitPayload(payload) {
    console.log('Payload --> ', payload);
    fetch('/api/stripe',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    ).then(res => res.json())
      .then(json => {
        let data = this.state.counters;
        data.push(json);

        this.setState({
          counters: data
        });
      });
  }

  render() {
    const {elementFontSize} = this.state;
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
            {...createOptions(elementFontSize)}
          />
        </label>
        <button>Pay</button>
      </form>
    );
  }
}

const MyPaymentForm = injectStripe(_MyPaymentCheckoutForm);

class Home extends Component {
  constructor(props) {
    super(props);

    //this.state = {
      //counters: []
   // };

   // this.newCounter = this.newCounter.bind(this);
   // this.incrementCounter = this.incrementCounter.bind(this);
   // this.decrementCounter = this.decrementCounter.bind(this);
   // this.deleteCounter = this.deleteCounter.bind(this);

   // this._modifyCounter = this._modifyCounter.bind(this);
    this.onToken = this.onToken.bind(this);
  }

  componentDidMount() {
    //fetch('/api/counters')
     // .then(res => res.json())
     // .then(json => {
       // this.setState({
        //  counters: json
        //});
     // });
  }
/*
  newCounter() {
    fetch('/api/counters', { method: 'POST' })
      .then(res => res.json())
      .then(json => {
        let data = this.state.counters;
        data.push(json);

        this.setState({
          counters: data
        });
      });
  }

  incrementCounter(index) {
    const id = this.state.counters[index]._id;

    fetch(`/api/counters/${id}/increment`, { method: 'PUT' })
      .then(res => res.json())
      .then(json => {
        this._modifyCounter(index, json);
      });
  }

  decrementCounter(index) {
    const id = this.state.counters[index]._id;

    fetch(`/api/counters/${id}/decrement`, { method: 'PUT' })
      .then(res => res.json())
      .then(json => {
        this._modifyCounter(index, json);
      });
  }

  deleteCounter(index) {
    const id = this.state.counters[index]._id;

    fetch(`/api/counters/${id}`, { method: 'DELETE' })
      .then(_ => {
        this._modifyCounter(index, null);
      });
  }

  _modifyCounter(index, data) {
    let prevData = this.state.counters;

    if (data) {
      prevData[index] = data;
    } else {
      prevData.splice(index, 1);
    }

    this.setState({
      counters: prevData
    });
  }
*/
  onToken(token){
    console.log('onTokenssss', token);
    fetch('/api/stripe',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(token)
      }
  ).then(res => res.json())
      .then(json => {
        let data = this.state.counters;
        data.push(json);

        this.setState({
          counters: data
        });
      });
  }

  render() {
    return (
      <div>
        <h1> Test Payment with STRIPE Element </h1>
        <StripeProvider apiKey="pk_test_7H1zrBLZ6IP5FtXsTRCDww53">
          <Elements>
            <MyPaymentForm/>
          </Elements>
        </StripeProvider>
      </div>
    );
  }
}

export default Home;
