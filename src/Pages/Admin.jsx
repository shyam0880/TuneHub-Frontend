import React from 'react'

const Admin = () => {
  return (
    <div>
        <div className="container">
            <div className="header">
                <h1>Welcome to admin Home</h1>
            </div>
            <div className="lists">
                <a href="newSong" className="button"><button className="btn-grad">new Song</button></a>
                <br/> 
                <a href="viewSongs" className="button"><button className="btn-grad">View All Songs</button></a> 
                <br/> 
                <a href="createPlaylist" className="button"><button className="btn-grad">Create Playlist</button></a> 
                <br/> 
                <a href="viewPlaylist" className="button"><button className="btn-grad">View Playlist</button></a>
            </div>
	    </div>

    </div>

  )
}

export default Admin
