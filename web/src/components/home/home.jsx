import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './home.css';
import { Post, NoPost } from '../post/post';
// import {  } from "react-bootstrap-icons"

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    renderPost();
  }, []);

  const createPost = (event) => {
    event.preventDefault();
    const postTitle = document.querySelector("#title");
    const postText = document.querySelector("#text");

    axios
      .post(`/api/v1/post`, {
        title: postTitle.value,
        text: postText.value,
      })
      .then(function (response) {
        console.log(response.data);
        Swal.fire({
          icon: 'success',
          title: 'Post Added',
          timer: 1000,
          showConfirmButton: false,
        });
        renderPost();
      })
      .catch(function (error) {
        console.log(error);
        document.querySelector(".result").innerHTML = "Error in post submission";
      });

    postTitle.value = "";
    postText.value = "";
  };

  const renderPost = () => {
    axios
      .get(`/api/v1/posts`)
      .then(function (response) {
        let fetchedPosts = response.data;
        console.log("fetched posts", fetchedPosts);
        setPosts(fetchedPosts);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const deletePost = (postId) => {
    Swal.fire({
      title: 'Enter Password',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      cancelButtonColor: "#24232c",
      confirmButtonText: 'Delete',
      confirmButtonColor: "#24232c",
      showLoaderOnConfirm: true,
      preConfirm: (password) => {
        if (password === '12345') {

          return axios.delete(`/api/v1/post/${postId}`)
            .then(response => {
              // console.log(response.data);
              Swal.fire({
                icon: 'success',
                title: 'Post Deleted',
                timer: 1000,
                showConfirmButton: false
              });

              renderPost();
            })
            .catch(error => {
              console.log(error.data);
              Swal.fire({
                icon: 'error',
                title: 'Failed to delete post',
                showConfirmButton: false
              });
            });
        } else {

          return Swal.fire({
            icon: 'error',
            title: 'Invalid Password',
            text: 'Please enter correct password',
            timer: 1000,
            showConfirmButton: false
          });
        }
      }
    });
  }

  function editPost(postId) {
    Swal.fire({
      title: 'Enter Password',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      cancelButtonColor: "#24232c",
      confirmButtonText: 'Edit',
      confirmButtonColor: "#24232c",
      showLoaderOnConfirm: true,
      preConfirm: (password) => {
        if (password === '12345') {

          axios.get(`/api/v1/post/${postId}`)
            .then(response => {
              const post = response.data;
              console.log(post)
              Swal.fire({
                title: 'Edit Post',
                html: `
                  <input type="text" id="editTitle" class="swal2-input" placeholder="Post Title" value="${post.title}" required>
                  <textarea id="editText" class="swal2-input text" placeholder="Post Text" required>${post.text}</textarea>
                `,
                showCancelButton: true,
                cancelButtonColor: "#24232c",
                confirmButtonText: 'Update',
                confirmButtonColor: "#24232c",
                preConfirm: () => {

                  const editedTitle = document.getElementById('editTitle').value;
                  const editedText = document.getElementById('editText').value;

                  if (!editedTitle.trim() || !editedText.trim()) {
                    Swal.showValidationMessage('Title and text are required');
                    return false;
                  }

                  return axios.put(`/api/v1/post/${postId}`, {
                    title: editedTitle,
                    text: editedText
                  })
                    .then(response => {
                      // console.log(response.data);
                      Swal.fire({
                        icon: 'success',
                        title: 'Post Updated',
                        timer: 1000,
                        showConfirmButton: false
                      });
                      renderPost()
                    })
                    .catch(error => {
                      // console.log(error.response.data);
                      Swal.fire({
                        icon: 'error',
                        title: 'Failed to update post',
                        text: error.response.data,
                        showConfirmButton: false
                      });
                    });
                }
              });
            })
            .catch(error => {
              // console.log(error.response.data);
              Swal.fire({
                icon: 'error',
                title: 'Failed to fetch post',
                text: error.response.data,
                showConfirmButton: false
              });
            });
        } else {

          Swal.fire({
            icon: 'error',
            title: 'Invalid Password',
            text: 'Please enter correct password',
            showConfirmButton: false
          });
        }
      }
    });
  }

  // delete all

  function deleteAllPosts() {
    Swal.fire({
      title: 'Enter Password',
      input: 'password',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      cancelButtonColor: "#24232c",
      confirmButtonText: 'Delete All Posts',
      confirmButtonColor: "#24232c",
      showLoaderOnConfirm: true,
      preConfirm: (password) => {
        if (password === '12345') {
          return axios.delete(`/api/v1/posts/all`, {
            headers: {
              'Content-Type': 'application/json',
            },
            data: {
              password: password
            }
          })
            .then(response => {
              // console.log(response.data);
              Swal.fire({
                icon: 'success',
                title: 'All Posts Deleted',
                timer: 1000,
                showConfirmButton: false
              });
              renderPost();
            })
            .catch(error => {
              // console.log(error.data);
              Swal.fire({
                icon: 'error',
                title: 'Failed to delete all posts',
                showConfirmButton: false
              });
            });
        } else {
          return Swal.fire({
            icon: 'error',
            title: 'Invalid Password',
            text: 'Please enter correct password',
            timer: 1000,
            showConfirmButton: false
          });
        }
      }
    });
  }

  return (
    <div>
      <div className="space-around row">
        <h1 className="green"> PineCone CRUD</h1>
      </div>

      <form onSubmit={createPost}>
        <h2>Create New Post</h2>
        <label htmlFor="title" className="green">
          Title
        </label>
        <input required id="title" type="text" placeholder="Enter Title" className="input" />
        <label htmlFor="text" className="green">
          Text
        </label>
        <textarea required id="text" placeholder="Enter Text" className="input"></textarea>
        <div className='row'>
        <button type="submit" className="button">
          Post
        </button>
        <button type="button" className="button" onClick={deleteAllPosts}>
          Delete All
        </button>
        </div>
      </form>
      <h2 className="green">Posts</h2>
      <div className="result">
        {posts.length === 0 ? (
          <NoPost />
        ) : (
          posts.map((post, index) => (
            <Post key={post._id} title={post.title} text={post.text} time={post.time} postId={post._id} del={deletePost} edit={editPost} delAll={deleteAllPosts} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home