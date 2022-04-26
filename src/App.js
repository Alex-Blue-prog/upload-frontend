import GlobalStyle from './styles/global';
import { Container, Content, LimitContainer, LimitText} from './styles';
import Upload from "./components/Upload";
import FileList from "./components/FileList";
import { useEffect, useState } from 'react';
import { uniqueId } from 'lodash';
import filesize from 'filesize';
import api from './services/api';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  

  useEffect(()=> {

    const getPosts = async () => {

      const response = await api.get('posts');

      setUploadedFiles(response.data.map(file => ({
        id: file._id,
        name: file.name,
        readableSize: filesize(file.size),
        preview: file.url,
        progress: 100,
        uploaded: true,
        url: file.url,
        deleteProgress: 0
      })));
    }

    getPosts();
  },[]);

  //component will unmount
  useEffect(() => {
    return () => {
      setUploadedFiles(uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview)));
      //del image cash preview url
    }
}, []);

  const handleUpload = (files) => {
    
    //check the limit of uploads
    if(uploadedFiles.length >= 5) {
      console.log('limite de uploads é de 5, coração <3');
      return

    }  //check if upload of multiple files at once is more than the limit
    else if(uploadedFiles.length + files.length > 5) {
      const permitedFilesNumber = 5 - uploadedFiles.length;

      //get the removed values and set to files again
      files = files.splice(0, permitedFilesNumber);
    }

    const uploaded = files.map(file => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null,
      deleteProgress: 0
    }));

    setUploadedFiles(uploadedFiles.concat(uploaded));

    uploaded.forEach(processUpload);

  }

  const updateFile = (id, data) => {
    setUploadedFiles(prev => {
      return prev.map(uploadedFile => {
        return id === uploadedFile.id ? {...uploadedFile, ...data} : uploadedFile;
      });
    });
  };

  const processUpload = (uploadedFile) => {
    const data = new FormData();

    data.append("file", uploadedFile.file, uploadedFile.name);

    api.post('posts', data, {
      onUploadProgress: e => {
        const progress = parseInt(Math.round((e.loaded * 100) / e.total));

        updateFile(uploadedFile.id, {
          progress,
        });
      }
    }).then(response => {
      setUploadedFiles(prev => {
        return prev.map(value => {
          return value.id === uploadedFile.id ? {...value, uploaded: true, url: response.data.url, id: response.data._id} : value;
        });
      });
    }).catch(err => {
      setUploadedFiles(prev => {
        return prev.map(value => {
          return value.id === uploadedFile.id ? {...value, error: true, url: ""} : value;
        });
      });

      console.log(err);
    })

  };

  const handleDelete = async (id) => {

    try{

      setUploadedFiles(prev => {
        return prev.filter(value => value.id !== id);
      });

      await api.delete(`posts/${id}`);

    }catch(err) {
      console.log(err);
    }
    
  }
  

  return (
    <Container>
      <LimitContainer>
          <LimitText>Limite de uploads: 5</LimitText>
      </LimitContainer>

      <Content>
        <Upload onUpload={handleUpload} uploadLimit={uploadedFiles?.length}/>

        { !!uploadedFiles?.length && (
          <FileList files={uploadedFiles} onDelete={handleDelete} />
        )}
        
      </Content>
      <GlobalStyle />
    </Container>
  );
}

export default App;
