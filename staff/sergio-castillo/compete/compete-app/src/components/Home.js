import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import './Home.css'

class Home extends Component {
    state = {
        id: sessionStorage.getItem('id') || '',
        token: sessionStorage.getItem('token') || '',
        role: []
    }

    render() {
        return <section className="home">
            <div className="home-images">
            <img alt="Messi" className="home-image" src="https://res.cloudinary.com/sergiocastillo/image/upload/v1538079544/Compete/Pogba.png"></img>
            <img alt="Lovren" className="home-image" src="https://res.cloudinary.com/sergiocastillo/image/upload/v1538078995/Compete/LovrenBackground.png"></img>
            <img alt="Messi3" className="home-image" src="https://res.cloudinary.com/sergiocastillo/image/upload/v1538079160/Compete/MessiBackground.png"></img>
		    </div>
            <div class="marquee-wrapper">
			    <div class="container">
				<div class="marquee-label">
					Breaking News
				</div>
				<div class="marquee" data-startvisible="true" data-duration="18000" data-gap="10" data-duplicated="true">
					<ul class="posts posts--inline">
						<li class="posts__item">
							<h6 class="posts__title"><a href="#">Jaume Serradell: Skylab D.C. midfielder suffers knee injury in training</a></h6>
							<div class="posts__excerpt">He's having tests on a right knee injury suffered in training on Wednesday....</div>
						</li>
						<li class="posts__item">
							<h6 class="posts__title"><a href="#">Alchemists coach on Jake Summer&#x27;s injury &quot;It looks really bad&quot;</a></h6>
							<div class="posts__excerpt">Lorem ipsum dolor sit amet consectetur adipisicing...</div>
						</li>
						<li class="posts__item">
							<h6 class="posts__title"><a href="#">The Alchemists player Steven Masterson breaks a new world record</a></h6>
							<div class="posts__excerpt">Lorem ipsum dolor sit amet consectetur adipisicing...</div>
						</li>
					</ul>
				</div>
		
			</div>
		</div>
        </section>
    }

}

export default withRouter(Home)