import ProfileInfo from "../Cards/ProfileInfo"
import { useNavigate } from "react-router-dom"
import SearchBar from "../SearchBar/SearchBar"
import { useState } from "react"

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()
    const onLogout = () => {
        localStorage.clear()
        navigate("/login")
    }

    const handleSearch = () => {
        if (searchQuery) {
            onSearchNote(searchQuery)
        }
    }

    const onClearSearch = () => {
        setSearchQuery("")
        handleClearSearch()
    }
    return (
        <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
            <div className="flex items-center gap-3 py-2">
                <img src="/BangkitLogo.png" alt="" className="w-9 h-9" />
                <h2 className="text-2xl font-medium text-black">BangkiTask.</h2>
            </div>

            <SearchBar
                value={searchQuery}
                onChange={({ target }) => setSearchQuery(target.value)}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
            />

            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </div>
    )
}

export default Navbar