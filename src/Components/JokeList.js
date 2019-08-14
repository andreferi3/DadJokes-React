import React, { Component } from 'react'
import Joke from './Joke'
import './styles/JokeList.css'
import axios from 'axios'
import uuid from 'uuid/v4'

const API_URL = 'https://icanhazdadjoke.com/'

export default class JokeList extends Component {

    static defaultProps = {
        numJokesToGet: 10
    }

    constructor(props) {
        super(props)

        this.state = {
            jokes: JSON.parse(window.localStorage.getItem('jokes')) || [],
            loading: false
        }

        this.seenJokes = new Set(this.state.jokes.map(j => j.text))
        console.log(this.seenJokes)
        this.handleClick = this.handleClick.bind(this)
    }

    async componentDidMount() {
        if(this.state.jokes.length === 0) {
            this.setState({ loading: true }, this.getJokes)
        }
    }

    async getJokes() {
        try {
            let jokes = []
            while(jokes.length < this.props.numJokesToGet) {
                let res = await axios.get(API_URL, {
                    headers: {
                        Accept: 'application/json'
                    }
                })
                let newJoke = res.data.joke
                if(!this.seenJokes.has(newJoke)) {
                    jokes.push({text: res.data.joke, votes: 0, id: uuid()})
                } else {
                    console.log('I FOUND DUPLICATE')
                    console.log(newJoke)
                }
            }
            this.setState((st) => ({
                jokes: [...st.jokes, ...jokes],
                loading: false
            }), 
                () => window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
            )
        } catch(e) {
            alert(e)
            this.setState({ loading: false })
        }
    }

    handleVote(id, delta) {
        this.setState((st) => ({
            jokes: st.jokes.map(joke => (joke.id === id) ? {...joke, votes: joke.votes + delta} : joke)
        }), 
        () => window.localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
        )
    }

    handleClick() {
        this.setState({ loading: true }, this.getJokes)
    }

    render() {
        if(this.state.loading) {
            return (
                <div className='JokeList-spinner'>
                    <i className='far fa-8x fa-laugh fa-spin' />
                    <h1 className='JokeList-title'>Loading...</h1>
                </div>
            )
        }

        let jokes = this.state.jokes.sort((a, b) => b.votes - a.votes)
        return (
            <React.Fragment>
                <div className='JokeList'>
                    <div className='JokeList-sidebar'>
                        <div className='JokeList-title'>
                            <h1>
                                <span>Dad</span> Jokes
                            </h1>
                            <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' alt='logo' />
                        </div>
                            <button className='JokeList-getmore' onClick={this.handleClick}>Fetch Jokes</button>
                    </div>
                    <div className='JokeList-jokes'>
                        <div className='JokeList-jokesLength'>
                            <h2>Jokes List : {this.state.jokes.length}</h2>
                        </div>
                        {jokes.map((joke) => (
                            <Joke text={joke.text} votes={joke.votes} key={joke.id} upVote={this.handleVote.bind(this, joke.id, 1)} downVote={this.handleVote.bind(this, joke.id, -1)} />
                        ))}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
