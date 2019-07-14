import React, { Component } from 'react';
import Firebase from 'firebase';
import config from './config';

class App extends Component {

  constructor(props) {
    super(props);
    
    console.log("constructor called...");
    var firebase = Firebase.initializeApp(config);
    // Get a reference to the database service
    var database = firebase.database();
    console.log(firebase.storage());

    this.state = {
      value: null,
      image: ""
    };
    this.imageChange = this.imageChange.bind(this);
    this.postImageToFirebase = this.postImageToFirebase.bind(this);

    
  }
  imageChange(event) {
        this.setState({
            [event.target.name]: event.target.files
        });
    }

   postImageToFirebase(event){
        event.preventDefault();
        const file = this.state.image;
        const storageRef = Firebase.storage().ref();
        const mainImage = storageRef.child("restaurant/"+file[0].name);
        mainImage.put(file[0]).then((snapshot) => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          mainImage.getDownloadURL().then((url) => {
            console.log(url);
          })
        })
    }

  getFileListData = () => {
    // Create a reference under which you want to list
    //console.log(Firebase.storage().UIImage);
    // Since you mentioned your images are in a folder,
    // we'll create a Reference to that folder:
    var storageRef = Firebase.storage().ref("/restaurant");


    // Now we get the references of these images
    storageRef.listAll().then(function(result) {
      result.items.forEach(function(imageRef) {
        // And finally display them
        displayImage(imageRef);
      });
    }).catch(function(error) {
      // Handle any errors
    });

    function displayImage(imageRef) {
      getMetadataCustom(imageRef);
      getDownloadURLCustom(imageRef);
      //deleteImageCustom(imageRef);
    }

    function getMetadataCustom(imageRef){
      imageRef.getMetadata().then(function(metaData) {
        // TODO: Display the image on the UI
        console.log(metaData);
      }).catch(function(error) {
        // Handle any errors
      });
    }
    function getDownloadURLCustom(imageRef){
      imageRef.getDownloadURL().then(function(url) {
        // TODO: Display the image on the UI
        console.log(url);
      }).catch(function(error) {
        // Handle any errors
      });
    }
    function deleteImageCustom(imageRef){
      // Delete the file
      imageRef.delete().then(function() {
        // File deleted successfully
        console.log("deleted ok");
      }).catch(function(error) {
        // Uh-oh, an error occurred!
        console.log(error);
      });
    }
  }
  componentDidMount() {
    this.getFileListData();
  }

  render() {
    function upload(e) {
      e.preventDefault();
      console.log(this.state.image);
  }
    return (
      <div>
        <input type='file' name="image"  onChange={this.imageChange}/>
        <button onClick={this.postImageToFirebase}>submit</button>
      </div>
    );
  }
}

export default App;
