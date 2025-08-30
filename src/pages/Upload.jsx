import React, { useState } from 'react'
import { Upload as UploadIcon, File, CheckCircle, AlertCircle } from 'lucide-react'

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files?.[0] || null)
    setResult(null)
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResult(null)
    setError(null)
    if (!selectedFile) {
      setError('Please choose a file to upload.')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)
    // userId removed per request

    setIsUploading(true)
    try {
      const response = await fetch('http://localhost:3000/api/file/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.msg || 'Upload failed')
      }
      setResult(data)
      setSelectedFile(null)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="app-wrapper">
    
      <main className="main-content">
        <div className="max-w-xl mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg mb-4">
              <UploadIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Upload a file</h1>
            <p className="text-gray-600 mt-2">Anyone can upload a file to the backend.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Choose file</label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                />
              </div>
              {selectedFile && (
                <div className="mt-3 flex items-center gap-2 text-gray-700">
                  <File className="w-4 h-4" />
                  <span className="text-sm">{selectedFile.name}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-5 rounded-lg font-medium shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/40 transition-all duration-200 disabled:opacity-70"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadIcon className="w-5 h-5" />
                  <span>Upload</span>
                </>
              )}
            </button>

            {result && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-emerald-800 font-medium">File uploaded successfully</p>
                  {result?.url && (
                    <p className="text-sm text-emerald-700 break-all mt-1">
                      URL: <a className="underline" href={result.url} target="_blank" rel="noreferrer">{result.url}</a>
                    </p>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </form>
        </div>
      </main>
      
    </div>
  )
}

export default Upload


