import { useState, useEffect, useContext } from 'react'
import { Search, File, FileText, Image, Music, Video, Archive, Code } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'
import './Home.css'
import './Header.css'
import {toast } from 'react-toastify'
import Authcontext from '../../context/Authcontext'
import { useNavigate } from 'react-router-dom'



const getFileIcon = (type) => {
  switch (type) {
    case 'image': return <Image className="w-5 h-5" />
    case 'video': return <Video className="w-5 h-5" />
    case 'music': return <Music className="w-5 h-5" />
    case 'code': return <Code className="w-5 h-5" />
    case 'archive': return <Archive className="w-5 h-5" />
    case 'document':
    case 'pdf':
    case 'presentation':
    case 'spreadsheet': return <FileText className="w-5 h-5" />
    default: return <File className="w-5 h-5" />
  }
}

const getFileTypeColor = (type) => {
  switch (type) {
    case 'image': return 'bg-green-100 text-green-700 border-green-200'
    case 'video': return 'bg-purple-100 text-purple-700 border-purple-200'
    case 'music': return 'bg-pink-100 text-pink-700 border-pink-200'
    case 'code': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'archive': return 'bg-orange-100 text-orange-700 border-orange-200'
    case 'document': return 'bg-indigo-100 text-indigo-700 border-indigo-200'
    case 'pdf': return 'bg-red-100 text-red-700 border-red-200'
    case 'presentation': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'spreadsheet': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

function Home() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const {user,setuser}=useContext(Authcontext);
  const navigate=useNavigate();
  const deleteFile=async(id)=>{
    const res=await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/files/deletefile/${id}`,{
      method:'DELETE',
      credentials:'include'
    })
    const data=await res.json();
    if(!res.ok){
      toast.error(data.msg);
    }
    else {
      toast.success('files delted successfully');
    }
  }
  const fetchfilelist=async()=>{
     setLoading(true)
    const res=await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/files/fetchfile`,{
      method:'GET',
      credentials:'include',
    })
    if(!res.ok){
      const data=await res.json();
      toast.error(data.msg);
      console.log(data)
    }
    else{
      const data=await res.json();
      toast.success('files fetched successfully');
      console.log(data.files);
      setFiles(data.files);
      console.log(data)
    }
    setLoading(false)
  }

  useEffect(() => {
      fetchfilelist();

    }, [])

  const filteredFiles = files.filter(file =>
    file.filename.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const openFile = async (file) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/files/${file._id}/view`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (res.ok) {
      
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
      } else {
       
        downloadfile(file);
      }
    } catch (err) {
      console.error('Error opening file:', err);
      
      downloadfile(file);
    }
  };

const downloadfile=async (file)=>{
 try {
   const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/files/${file._id}/download`,{
    method:'GET',
    credentials:'include'
   });
   
   if (!res.ok) {
     const errorData = await res.json();
     toast.error(errorData.msg || 'Download failed');
     return;
   }

   
   const blob = await res.blob();
   
   
   const url = window.URL.createObjectURL(blob);
   const link = document.createElement("a");
   link.href = url;
   link.download = file.filename;
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
   
   
   window.URL.revokeObjectURL(url);
   
   toast.success('File downloaded successfully');
 } catch (err) {
   console.error('Download error:', err);
   toast.error('Download failed');
 }
}


  return (
    <div className="app-wrapper home-page">
   
      <main className="main-content">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <header className="mb-12">
          <div className="welcome-section">
            <h1 className="welcome-title">
              {getGreeting()}, {user?.name}
            </h1>
            <p className="welcome-subtitle">
              Welcome back to your file dashboard. Here are your recent files.
            </p>
          </div>
        </header>

        {/* Search Section */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Files Section */}
        <section className="files-section">
          <div className="section-header">
            <h2 className="section-title">Your Files</h2>
            <span className="file-count">
              {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
            </span>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading your files...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="empty-state">
              <File className="empty-icon" />
              <h3 className="empty-title">No files found</h3>
              <p className="empty-description">
                {searchTerm ? 'Try adjusting your search terms' : 'Upload some files to get started'}
              </p>
            </div>
          ) : (
            <div className="files-grid">
              {filteredFiles.map((file) => (
                <div key={file._id} 
                onClick={() => console.log("Selected:", file.filename)}
                onDoubleClick={()=>openFile(file)}
                className="file-card">
                  
                  <div className="file-header">
                    
                    <div className="file-icon-wrapper">
                      {getFileIcon(file.filetype)}
                    </div>
                    <span className={`file-type-badge ${getFileTypeColor(file.filetype)}`}>
                      {file.filetype}
                    </span>
                  </div>
                  <div className="file-content">
                    <h3 className="file-name">{file.filename}</h3>
                    <div className="file-meta">
                      <span className="file-size">{file.size}</span>
                      <span className="file-modified">Modified {new Date(file.uploadedAt).toLocaleDateString()}</span>
                      <div className='flex flex-col'>
                      <button onClick={()=>{navigate(`/share/${file._id}`)}}>share</button>
                     
                  
                    </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadfile(file);
                      }}
                      className="download-btn"
                    >
                      Download
                    </button>
                    <button onClick={()=>deleteFile(file._id)}className='mx-23' >Delete</button>
                    
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      </main>
     
    </div>
  )
}

export default Home