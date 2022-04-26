import Dropzone from 'react-dropzone';

import {DropContainer, UploadMessage} from './styles';

const Upload = ({onUpload, uploadLimit}) => {

  const renderDragMessage = (isDragActive, isDragReject) => {
    if(isDragActive && uploadLimit >= 5) {
      return <UploadMessage type="error">Limite de apenas 5 uploads</UploadMessage>
    }

    if(!isDragActive) {
      return <UploadMessage>Arraste arquivos aqui ...</UploadMessage>
    }

    if(isDragReject) {
      return <UploadMessage type="error">Arquivo não suportado</UploadMessage>
    }

    return <UploadMessage type="success">Solte os arquivos aqui</UploadMessage>
  };

  return (
    <Dropzone accept={"image/*"} onDropAccepted={onUpload}>
      { ({getRootProps, getInputProps, isDragActive, isDragReject}) => (
        <DropContainer
          {...getRootProps()}
          isDragActive={isDragActive}
          isDragReject={isDragReject}
          uploadLimit={uploadLimit}
        >
          <input {...getInputProps()} />
          {renderDragMessage(isDragActive, isDragReject)}
        </DropContainer>
      )}
    </Dropzone>
  )
}

export default Upload;