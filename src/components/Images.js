import React, { useContext, useEffect } from 'react'
import Gallery from '../pages/Gallery';
import { app } from "../base";


const db = app.firestore();

export default function Images() {
  const [fileUrl, setFileUrl] = React.useState(null);
  const [users, setUsers] = React.useState([]); // users from firebase

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    const storageRef = app.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    setFileUrl(await fileRef.getDownloadURL());
  };

  const onSubmit = (e) => {
    e.preventDefault(); // so when you click submit it doesen't triggger navigation
    const username = e.target.username.value;
    if (!username) {
      return;
    }
    db.collection("users").doc(username).set({
      name: username,
      avatar: fileUrl,
    });
  };
  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await db.collection("users").get();
      setUsers(
        usersCollection.docs.map((doc) => {
          return doc.data();
        })
      );
    };
    fetchUsers();
  }, []);

  return (
    <>
        {users.map((useR) => {
        console.log(useR.avatar);
        
          return (
           
            
              <img width="300" height="300" src={useR.avatar} />
              
           
          );
        })}
     
    </>
  );
}