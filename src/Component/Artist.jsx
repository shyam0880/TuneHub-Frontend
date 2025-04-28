import { useEffect, useState, useContext } from "react";
import '../CSS/Artist.css';
import AuthContext from "../Context/AuthContext";

const Artist = () => {
    const { apiUrl, setAlertData } = useContext(AuthContext);

    const [artists, setArtists] = useState([]);

    const [formData, setFormData] = useState({ name: "", image: null });
    const [editingId, setEditingId] = useState(null);
    const [openMenu, setOpenMenu] = useState(null); 
    const [visible, setVisible] = useState(false); 
    const [isLoading, setIsLoading] = useState(false); 

    useEffect(() => {
        fetchArtists();
    }, []);

    const fetchArtists = async () => {
        const res = await fetch(`${apiUrl}/artists`);
        const data = await res.json();
        setArtists(data);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        if (formData.image) {
            formDataToSend.append("image", formData.image);
        }

        const method = editingId ? "PUT" : "POST";
        const url = editingId ? `${apiUrl}/artists/${editingId}` : `${apiUrl}/artists`;
        try {
            const response = await fetch(url, { method, body: formDataToSend });
    
            if (!response.ok) {  
                setAlertData({ show: true, status: false, message: response.statusText });
            }
            setFormData({ name: "", image: null });
            setEditingId(null);
            fetchArtists();
            setAlertData({ show: true, status: true, message: editingId ? "Artist updated successfully" : "Artist added successfully" });
            setVisible(false); 
        } catch (error) {
            setAlertData({ show: true, status: false, message: error.message });
        } finally {
            setIsLoading(false); 
        }
    };

    const handleEdit = (artist) => {
        if (artist) {
            setFormData({ name: artist.name, image: null });
            setEditingId(artist.id);
            setVisible(true); 
            setOpenMenu(null); 
        }
        else {
            setFormData({ name: "", image: null });
            setEditingId(null);
            setVisible(true);
            setOpenMenu(null); 
        }
    };

    const handleDelete = async (id) => {
        await fetch(`${apiUrl}/artists/${id}`, { method: "DELETE" });
        fetchArtists();
        setOpenMenu(null); 
    };

    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".options-container")) {
                setOpenMenu(null);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div className='artist'>
            {visible&&(<div className="form-container">
                <form onSubmit={handleSubmit}>
                    <h2>{editingId ? "Edit Artist" : "Add Artist"}</h2>
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="input-field" />
                    <input type="file" onChange={handleFileChange} className="input-field" />
                    <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? (
                            <div className="loading-spinner"></div>
                        ) : editingId ? (
                            "Update"
                        ) : (
                            "Add"
                        )}
                    </button>
                    <button type="button" className="cancel-btn" onClick={() => { setVisible(false); setEditingId(null); }}>Cancel</button>
                </form>
            </div>)}

            <ul className="artist-list">
            <li className="add-item" onClick={()=>handleEdit()}>
                <i class="bi bi-plus-circle-dotted" ></i>
                Add Artist
            </li>
                {artists.length > 0 ? (
                    artists.map((artist) => (
                        <li key={artist.id} className="artist-item">
                            <div className="artist-image">
                                <img src={artist.image} alt={artist.name} />
                                <button className="play-btn"><i class="bi bi-play-fill"></i></button>
                                <div className="options-container">
                                    <button className="options-btn" 
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            setOpenMenu(openMenu === artist.id ? null : artist.id);
                                        }}>
                                        ☰
                                    </button>
                                    {openMenu === artist.id && (
                                        <div className="options-menu" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => handleEdit(artist)}>Edit</button>
                                            <button onClick={() => handleDelete(artist.id)}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="artist-name">{artist.name}</div>
                        </li>
                    ))
                ) : (
                    <li className="noArtist"></li>
                )}
            </ul>
        </div>
    );
};

export default Artist;
