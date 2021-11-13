import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/Home";
import UserProfile from "./components/UserProfile";
import Debits from "./components/Debits";
import Credits from "./components/Credits";
import LogIn from "./LogIn";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor() {
    super();

    this.state = {
      accountBalance: 14568.27,
      currentUser: {
        userName: "joe_shmo",
        memberSince: "07/23/96",
      },
      debits: [],
      credits: [],
    };
  }

  //lifecycle method: all api request are here
  async componentDidMount() {
    let debits = await axios.get("https://moj-api.herokuapp.com/debits");
    let credits = await axios.get("https://moj-api.herokuapp.com/credits");

    //get data from API response
    debits = debits.data;
    credits = credits.data;

    let debitSum = 0,
      creditSum = 0;
    debits.forEach((debit) => {
      debitSum += debit.amount;
    });
    credits.forEach((credit) => {
      creditSum += credit.amount;
    });
    let accountBalance = creditSum - debitSum;
    this.setState({ debits, credits, accountBalance });
  }

  //updates the debit state based on user input
  addDebit = (e) => {
    //send to debits view via props
    //updates state based off user input
    e.preventDefault();
    const description = e.target[0].value;
    const amount = Number(e.target[1].value);
    console.log(description, amount);
  };

  mockLogIn = (logInInfo) => {
    const newUser = { ...this.state.currentUser };
    newUser.userName = logInInfo.userName;
    this.setState({ currentUser: newUser });
  };

  render() {
    const HomeComponent = () => (
      <Home accountBalance={this.state.accountBalance} />
    );
    const UserProfileComponent = () => (
      <UserProfile
        userName={this.state.currentUser.userName}
        memberSince={this.state.currentUser.memberSince}
      />
    );
    const { debits } = this.state;
    const DebitsComponent = () => (
      <Debits addDebit={this.addDebit} debits={debits} />
    );
    const { credits } = this.state;
    const CreditsComponent = () => (
      <Credits addCredit={this.addCredit} credits={credits} />
    );
    const LogInComponent = () => (
      <LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />
    );

    return (
      <Router>
        <div>
          <Route exact path="/" render={HomeComponent} />
          <Route exact path="/userProfile" render={UserProfileComponent} />
          <Route exact path="/debits" render={DebitsComponent} />
          <Route exact path="/credits" render={CreditsComponent} />
          <Route exact path="/login" render={LogInComponent} />
        </div>
      </Router>
    );
  }
}

export default App;
