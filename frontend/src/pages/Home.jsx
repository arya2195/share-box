import { useState, useEffect } from 'react'
import { Search, File, FileText, Image, Music, Video, Archive, Code } from 'lucide-react'
import Header from './Header'
import Footer from './Footer'
import './Home.css'
import './Header.css'
import {toast } from 'react-toastify'

// Mock data - replace with actual API call
const mockFiles = [
  { id: 1, name: 'project-report.pdf', type: 'pdf', size: '2.4 MB', modified: '2025-01-02' },
  { id: 2, name: 'presentation.pptx', type: 'presentation', size: '15.2 MB', modified: '2025-01-01' },
  { id: 3, name: 'budget-2025.xlsx', type: 'spreadsheet', size: '876 KB', modified: '2024-12-30' },
  { id: 4, name: 'team-photo.jpg', type: 'image', size: '3.1 MB', modified: '2024-12-28' },
  { id: 5, name: 'app.js', type: 'code', size: '12 KB', modified: '2024-12-27' },
  { id: 6, name: 'meeting-notes.docx', type: 'document', size: '245 KB', modified: '2024-12-25' },
  { id: 7, name: 'demo-video.mp4', type: 'video', size: '45.3 MB', modified: '2024-12-24' },
  { id: 8, name: 'backup.zip', type: 'archive', size: '128 MB', modified: '2024-12-20' }
]

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
  const [userName] = useState('Alex Johnson')
  const fetchfilelist=async()=>{
     setLoading(true)
    const res=await fetch(`http://localhost:3000/api/user/fetchfile`,{
      method:'GET',
      credentials:'include',
    })
    if(!res.ok){
      const data=await res.json();
      toast.error(data.msg);
    }
    else{
      const data=await res.json();
      toast.success('files fetched successfully');
      setFiles(data.files);
    }
    setLoading(false)
  }

  useEffect(() => {
   
    // Simulate API call
    const fetchFiles = async () => {
      setLoading(true)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setFiles(mockFiles)
      setLoading(false)
    }
    

    fetchFiles()
  }, [])

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const openFile = (file) => {
  if (file.isPublic) {
    window.open(file.fileurl, "_blank"); // direct S3
  } else {
    window.open(`${import.meta.env.VITE_BACKEND_URL}/api/file/${file._id}/view`, "_blank"); // backend
  }
};

const downloadfile=async (file)=>{
 const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/file/${file._id}/download`,{
  method:'GET',
  credentials:'include'
 });
    const data = await res.json();

    const link = document.createElement("a");
    link.href = data.url;
    link.download = file.name;
    link.click();
}


  return (
    <div className="app-wrapper home-page">
   
      <main className="main-content">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <header className="mb-12">
          <div className="welcome-section">
            <h1 className="welcome-title">
              {getGreeting()}, {userName}
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
                <div key={file.id} 
                onClick={() => console.log("Selected:", file.name)}
  onDoubleClick={()=>openFile(file)}

                className="file-card">
                  <div className="file-header">
                    <div className="file-icon-wrapper">
                      {getFileIcon(file.type)}
                    </div>
                    <span className={`file-type-badge ${getFileTypeColor(file.type)}`}>
                      {file.type}
                    </span>
                  </div>
                  <div className="file-content">
                    <h3 className="file-name">{file.name}</h3>
                    <div className="file-meta">
                      <span className="file-size">{file.size}</span>
                      <span className="file-modified">Modified {file.modified}</span>
                    </div>
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