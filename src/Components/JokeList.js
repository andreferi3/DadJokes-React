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
            jokes: []
        }
    }

    async componentDidMount() {
        let jokes = []
        while(jokes.length < this.props.numJokesToGet) {
            let res = await axios.get(API_URL, {
                headers: {
                    Accept: 'application/json'
                }
            })
            jokes.push({text: res.data.joke, votes: 0, id: uuid()})
        }
        this.setState({ jokes: jokes })
    }

    handleVote(id, delta) {
        this.setState((st) => ({
            jokes:
                st.jokes.map(joke => 
                    (joke.id === id) ? {...joke,votes: joke.votes + delta} : joke)
        }))
    }

    render() {
        return (
            <div className='JokeList'>
                <div className='JokeList-sidebar'>
                    <div className='JokeList-title'>
                        <h1>
                            <span>Dad</span> Jokes
                        </h1>
                        <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' alt='logo' />
                    </div>
                        <button className='JokeList-getmore'>New Jokes</button>
                </div>
                <div className='JokeList-jokes'>
                    {this.state.jokes.map(joke => (
                        <Joke text={joke.text} votes={joke.votes} key={joke.id} upVote={this.handleVote.bind(this, joke.id, 1)} downVote={this.handleVote.bind(this, joke.id, -1)} />
                    ))}
                </div>
            </div>
        )
    }
}
