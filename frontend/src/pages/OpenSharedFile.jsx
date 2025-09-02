import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function OpenSharedFile() {
  const { shareId } = useParams();
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/files/shared/${shareId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('File not found');
        const contentType = res.headers.get('Content-Type');
        setFileType(contentType);
        const blob = await res.blob();
        setFileUrl(URL.createObjectURL(blob));
      })
      .catch((err) => {
        console.error(err);
      });
  }, [shareId]);

  if (!fileUrl) return <div>Loading...</div>;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f3f3f3'
    }}>
      {fileType.startsWith('image/') ? (
        <img src={fileUrl} alt="Shared file" style={{ maxWidth: '90vw', maxHeight: '90vh', boxShadow: '0 0 10px #aaa' }} />
      ) : fileType === 'application/pdf' ? (
        <iframe
          src={fileUrl}
          style={{
            width: '100vw',
            height: '100vh',
            border: 'none',
            boxShadow: '0 0 10px #aaa'
          }}
          title="PDF preview"
        ></iframe>
      ) : (
        <a href={fileUrl} download>
          Download File
        </a>
      )}
    </div>
  );
}

export default OpenSharedFile;