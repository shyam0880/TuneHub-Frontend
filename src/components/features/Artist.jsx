import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import '../../styles/Artist.css';
import AuthContext from "../../context/AuthContext";
import Loading from "../ui/Loading";

const Artist = () => {
    const { apiUrl, setAlertData, openConfirmDialog, artists, contextUser } = useContext(AuthContext);

    // const [artists, setArtists] = useState([]);

    const [formData, setFormData] = useState({ name: "", image: null });
    const [editingId, setEditingId] = useState(null);
    const [openMenu, setOpenMenu] = useState(null); 
    const [visible, setVisible] = useState(false); 
    const [isLoading, setIsLoading] = useState(false); 

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
            const response = await fetch(url, { method, body: formDataToSend, credentials: "include", });
    
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
        try {
            const response = await fetch(`${apiUrl}/artists/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
    
            if (response.ok) {
                setAlertData({ show: true, status: true, message: "Artist deleted successfully" });
                fetchArtists(); 
            } else {
                const errorData = await response.json();
                setAlertData({ show: true, status: false, message: errorData.message || "Unknown error" });
            }
        } catch (error) {
            setAlertData({ show: true, status: false, message: error.message });
        }
    
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

    const handleDeleteArtist = (id) => {
		openConfirmDialog("Are you sure you want to delete this artist?", () => handleDelete(id));
	};

    if (contextUser.role === "USER" ) {
      return <Navigate to="/dashboard" replace />;
    }
      
    if (contextUser === undefined) {
        return <Loading />;
    }

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
                <i className="bi bi-plus-circle-dotted" ></i>
                Add Artist
            </li>
                {artists.length > 0 ? (
                    artists.map((artist) => (
                        <li key={artist.id} className="artist-item">
                            <div className="artist-image">
                                <img src={artist.image} alt={artist.name} />
                                <button className="play-btn"><i className="bi bi-play-fill"></i></button>
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
                                            <button onClick={() => handleDeleteArtist(artist.id)}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="artist-name">{artist.name}</div>
                        </li>
                    ))
                ) : (
                    <li className="noArtist skeleton-card"></li>
                )}
            </ul>
        </div>
    );
};

export default Artist;
