import React from 'react'

const HomeMusic = () => {

    const scroll = (ref, distance) => {
		if (ref.current) {
			ref.current.scrollBy({ left: distance, behavior: "smooth" });
		}
	};
  return (
    <div class="song_side">
		<nav>
			{/* <ul>
				<li>Discover <span></span></li>
				<li>MY LIBRARIES</li>
				<li>RADIO</li>
			</ul> */}
            <h3>Good Morning </h3>
			<div class="search">
				<input type="text" placeholder="Search Music...."/>
				<i class="bi bi-search"></i>
			</div>
			<div class="user">
				<img src="" alt=""/>
			</div>
		</nav>

		<div class="content">
			<h1>Alen walker fade</h1>
			<p>You are the sahadow to my light why did you fell us Another start you feel<br/> Away afraid our aim is out of sight wanna see us Alive</p>
			<div class="buttons">
				<button>PLAY</button>
				<button>FOLLOW</button>
			</div>
		</div>

		<div class="popular_song">
			<div class="h4">
				<h4>Pick where you left</h4>
				<div class="btn_s">
                <i class="bi bi-arrow-left-short" id="song_prev" onClick={() => scroll(popSongRef, -330)}></i>
				<i class="bi bi-arrow-right-short" id="song_next" onClick={() => scroll(popSongRef, +330)}></i>
				</div>
			</div>
			<div class="pop_song" ref={popSongRef}>
			{songs.length>0?(
				songs.map((song) => (
						<li key={song.id} className="songItem">
						<div className="img_play">
							<img src={song.image} alt={song.name} />
						</div>
						<h5>
							{song.name} <br />
							<div className="subtitle">{song.artist}</div>
						</h5>
							<i className="bi playlistPlay bi-play-circle-fill"></i>
						</li>
				)
					)):(
					<li className="noSong"></li>
					)
				}		
			</div>
		</div>
		<div class="popular_song">
			<div class="h4">
				<h4>Your Song</h4>
				<div class="btn_s">
					<i class="bi bi-arrow-left-short" id="song_prev1"onClick={() => scroll(popSongRef1, -330)}></i>
					<i class="bi bi-arrow-right-short" id="song_next"onClick={() => scroll(popSongRef1, +330)}></i>
				</div>
			</div>
			<div class="pop_song" ref={popSongRef1}>
                <li className="addSong" onClick={()=>{setPopUp(true)}}>
                    <i class="bi bi-plus-circle"></i>
                </li>
				{songs.length>0?(
				songs.map((song) => (
						<li key={song.id} className="songItem">
						<div className="img_play">
							<img src={song.image} alt={song.title} />
						</div>
						<h5>
							{song.title} <br />
							<div className="subtitle">{song.artist}</div>
						</h5>
							<i className="bi playlistPlay bi-play-circle-fill"></i>
						</li>
				)
					)):(
					<li className="noSong"></li>
					)
				}
								
			</div>
		</div>
		<div class="popular_artist">
			<div class="h4">
				<h4>Popular Artist</h4>
				<div class="btn_s">
					<i class="bi bi-arrow-left-short" id="artist_prev"></i>
					<i class="bi bi-arrow-right-short" id="artist_next"></i>
				</div>
			</div>
			<div class="item">
				<li>
					<img src="../static/css/image/disk.jpg" alt=""/>
				</li>
				
			</div>
		</div>
	</div>
  )
}

export default HomeMusic
