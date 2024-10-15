import { MdAdd } from "react-icons/md"
import NoteCard from "../../components/Cards/NoteCard"
import Navbar from "../../components/Navbar/Navbar"
import AddEditNotes from "./AddEditNotes"
import { useEffect, useState } from "react"
import Modal from "react-modal"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import Toast from "../../components/ToastMessage/Toast"
import EmptyCard from "../../components/EmptyCard/EmptyCard"
import addNote from "../../assets/image/add-notes.svg"
import noData from "../../assets/image/no-data.svg"

const Home = () => {
    const [openEditModal, setOpenEditModal] = useState({
        isShown: false,
        type: "add",
        data: null,
    })

    const [showToastMsg, setShowToastMsg] = useState({
        isShown: false,
        message: "",
        type: 'add',
    })

    const [allNotes, setallNotes] = useState([])
    const [userInfo, setUserInfo] = useState(null)

    const [isSearched, setIsSearched] = useState(false)

    const navigate = useNavigate()

    const handleEdit = (noteDetails) => {
        setOpenEditModal({
            isShown: true,
            type: "edit",
            data: noteDetails,
        })
    }

    const showToastMessage = (message, type) => {
        setShowToastMsg({
            isShown: true,
            message,
            type,
        })
    }

    const handleCloseToast = () => {
        setShowToastMsg({
            isShown: false,
            message: "",
        })
    }

    // Get User Info
    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get('/get-user')
            if (response.data && response.data.user) {
                setUserInfo(response.data.user)
            }
        } catch (error) {
            if (error.response.status === 401) {
                localStorage.clear()
                navigate('/login')
            }
        }
    }

    // Get All Notes
    const getAllNotes = async () => {
        try {
            const response = await axiosInstance.get('/get-all-notes')

            if (response.data && response.data.notes) {
                setallNotes(response.data.notes)
            }
        } catch (error) {
            console.log('An unexpected error occured', error);
        }
    }

    // Delete Note
    const deleteNote = async (data) => {
        const noteId = data._id

        try {
            const response = await axiosInstance.delete(`/delete-note/${noteId}`)

            if (response.data && !response.data.error) {
                showToastMessage("Note Deleted Successfully", "delete")
                getAllNotes()
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.log('An unexpected error occured', error);
            }
        }
    }

    // Search Note
    const onSearchNote = async (query) => {
        try {
            const response = await axiosInstance.get(`/search-notes`, {
                params: { query }
            })

            if (response.data && response.data.notes) {
                setIsSearched(true)
                setallNotes(response.data.notes)
            }
        } catch (error) {
            console.log('An unexpected error occured', error);
        }
    }

    const updateIsPinned = async (noteData) => {
        const noteId = noteData._id
        try {
            const response = await axiosInstance.put(`/update-note-pinned/${noteId}`, {
                "isPinned": !noteData.isPinned
            })

            if (response.data && response.data.note) {
                showToastMessage("Note Updated Successfully")
                getAllNotes()
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleClearSearch = () => {
        setIsSearched(false)
        getAllNotes()
    }

    useEffect(() => {
        getAllNotes()
        getUserInfo()
        return () => { }
    }, [])

    return (
        <>
            <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} />

            <div className="container mx-auto">
                {allNotes.length > 0 ?
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        {
                            allNotes.map((item) => (
                                <NoteCard key={item._id}
                                    title={item.title}
                                    date={item.createdOn}
                                    content={item.content}
                                    tags={item.tags}
                                    isPinned={item.isPinned}
                                    onEdit={() => handleEdit(item)}
                                    onDelete={() => deleteNote(item)}
                                    onPinNote={() => updateIsPinned(item)}
                                />
                            ))
                        }
                    </div>
                    :
                    <EmptyCard imgSrc={isSearched ? noData : addNote} message={isSearched ? `Oops! No notes found form your search` : `Start creating your first note! Click the 'Add' button to get started`} />
                }
            </div>

            <button className="w-16 h-16 flex justify-center items-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
                onClick={() => setOpenEditModal({ isShown: true, type: "add", data: null })}
            >
                <MdAdd className="text-[32px] text-white" />
            </button>

            <Modal
                isOpen={openEditModal.isShown}
                onRequestClose={() => { }}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    },
                }}
                contentLabel=""
                className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
            >
                <AddEditNotes
                    noteData={openEditModal.data}
                    type={openEditModal.type}
                    onClose={() => setOpenEditModal({ isShown: false, type: "add", data: null })}
                    getAllNotes={getAllNotes}
                    showToastMessage={showToastMessage}
                />
            </Modal>

            <Toast
                isShown={showToastMsg.isShown}
                message={showToastMsg.message}
                type={showToastMsg.type}
                onClose={handleCloseToast}
            />

        </>
    )
}

export default Home